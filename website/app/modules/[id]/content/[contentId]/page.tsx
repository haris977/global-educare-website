"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

// Define TypeScript interfaces
interface Question {
  id: number;
  type: 'multiple-choice' | 'text-input';
  question: string;
  options?: string[];
  correctAnswer: string;
}

interface TheorySection {
  type: 'introduction' | 'theory' | 'example' | 'tips';
  title: string;
  content: string;
}

interface ExerciseSection {
  type: 'exercise' | 'introduction';
  title: string;
  content?: string;
  questions?: Question[];
}

type ContentSection = TheorySection | ExerciseSection;

interface ContentData {
  id: string;
  moduleId: string;
  title: string;
  type: 'lesson' | 'exercise';
  difficulty: string;
  topic: string;
  duration: string;
  description: string;
  completionStatus: string;
  sections: ContentSection[];
}

// Mock content generator
const generateMockContent = (moduleId: string, contentId: string): ContentData => {
  // Extract info from contentId format: moduleId-topic-difficulty-number
  const parts = contentId.split('-');
  const topic = parts.slice(1, -2).join('-');
  const difficulty = parts[parts.length - 2];
  
  // Determine content type from contentId
  const isExercise = contentId.includes('exercise') || Math.random() > 0.7;
  
  let content: ContentData = {
    id: contentId,
    moduleId: moduleId,
    title: `${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: ${isExercise ? 'Practice' : 'Lesson'}`,
    type: isExercise ? 'exercise' : 'lesson',
    difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    topic: topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    duration: `${15 + Math.floor(Math.random() * 30)} min`,
    description: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level ${moduleId} content focusing on ${topic.split('-').join(' ')}`,
    completionStatus: Math.random() > 0.7 ? 'completed' : 'not-started',
    sections: [],
  };
  
  // Generate sections based on content type
  if (content.type === 'lesson') {
    content.sections = [
      {
        type: 'introduction',
        title: 'Introduction',
        content: `<p>Welcome to this ${content.difficulty.toLowerCase()} level lesson on ${content.topic.toLowerCase()}. In this lesson, you will learn key concepts and strategies for the IELTS ${moduleId} section.</p>
                  <p>By the end of this lesson, you will be able to:</p>
                  <ul>
                    <li>Understand the structure of the ${moduleId} section</li>
                    <li>Recognize different question types</li>
                    <li>Apply effective strategies for ${content.topic.toLowerCase()}</li>
                    <li>Practice with sample questions</li>
                  </ul>`
      },
      {
        type: 'theory',
        title: 'Key Concepts',
        content: `<p>The IELTS ${moduleId} section tests your ability to understand and respond to various types of ${moduleId} tasks. For ${content.topic.toLowerCase()}, you need to focus on the following aspects:</p>
                  <h3>Main Principles</h3>
                  <p>Understanding the core requirements will help you perform better in the exam:</p>
                  <ul>
                    <li>Time management is crucial - allocate appropriate time for each task</li>
                    <li>Understanding the specific requirements of each question type</li>
                    <li>Using appropriate language and structures for ${moduleId} tasks</li>
                    <li>Practicing regularly with authentic materials</li>
                  </ul>
                  <h3>Common Challenges</h3>
                  <p>Students often struggle with these aspects:</p>
                  <ul>
                    <li>Identifying the main ideas and supporting details</li>
                    <li>Recognizing patterns and relationships</li>
                    <li>Managing time effectively during the exam</li>
                    <li>Dealing with unfamiliar vocabulary or concepts</li>
                  </ul>`
      },
      {
        type: 'example',
        title: 'Examples',
        content: `<p>Here are some examples of how to approach ${content.topic.toLowerCase()} in the IELTS ${moduleId} section:</p>
                  <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 my-3">
                    <h4 class="font-medium">Example 1</h4>
                    <p>Sample content demonstrating a typical ${moduleId} task related to ${content.topic.toLowerCase()}.</p>
                    <p class="text-gray-600 mt-2">This example illustrates how to identify key information and apply the correct strategy.</p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 my-3">
                    <h4 class="font-medium">Example 2</h4>
                    <p>Another sample showing a different aspect of ${content.topic.toLowerCase()} tasks.</p>
                    <p class="text-gray-600 mt-2">Pay attention to how the response is structured and organized.</p>
                  </div>`
      },
      {
        type: 'tips',
        title: 'Tips and Strategies',
        content: `<p>Follow these tips to improve your performance in the ${moduleId} section for ${content.topic.toLowerCase()}:</p>
                  <ol>
                    <li><strong>Prepare effectively:</strong> Familiarize yourself with the format and types of questions</li>
                    <li><strong>Practice regularly:</strong> Use authentic materials and past papers</li>
                    <li><strong>Time management:</strong> Allocate appropriate time for each task</li>
                    <li><strong>Review and reflect:</strong> Analyze your mistakes and learn from them</li>
                    <li><strong>Seek feedback:</strong> Get input from teachers or experienced test-takers</li>
                  </ol>
                  <p>Remember that consistent practice is key to improving your skills in the ${moduleId} section.</p>`
      }
    ];
  } else {
    // Generate exercise sections
    content.sections = [
      {
        type: 'introduction',
        title: 'Exercise Overview',
        content: `<p>This is a ${content.difficulty.toLowerCase()} level exercise focusing on ${content.topic.toLowerCase()} for the IELTS ${moduleId} section.</p>
                  <p>Complete the following questions to test your understanding and skills. You'll receive feedback at the end of the exercise.</p>`
      },
      {
        type: 'exercise',
        title: 'Practice Questions',
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: `Sample question 1 related to ${content.topic.toLowerCase()} for the ${moduleId} section?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option B'
          },
          {
            id: 2,
            type: 'multiple-choice',
            question: `Sample question 2 focusing on another aspect of ${content.topic.toLowerCase()}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option C'
          },
          {
            id: 3,
            type: 'text-input',
            question: `Complete the following sentence based on the ${content.topic.toLowerCase()} concepts discussed:`,
            correctAnswer: 'Sample answer text'
          }
        ]
      }
    ];
  }
  
  return content;
};

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id: moduleId, contentId } = params as { id: string; contentId: string };
  
  const [content, setContent] = useState<ContentData | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const contentData = generateMockContent(moduleId, contentId);
    setContent(contentData);
    setUserAnswers({});
    setShowResults(false);
    setCurrentSection(0);
    setProgress(0);
  }, [moduleId, contentId]);
  
  const handleAnswerSelection = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNextSection = () => {
    if (currentSection < content.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setProgress(((currentSection + 1) / content.sections.length) * 100);
    } else if (content.type === 'exercise') {
      setShowResults(true);
    } else {
      // Mark lesson as completed
      router.push(`/modules/${moduleId}`);
    }
  };
  
  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setProgress(((currentSection - 1) / content.sections.length) * 100);
    }
  };
  
  const handleSubmitExercise = () => {
    setShowResults(true);
  };
  
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
  
  // Calculate correct answers if showing results
  const correctAnswersCount = showResults
    ? content.sections
        .filter(section => section.type === 'exercise')
        .flatMap(section => section.questions)
        .filter(question => userAnswers[question.id] === question.correctAnswer)
        .length
    : 0;
  
  const totalQuestions = content.sections
    .filter(section => section.type === 'exercise')
    .flatMap(section => section.questions)
    .length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb navigation */}
          <nav className="mb-4">
            <ol className="flex space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/modules" className="hover:text-gray-700">
                  Modules
                </Link>
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
                <span className="text-gray-700">{content.title}</span>
              </li>
            </ol>
          </nav>
          
          {/* Content header */}
          <div className={`${moduleColorSet.bg} ${moduleColorSet.border} border rounded-lg shadow-sm p-6 mb-6`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${moduleColorSet.color}-100 ${moduleColorSet.text} mr-2`}>
                    {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                    {content.difficulty}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {content.duration}
                  </span>
                </div>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">{content.title}</h1>
                <p className="mt-1 text-gray-600">{content.description}</p>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`bg-${moduleColorSet.color}-600 h-2.5 rounded-full`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Content section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            {showResults ? (
              // Results view for exercises
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-${moduleColorSet.color}-100 mb-4`}>
                    <svg className={`h-8 w-8 text-${moduleColorSet.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Exercise Completed!</h2>
                  <p className="mt-1 text-gray-600">You got {correctAnswersCount} out of {totalQuestions} questions correct.</p>
                </div>
                
                <div className="my-6 h-4 bg-gray-200 rounded-full">
                  <div 
                    className={correctAnswersCount / totalQuestions > 0.7 ? "h-4 bg-green-500 rounded-full" : "h-4 bg-yellow-500 rounded-full"} 
                    style={{ width: `${(correctAnswersCount / totalQuestions) * 100}%` }}
                  ></div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Question Review</h3>
                  {content.sections
                    .filter(section => section.type === 'exercise')
                    .flatMap(section => section.questions)
                    .map(question => {
                      const isCorrect = userAnswers[question.id] === question.correctAnswer;
                      return (
                        <div key={question.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                          <p className="font-medium text-gray-900">{question.question}</p>
                          <div className="mt-2">
                            <p className="text-sm">Your answer: <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{userAnswers[question.id] || 'No answer'}</span></p>
                            {!isCorrect && (
                              <p className="text-sm mt-1">Correct answer: <span className="font-medium text-green-700">{question.correctAnswer}</span></p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    href={`/modules/${moduleId}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back to Module
                  </Link>
                  <Link 
                    href={`/modules/${moduleId}/content/${contentId}/review`}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${moduleColorSet.color}-600 hover:bg-${moduleColorSet.color}-700`}
                  >
                    Review Concepts
                  </Link>
                </div>
              </div>
            ) : (
              // Current section content
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {content.sections[currentSection].title}
                </h2>
                
                {content.sections[currentSection].type === 'exercise' ? (
                  // Exercise questions
                  <div className="space-y-6">
                    {content.sections[currentSection].questions.map(question => (
                      <div key={question.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-900 mb-3">{question.question}</p>
                        
                        {question.type === 'multiple-choice' && (
                          <div className="space-y-2">
                            {question.options.map(option => (
                              <div key={option} className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id={`question-${question.id}-${option}`}
                                    name={`question-${question.id}`}
                                    type="radio"
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                    checked={userAnswers[question.id] === option}
                                    onChange={() => handleAnswerSelection(question.id, option)}
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor={`question-${question.id}-${option}`} className="font-medium text-gray-700">
                                    {option}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'text-input' && (
                          <div>
                            <input 
                              type="text" 
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={userAnswers[question.id] || ''}
                              onChange={(e) => handleAnswerSelection(question.id, e.target.value)}
                              placeholder="Type your answer here"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Theory content
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.sections[currentSection].content }} />
                )}
              </div>
            )}
          </div>
          
          {/* Navigation buttons */}
          {!showResults && (
            <div className="flex justify-between">
              <button
                onClick={handlePrevSection}
                disabled={currentSection === 0}
                className={`inline-flex items-center px-4 py-2 border ${currentSection === 0 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-md bg-white`}
              >
                Previous
              </button>
              
              {currentSection === content.sections.length - 1 && content.type === 'exercise' ? (
                <button
                  onClick={handleSubmitExercise}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${moduleColorSet.color}-600 hover:bg-${moduleColorSet.color}-700`}
                >
                  Submit Answers
                </button>
              ) : (
                <button
                  onClick={handleNextSection}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${moduleColorSet.color}-600 hover:bg-${moduleColorSet.color}-700`}
                >
                  {currentSection === content.sections.length - 1 ? 'Complete' : 'Next'}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 