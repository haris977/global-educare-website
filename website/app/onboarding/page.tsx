"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock onboarding steps
const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Global Edu Care',
    description: 'Your comprehensive IELTS preparation platform',
    content: (
      <div className="space-y-4">
        <p>
          Congratulations on joining Global Edu Care! We're excited to help you achieve your IELTS goals.
        </p>
        <p>
          This quick tour will introduce you to the key features of our platform, so you can get the most out of your learning experience.
        </p>
        <div className="mt-6">
          <img 
            src="/placeholder-welcome.jpg" 
            alt="Welcome to Global Edu Care" 
            className="rounded-lg shadow-md mx-auto h-64 object-cover w-full bg-gray-100"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Your Learning Dashboard',
    description: 'Track your progress and access all features',
    content: (
      <div className="space-y-4">
        <p>
          Your dashboard is your command center for IELTS preparation. Here you can:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Track your progress across all IELTS modules</li>
          <li>View recommended practice based on your performance</li>
          <li>Access quick links to recently used materials</li>
          <li>See upcoming scheduled practice sessions</li>
        </ul>
        <div className="mt-6">
          <img 
            src="/placeholder-dashboard.jpg" 
            alt="Dashboard Overview" 
            className="rounded-lg shadow-md mx-auto h-64 object-cover w-full bg-gray-100"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'modules',
    title: 'IELTS Modules',
    description: 'Comprehensive preparation for all test components',
    content: (
      <div className="space-y-4">
        <p>
          Our platform covers all four IELTS modules with targeted practice:
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h4 className="font-semibold text-indigo-700">Listening</h4>
            <p className="text-sm mt-1">Audio exercises with comprehension questions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h4 className="font-semibold text-indigo-700">Reading</h4>
            <p className="text-sm mt-1">Academic passages with analysis questions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h4 className="font-semibold text-indigo-700">Writing</h4>
            <p className="text-sm mt-1">Task 1 & 2 practice with detailed feedback</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
            <h4 className="font-semibold text-indigo-700">Speaking</h4>
            <p className="text-sm mt-1">Interactive speaking exercises for all parts</p>
          </div>
        </div>
        <div className="mt-6">
          <img 
            src="/placeholder-modules.jpg" 
            alt="IELTS Modules" 
            className="rounded-lg shadow-md mx-auto h-64 object-cover w-full bg-gray-100"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'practice',
    title: 'Practice Tests',
    description: 'Full-length mock exams and timed practice',
    content: (
      <div className="space-y-4">
        <p>
          Prepare effectively with our comprehensive practice tests:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Full-length IELTS mock tests in exam conditions</li>
          <li>Section-specific timed practice</li>
          <li>Detailed performance analysis and band score estimates</li>
          <li>Personalized feedback on your responses</li>
        </ul>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-4">
          <p className="text-sm text-indigo-700">
            <strong>Pro Tip:</strong> Take at least one full practice test every two weeks to track your progress effectively.
          </p>
        </div>
        <div className="mt-6">
          <img 
            src="/placeholder-practice.jpg" 
            alt="Practice Tests" 
            className="rounded-lg shadow-md mx-auto h-64 object-cover w-full bg-gray-100"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'feedback',
    title: 'Personalized Feedback',
    description: 'Get detailed feedback on your writing and speaking',
    content: (
      <div className="space-y-4">
        <p>
          Our platform provides detailed feedback to help you improve:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Writing assessments with sentence-level corrections</li>
          <li>Band score breakdowns across all criteria</li>
          <li>Speaking feedback with pronunciation guidance</li>
          <li>Personalized improvement recommendations</li>
        </ul>
        <div className="mt-6">
          <img 
            src="/placeholder-feedback.jpg" 
            alt="Personalized Feedback" 
            className="rounded-lg shadow-md mx-auto h-64 object-cover w-full bg-gray-100"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start your IELTS preparation journey',
    content: (
      <div className="space-y-4">
        <p>
          You\'re now ready to begin your IELTS preparation journey with Global Edu Care!
        </p>
        <p>
          We recommend starting with a diagnostic test to assess your current level and create a personalized study plan.
        </p>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-4">
          <p className="text-sm text-green-700">
            <strong>Success Tip:</strong> Consistent practice is key to IELTS success. Aim for at least 30 minutes of focused study each day.
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <svg className="h-24 w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    ),
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [animatingOut, setAnimatingOut] = useState(false);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setAnimatingOut(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setAnimatingOut(false);
      }, 300);
    } else {
      // Redirect to dashboard when onboarding is complete
      router.push('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setAnimatingOut(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setAnimatingOut(false);
      }, 300);
    }
  };

  const handleSkip = () => {
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const currentStepData = onboardingSteps[currentStep];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase tracking-wide font-semibold text-indigo-600">
                STEP {currentStep + 1} OF {onboardingSteps.length}
              </span>
              <span className="text-xs font-semibold inline-block text-indigo-600">
                {Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%
              </span>
            </div>
            
            <div className="overflow-hidden h-2 mb-4 flex rounded-full bg-gray-200">
              <div
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-in-out"
              ></div>
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              {onboardingSteps.map((step, index) => (
                <button
                  key={step.id}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                    index < currentStep
                      ? 'bg-indigo-600 text-white'
                      : index === currentStep
                      ? 'bg-indigo-100 border-2 border-indigo-600 text-indigo-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  onClick={() => {
                    setAnimatingOut(true);
                    setTimeout(() => {
                      setCurrentStep(index);
                      setAnimatingOut(false);
                    }, 300);
                  }}
                >
                  {index < currentStep ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Content Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
            <div className="p-6 sm:p-10">
              <div 
                className={`transition-opacity duration-300 ${
                  animatingOut ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentStepData.title}</h2>
                <p className="text-gray-600 mb-6">{currentStepData.description}</p>
                
                <div className="prose max-w-none">
                  {currentStepData.content}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            {currentStep > 0 ? (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Previous
              </button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}
            
            <div className="flex space-x-3">
              {currentStep < onboardingSteps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 hover:text-indigo-700 focus:outline-none"
                >
                  Skip Tutorial
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                {currentStep < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 