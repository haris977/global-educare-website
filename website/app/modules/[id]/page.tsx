"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

// Module metadata
const moduleInfo = {
  listening: {
    title: 'IELTS Listening',
    description: 'Improve your ability to understand spoken English in various contexts, from everyday conversations to academic lectures.',
    icon: (
      <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    color: 'blue',
  },
  reading: {
    title: 'IELTS Reading',
    description: 'Develop the skills to understand complex texts, identify key information, and improve your academic vocabulary.',
    icon: (
      <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'purple',
  },
  writing: {
    title: 'IELTS Writing',
    description: 'Learn how to write clear, coherent responses for both academic and general tasks, with strategies for achieving higher band scores.',
    icon: (
      <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: 'green',
  },
  speaking: {
    title: 'IELTS Speaking',
    description: 'Build confidence in expressing yourself clearly and fluently across all parts of the IELTS Speaking test.',
    icon: (
      <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    color: 'yellow',
  },
};

// Mock content data
const generateMockContentForModule = (moduleId: string) => {
  const contentTypes = {
    listening: ['Conversations', 'Academic Lectures', 'Daily Life', 'Professional Settings'],
    reading: ['Academic Articles', 'Scientific Texts', 'Historical Passages', 'Social Sciences'],
    writing: ['Task 1: Charts & Graphs', 'Task 1: Processes', 'Task 2: Opinion Essays', 'Task 2: Discussion Essays'],
    speaking: ['Part 1: Introduction', 'Part 2: Individual Long Turn', 'Part 3: Discussion', 'Fluency Techniques'],
  };

  const mockContent = [];
  const contentTypesForModule = contentTypes[moduleId as keyof typeof contentTypes] || [];
  
  // Content types
  for (const contentType of contentTypesForModule) {
    // Difficulty levels
    for (const difficulty of ['Beginner', 'Intermediate', 'Advanced']) {
      // Generate 2-4 items per difficulty
      const itemCount = 2 + Math.floor(Math.random() * 3); // Generates 2, 3, or 4
      
      for (let i = 1; i <= itemCount; i++) {
        mockContent.push({
          id: `${moduleId}-${contentType.toLowerCase().replace(/\s+/g, '-')}-${difficulty.toLowerCase()}-${i}`,
          title: `${contentType}: ${i === 1 ? 'Introduction' : `Practice ${i}`}`,
          type: Math.random() > 0.7 ? 'exercise' : 'lesson',
          topic: contentType,
          difficulty: difficulty,
          duration: `${15 + Math.floor(Math.random() * 30)} min`,
          completionStatus: Math.random() > 0.7 ? 'completed' : 'not-started',
          description: `${difficulty} level ${moduleId} training focusing on ${contentType.toLowerCase()}`,
        });
      }
    }
  }
  
  return mockContent;
};

const module_colors = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    button: 'bg-blue-600 hover:bg-blue-700',
    buttonLight: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    button: 'bg-purple-600 hover:bg-purple-700',
    buttonLight: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    button: 'bg-green-600 hover:bg-green-700',
    buttonLight: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  yellow: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    button: 'bg-amber-600 hover:bg-amber-700',
    buttonLight: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  },
};

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleId = params.id as string;
  
  // Filter states
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Content data
  const [content, setContent] = useState<any[]>([]);
  
  // Get module info, default to listening if not found
  const module = moduleInfo[moduleId as keyof typeof moduleInfo] || moduleInfo.listening;
  const colors = module_colors[module.color as keyof typeof module_colors];
  
  // Get all available topics for this module
  const allTopics = Array.from(new Set(content.map(item => item.topic)));
  
  // Effect to generate mock content on module change
  useEffect(() => {
    setContent(generateMockContentForModule(moduleId));
    // Reset filters when module changes
    setSelectedTopics([]);
    setSelectedDifficulties([]);
    setSelectedContentTypes([]);
    setSearchQuery('');
  }, [moduleId]);
  
  // Filter content based on selected filters
  const filteredContent = content.filter(item => {
    // Apply topic filter
    if (selectedTopics.length > 0 && !selectedTopics.includes(item.topic)) {
      return false;
    }
    
    // Apply difficulty filter
    if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(item.difficulty)) {
      return false;
    }
    
    // Apply content type filter
    if (selectedContentTypes.length > 0 && !selectedContentTypes.includes(item.type)) {
      return false;
    }
    
    // Apply search filter
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Toggle selection in filter arrays
  const toggleFilter = (value: string, filterType: 'topic' | 'difficulty' | 'contentType') => {
    switch (filterType) {
      case 'topic':
        setSelectedTopics(prev => 
          prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
        );
        break;
      case 'difficulty':
        setSelectedDifficulties(prev =>
          prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]
        );
        break;
      case 'contentType':
        setSelectedContentTypes(prev =>
          prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
        );
        break;
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedTopics([]);
    setSelectedDifficulties([]);
    setSelectedContentTypes([]);
    setSearchQuery('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Module Header */}
          <div className={`${colors.bg} ${colors.border} border rounded-xl shadow-sm p-6 mb-8`}>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  {module.icon}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{module.title}</h1>
                <p className="mt-1 text-gray-600">{module.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link 
                    href={`/practice/${moduleId}`}
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white ${colors.button}`}
                  >
                    Take a Practice Test
                  </Link>
                  <Link 
                    href={`/study-plan/${moduleId}`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  >
                    View Study Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white shadow rounded-lg mb-6">
                <div className="px-4 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                </div>
                <div className="p-4">
                  {/* Search */}
                  <div className="mb-6">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      id="search"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Topics */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Topics</h3>
                    <div className="space-y-2">
                      {allTopics.map((topic) => (
                        <div key={topic} className="flex items-center">
                          <input
                            id={`topic-${topic}`}
                            name={`topic-${topic}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => toggleFilter(topic, 'topic')}
                          />
                          <label htmlFor={`topic-${topic}`} className="ml-2 text-sm text-gray-700">
                            {topic}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Difficulty */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty Level</h3>
                    <div className="space-y-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map((difficulty) => (
                        <div key={difficulty} className="flex items-center">
                          <input
                            id={`difficulty-${difficulty}`}
                            name={`difficulty-${difficulty}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedDifficulties.includes(difficulty)}
                            onChange={() => toggleFilter(difficulty, 'difficulty')}
                          />
                          <label htmlFor={`difficulty-${difficulty}`} className="ml-2 text-sm text-gray-700">
                            {difficulty}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Content Type */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Content Type</h3>
                    <div className="space-y-2">
                      {['lesson', 'exercise'].map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            id={`type-${type}`}
                            name={`type-${type}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedContentTypes.includes(type)}
                            onChange={() => toggleFilter(type, 'contentType')}
                          />
                          <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Clear Filters */}
                  <button
                    onClick={clearFilters}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Your Progress</h2>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Completed</span>
                    <span className="text-sm font-medium text-gray-900">
                      {content.filter(item => item.completionStatus === 'completed').length} / {content.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${(content.filter(item => item.completionStatus === 'completed').length / content.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  <Link 
                    href="/dashboard"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    View Detailed Progress
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Content Grid */}
            <div className="mt-6 lg:mt-0 lg:col-span-9">
              {/* Applied Filters */}
              {(selectedTopics.length > 0 || selectedDifficulties.length > 0 || selectedContentTypes.length > 0 || searchQuery) && (
                <div className="bg-white px-4 py-3 rounded-lg shadow-sm mb-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  
                  {/* Topic filters */}
                  {selectedTopics.map(topic => (
                    <span key={topic} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {topic}
                      <button 
                        type="button"
                        onClick={() => toggleFilter(topic, 'topic')}
                        className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove filter for {topic}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  
                  {/* Difficulty filters */}
                  {selectedDifficulties.map(difficulty => (
                    <span key={difficulty} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {difficulty}
                      <button 
                        type="button"
                        onClick={() => toggleFilter(difficulty, 'difficulty')}
                        className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove filter for {difficulty}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  
                  {/* Content type filters */}
                  {selectedContentTypes.map(type => (
                    <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                      <button 
                        type="button"
                        onClick={() => toggleFilter(type, 'contentType')}
                        className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove filter for {type}</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  
                  {/* Search query */}
                  {searchQuery && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Search: "{searchQuery}"
                      <button 
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                      >
                        <span className="sr-only">Clear search</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  )}
                  
                  <button
                    onClick={clearFilters}
                    className="text-xs text-indigo-600 hover:text-indigo-500 ml-auto"
                  >
                    Clear all
                  </button>
                </div>
              )}
              
              {/* Results Count */}
              <div className="bg-white px-4 py-3 rounded-lg shadow-sm mb-4">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredContent.length}</span> of <span className="font-medium">{content.length}</span> results
                </p>
              </div>
              
              {/* Content Cards */}
              {filteredContent.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredContent.map((item) => {
                    // Choose icon based on content type
                    let icon;
                    if (item.type === 'lesson') {
                      icon = (
                        <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      );
                    } else {
                      icon = (
                        <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      );
                    }
                    
                    // Set difficulty badge color
                    const difficultyColor = 
                      item.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      item.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800';
                    
                    // Completion status
                    const isCompleted = item.completionStatus === 'completed';
                    
                    return (
                      <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-indigo-50 rounded-lg p-2">
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                              <p className="text-sm text-gray-500 truncate">{item.topic}</p>
                            </div>
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                  </svg>
                                  Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-gray-400" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                  </svg>
                                  Not Started
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${difficultyColor}`}>
                                {item.difficulty}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {item.duration}
                              </span>
                            </div>
                            <Link 
                              href={`/modules/${moduleId}/content/${item.id}`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                            >
                              {isCompleted ? 'Review' : item.type === 'lesson' ? 'Start Lesson' : 'Start Exercise'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria to find what you\'re looking for.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 