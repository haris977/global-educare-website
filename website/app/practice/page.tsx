"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TestsAPI } from '@/services/api';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:py-16 md:px-12 text-center sm:text-left sm:flex items-center">
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Welcome <span className="inline-block animate-wave">👋</span>
                </h1>
                <p className="text-lg md:text-xl text-indigo-100 mb-8">
                  Start your IELTS preparation journey, practice daily and achieve your dream band.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Plan Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 md:p-8 md:flex md:items-center md:justify-between">
              <div className="md:flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your personalised IELTS Lesson Plan</h2>
                <p className="text-gray-600">Continue learning & keep building your skills</p>
              </div>
              <div className="mt-4 md:mt-0 md:flex-shrink-0">
                <Link 
                  href="/modules" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Go To Lessons
                </Link>
              </div>
              <div className="hidden md:block md:ml-6 md:flex-shrink-0">
                <Image 
                  src="/images/lesson-plan.svg" 
                  alt="Lesson Plan" 
                  width={200} 
                  height={200}
                  className="h-auto w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Band Predictor Test */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Band Predictor Test</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Reading Test */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reading Test</h3>
              <div className="text-sm text-gray-500 mb-4">8 Questions · 5 min</div>
              <Link href="/practice/reading-test" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                Start Test 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Listening Test */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 017.072 0m-9.9-2.828a9 9 0 0112.728 0" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Listening Test</h3>
              <div className="text-sm text-gray-500 mb-4">8 Questions · 5 min</div>
              <Link href="/practice/listening-test" className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center">
                Start Test 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Writing Test */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Writing Test</h3>
              <div className="text-sm text-gray-500 mb-4">1 Task · 10 min</div>
              <Link href="/practice/writing-test" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                Start Test 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Speaking Test */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-100 text-yellow-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Speaking Test</h3>
              <div className="text-sm text-gray-500 mb-4">2 Questions · 5 min</div>
              <Link href="/practice/speaking-test" className="text-yellow-600 hover:text-yellow-800 font-medium inline-flex items-center">
                Start Test 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Loading/Error states */}
        {loading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
          </div>
        )}
        
        {/* Recent Test History */}
        {userHistory.length > 0 && !loading && !error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Your Recent Test History</h3>
              </div>
              
              <div className="overflow-x-auto">
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
                    {userHistory.map((history: any) => (
                      <tr key={history.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{history.testName}</div>
                          <div className="text-sm text-gray-500">{history.testType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(history.startedAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(history.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            history.status === 'COMPLETED' 
                              ? 'bg-green-100 text-green-800' 
                              : history.status === 'IN_PROGRESS' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {history.status === 'COMPLETED' 
                              ? 'Completed' 
                              : history.status === 'IN_PROGRESS' 
                              ? 'In Progress' 
                              : 'Expired'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {history.status === 'COMPLETED' ? `${history.score || 'N/A'}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            href={history.status === 'IN_PROGRESS' 
                              ? `/practice/attempt/${history.attemptId}` 
                              : `/practice/results/${history.attemptId}`} 
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {history.status === 'IN_PROGRESS' ? 'Continue' : 'View'}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 