"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import StepWelcome from "./StepWelcome";
import StepLanguageLevel from "./StepLanguageLevel";
import StepLearningGoals from "./StepLearningGoals";
import StepPersonalInfo from "./StepPersonalInfo";
import StepCreateAccount from "./StepCreateAccount";
import StepConfirmation from "./StepConfirmation";

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    languageLevel: "",
    learningGoals: [] as string[],
    name: "",
    email: "",
    password: "",
    country: "",
    agreeTerms: false
  });
  
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    setAnimateProgress(true);
  }, []);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setAnimateProgress(false);
    // Small delay to allow transition to run
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setAnimateProgress(true);
    }, 50);
  };

  const prevStep = () => {
    setAnimateProgress(false);
    // Small delay to allow transition to run
    setTimeout(() => {
      setCurrentStep(prev => Math.max(1, prev - 1));
      setAnimateProgress(true);
    }, 50);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepWelcome onNext={nextStep} />;
      case 2:
        return (
          <StepLanguageLevel 
            onNext={nextStep} 
            onPrev={prevStep}
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 3:
        return (
          <StepLearningGoals 
            onNext={nextStep} 
            onPrev={prevStep}
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 4:
        return (
          <StepPersonalInfo 
            onNext={nextStep} 
            onPrev={prevStep}
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 5:
        return (
          <StepCreateAccount 
            onNext={nextStep} 
            onPrev={prevStep}
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 6:
        return <StepConfirmation formData={formData} />;
      default:
        return <StepWelcome onNext={nextStep} />;
    }
  };

  const progressPercentage = Math.round((currentStep / 6) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Logo and Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg mb-8">
        <div className="flex justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-indigo-100 p-3 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Global Edu Care</h2>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Progress Indicator */}
        <div className="relative px-8 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wide font-semibold text-indigo-600">
              STEP {currentStep} OF 6
            </span>
            <span className="text-xs font-semibold inline-block text-indigo-600">
              {progressPercentage}%
            </span>
          </div>
          
          <div className="overflow-hidden h-2 mb-4 flex rounded-full bg-gray-200">
            <div
              style={{ width: `${animateProgress ? progressPercentage : 0}%` }}
              className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-700 ease-in-out"
            ></div>
          </div>
        </div>
        
        {/* Content Container */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 mb-10 transform transition-all duration-300 ease-in-out">
          {renderStep()}
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-center space-x-2 mb-10">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`rounded-full transition-all duration-300 ${
                step === currentStep 
                  ? "bg-indigo-600 w-3 h-3" 
                  : step < currentStep 
                    ? "bg-indigo-400 w-2 h-2" 
                    : "bg-gray-300 w-2 h-2"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
} 