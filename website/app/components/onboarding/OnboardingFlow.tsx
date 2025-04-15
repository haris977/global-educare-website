"use client";

import { useState } from "react";
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

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          {/* Progress bar */}
          <div className="w-full max-w-xs">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs font-semibold text-indigo-600 uppercase">
                  Step {currentStep} of 6
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {Math.round((currentStep / 6) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
} 