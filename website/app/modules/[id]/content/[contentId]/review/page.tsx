"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Module colors mapping
const moduleColors = {
  listening: {
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-800',
    button: 'bg-blue-600 hover:bg-blue-700',
  },
  reading: {
    color: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    text: 'text-purple-800',
    button: 'bg-purple-600 hover:bg-purple-700',
  },
  writing: {
    color: 'green',
    bg: 'bg-green-50',
    border: 'border-green-100',
    text: 'text-green-800',
    button: 'bg-green-600 hover:bg-green-700',
  },
  speaking: {
    color: 'yellow',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    text: 'text-amber-800',
    button: 'bg-amber-600 hover:bg-amber-700',
  },
};

// Mock content generator - simplified version for review page
const generateReviewContent = (moduleId, contentId) => {
  // Extract info from contentId format: moduleId-topic-difficulty-number
  const parts = contentId.split('-');
  const topic = parts.slice(1, -2).join('-');
  const difficulty = parts[parts.length - 2];
  
  return {
    id: contentId,
    moduleId: moduleId,
    title: `${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: Review`,
    topic: topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    keyPoints: [
      `Understanding the structure of ${topic.split('-').join(' ')} questions`,
      `Identifying main ideas and supporting details in ${moduleId} tasks`,
      `Using appropriate techniques for ${difficulty.toLowerCase()} level content`,
      `Time management strategies for the ${moduleId} section`,
      `Common mistakes to avoid in ${topic.split('-').join(' ')} tasks`
    ],
    additionalResources: [
      {
        title: 'Practice Exercises',
        description: 'Additional exercises to reinforce your learning',
        link: `/modules/${moduleId}/content/${contentId}/practice`
      },
      {
        title: 'Video Tutorial',
        description: 'Watch our expert explain key concepts',
        link: `/resources/videos/${moduleId}/${topic}`
      },
      {
        title: 'Study Guide',
        description: 'Download a comprehensive study guide',
        link: `/resources/guides/${moduleId}/${topic}`
      }
    ],
    recommendations: [
      {
        id: `${moduleId}-${topic}-${difficulty}-next-1`,
        title: 'Advanced Strategies',
        description: `Take your ${topic.split('-').join(' ')} skills to the next level`,
        difficulty: difficulty
      },
      {
        id: `${moduleId}-related-topic-${difficulty}-1`,
        title: 'Related Topic',
        description: 'Explore a related area to expand your knowledge',
        difficulty: difficulty
      }
    ]
  };
};

export default function ContentReviewPage() {
  const params = useParams();
  const { id: moduleId, contentId } = params;
  
  const [content, setContent] = useState(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const reviewContent = generateReviewContent(moduleId, contentId);
    setContent(reviewContent);
  }, [moduleId, contentId]);
  
  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  const moduleColorSet = moduleColors[moduleId] || moduleColors.listening;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <nav className="mb-4">
            <ol className="flex space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/modules" className="hover:text-gray-700">Modules</Link>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href={`/modules/${moduleId}`} className="hover:text-gray-700">
                  {moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href={`/modules/${moduleId}/content/${contentId}`} className="hover:text-gray-700">
                  Content
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-700">Review</span>
              </li>
            </ol>
          </nav>
          
          {/* Content header */}
          <div className={`${moduleColorSet.bg} ${moduleColorSet.border} border rounded-lg shadow-sm p-6 mb-6`}>
            <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
            <div className="mt-2 flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${moduleColorSet.color}-100 ${moduleColorSet.text} mr-2`}>
                {moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {content.difficulty}
              </span>
            </div>
            <p className="mt-2 text-gray-600">
              A review of the key concepts and strategies for {content.topic.toLowerCase()} in the IELTS {moduleId} section.
            </p>
          </div>
          
          {/* Key Points */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Key Takeaways</h2>
              <p className="mt-1 text-sm text-gray-500">The main concepts you should remember from this lesson</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="space-y-3">
                {content.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`flex-shrink-0 h-5 w-5 ${moduleColorSet.text}`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Additional Resources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Additional Resources</h2>
              <p className="mt-1 text-sm text-gray-500">Further learning materials to enhance your understanding</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ul className="divide-y divide-gray-200">
                {content.additionalResources.map((resource, index) => (
                  <li key={index} className={index > 0 ? 'pt-4 mt-4' : ''}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{resource.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{resource.description}</p>
                      </div>
                      <Link 
                        href={resource.link}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-${moduleColorSet.color}-600 hover:bg-${moduleColorSet.color}-700`}
                      >
                        Access
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Recommended Next Steps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recommended Next Steps</h2>
              <p className="mt-1 text-sm text-gray-500">Continue your learning journey with these recommendations</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {content.recommendations.map((item) => (
                  <Link 
                    key={item.id}
                    href={`/modules/${moduleId}/content/${item.id}`}
                    className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4">
                      <h3 className="text-base font-medium text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.difficulty}
                        </span>
                        <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          View content
                          <span aria-hidden="true"> &rarr;</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between">
            <Link
              href={`/modules/${moduleId}/content/${contentId}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Content
            </Link>
            <Link
              href={`/modules/${moduleId}`}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${moduleColorSet.color}-600 hover:bg-${moduleColorSet.color}-700`}
            >
              View All Module Content
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 