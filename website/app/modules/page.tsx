"use client";

import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

// Mock module data
const modules = [
  {
    id: 'listening',
    title: 'Listening',
    description: 'Improve your ability to understand spoken English in academic and everyday contexts.',
    completedLessons: 7,
    totalLessons: 25,
    color: 'blue',
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    topics: [
      { name: 'Conversations', count: 6 },
      { name: 'Academic Lectures', count: 8 },
      { name: 'Daily Life', count: 5 },
      { name: 'Professional Settings', count: 6 },
    ],
  },
  {
    id: 'reading',
    title: 'Reading',
    description: 'Develop critical reading skills for academic texts and enhance your vocabulary.',
    completedLessons: 5,
    totalLessons: 22,
    color: 'purple',
    icon: (
      <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    topics: [
      { name: 'Academic Articles', count: 7 },
      { name: 'Scientific Texts', count: 5 },
      { name: 'Historical Passages', count: 4 },
      { name: 'Social Sciences', count: 6 },
    ],
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Learn to write clear, well-structured responses for both academic and general tasks.',
    completedLessons: 3,
    totalLessons: 18,
    color: 'green',
    icon: (
      <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    topics: [
      { name: 'Task 1: Charts & Graphs', count: 5 },
      { name: 'Task 1: Processes', count: 3 },
      { name: 'Task 2: Opinion Essays', count: 6 },
      { name: 'Task 2: Discussion Essays', count: 4 },
    ],
  },
  {
    id: 'speaking',
    title: 'Speaking',
    description: 'Build confidence in expressing your ideas clearly and fluently in an English-speaking environment.',
    completedLessons: 2,
    totalLessons: 16,
    color: 'yellow',
    icon: (
      <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    topics: [
      { name: 'Part 1: Introduction', count: 4 },
      { name: 'Part 2: Individual Long Turn', count: 5 },
      { name: 'Part 3: Discussion', count: 4 },
      { name: 'Fluency Techniques', count: 3 },
    ],
  },
];

// Module colors mapping
const moduleColors = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-800',
    progress: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    text: 'text-purple-800',
    progress: 'bg-purple-500',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-100',
    text: 'text-green-800',
    progress: 'bg-green-500',
  },
  yellow: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-800',
    progress: 'bg-amber-500',
  },
};

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">IELTS Learning Modules</h1>
                <p className="mt-2 text-sm text-gray-700">
                  Access comprehensive learning materials and practice exercises for all four IELTS test modules.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link 
                  href="/practice-tests"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Take a Practice Test
                </Link>
              </div>
            </div>
          </div>
          
          {/* Recent Progress Summary */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Your Recent Progress</h2>
              <div className="mt-4 max-w-2xl">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {modules.map((module) => {
                    const colors = moduleColors[module.color as keyof typeof moduleColors];
                    const progressPercentage = Math.round((module.completedLessons / module.totalLessons) * 100);
                    
                    return (
                      <div key={module.id} className={`${colors.bg} ${colors.border} border rounded-lg px-4 py-3`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {module.icon}
                          </div>
                          <div className="ml-3">
                            <h3 className={`text-sm font-medium ${colors.text}`}>{module.title}</h3>
                            <div className="mt-1 flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`${colors.progress} h-2 rounded-full`}
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-500">{progressPercentage}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Module Cards */}
          <div className="space-y-12">
            {modules.map((module) => {
              const colors = moduleColors[module.color as keyof typeof moduleColors];
              
              return (
                <div key={module.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`${colors.bg} p-3 rounded-lg mr-4`}>
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{module.title}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{module.description}</p>
                      </div>
                    </div>
                    <Link
                      href={`/modules/${module.id}`}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-${module.color}-600 hover:bg-${module.color}-700 focus:outline-none`}
                    >
                      Explore Module
                    </Link>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <h4 className="text-sm font-medium text-gray-500">Popular Topics</h4>
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        {module.topics.map((topic) => (
                          <Link 
                            key={topic.name} 
                            href={`/modules/${module.id}/topics/${encodeURIComponent(topic.name.toLowerCase())}`}
                            className="group relative bg-white border rounded-lg shadow-sm p-4 hover:border-gray-300 focus:outline-none"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                              <p className="mt-1 text-xs text-gray-500">{topic.count} lessons</p>
                            </div>
                            <span className="absolute inset-0" aria-hidden="true"></span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{module.completedLessons}</span> of <span className="font-medium text-gray-900">{module.totalLessons}</span> lessons completed
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <div className="flex items-center">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="ml-1 text-sm text-gray-500">
                                  Most popular module
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-6 flex-shrink-0">
                          <Link
                            href={`/modules/${module.id}`}
                            className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View all content
                            <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Recommendations */}
          <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recommended Next Steps</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Based on your learning history and progress</p>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                <li>
                  <Link href="/modules/listening/lessons/academic-lectures" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-50 rounded-lg p-2">
                            <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-indigo-600 truncate">Academic Lectures: Note-Taking Skills</p>
                            <p className="mt-1 text-sm text-gray-500">Listening Module • Advanced • 25 min</p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Recommended Next
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/modules/writing/lessons/task2-opinion" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-50 rounded-lg p-2">
                            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-indigo-600 truncate">Task 2: Structuring Opinion Essays</p>
                            <p className="mt-1 text-sm text-gray-500">Writing Module • Intermediate • 40 min</p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            New Lesson
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/practice-tests/mini/reading" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-purple-50 rounded-lg p-2">
                            <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-indigo-600 truncate">Mini Practice Test: Reading</p>
                            <p className="mt-1 text-sm text-gray-500">Reading Module • Mixed Difficulty • 30 min</p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Weekly Challenge
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 