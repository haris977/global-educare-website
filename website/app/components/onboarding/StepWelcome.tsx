"use client";

interface StepWelcomeProps {
  onNext: () => void;
}

export default function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          Welcome to Global Edu Care
        </h2>
        
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-indigo-100 p-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-indigo-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Let&apos;s get you set up to improve your English skills
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            What you&apos;ll get:
          </h3>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Personalized learning path based on your current level
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Expert-designed courses and materials
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Interactive exercises with instant feedback
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Track your progress and see your improvement
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">
            This will only take about 2 minutes
          </p>
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mr-1"></div>
            <div className="w-2 h-2 bg-indigo-300 rounded-full mr-1"></div>
            <div className="w-2 h-2 bg-indigo-300 rounded-full mr-1"></div>
            <div className="w-2 h-2 bg-indigo-300 rounded-full mr-1"></div>
            <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Let&apos;s get started
        </button>
      </div>
    </div>
  );
} 