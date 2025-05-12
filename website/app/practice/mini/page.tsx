"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const miniPracticeTests = [
  {
    id: 'listening-basic',
    title: 'Listening: Basic Comprehension',
    type: 'listening',
    difficulty: 'Easy',
    duration: '30 minutes',
    questions: 15,
    rating: 4.8,
    reviews: 92,
    description: 'Focus on fundamental listening skills with straightforward dialogues and monologues.',
    skills: ['Identifying main ideas', 'Understanding specific details', 'Following instructions'],
  },
  {
    id: 'listening-advanced',
    title: 'Listening: Advanced Comprehension',
    type: 'listening',
    difficulty: 'Hard',
    duration: '30 minutes',
    questions: 15,
    rating: 4.6,
    reviews: 75,
    description: 'Challenge your listening skills with complex academic lectures and fast-paced conversations.',
    skills: ['Understanding academic lectures', 'Following complex arguments', 'Identifying speaker attitudes'],
  },
  {
    id: 'reading-basic',
    title: 'Reading: Basic Comprehension',
    type: 'reading',
    difficulty: 'Easy',
    duration: '35 minutes',
    questions: 13,
    rating: 4.9,
    reviews: 105,
    description: 'Build reading confidence with shorter texts focused on everyday topics.',
    skills: ['Skimming for main ideas', 'Scanning for information', 'Understanding vocabulary in context'],
  },
  {
    id: 'reading-advanced',
    title: 'Reading: Academic Passages',
    type: 'reading',
    difficulty: 'Hard',
    duration: '35 minutes',
    questions: 13,
    rating: 4.7,
    reviews: 89,
    description: 'Practice with challenging academic texts featuring complex language and abstract concepts.',
    skills: ['Understanding academic arguments', 'Identifying writer opinion', 'Following complex explanations'],
  },
  {
    id: 'writing-task1',
    title: 'Writing: Task 1 Practice',
    type: 'writing',
    difficulty: 'Medium',
    duration: '20 minutes',
    questions: 1,
    rating: 4.8,
    reviews: 120,
    description: 'Practice describing graphs, charts, tables and diagrams with detailed feedback.',
    skills: ['Data description', 'Trend analysis', 'Academic vocabulary'],
  },
  {
    id: 'writing-task2',
    title: 'Writing: Task 2 Practice',
    type: 'writing',
    difficulty: 'Medium-Hard',
    duration: '40 minutes',
    questions: 1,
    rating: 4.7,
    reviews: 98,
    description: 'Develop your essay writing skills with practice on common IELTS topics.',
    skills: ['Essay structure', 'Argument development', 'Critical thinking'],
  },
  {
    id: 'speaking-part1',
    title: 'Speaking: Introduction & Interview',
    type: 'speaking',
    difficulty: 'Easy',
    duration: '5 minutes',
    questions: 5,
    rating: 4.9,
    reviews: 110,
    description: 'Practice answering common personal questions with confidence.',
    skills: ['Fluency', 'Personal expression', 'Question response'],
  },
  {
    id: 'speaking-part2',
    title: 'Speaking: Topic Cards',
    type: 'speaking',
    difficulty: 'Medium',
    duration: '5 minutes',
    questions: 1,
    rating: 4.8,
    reviews: 95,
    description: 'Work on your ability to speak at length on a given topic with minimal preparation.',
    skills: ['Extended speaking', 'Topic development', 'Coherent organization'],
  },
];

// Group tests by type
const groupedTests = {
  listening: miniPracticeTests.filter(test => test.type === 'listening'),
  reading: miniPracticeTests.filter(test => test.type === 'reading'),
  writing: miniPracticeTests.filter(test => test.type === 'writing'),
  speaking: miniPracticeTests.filter(test => test.type === 'speaking'),
};

const typeIcons = {
  listening: (
    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  reading: (
    <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  writing: (
    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  speaking: (
    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
};

const typeColors = {
  listening: 'bg-blue-100 text-blue-800',
  reading: 'bg-purple-100 text-purple-800',
  writing: 'bg-green-100 text-green-800',
  speaking: 'bg-yellow-100 text-yellow-800',
};

export default function MiniPracticeTestsPage() {
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
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Mini Tests</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mini IELTS Practice Tests</h1>
                <p className="mt-2 text-gray-600">
                  Focus on specific skills with our targeted mini practice tests. Perfect for focused practice sessions.
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
          
          {/* Listening Tests */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              {typeIcons.listening}
              <h2 className="ml-2 text-xl font-bold text-gray-900">Listening Tests</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedTests.listening.map((test) => (
                <div key={test.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[test.type]}`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{test.description}</p>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{test.duration} • {test.questions} questions</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2">Skills tested:</div>
                      <div className="flex flex-wrap gap-2">
                        {test.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <Link
                        href={`/practice/mini/${test.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Start Test
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Reading Tests */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              {typeIcons.reading}
              <h2 className="ml-2 text-xl font-bold text-gray-900">Reading Tests</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedTests.reading.map((test) => (
                <div key={test.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[test.type]}`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{test.description}</p>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{test.duration} • {test.questions} questions</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2">Skills tested:</div>
                      <div className="flex flex-wrap gap-2">
                        {test.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <Link
                        href={`/practice/mini/${test.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        Start Test
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Writing Tests */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              {typeIcons.writing}
              <h2 className="ml-2 text-xl font-bold text-gray-900">Writing Tests</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedTests.writing.map((test) => (
                <div key={test.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[test.type]}`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{test.description}</p>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{test.duration} • {test.questions} task</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2">Skills tested:</div>
                      <div className="flex flex-wrap gap-2">
                        {test.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <Link
                        href={`/practice/mini/${test.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Start Test
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Speaking Tests */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              {typeIcons.speaking}
              <h2 className="ml-2 text-xl font-bold text-gray-900">Speaking Tests</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedTests.speaking.map((test) => (
                <div key={test.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[test.type]}`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{test.description}</p>
                    
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{test.duration} • {test.questions > 1 ? `${test.questions} questions` : '1 task'}</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2">Skills tested:</div>
                      <div className="flex flex-wrap gap-2">
                        {test.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <Link
                        href={`/practice/mini/${test.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                      >
                        Start Test
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-600">Ready for a complete test experience?</p>
            <p className="mt-1">
              <Link href="/practice/full" className="text-blue-600 hover:text-blue-800 font-medium">
                Try our full-length practice tests →
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 