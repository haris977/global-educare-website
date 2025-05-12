"use client";

import { useState, useEffect } from "react";
import { FaBrain, FaChartLine, FaGlobeAmericas, FaGraduationCap, FaLaptopCode, FaUsers } from "react-icons/fa";

interface StepLearningGoalsProps {
  onNext: () => void;
  onPrev: () => void;
  formData: {
    learningGoals: string[];
    [key: string]: string | string[] | boolean;
  };
  updateFormData: (data: { learningGoals: string[] }) => void;
}

// List of learning goals
const learningGoals = [
  {
    id: "jobPreparation",
    title: "Job Preparation",
    icon: FaChartLine,
    description: "Prepare for a new job or career in an English-speaking environment",
  },
  {
    id: "academicSuccess",
    title: "Academic Success",
    icon: FaGraduationCap,
    description: "Improve your English for academic purposes (IELTS, TOEFL, university studies)",
  },
  {
    id: "businessCommunication",
    title: "Business Communication",
    icon: FaLaptopCode,
    description: "Enhance your English for professional communication and workplace success",
  },
  {
    id: "travel",
    title: "Travel & Cultural Exchange",
    icon: FaGlobeAmericas,
    description: "Learn English for travel, cultural exchange, or living abroad",
  },
  {
    id: "socialCommunication",
    title: "Social Communication",
    icon: FaUsers,
    description: "Improve your English for everyday conversations and social interactions",
  },
  {
    id: "personalGrowth",
    title: "Personal Growth",
    icon: FaBrain,
    description: "Develop your English skills for personal enrichment and self-improvement",
  },
];

export default function StepLearningGoals({
  onNext,
  onPrev,
  formData,
  updateFormData,
}: StepLearningGoalsProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(formData.learningGoals || []);
  const [error, setError] = useState<string>("");
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    // Only update if it's not the initial render
    if (!isInitialRender) {
      updateFormData({ learningGoals: selectedGoals });
    } else {
      setIsInitialRender(false);
    }
  }, [selectedGoals, updateFormData, isInitialRender]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
    setError("");
  };

  const handleContinue = () => {
    if (selectedGoals.length === 0) {
      setError("Please select at least one learning goal");
      return;
    }
    onNext();
  };

  return (
    <div className="py-8 px-6 sm:px-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          What are your learning goals?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Select all that apply to customize your learning experience
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {learningGoals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`
              p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ease-in-out 
              hover:border-indigo-500 hover:shadow-md relative overflow-hidden group
              ${
                selectedGoals.includes(goal.id)
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }
            `}
          >
            {selectedGoals.includes(goal.id) && (
              <div className="absolute right-2 top-2 h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="flex items-start space-x-4">
              <div className={`
                p-3 rounded-full 
                ${selectedGoals.includes(goal.id) ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-500"}
                transition-colors duration-200
              `}>
                <goal.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className={`font-medium ${selectedGoals.includes(goal.id) ? "text-indigo-900" : "text-gray-900"}`}>
                  {goal.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{goal.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 