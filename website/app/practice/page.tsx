"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TestsAPI } from '@/services/api';

interface Test {
  id: string;
  title: string;
  description: string;
  moduleType: string;
  difficulty: string;
  totalTime: number;
  totalQuestions: number;
  createdAt: string;
  sections: any[];
}

interface TestAttempt {
  id: string;
  testId: string;
  status: string;
  score?: number;
  startedAt: string;
  completedAt?: string;
  test: {
    title: string;
    moduleType: string;
  };
}

export default function PracticeTestsPage() {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<Test[]>([]);
  const [userHistory, setUserHistory] = useState<TestAttempt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [apiStatus, setApiStatus] = useState<'connected'|'fallback'|'error'>('connected');

  // Define fallback tests to use if API fails - we'll keep this for compatibility
  // but the primary tests should come from the backend API
  const fallbackTests: Test[] = [
    {
      id: "fallback-test-1",
      title: "IELTS Reading Practice Test",
      description: "A practice test for the IELTS reading module with comprehensive passage analysis and question types",
      moduleType: "READING",
      difficulty: "MEDIUM",
      totalTime: 60,
      totalQuestions: 5,
      createdAt: new Date().toISOString(),
      sections: []
    },
    {
      id: "fallback-test-2",
      title: "IELTS Listening Practice Test",
      description: "A practice test for the IELTS listening module with audio samples and comprehension questions",
      moduleType: "LISTENING",
      difficulty: "EASY",
      totalTime: 30,
      totalQuestions: 3,
      createdAt: new Date().toISOString(),
      sections: []
    },
    {
      id: "fallback-test-3",
      title: "IELTS Writing Practice Test",
      description: "A practice test for the IELTS writing module with essay and letter writing tasks",
      moduleType: "WRITING",
      difficulty: "HARD",
      totalTime: 60,
      totalQuestions: 2,
      createdAt: new Date().toISOString(),
      sections: []
    },
    {
      id: "fallback-test-4",
      title: "IELTS Speaking Practice Test",
      description: "A practice test for the IELTS speaking module with all three parts of the speaking test",
      moduleType: "SPEAKING",
      difficulty: "MEDIUM",
      totalTime: 15,
      totalQuestions: 3,
      createdAt: new Date().toISOString(),
      sections: []
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setApiStatus('connected'); // Reset API status
        console.log("Fetching tests from API...");
        
        try {
          // Try API call first
          const testsResponse = await TestsAPI.getAllTests({ isPublished: true });
          
          if (testsResponse.success && testsResponse.data && testsResponse.data.length > 0) {
            console.log(`Found ${testsResponse.data.length} tests from API`);
            
            // Filter out fallback tests (they have IDs that start with "fallback-test-")
            const realTests = testsResponse.data.filter(test => !test.id.startsWith('fallback-test-'));
            
            // Only show real tests if available
            if (realTests.length > 0) {
              console.log(`Found ${realTests.length} real tests created from admin panel`);
              setTests(realTests);
              setApiStatus('connected');
            } else {
              console.log("No real tests available, showing empty list");
              setTests([]);
              setApiStatus('connected');
            }
          } else {
            console.warn("API returned success but no tests");
            setTests([]);
            setApiStatus('connected'); // API is working but returned no tests
          }
        } catch (apiError) {
          console.error("Error fetching tests:", apiError);
          setApiStatus('error');
          setError("Could not connect to the test server. Please check your internet connection or try again later.");
          setTests([]);
        }
        
        // Try to fetch user test history if user is logged in
        try {
          console.log("Fetching user test history...");
          const historyResponse = await TestsAPI.getUserTestHistory();
          
          if (historyResponse.success && Array.isArray(historyResponse.data)) {
            console.log(`Found ${historyResponse.data.length} history items`);
            setUserHistory(historyResponse.data);
          } else {
            console.log("No test history found or empty response");
            setUserHistory([]);
          }
        } catch (historyError: any) {
          console.log("Could not fetch test history:", historyError);
          // Only show error if it's not an authentication error
          if (historyError.message !== "Test not found" && !historyError.message.includes("401")) {
            console.error("Error fetching test history:", historyError);
          }
          setUserHistory([]);
          // Don't change apiStatus for history errors since it's secondary
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setApiStatus('error');
        setError("An unexpected error occurred. Please try again later.");
        setTests([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter tests by module type
  const filteredTests = activeTab === 'all' 
    ? tests 
    : tests.filter(test => test.moduleType.toLowerCase() === activeTab);
  
  // Group recent attempts by status
  const inProgressAttempts = userHistory.filter(attempt => attempt.status === 'IN_PROGRESS');
  const completedAttempts = userHistory.filter(attempt => attempt.status === 'COMPLETED' || attempt.status === 'SUBMITTED')
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 5); // Show only 5 most recent
  
  // Module tab data
  const modules = [
    { id: 'all', name: 'All Tests', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'reading', name: 'Reading', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'listening', name: 'Listening', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { id: 'writing', name: 'Writing', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
    { id: 'speaking', name: 'Speaking', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-orange-100 text-orange-800';
      case 'VERY_HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleColor = (moduleType: string) => {
    switch (moduleType.toUpperCase()) {
      case 'READING': return 'bg-indigo-100 text-indigo-800';
      case 'LISTENING': return 'bg-emerald-100 text-emerald-800';
      case 'WRITING': return 'bg-amber-100 text-amber-800';
      case 'SPEAKING': return 'bg-rose-100 text-rose-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white">Practice Tests</h1>
          <p className="mt-2 text-blue-100">
            Master the IELTS with our comprehensive practice tests. Track your progress and improve your skills.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Status Banner - only show if there's an issue */}
        {apiStatus !== 'connected' && (
          <div className={`mb-6 border-l-4 p-4 ${
            apiStatus === 'fallback' 
              ? 'bg-yellow-50 border-yellow-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${
                  apiStatus === 'fallback' ? 'text-yellow-400' : 'text-red-400'
                }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className={`text-sm ${
                  apiStatus === 'fallback' ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {apiStatus === 'fallback' 
                    ? 'Unable to connect to the test server. Showing sample tests for demonstration purposes only.' 
                    : 'Error connecting to the test server. Please check your internet connection or try again later.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* In Progress Tests Section */}
        {inProgressAttempts.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Continue Your Tests</h2>
              <Link href="/practice/history" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All History
              </Link>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You have <strong>{inProgressAttempts.length}</strong> test{inProgressAttempts.length !== 1 ? 's' : ''} in progress. Continue where you left off.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressAttempts.map((attempt) => (
                <div key={attempt.id} className="bg-white rounded-lg shadow-sm border border-yellow-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{attempt.test.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Started: {formatDate(attempt.startedAt)}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModuleColor(attempt.test.moduleType)}`}>
                        {attempt.test.moduleType}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <Link 
                        href={`/practice/full/${attempt.testId}`} 
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Continue Test
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module Type Tabs */}
        <div className="mb-8">
          <div className="sm:hidden">
            <select
              id="module-filter"
              name="module-filter"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === module.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    <div className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={module.icon} />
                      </svg>
                      {module.name}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Available Tests */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <p className="text-sm text-red-700 mt-1">
                  Please check if the backend API server is running at {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}
                </p>
              </div>
            </div>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h2 className="mt-2 text-lg font-medium text-gray-900">No tests found</h2>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all' ? "There are no available tests at the moment." : `No ${activeTab} tests are currently available.`}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {apiStatus === 'error' ? "This could be due to a connection issue with the test server." : 
               "Tests are managed in the admin panel. Please check if tests have been created and published."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div key={test.id} className={`bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow
                ${test.id.startsWith('fallback-test-') ? 'border-yellow-200' : 'border-gray-200'}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{test.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModuleColor(test.moduleType)}`}>
                      {test.moduleType}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{test.description}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {test.totalTime} minutes
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {test.totalQuestions} questions
                    </span>
                    {test.id.startsWith('fallback-test-') && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Sample
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <Link 
                      href={`/practice/full/${test.id}`} 
                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Start Test
                    </Link>
                    <Link 
                      href={`/practice/preview/${test.id}`}
                      className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Recent History */}
        {completedAttempts.length > 0 && (
          <div className="mt-16">
            <div className="flex justify-between items-baseline mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Test Results</h2>
              <Link href="/practice/history" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All History
              </Link>
            </div>
            
            <div className="overflow-hidden bg-white shadow-sm border border-gray-200 sm:rounded-lg">
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
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedAttempts.map((attempt) => (
                    <tr key={attempt.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{attempt.test.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(attempt.startedAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attempt.score !== undefined ? (
                          <div className="text-sm font-medium text-gray-900">{attempt.score}%</div>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getModuleColor(attempt.test.moduleType)}`}>
                          {attempt.test.moduleType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/practice/results/${attempt.id}`} className="text-blue-600 hover:text-blue-900">
                          View Results
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 