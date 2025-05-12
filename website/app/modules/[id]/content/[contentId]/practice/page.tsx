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

// Mock practice generator
const generatePracticeExercise = (moduleId, contentId) => {
  // Extract info from contentId format: moduleId-topic-difficulty-number
  const parts = contentId.split('-');
  const topic = parts.slice(1, -2).join('-');
  const difficulty = parts[parts.length - 2];
  
  return {
    id: contentId,
    moduleId: moduleId,
    title: `${topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: Additional Practice`,
    topic: topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    instructions: `This is an additional practice exercise for ${topic.split('-').join(' ')} in the IELTS ${moduleId} section. Answer all questions to the best of your ability.`,
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: `Sample practice question 1 related to ${topic.split('-').join(' ')}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: `Sample practice question 2 focusing on ${topic.split('-').join(' ')}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option D'
      },
      {
        id: 3,
        type: 'text-input',
        question: `Write a short response related to ${topic.split('-').join(' ')} based on the following prompt:`,
        prompt: `Sample writing prompt for ${moduleId} ${topic.split('-').join(' ')} practice.`,
        correctAnswer: 'Sample model answer. In a real app, this would be evaluated by a tutor or AI.'
      },
      {
        id: 4,
        type: 'true-false',
        question: `True or False: Sample statement related to ${topic.split('-').join(' ')}.`,
        correctAnswer: 'True'
      },
      {
        id: 5,
        type: 'multiple-choice',
        question: `Final practice question about ${topic.split('-').join(' ')}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option B'
      }
    ]
  };
};

export default function ContentPracticePage() {
  const params = useParams();
  const router = useRouter();
  const { id: moduleId, contentId } = params;
  
  const [practice, setPractice] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const practiceData = generatePracticeExercise(moduleId, contentId);
    setPractice(practiceData);
    setUserAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setProgress(0);
  }, [moduleId, contentId]);
  
  const handleAnswerSelection = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < practice.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setProgress(((currentQuestion + 1) / practice.questions.length) * 100);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setProgress(((currentQuestion - 1) / practice.questions.length) * 100);
    }
  };
  
  const calculateScore = () => {
    const correctAnswers = practice.questions.filter(
      question => userAnswers[question.id] === question.correctAnswer
    ).length;
    
    return {
      correct: correctAnswers,
      total: practice.questions.length,
      percentage: Math.round((correctAnswers / practice.questions.length) * 100)
    };
  };
  
  if (!practice) {
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
  const currentQuestionData = practice.questions[currentQuestion];
  
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
                <span className="text-gray-700">Practice</span>
              </li>
            </ol>
          </nav>
          
          {/* Practice header */}
          <div className={`${moduleColorSet.bg} ${moduleColorSet.border} border rounded-lg shadow-sm p-6 mb-6`}>
            <h1 className="text-2xl font-bold text-gray-900">{practice.title}</h1>
            <div className="mt-2 flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${moduleColorSet.color}-100 ${moduleColorSet.text} mr-2`}>
                {moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {practice.difficulty}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{practice.instructions}</p>
          </div>
          
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Question {currentQuestion + 1} of {practice.questions.length}</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`bg-${moduleColorSet.color}-600 h-2.5 rounded-full`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Question/Results display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            {showResults ? (
              // Results view
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full bg-${moduleColorSet.color}-100 mb-4`}>
                    <svg className={`h-8 w-8 text-${moduleColorSet.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  {(() => {
                    const score = calculateScore();
                    return (
                      <>
                        <h2 className="text-xl font-bold text-gray-900">Practice Completed!</h2>
                        <p className="mt-1 text-gray-600">You got {score.correct} out of {score.total} questions correct.</p>
                        
                        <div className="mt-4 mx-auto max-w-md">
                          <div className="relative h-4 bg-gray-200 rounded-full">
                            <div 
                              className={
                                score.percentage >= 80 ? "h-4 bg-green-500 rounded-full" : 
                                score.percentage >= 60 ? "h-4 bg-yellow-500 rounded-full" : 
                                "h-4 bg-red-500 rounded-full"
                              }
                              style={{ width: `${score.percentage}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 text-center">
                            <span className="text-sm font-medium text-gray-700">{score.percentage}%</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Question Review</h3>
                  {practice.questions.map((question) => {
                    const isCorrect = userAnswers[question.id] === question.correctAnswer;
                    const answerStatus = userAnswers[question.id] 
                      ? (isCorrect ? 'Correct' : 'Incorrect') 
                      : 'Not answered';
                    
                    return (
                      <div key={question.id} className={`p-4 rounded-lg ${
                        !userAnswers[question.id] ? 'bg-gray-50 border border-gray-200' :
                        isCorrect ? 'bg-green-50 border border-green-200' : 
                        'bg-red-50 border border-red-200'
                      }`}>
                        <p className="font-medium text-gray-900">{question.question}</p>
                        {question.prompt && (
                          <p className="mt-1 text-gray-700 italic">{question.prompt}</p>
                        )}
                        <div className="mt-2">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              !userAnswers[question.id] ? 'bg-gray-100 text-gray-800' :
                              isCorrect ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {answerStatus}
                            </span>
                          </div>
                          <p className="text-sm mt-2">Your answer: <span className="font-medium">{userAnswers[question.id] || 'No answer provided'}</span></p>
                          {(!isCorrect || !userAnswers[question.id]) && (
                            <p className="text-sm mt-1">Correct answer: <span className="font-medium">{question.correctAnswer}</span></p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    href={`/modules/${moduleId}/content/${contentId}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back to Content
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
              // Question view
              <div className="p-6">
                <h2 className="text-xl font-medium text-gray-900">Question {currentQuestion + 1}</h2>
                
                <div className="mt-4">
                  <p className="text-gray-900 font-medium mb-2">{currentQuestionData.question}</p>
                  {currentQuestionData.prompt && (
                    <p className="text-gray-700 italic mb-4">{currentQuestionData.prompt}</p>
                  )}
                  
                  {currentQuestionData.type === 'multiple-choice' && (
                    <div className="mt-4 space-y-3">
                      {currentQuestionData.options.map((option) => (
                        <div key={option} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`question-${currentQuestionData.id}-${option}`}
                              name={`question-${currentQuestionData.id}`}
                              type="radio"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              checked={userAnswers[currentQuestionData.id] === option}
                              onChange={() => handleAnswerSelection(currentQuestionData.id, option)}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`question-${currentQuestionData.id}-${option}`} className="font-medium text-gray-700">
                              {option}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {currentQuestionData.type === 'text-input' && (
                    <div className="mt-4">
                      <textarea
                        rows={4}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Type your answer here..."
                        value={userAnswers[currentQuestionData.id] || ''}
                        onChange={(e) => handleAnswerSelection(currentQuestionData.id, e.target.value)}
                      ></textarea>
                    </div>
                  )}
                  
                  {currentQuestionData.type === 'true-false' && (
                    <div className="mt-4 space-y-3">
                      {['True', 'False'].map((option) => (
                        <div key={option} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`question-${currentQuestionData.id}-${option}`}
                              name={`question-${currentQuestionData.id}`}
                              type="radio"
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              checked={userAnswers[currentQuestionData.id] === option}
                              onChange={() => handleAnswerSelection(currentQuestionData.id, option)}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`question-${currentQuestionData.id}-${option}`} className="font-medium text-gray-700">
                              {option}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation buttons */}
          {!showResults && (
            <div className="flex justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className={`inline-flex items-center px-4 py-2 border ${currentQuestion === 0 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} text-sm font-medium rounded-md bg-white`}
              >
                Previous
              </button>
              
              <button
                onClick={handleNextQuestion}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${moduleColorSet.color}-600 hover:bg-${moduleColorSet.color}-700`}
              >
                {currentQuestion === practice.questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 