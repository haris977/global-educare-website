"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Mock data for demo content
const demoModules = [
  {
    id: 'listening',
    title: 'Listening',
    description: 'Improve your ability to understand spoken English in academic and everyday contexts.',
    progress: 0,
    icon: (
      <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    demoContent: [
      { id: 'listen-1', title: 'Understanding Conversations', locked: false, type: 'exercise' },
      { id: 'listen-2', title: 'Academic Lecture Practice', locked: false, type: 'quiz' },
      { id: 'listen-3', title: 'Advanced Listening Strategies', locked: true, type: 'lesson' }
    ]
  },
  {
    id: 'reading',
    title: 'Reading',
    description: 'Develop critical reading skills for academic texts and enhance your vocabulary.',
    progress: 0,
    icon: (
      <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    demoContent: [
      { id: 'read-1', title: 'Academic Passage Analysis', locked: false, type: 'exercise' },
      { id: 'read-2', title: 'Vocabulary Building', locked: true, type: 'lesson' },
      { id: 'read-3', title: 'Speed Reading Techniques', locked: true, type: 'exercise' }
    ]
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Learn to write clear, well-structured responses for both academic and general tasks.',
    progress: 0,
    icon: (
      <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    demoContent: [
      { id: 'write-1', title: 'Task 1: Data Description', locked: false, type: 'exercise' },
      { id: 'write-2', title: 'Essay Structure', locked: true, type: 'lesson' },
      { id: 'write-3', title: 'Advanced Grammar Review', locked: true, type: 'quiz' }
    ]
  },
  {
    id: 'speaking',
    title: 'Speaking',
    description: 'Build confidence in expressing your ideas clearly and fluently in an English-speaking environment.',
    progress: 0,
    icon: (
      <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    demoContent: [
      { id: 'speak-1', title: 'Part 1: Introduction Practice', locked: false, type: 'exercise' },
      { id: 'speak-2', title: 'Fluency Techniques', locked: true, type: 'lesson' },
      { id: 'speak-3', title: 'Mock Interview', locked: true, type: 'exercise' }
    ]
  }
];

export default function DemoPage() {
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // In a real app, this would come from the backend
    // For demo purposes, we'll just simulate the 3-day countdown
    
    const initialDate = localStorage.getItem('demoStartDate') 
      ? new Date(localStorage.getItem('demoStartDate') as string)
      : new Date();
      
    if (!localStorage.getItem('demoStartDate')) {
      localStorage.setItem('demoStartDate', initialDate.toString());
    }
    
    const endDate = new Date(initialDate);
    endDate.setDate(endDate.getDate() + 3);
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        {/* Demo Access Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-indigo-700 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10 sm:pb-6 flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
                  Your Demo Access
                </h2>
                <div className="mt-2 text-white text-opacity-90 text-sm">
                  Experience our IELTS preparation platform with limited access. Upgrade anytime to unlock all features.
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg px-6 py-4 text-center">
                <p className="text-sm font-medium uppercase text-indigo-100 tracking-wide">Time remaining:</p>
                <div className="mt-2 flex space-x-2 justify-center text-white">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{timeRemaining.days}</span>
                    <span className="text-xs">Days</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">:</span>
                    <span className="invisible">:</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{timeRemaining.hours.toString().padStart(2, '0')}</span>
                    <span className="text-xs">Hours</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">:</span>
                    <span className="invisible">:</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{timeRemaining.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-xs">Min</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">:</span>
                    <span className="invisible">:</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{timeRemaining.seconds.toString().padStart(2, '0')}</span>
                    <span className="text-xs">Sec</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pt-6 pb-8 bg-indigo-800 sm:p-10 sm:pt-6">
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-indigo-100">Sample IELTS practice questions</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-indigo-100">Limited module access</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-indigo-100">Basic progress tracking</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-indigo-100">Preview of learning materials</p>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="rounded-lg shadow-md">
                  <Link
                    href="/pricing"
                    className="block w-full text-center rounded-lg border border-transparent bg-white px-6 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none"
                  >
                    Upgrade to Full Access
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Module Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">IELTS Preparation Modules</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {demoModules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="px-6 py-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {module.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-500">{module.demoContent.filter(c => !c.locked).length} of {module.demoContent.length} available</p>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600">{module.description}</p>
                  
                  <div className="mt-5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Available Content</h4>
                    <ul className="space-y-3">
                      {module.demoContent.map((content) => (
                        <li key={content.id} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full ${
                              content.locked ? 'bg-gray-300' : 
                                content.type === 'exercise' ? 'bg-green-500' : 
                                content.type === 'quiz' ? 'bg-blue-500' : 'bg-purple-500'
                            } mr-2`}></span>
                            <span className={`text-sm ${content.locked ? 'text-gray-400' : 'text-gray-700'}`}>
                              {content.title}
                            </span>
                          </div>
                          {content.locked ? (
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          ) : (
                            <Link href={`/demo/${module.id}/${content.id}`}>
                              <span className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Start</span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <Link
                    href={`/pricing?module=${module.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center"
                  >
                    Unlock all {module.title} content
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-12 max-w-7xl mx-auto text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Ready to unlock your full IELTS potential?
              </h2>
              <p className="mt-4 text-lg leading-6 text-indigo-100">
                Get unlimited access to all modules, personalized feedback, and premium features.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                  >
                    View Subscription Plans
                  </Link>
                </div>
                <div className="ml-3 inline-flex">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 bg-opacity-60 hover:bg-opacity-70"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 