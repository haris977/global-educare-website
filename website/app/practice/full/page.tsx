"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/services/api';

const practiceTests = [
  {
    id: 'test-1',
    title: 'IELTS Academic Practice Test 1',
    date: 'June 2023',
    difficulty: 'Medium',
    duration: '2 hours 45 minutes',
    questions: {
      listening: 40,
      reading: 40,
      writing: 2,
      speaking: 3
    },
    rating: 4.8,
    reviews: 120,
    description: 'Complete practice test following the official IELTS Academic format. Includes all four modules with detailed score analysis.',
  },
  {
    id: 'test-2',
    title: 'IELTS Academic Practice Test 2',
    date: 'September 2023',
    difficulty: 'Hard',
    duration: '2 hours 45 minutes',
    questions: {
      listening: 40,
      reading: 40,
      writing: 2,
      speaking: 3
    },
    rating: 4.7,
    reviews: 98,
    description: 'Academic practice test with challenging reading passages and complex writing tasks. Good preparation for those aiming for band 7+.',
  },
  {
    id: 'test-3',
    title: 'IELTS General Training Practice Test 1',
    date: 'July 2023',
    difficulty: 'Medium',
    duration: '2 hours 45 minutes',
    questions: {
      listening: 40,
      reading: 40,
      writing: 2,
      speaking: 3
    },
    rating: 4.9,
    reviews: 105,
    description: 'General Training IELTS practice test with workplace-themed reading and writing tasks. Ideal for migration purposes.',
  },
  {
    id: 'test-4',
    title: 'IELTS General Training Practice Test 2',
    date: 'October 2023',
    difficulty: 'Medium-Hard',
    duration: '2 hours 45 minutes',
    questions: {
      listening: 40,
      reading: 40,
      writing: 2,
      speaking: 3
    },
    rating: 4.6,
    reviews: 87,
    description: 'General Training test featuring social survival scenarios and everyday English usage. Recommended for workplace and migration preparation.',
  },
];

export default function FullPracticeTestsPage() {
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
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Full Tests</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Full IELTS Practice Tests</h1>
                <p className="mt-2 text-gray-600">
                  Complete practice tests that simulate the actual IELTS exam experience.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex rounded-md shadow-sm">
                  <Link
                    href="/practice"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="mr-2 -ml-1 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Tests
                  </Link>
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {practiceTests.map((test) => (
              <div key={test.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{test.title}</h2>
                      <p className="mt-1 text-sm text-gray-500">Released: {test.date} • Difficulty: {test.difficulty}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                      <div className="flex items-center mr-4">
                        <svg className="text-yellow-400 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm text-gray-600">{test.rating} ({test.reviews} reviews)</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {test.duration}
                      </span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-gray-600">{test.description}</p>
                  
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500">Listening</div>
                          <div className="text-sm font-semibold">{test.questions.listening} Questions</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500">Reading</div>
                          <div className="text-sm font-semibold">{test.questions.reading} Questions</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500">Writing</div>
                          <div className="text-sm font-semibold">{test.questions.writing} Tasks</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500">Speaking</div>
                          <div className="text-sm font-semibold">{test.questions.speaking} Parts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      href={`/practice/full/${test.id}`}
                      className="w-full md:w-auto flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Start Test
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-600">Can\'t find what you\'re looking for?</p>
            <p className="mt-1">
              <Link href="/practice/mini" className="text-blue-600 hover:text-blue-800 font-medium">
                Try our mini practice tests →
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 