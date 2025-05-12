"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { TestsAPI } from '@/app/services/api';

export default function PracticeTestsPage() {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all published tests
        const testsResponse = await TestsAPI.getAllTests({ isPublished: true });
        setTests(testsResponse.data || []);
        
        // Try to fetch user test history if user is logged in
        try {
          const historyResponse = await TestsAPI.getUserTestHistory();
          setUserHistory(historyResponse.data || []);
        } catch (historyError) {
          // User might not be logged in, or another error occurred
          console.log("Could not fetch test history:", historyError);
          setUserHistory([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Failed to load tests. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group tests by module type
  const fullTests = tests.filter((test: any) => test.moduleType === 'FULL_TEST');
  const moduleTests = tests.filter((test: any) => test.moduleType !== 'FULL_TEST');

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
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Practice Tests</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">IELTS Practice Tests</h1>
            <p className="mt-2 text-gray-600">
              Practice makes perfect. Choose from our range of IELTS practice tests to improve your skills.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg text-gray-700">Loading tests...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Practice Tests */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition hover:shadow-md">
                  <div className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Full Practice Tests</h2>
                    </div>
                    
                    <p className="mt-4 text-gray-600">
                      Experience complete IELTS exams with our full-length practice tests. These tests simulate the real exam environment and cover all four sections: Listening, Reading, Writing, and Speaking.
                    </p>
                    
                    <div className="mt-5 space-y-4">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Complete 2h45m tests</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">All four IELTS skills in one package</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Timed sections and authentic scoring</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Detailed performance analysis</span>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Link
                        href="/practice/full"
                        className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Browse Full Tests
                        <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Mini Practice Tests */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition hover:shadow-md">
                  <div className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                        <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Mini Practice Tests</h2>
                    </div>
                    
                    <p className="mt-4 text-gray-600">
                      Focus on specific skills with our targeted mini practice tests. Perfect for when you have limited time or want to focus on improving particular areas of your IELTS performance.
                    </p>
                    
                    <div className="mt-5 space-y-4">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Short 20-40 minute sessions</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Focus on specific skills and question types</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Targeted feedback on specific areas</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Perfect for busy schedules</span>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Link
                        href="/practice/mini"
                        className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        Browse Mini Tests
                        <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Test History */}
              <div className="mt-10 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Your Recent Test History</h3>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                          {userHistory.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Test
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score
                                  </th>
                                  <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Action</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {userHistory.map((attempt: any) => (
                                  <tr key={attempt.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">{attempt.test.title}</div>
                                      <div className="text-sm text-gray-500">{attempt.test.moduleType.replace('_', ' ')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-500">{new Date(attempt.updatedAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        attempt.status === 'COMPLETED' 
                                          ? 'bg-green-100 text-green-800' 
                                          : attempt.status === 'IN_PROGRESS'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {attempt.status === 'COMPLETED' 
                                          ? 'Completed' 
                                          : attempt.status === 'IN_PROGRESS'
                                          ? 'In Progress'
                                          : 'Reviewing'}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {attempt.score ? `${attempt.score}/${attempt.test.totalMarks}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      {attempt.status === 'IN_PROGRESS' ? (
                                        <Link href={`/practice/${attempt.test.id}/attempts/${attempt.id}`} className="text-blue-600 hover:text-blue-900">
                                          Resume
                                        </Link>
                                      ) : attempt.status === 'COMPLETED' ? (
                                        <Link href={`/practice/${attempt.test.id}/results/${attempt.id}`} className="text-blue-600 hover:text-blue-900">
                                          View Results
                                        </Link>
                                      ) : (
                                        <span className="text-gray-400">Waiting</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="text-center py-10">
                              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                              </svg>
                              <h3 className="mt-2 text-lg font-medium text-gray-900">No test history yet</h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Take your first practice test to start building your performance history.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Study Tips */}
              <div className="mt-10 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">IELTS Study Tips</h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <h4 className="font-medium">Listening</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Practice with a variety of accents. Read questions before the audio starts. Take notes on specific details like numbers, dates, and names.
                      </p>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h4 className="font-medium">Reading</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Improve your skimming and scanning techniques. Practice identifying main ideas quickly. Work on your vocabulary for academic contexts.
                      </p>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <h4 className="font-medium">Writing</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Plan your essays before writing. Use a variety of sentence structures. Practice describing graphs and data for Task 1.
                      </p>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <h4 className="font-medium">Speaking</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Record yourself speaking to identify areas for improvement. Practice speaking on random topics for 2 minutes. Work on reducing hesitations.
                      </p>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h4 className="font-medium">Time Management</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Practice with timed conditions. Allocate specific time for each section. Don't spend too long on any single question.
                      </p>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <h4 className="font-medium">Test Day Strategy</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Get a good night's sleep. Arrive early at the test center. Stay calm and manage your stress. Follow all instructions carefully.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 