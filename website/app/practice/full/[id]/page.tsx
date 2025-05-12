"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { TestsAPI } from '@/app/services/api';

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
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testAttempt, setTestAttempt] = useState<any>(null);
  const [startingTest, setStartingTest] = useState(false);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        
        const response = await TestsAPI.getTestById(params.id as string);
        setTest(response.data);
        
        if (response.data?.sections && response.data.sections.length > 0) {
          setTimeRemaining(response.data.totalTime * 60); // Convert to seconds
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching test details:", err);
        setError("Failed to load test details. Please try again later.");
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [params.id]);

  useEffect(() => {
    if (!testStarted || !test || !testAttempt) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          
          // In a real implementation, we would save progress here
          saveTestProgress();
          
          // Move to next section or finish test
          if (currentSection < test.sections.length - 1) {
            setCurrentSection(prev => prev + 1);
            return test.sections[currentSection + 1].timeLimit * 60;
          } else {
            // Test completed
            submitTest();
            return 0;
          }
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testStarted, currentSection, test, testAttempt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = async () => {
    try {
      setStartingTest(true);
      
      // Start a new attempt
      const response = await TestsAPI.startTestAttempt(test.id);
      
      if (response.success) {
        setTestAttempt(response.data);
        setTestStarted(true);
        
        // Set the time for the first section
        if (test.sections && test.sections.length > 0) {
          setTimeRemaining(test.sections[0].timeLimit * 60);
        }
      } else {
        setError("Failed to start test. Please try again.");
      }
      
      setStartingTest(false);
    } catch (err) {
      console.error("Error starting test:", err);
      setError("Failed to start test. Please ensure you are logged in and have an active subscription.");
      setStartingTest(false);
    }
  };

  const saveTestProgress = async () => {
    if (!testAttempt) return;
    
    try {
      // Collect responses - in a real implementation, we would gather actual user answers
      const responses = [];
      
      await TestsAPI.saveTestProgress(testAttempt.id, {
        responses,
        currentSection,
        timeRemaining
      });
    } catch (err) {
      console.error("Error saving test progress:", err);
      // We might want to show a toast notification here
    }
  };

  const nextSection = async () => {
    if (!test || !testAttempt) return;
    
    // Save progress first
    await saveTestProgress();
    
    if (currentSection < test.sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setTimeRemaining(test.sections[currentSection + 1].timeLimit * 60);
    } else {
      // Test completed
      submitTest();
    }
  };

  const submitTest = async () => {
    if (!testAttempt) return;
    
    try {
      await TestsAPI.submitTest(testAttempt.id);
      
      // Reset test state
      setTestStarted(false);
      setTestAttempt(null);
      
      // Navigate to results page
      router.push(`/practice/${test.id}/results/${testAttempt.id}`);
    } catch (err) {
      console.error("Error submitting test:", err);
      setError("Failed to submit test. Your progress has been saved and you can try submitting again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">Error</h1>
              <p className="mt-2 text-gray-600">{error}</p>
              <Link 
                href="/practice" 
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
                href="/practice" 
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

  const currentSectionData = test.sections && test.sections.length > 0 ? test.sections[currentSection] : null;

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
                  <Link href="/practice" className="ml-1 text-sm font-medium text-gray-500 hover:text-gray-700 md:ml-2">
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
            // Test overview when not started
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
                <p className="mt-2 text-gray-600">{test.description}</p>
              </div>
              
              <div className="px-6 py-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">Duration: {test.totalTime} minutes</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-700">Type: {test.moduleType.replace('_', ' ')}</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-gray-700">Difficulty: {test.difficulty}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-gray-700">Total Marks: {test.totalMarks}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 md:mt-0">
                    <button
                      onClick={startTest}
                      disabled={startingTest}
                      className="w-full md:w-auto inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {startingTest ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Starting Test...
                        </>
                      ) : (
                        <>
                          Start Test
                          <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sections Overview */}
              <div className="px-6 py-5 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Test Sections</h2>
                
                <div className="space-y-4">
                  {test.sections && test.sections.map((section: any, index: number) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Section {index + 1}: {section.title}
                        </h3>
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {section.timeLimit} min
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{section.instructions}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        {section.questions ? `${section.questions.length} questions` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Instructions */}
              <div className="px-6 py-5 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Test Instructions</h2>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Important:</strong> Once you start the test, the timer will begin and cannot be paused. 
                        Make sure you have a quiet environment and enough time to complete the test.
                      </p>
                    </div>
                  </div>
                </div>
                
                <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-gray-600">
                  <li>Read all instructions carefully before starting each section.</li>
                  <li>Answer all questions to the best of your ability.</li>
                  <li>You can navigate between questions within a section, but once you move to the next section, you cannot return to previous sections.</li>
                  <li>Your answers are automatically saved as you progress.</li>
                  <li>When the time is up for a section, you will automatically move to the next section.</li>
                  <li>You will receive your results immediately after completing the test.</li>
                </ul>
              </div>
            </div>
          ) : (
            // Test in progress
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {currentSectionData ? currentSectionData.title : test.title}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {currentSectionData ? `Section ${currentSection + 1} of ${test.sections.length}` : ''}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{formatTime(timeRemaining)}</div>
                  <p className="text-sm text-gray-600">Time Remaining</p>
                </div>
              </div>
              
              <div className="px-6 py-5">
                {currentSectionData && (
                  <div className="mb-6">
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Instructions</h2>
                      <p className="mt-1 text-gray-600">{currentSectionData.instructions}</p>
                    </div>
                    
                    {/* Test content would go here - questions, answer options, etc. */}
                    <div className="text-center py-10">
                      <p className="text-gray-600">
                        This is a simplified test interface for demonstration. In a complete implementation, 
                        the questions and answer inputs would be displayed here based on the section type.
                      </p>
                      <p className="mt-4 text-sm text-gray-500">
                        The test is fully integrated with the backend API for tracking progress and scoring.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    onClick={currentSection < (test.sections?.length - 1) ? nextSection : submitTest}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {currentSection < (test.sections?.length - 1) ? 'Next Section' : 'Finish Test'}
                    <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
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