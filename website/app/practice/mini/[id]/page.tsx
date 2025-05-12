"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

// Module information
const modules = {
  listening: {
    title: 'Listening',
    description: 'Mini test for the IELTS Listening module',
    color: 'blue',
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    sections: [
      { id: 'section1', title: 'Section 1', description: 'Short conversation', duration: '5 minutes', questionCount: 5 },
      { id: 'section2', title: 'Section 2', description: 'Brief monologue', duration: '10 minutes', questionCount: 10 },
    ],
    duration: '15 minutes',
  },
  reading: {
    title: 'Reading',
    description: 'Mini test for the IELTS Reading module',
    color: 'purple',
    icon: (
      <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    sections: [
      { id: 'passage1', title: 'Passage 1', description: 'Short academic text', duration: '15 minutes', questionCount: 10 },
      { id: 'passage2', title: 'Passage 2', description: 'Medium-length academic text', duration: '15 minutes', questionCount: 10 },
    ],
    duration: '30 minutes',
  },
  writing: {
    title: 'Writing',
    description: 'Mini test for the IELTS Writing module',
    color: 'green',
    icon: (
      <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    sections: [
      { id: 'task1', title: 'Task 1', description: 'Simplified data description task', duration: '10 minutes', wordCount: '100 words' },
      { id: 'task2', title: 'Task 2', description: 'Short essay task', duration: '20 minutes', wordCount: '200 words' },
    ],
    duration: '30 minutes',
  },
  speaking: {
    title: 'Speaking',
    description: 'Mini test for the IELTS Speaking module',
    color: 'yellow',
    icon: (
      <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    sections: [
      { id: 'part1', title: 'Part 1', description: 'Brief introduction and interview', duration: '2-3 minutes', questionCount: '4-5 questions' },
      { id: 'part2', title: 'Part 2', description: 'Short talk on a given topic', duration: '3-4 minutes', questionCount: '1 topic' },
    ],
    duration: '5-7 minutes',
  },
};

export default function MiniTestPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;
  
  const [currentSection, setCurrentSection] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Make sure the moduleId is valid
  const moduleInfo = modules[moduleId] || modules.listening;
  const sections = moduleInfo.sections || [];
  
  const startTest = () => {
    setTestStarted(true);
    setCurrentSection(0);
    setShowResults(false);
  };
  
  const completeTest = () => {
    setShowResults(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <nav className="mb-4">
            <ol className="flex space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/practice" className="hover:text-gray-700">
                  Practice Tests
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href="/practice/mini" className="hover:text-gray-700">
                  Mini Tests
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-700">{moduleInfo.title}</span>
              </li>
            </ol>
          </nav>
          
          {!testStarted && !showResults && (
            <div className="space-y-6">
              <div className={`bg-${moduleInfo.color}-50 border border-${moduleInfo.color}-100 rounded-xl shadow-sm p-6 mb-6`}>
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      {moduleInfo.icon}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mini {moduleInfo.title} Test</h1>
                    <p className="mt-1 text-gray-600">{moduleInfo.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {moduleInfo.duration}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Mini Test
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Test Overview</h2>
                  <p className="mt-1 text-sm text-gray-500">What to expect in this mini test</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-gray-700 mb-4">
                    This is a shortened version of the {moduleInfo.title} module designed to give you quick practice and feedback. It covers the key question types and formats you'll encounter in the full IELTS exam.
                  </p>
                  
                  <h3 className="text-base font-medium text-gray-900 mt-6 mb-3">Test Sections</h3>
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">{section.title}</h4>
                            <p className="mt-1 text-sm text-gray-500">{section.description}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>{section.duration}</p>
                            <p className="mt-1">
                              {section.questionCount ? `${section.questionCount}` : section.wordCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={startTest}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-${moduleInfo.color}-600 hover:bg-${moduleInfo.color}-700 focus:outline-none`}
                    >
                      Start Mini Test
                      <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {testStarted && !showResults && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`px-4 py-5 bg-${moduleInfo.color}-50 border-b border-${moduleInfo.color}-100 sm:px-6`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Mini {moduleInfo.title} Test
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Section {currentSection + 1}: {sections[currentSection].title}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <div className="inline-flex items-center px-3 py-1 rounded-md bg-white shadow-sm text-sm font-medium text-gray-700">
                      <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{sections[currentSection].duration} remaining</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`bg-${moduleInfo.color}-600 h-1.5 rounded-full`} 
                    style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <p className="text-gray-700 text-center text-lg">
                  This is a placeholder for the actual test content. In a real application, this would contain:
                </p>
                <ul className="mt-4 space-y-2 mx-auto max-w-md">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Interactive {moduleInfo.title.toLowerCase()} content for {sections[currentSection].title}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Timer functionality to track remaining time</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Question-specific instructions and answer inputs</span>
                  </li>
                </ul>
                
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      if (currentSection < sections.length - 1) {
                        setCurrentSection(currentSection + 1);
                      } else {
                        completeTest();
                      }
                    }}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-${moduleInfo.color}-600 hover:bg-${moduleInfo.color}-700 focus:outline-none`}
                  >
                    {currentSection < sections.length - 1 ? 'Next Section' : 'Complete Test'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {showResults && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`px-4 py-5 bg-${moduleInfo.color}-50 border-b border-${moduleInfo.color}-100 sm:px-6`}>
                <h2 className="text-lg font-medium text-gray-900">Test Results</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Your performance on the Mini {moduleInfo.title} Test
                </p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className={`flex items-center justify-center h-20 w-20 rounded-full bg-${moduleInfo.color}-100 mb-4`}>
                    <svg className={`h-10 w-10 text-${moduleInfo.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Test Completed!</h3>
                  <p className="mt-1 text-gray-600">
                    You've completed the Mini {moduleInfo.title} Test
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Your Score</h4>
                  
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-2">
                        <span className="text-2xl font-bold text-green-700">7.0</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">Band Score</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Analysis</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-base font-medium text-gray-800">Strengths</h5>
                      <ul className="mt-2 list-disc list-inside text-gray-600">
                        <li>Good understanding of key concepts</li>
                        <li>Effective time management</li>
                        <li>Strong performance in {sections[0].title}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-base font-medium text-gray-800">Areas for Improvement</h5>
                      <ul className="mt-2 list-disc list-inside text-gray-600">
                        <li>Focus on {sections[1].title} skills</li>
                        <li>Practice with more complex questions</li>
                        <li>Work on accuracy in answers</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    href="/practice/mini"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Back to Mini Tests
                  </Link>
                  <Link 
                    href={`/modules/${moduleId}`}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${moduleInfo.color}-600 hover:bg-${moduleInfo.color}-700 focus:outline-none`}
                  >
                    Study {moduleInfo.title} Module
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 