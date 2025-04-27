"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

// Mock data for tests
const mockTests = [
  {
    id: 'full-test-1',
    title: 'Complete IELTS Practice Test 1',
    type: 'full',
    description: 'A comprehensive IELTS practice test covering all four sections: Listening, Reading, Writing, and Speaking.',
    duration: 165, // in minutes
    sections: [
      {
        id: 'listening',
        title: 'Listening Test',
        duration: 30,
        questions: 40,
        description: 'Listen to four recordings and answer questions based on what you hear.'
      },
      {
        id: 'reading',
        title: 'Reading Test',
        duration: 60,
        questions: 40,
        description: 'Read three passages and answer questions to demonstrate your understanding.'
      },
      {
        id: 'writing',
        title: 'Writing Test',
        duration: 60,
        questions: 2,
        description: 'Complete two writing tasks: a graph or chart description and an essay.'
      },
      {
        id: 'speaking',
        title: 'Speaking Test',
        duration: 15,
        questions: 3,
        description: 'Participate in a recorded interview covering three speaking parts.'
      }
    ]
  },
  {
    id: 'mini-listening-1',
    title: 'Mini Listening Practice Test 1',
    type: 'mini',
    description: 'A short listening practice test to improve your comprehension skills.',
    duration: 20,
    sections: [
      {
        id: 'listening',
        title: 'Listening Practice',
        duration: 20,
        questions: 15,
        description: 'Listen to a recording and answer questions to test your listening comprehension.'
      }
    ]
  },
  {
    id: 'mini-reading-1',
    title: 'Mini Reading Practice Test 1',
    type: 'mini',
    description: 'A short reading practice test focused on academic reading skills.',
    duration: 25,
    sections: [
      {
        id: 'reading',
        title: 'Reading Practice',
        duration: 25,
        questions: 15,
        description: 'Read an academic passage and answer questions to test your reading comprehension.'
      }
    ]
  },
  {
    id: 'mini-writing-1',
    title: 'Mini Writing Practice Test 1',
    type: 'mini',
    description: 'A focused writing practice test to improve your essay writing skills.',
    duration: 30,
    sections: [
      {
        id: 'writing',
        title: 'Writing Practice',
        duration: 30,
        questions: 1,
        description: 'Write an essay on a given topic to practice your writing skills.'
      }
    ]
  },
  {
    id: 'mini-speaking-1',
    title: 'Mini Speaking Practice Test 1',
    type: 'mini',
    description: 'A short speaking practice test to improve your verbal communication.',
    duration: 15,
    sections: [
      {
        id: 'speaking',
        title: 'Speaking Practice',
        duration: 15,
        questions: 2,
        description: 'Respond to prompted questions to practice your speaking skills.'
      }
    ]
  }
];

export default function PracticeTestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundTest = mockTests.find(t => t.id === params.id);
    
    if (foundTest) {
      setTest(foundTest);
      setTimeRemaining(foundTest.sections[0].duration * 60); // Convert to seconds
    }
    
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    if (!testStarted || !test) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Move to next section or finish test
          if (currentSection < test.sections.length - 1) {
            setCurrentSection(prev => prev + 1);
            return test.sections[currentSection + 1].duration * 60;
          } else {
            // Test completed
            setTestStarted(false);
            return 0;
          }
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testStarted, currentSection, test]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    setTestStarted(true);
  };

  const nextSection = () => {
    if (currentSection < test.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setTimeRemaining(test.sections[currentSection + 1].duration * 60);
    } else {
      // Test completed
      setTestStarted(false);
    }
  };

  const finishTest = () => {
    // In a real app, this would submit the test and show results
    router.push('/practice-tests');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Test Not Found</h1>
              <p className="mt-2 text-gray-600">
                The practice test you're looking for could not be found.
              </p>
              <Link 
                href="/practice-tests" 
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Available Tests
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentSectionData = test.sections[currentSection];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-5" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/practice-tests" className="ml-1 text-sm font-medium text-gray-500 hover:text-gray-700 md:ml-2">
                    Practice Tests
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{test.title}</span>
                </div>
              </li>
            </ol>
          </nav>
          
          {!testStarted ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
                <p className="mt-2 text-gray-600">{test.description}</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Test Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-500">Duration:</span>
                      </div>
                      <p className="mt-1 text-lg font-medium text-gray-900">{test.duration} min</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-500">Total Questions:</span>
                      </div>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {test.sections.reduce((total, section) => total + section.questions, 0)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-500">Type:</span>
                      </div>
                      <p className="mt-1 text-lg font-medium text-gray-900 capitalize">{test.type} Test</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Test Sections</h2>
                  <div className="space-y-3">
                    {test.sections.map((section, index) => (
                      <div key={section.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">{section.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                          </div>
                          <div className="mt-2 md:mt-0 flex items-center space-x-4">
                            <div className="flex items-center">
                              <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm text-gray-500">{section.duration} min</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm text-gray-500">{section.questions} questions</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Before you begin</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Make sure you have a quiet environment with no interruptions.</li>
                          <li>Set aside the full amount of time required for the test ({test.duration} minutes).</li>
                          <li>Have a pen and paper ready for making notes.</li>
                          <li>Headphones recommended for listening sections.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={startTest}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Start Test
                    <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h1 className="text-xl font-medium text-gray-900">{currentSectionData.title}</h1>
                  <p className="mt-2 text-gray-600">{currentSectionData.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Section Information</h3>
                        <p className="text-sm text-gray-500 mt-1">{currentSectionData.description}</p>
                        <div className="mt-2 flex space-x-6">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-500">{currentSectionData.duration} minutes</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-500">{currentSectionData.questions} questions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* This would be replaced with the actual test content */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center mb-6">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Test Content Placeholder</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      In a real application, this area would contain the actual test questions and answer options.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    {currentSection < test.sections.length - 1 ? (
                      <button
                        onClick={nextSection}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Next Section
                        <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={finishTest}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Finish Test
                        <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Test Progress</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {test.sections.map((section, index) => (
                      <div key={section.id} className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          index < currentSection ? 'bg-green-100 text-green-600' : 
                          index === currentSection ? 'bg-blue-100 text-blue-600' : 
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {index < currentSection ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${
                            index < currentSection ? 'text-green-600' : 
                            index === currentSection ? 'text-blue-600' : 
                            'text-gray-500'
                          }`}>
                            {section.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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