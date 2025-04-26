"use client";

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';

// Mock user data
const userData = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  subscription: {
    type: 'Quarterly',
    status: 'active',
    nextBillingDate: '2023-09-15',
    expiresOn: '2023-09-15',
  },
  progress: {
    overall: 42,
    listening: 65,
    reading: 50,
    writing: 35,
    speaking: 20,
  },
  recentActivity: [
    { id: 1, type: 'practice', module: 'Listening', title: 'Section 1 Practice', score: '7/10', date: '2 hours ago' },
    { id: 2, type: 'lesson', module: 'Writing', title: 'Task 2 Essay Structure', completed: true, date: 'Yesterday' },
    { id: 3, type: 'quiz', module: 'Reading', title: 'Academic Vocabulary Quiz', score: '8/10', date: '3 days ago' },
    { id: 4, type: 'practice', module: 'Speaking', title: 'Part 2 Long Turn', completed: true, date: '5 days ago' },
  ],
  recommendedContent: [
    { id: 1, type: 'practice', module: 'Writing', title: 'Task 1 Data Description', difficulty: 'Medium' },
    { id: 2, type: 'lesson', module: 'Reading', title: 'Skimming and Scanning Techniques', difficulty: 'Beginner' },
    { id: 3, type: 'quiz', module: 'Listening', title: 'Note Completion Practice', difficulty: 'Hard' },
  ],
  upcomingTests: [
    { id: 1, title: 'Full Mock Test', date: 'Sep 12, 2023', time: '10:00 AM' },
    { id: 2, title: 'Writing Assessment', date: 'Sep 18, 2023', time: '2:00 PM' },
  ],
};

// Define tab types for better type safety
type TabType = 'overview' | 'progress' | 'materials' | 'tests';

// Module colors for consistent styling
const moduleColors = {
  Listening: { bg: 'bg-blue-100', text: 'text-blue-800', icon: 'text-blue-500', border: 'border-blue-200' },
  Reading: { bg: 'bg-purple-100', text: 'text-purple-800', icon: 'text-purple-500', border: 'border-purple-200' },
  Writing: { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-500', border: 'border-green-200' },
  Speaking: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-500', border: 'border-yellow-200' },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Tab labels
  const tabLabels: Record<TabType, string> = {
    overview: 'Overview',
    progress: 'Progress',
    materials: 'Learning Materials',
    tests: 'Tests & Assessments',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <div className="bg-white overflow-hidden rounded-lg shadow mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData.name}!</h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Continue your IELTS preparation journey. Your current overall progress is {userData.progress.overall}%.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <Link
                    href="/mock-test"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Take a Mock Test
                  </Link>
                  <Link
                    href="/study-plan"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View Study Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="mb-8">
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as TabType)}
                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="overview">Overview</option>
                <option value="progress">Progress</option>
                <option value="materials">Learning Materials</option>
                <option value="tests">Tests & Assessments</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {(['overview', 'progress', 'materials', 'tests'] as TabType[]).map((tab) => {
                    const isActive = activeTab === tab;
                    const label = tabLabels[tab];
                    
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${
                          isActive
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
          
          {/* Dashboard Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Progress Cards */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(userData.progress)
                    .filter(([key]) => key !== 'overall')
                    .map(([module, progress]) => {
                      const moduleKey = module as keyof typeof moduleColors;
                      const colors = moduleColors[moduleKey] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-500', border: 'border-gray-200' };
                      
                      return (
                        <div key={module} className={`bg-white overflow-hidden rounded-lg shadow ${colors.border}`}>
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 rounded-md p-3 ${colors.bg}`}>
                                <svg className={`h-6 w-6 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {module === 'listening' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />}
                                  {module === 'reading' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                                  {module === 'writing' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />}
                                  {module === 'speaking' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                                </svg>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <dl>
                                  <dt className={`text-sm font-medium truncate ${colors.text}`}>
                                    {module.charAt(0).toUpperCase() + module.slice(1)}
                                  </dt>
                                  <dd>
                                    <div className="flex items-center">
                                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                          className="bg-indigo-600 h-2.5 rounded-full" 
                                          style={{ width: `${progress}%` }}
                                        ></div>
                                      </div>
                                      <span className="ml-2 text-sm font-medium text-gray-700">{progress}%</span>
                                    </div>
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                              <Link
                                href={`/modules/${module}`}
                                className="font-medium text-indigo-700 hover:text-indigo-900"
                              >
                                Continue learning
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              
              {/* Recent Activity */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {userData.recentActivity.map((activity) => {
                      const moduleKey = activity.module as keyof typeof moduleColors;
                      const colors = moduleColors[moduleKey];
                      
                      return (
                        <li key={activity.id}>
                          <Link
                            href={`/activity/${activity.id}`}
                            className="block hover:bg-gray-50"
                          >
                            <div className="px-4 py-4 flex items-center sm:px-6">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                                <svg className={`h-6 w-6 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {activity.type === 'practice' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
                                  {activity.type === 'lesson' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                                  {activity.type === 'quiz' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                </svg>
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-indigo-600 truncate">
                                    {activity.title}
                                  </p>
                                  <div className="ml-2 flex-shrink-0 flex">
                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors.bg} ${colors.text}`}>
                                      {activity.module}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2 flex justify-between">
                                  <div className="flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                      {activity.score && (
                                        <span className="truncate">Score: {activity.score}</span>
                                      )}
                                      {activity.completed && (
                                        <span className="truncate flex items-center">
                                          <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                          Completed
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                  <div className="text-sm text-gray-500">{activity.date}</div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              
              {/* Two-Column Layout for Recommended and Upcoming */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recommended Content */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recommended For You</h2>
                  <div className="bg-white shadow overflow-hidden rounded-lg">
                    <ul className="divide-y divide-gray-200">
                      {userData.recommendedContent.map((content) => {
                        const moduleKey = content.module as keyof typeof moduleColors;
                        const colors = moduleColors[moduleKey];
                        
                        return (
                          <li key={content.id}>
                            <Link
                              href={`/content/${content.id}`}
                              className="block hover:bg-gray-50 p-4"
                            >
                              <div className="flex items-center">
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                                  <svg className={`h-6 w-6 ${colors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {content.type === 'practice' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
                                    {content.type === 'lesson' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                                    {content.type === 'quiz' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                  </svg>
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {content.title}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors.bg} ${colors.text}`}>
                                        {content.module}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-1 flex justify-between">
                                    <div className="flex items-center">
                                      <p className="text-sm text-gray-500">
                                        {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                                      </p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      <span className={`px-2 py-1 text-xs rounded ${
                                        content.difficulty === 'Beginner' 
                                          ? 'bg-green-100 text-green-800' 
                                          : content.difficulty === 'Medium'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {content.difficulty}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="bg-gray-50 px-4 py-3 text-center">
                      <Link
                        href="/recommendations"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View all recommendations
                        <span aria-hidden="true"> &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Upcoming Tests */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Tests</h2>
                  <div className="bg-white shadow overflow-hidden rounded-lg">
                    {userData.upcomingTests.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {userData.upcomingTests.map((test) => (
                          <li key={test.id}>
                            <div className="px-4 py-4 flex items-center sm:px-6">
                              <div className="flex-shrink-0">
                                <svg className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900">
                                    {test.title}
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{test.date} at {test.time}</span>
                                </div>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none"
                                >
                                  Prepare
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-5 sm:p-6 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming tests</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Schedule a test to assess your progress and readiness.
                        </p>
                        <div className="mt-6">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Schedule a Test
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="bg-gray-50 px-4 py-3 text-center">
                      <Link
                        href="/schedule"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View test schedule
                        <span aria-hidden="true"> &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subscription Status */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Subscription Status</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {userData.subscription.type} Plan
                        </h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                          <p>
                            Your subscription is {userData.subscription.status === 'active' ? 'active' : 'inactive'}.
                            {userData.subscription.status === 'active' && ` Next billing date is ${userData.subscription.nextBillingDate}.`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                        {userData.subscription.status === 'active' ? (
                          <Link
                            href="/account/subscription"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Manage Subscription
                          </Link>
                        ) : (
                          <Link
                            href="/pricing"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          >
                            Renew Subscription
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs - in a real app, these would be implemented */}
          {activeTab === 'progress' && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Detailed Progress Analysis</h3>
              <p className="mt-1 text-sm text-gray-500">This tab would show detailed progress tracking and analytics.</p>
            </div>
          )}
          
          {activeTab === 'materials' && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Learning Materials Library</h3>
              <p className="mt-1 text-sm text-gray-500">This tab would provide access to all learning materials and resources.</p>
            </div>
          )}
          
          {activeTab === 'tests' && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tests & Assessments</h3>
              <p className="mt-1 text-sm text-gray-500">This tab would provide access to all practice tests and assessments.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 