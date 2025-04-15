"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface StepConfirmationProps {
  formData: {
    name: string;
    email: string;
    languageLevel: string;
    learningGoals: string[];
    [key: string]: string | string[] | boolean;
  };
}

export default function StepConfirmation({ formData }: StepConfirmationProps) {
  const router = useRouter();

  const getLevelName = (levelId: string) => {
    const levels: Record<string, string> = {
      beginner: "Beginner (A1)",
      elementary: "Elementary (A2)",
      intermediate: "Intermediate (B1)",
      upper_intermediate: "Upper Intermediate (B2)",
      advanced: "Advanced (C1)",
      proficient: "Proficient (C2)"
    };
    return levels[levelId] || levelId;
  };

  const getGoalName = (goalId: string) => {
    const goals: Record<string, string> = {
      general_english: "General English",
      business_english: "Business English",
      academic_english: "Academic English",
      conversation: "Conversation Skills",
      pronunciation: "Pronunciation",
      listening: "Listening Comprehension",
      ielts_preparation: "IELTS Preparation",
      toefl_preparation: "TOEFL Preparation"
    };
    return goals[goalId] || goalId;
  };
  
  const handleGoToDashboard = () => {
    // Here you would normally complete registration and redirect
    // For now, we&apos;ll just redirect to the homepage or dashboard
    router.push("/dashboard");
  };
  
  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome to Global Edu Care, {formData.name}!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your account has been created and your free trial is now active.
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Your personalized learning plan:
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Current level:</p>
            <p className="text-base text-gray-900">{getLevelName(formData.languageLevel)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Learning goals:</p>
            <ul className="list-disc pl-5 mt-1 text-base text-gray-900">
              {formData.learningGoals.map(goal => (
                <li key={goal}>{getGoalName(goal)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-blue-700">
                We&apos;ve sent a confirmation email to <span className="font-medium">{formData.email}</span>. 
                Please verify your email to ensure you receive important updates.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={handleGoToDashboard}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to your dashboard
        </button>
        
        <Link 
          href="/browse-courses"
          className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Browse courses
        </Link>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Your free trial expires in 3 days. You can upgrade to a full membership at any time.
        </p>
      </div>
    </div>
  );
} 