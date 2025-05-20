"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TestsAPI } from '@/services/api';

interface TestResult {
  id: string;
  testId: string;
  userId: string;
  status: string;
  score: number;
  maxScore: number;
  percentageScore: number;
  feedback: string;
  startedAt: string;
  completedAt: string;
  sectionResults: Array<{
    sectionId: string;
    title: string;
    score: number;
    maxScore: number;
    questionResults: Array<{
      questionId: string;
      questionText: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      score: number;
      maxScore: number;
    }>;
  }>;
  test: {
    title: string;
    description: string;
    moduleType: string;
    difficulty: string;
  };
}

export default function TestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch test result data
  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        setLoading(true);
        setLoadingStep(1);
        
        // Check for fallback/local test results first
        if (params.id.startsWith('local-attempt-') || params.id.includes('fallback-test')) {
          console.log("Looking for local test result:", params.id);
          setLoadingStep(2);
          
          // Try to get result from localStorage
          if (typeof window !== 'undefined') {
            const localResult = localStorage.getItem(`testResult-${params.id}`);
            
            if (localResult) {
              console.log("Found local test result");
              const parsedResult = JSON.parse(localResult);
              setLoadingStep(3);
              
              // Create mock section results if they don't exist
              if (!parsedResult.sectionResults) {
                const mockSectionResults = createMockSectionResults(parsedResult);
                parsedResult.sectionResults = mockSectionResults;
              }
              
              setResult(parsedResult);
              setLoading(false);
              return;
            }
          }
        }
        
        // Regular API flow
        setLoadingStep(2);
        const response = await TestsAPI.getTestResult(params.id as string);
        setLoadingStep(3);
        
        if (response.success && response.data) {
          setResult(response.data);
        } else {
          setError("Failed to load test results. Please try again later.");
        }
      } catch (err) {
        setError("An error occurred while loading the results.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Create mock section results for fallback tests
    const createMockSectionResults = (result: any) => {
      const testId = result.testId || '';
      const testNumber = Number(testId.split('-').pop());
      
      switch(testNumber) {
        case 1: // Reading
          return [{
            sectionId: `${testId}-section-1`,
            title: "Reading Comprehension",
            score: Math.floor(Math.random() * 4) + 3, // 3-7 out of 10
            maxScore: 10,
            questionResults: [
              {
                questionId: `${testId}-q1`,
                questionText: "According to the passage, what is the main cause of climate change?",
                userAnswer: "Human activity",
                correctAnswer: "Human activity",
                isCorrect: true,
                score: 1,
                maxScore: 1
              },
              {
                questionId: `${testId}-q2`,
                questionText: "The passage suggests that deforestation contributes to climate change.",
                userAnswer: "true",
                correctAnswer: "true",
                isCorrect: true,
                score: 1,
                maxScore: 1
              },
              {
                questionId: `${testId}-q3`,
                questionText: "Complete the sentence: Greenhouse gases in the atmosphere _________.",
                userAnswer: "increase temperature",
                correctAnswer: "trap heat",
                isCorrect: false,
                score: 0,
                maxScore: 1
              },
              {
                questionId: `${testId}-q4`,
                questionText: "What are two major contributors to climate change mentioned in the passage?",
                userAnswer: "fossil fuels and deforestation",
                correctAnswer: "fossil fuels and deforestation",
                isCorrect: true,
                score: 2,
                maxScore: 2
              },
              {
                questionId: `${testId}-q5`,
                questionText: "Explain how human activities contribute to climate change based on the passage.",
                userAnswer: "Human activities like burning fossil fuels release greenhouse gases.",
                correctAnswer: "The answer should mention fossil fuels, greenhouse gases, and deforestation as key factors.",
                isCorrect: true,
                score: 3,
                maxScore: 5
              }
            ]
          }];
        
        case 2: // Listening
          return [{
            sectionId: `${testId}-section-1`,
            title: "Listening Comprehension",
            score: Math.floor(Math.random() * 2) + 2, // 2-4 out of 5
            maxScore: 5,
            questionResults: [
              {
                questionId: `${testId}-q1`,
                questionText: "What is the main topic of the conversation?",
                userAnswer: "Travel plans",
                correctAnswer: "Travel plans",
                isCorrect: true,
                score: 1,
                maxScore: 1
              },
              {
                questionId: `${testId}-q2`,
                questionText: "The speakers agree to meet at 5 PM.",
                userAnswer: "false",
                correctAnswer: "false",
                isCorrect: true,
                score: 1,
                maxScore: 1
              },
              {
                questionId: `${testId}-q3`,
                questionText: "What time did the speakers agree to meet?",
                userAnswer: "2 PM",
                correctAnswer: "3 PM",
                isCorrect: false,
                score: 0,
                maxScore: 3
              }
            ]
          }];
          
        case 3: // Writing
          return [
            {
              sectionId: `${testId}-section-1`,
              title: "Task 1",
              score: Math.floor(Math.random() * 3) + 6, // 6-9 out of 10
              maxScore: 10,
              questionResults: [
                {
                  questionId: `${testId}-q1`,
                  questionText: "The chart below shows the percentage of households with internet access in four countries between 2000 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
                  userAnswer: "The chart illustrates the percentage of households with internet access in four different countries over a 20-year period from 2000 to 2020...",
                  correctAnswer: "Properly structured analysis of the chart data with main trends identified.",
                  isCorrect: true,
                  score: 7,
                  maxScore: 10
                }
              ]
            },
            {
              sectionId: `${testId}-section-2`,
              title: "Task 2",
              score: Math.floor(Math.random() * 4) + 11, // 11-15 out of 20
              maxScore: 20,
              questionResults: [
                {
                  questionId: `${testId}-q2`,
                  questionText: "Some people believe that social media has a positive impact on society, while others disagree. Discuss both views and give your opinion.",
                  userAnswer: "Social media has become an integral part of modern life, affecting various aspects of society both positively and negatively...",
                  correctAnswer: "Well-structured essay discussing both perspectives and providing a reasoned opinion.",
                  isCorrect: true,
                  score: 13,
                  maxScore: 20
                }
              ]
            }
          ];
          
        case 4: // Speaking
          return [{
            sectionId: `${testId}-section-1`,
            title: "Speaking Test",
            score: Math.floor(Math.random() * 3) + 5, // 5-8 out of 9
            maxScore: 9,
            questionResults: [
              {
                questionId: `${testId}-q1`,
                questionText: "Part 1: Tell me about yourself and your hometown.",
                userAnswer: "Audio recording (transcription not available)",
                correctAnswer: "Fluent speech with good pronunciation and vocabulary.",
                isCorrect: true,
                score: 2,
                maxScore: 3
              },
              {
                questionId: `${testId}-q2`,
                questionText: "Part 2: Describe a person who has had a significant influence on your life.",
                userAnswer: "Audio recording (transcription not available)",
                correctAnswer: "Well-structured description with supporting details.",
                isCorrect: true,
                score: 2,
                maxScore: 3
              },
              {
                questionId: `${testId}-q3`,
                questionText: "Part 3: Do you think family influences are more important than influences from friends? Why or why not?",
                userAnswer: "Audio recording (transcription not available)",
                correctAnswer: "Discussion showing critical thinking and good use of complex language.",
                isCorrect: true,
                score: 1,
                maxScore: 3
              }
            ]
          }];
          
        default: // Default to reading test
          return [{
            sectionId: `${testId}-section-1`,
            title: "Test Section",
            score: Math.floor(result.percentageScore * 10 / 100) || 7,
            maxScore: 10,
            questionResults: [
              {
                questionId: `${testId}-q1`,
                questionText: "Sample question 1",
                userAnswer: "User's answer",
                correctAnswer: "Correct answer",
                isCorrect: true,
                score: 2,
                maxScore: 2
              },
              {
                questionId: `${testId}-q2`,
                questionText: "Sample question 2",
                userAnswer: "User's answer",
                correctAnswer: "Correct answer",
                isCorrect: false,
                score: 0,
                maxScore: 3
              },
              {
                questionId: `${testId}-q3`,
                questionText: "Sample question 3",
                userAnswer: "User's answer",
                correctAnswer: "Correct answer",
                isCorrect: true,
                score: 5,
                maxScore: 5
              }
            ]
          }];
      }
    };
    
    fetchTestResult();
  }, [params.id]);
  
  // Format date string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Calculate duration between start and completion
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  };
  
  // Convert percentage score to IELTS band score (1-9 scale)
  const calculateIeltsBand = (percentageScore: number): number => {
    if (percentageScore >= 95) return 9.0;
    if (percentageScore >= 90) return 8.5;
    if (percentageScore >= 85) return 8.0;
    if (percentageScore >= 80) return 7.5;
    if (percentageScore >= 75) return 7.0;
    if (percentageScore >= 70) return 6.5;
    if (percentageScore >= 65) return 6.0;
    if (percentageScore >= 60) return 5.5;
    if (percentageScore >= 55) return 5.0;
    if (percentageScore >= 50) return 4.5;
    if (percentageScore >= 40) return 4.0;
    if (percentageScore >= 30) return 3.5;
    if (percentageScore >= 20) return 3.0;
    if (percentageScore >= 10) return 2.5;
    if (percentageScore >= 5) return 2.0;
    if (percentageScore > 0) return 1.5;
    return 1.0;
  };
  
  // Get score band description
  const getScoreBand = (percentageScore: number) => {
    const band = calculateIeltsBand(percentageScore);
    
    if (band >= 8.0) return { band: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (band >= 7.0) return { band: 'Very Good', color: 'bg-green-100 text-green-800' };
    if (band >= 6.0) return { band: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    if (band >= 5.0) return { band: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800' };
    if (band >= 4.0) return { band: 'Adequate', color: 'bg-orange-100 text-orange-800' };
    return { band: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };
  
  // Loading state
  if (loading) {
    const loadingSteps = [
      "Initializing...",
      "Fetching your test results...",
      "Preparing your score report..."
    ];
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">Loading Results</h2>
            <p className="mt-2 text-gray-600">{loadingSteps[loadingStep - 1]}</p>
            
            <div className="mt-6 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
                style={{ width: `${(loadingStep / loadingSteps.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Step {loadingStep} of {loadingSteps.length}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Error Loading Results</h2>
            <p className="mt-2 text-gray-600">{error || "The test results could not be loaded."}</p>
            <div className="mt-6">
              <Link 
                href="/practice" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Practice Tests
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const scoreBand = getScoreBand(result.percentageScore);
  const ieltsBandScore = calculateIeltsBand(result.percentageScore);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Test Results</h1>
                <p className="mt-1 text-sm text-blue-100">
                  {result.test.title} • {result.test.moduleType.replace('_', ' ')} Module
                </p>
              </div>
            </div>
          </div>
          
          {/* Score summary */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded p-4">
                <div className="text-sm text-gray-500">Percentage Score</div>
                <div className="text-2xl font-bold text-gray-900">{result.percentageScore}%</div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreBand.color}`}>
                    {scoreBand.band}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-4">
                <div className="text-sm text-gray-500">IELTS Band Score</div>
                <div className="text-2xl font-bold text-gray-900">{ieltsBandScore.toFixed(1)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  Scale: 1.0 - 9.0
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-4">
                <div className="text-sm text-gray-500">Test Completed</div>
                <div className="text-base font-medium text-gray-900">{formatDate(result.completedAt)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  Duration: {calculateDuration(result.startedAt, result.completedAt)}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-4">
                <div className="text-sm text-gray-500">Test Difficulty</div>
                <div className="text-base font-medium text-gray-900">{result.test.difficulty}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {result.test.description && result.test.description.substring(0, 60)}
                  {result.test.description && result.test.description.length > 60 ? '...' : ''}
                </div>
              </div>
            </div>
            
            {/* IELTS Band Score interpretation */}
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <h3 className="text-base font-medium text-blue-900">IELTS Band Score Interpretation</h3>
              <p className="text-sm text-blue-700 mt-1">
                {ieltsBandScore >= 9.0 && "Expert user: You have full operational command of English with complete understanding."}
                {ieltsBandScore >= 8.0 && ieltsBandScore < 9.0 && "Very good user: You have fully operational command with only occasional inaccuracies."}
                {ieltsBandScore >= 7.0 && ieltsBandScore < 8.0 && "Good user: You have operational command with occasional inaccuracies and misunderstandings."}
                {ieltsBandScore >= 6.0 && ieltsBandScore < 7.0 && "Competent user: You have an effective command with some inaccuracies."}
                {ieltsBandScore >= 5.0 && ieltsBandScore < 6.0 && "Modest user: You have partial command with notable inaccuracies."}
                {ieltsBandScore >= 4.0 && ieltsBandScore < 5.0 && "Limited user: Your understanding is limited to familiar situations."}
                {ieltsBandScore >= 3.0 && ieltsBandScore < 4.0 && "Extremely limited user: You convey only general meaning in very familiar situations."}
                {ieltsBandScore >= 2.0 && ieltsBandScore < 3.0 && "Intermittent user: You have great difficulty understanding spoken and written English."}
                {ieltsBandScore < 2.0 && "Non-user: You have no ability to use the language except for a few isolated words."}
              </p>
            </div>
            
            {/* Feedback */}
            {result.feedback && (
              <div className="mt-6">
                <h3 className="text-base font-medium text-gray-900">General Feedback</h3>
                <div className="mt-2 bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700">{result.feedback}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Section Results */}
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Section Results</h3>
            
            <div className="space-y-6">
              {result.sectionResults.map((section, index) => {
                // Calculate section percentage and band score
                const sectionPercentage = Math.round((section.score / section.maxScore) * 100);
                const sectionBandScore = calculateIeltsBand(sectionPercentage);
                
                return (
                  <div key={section.sectionId} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex flex-wrap justify-between items-center">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">{section.title}</h4>
                        <p className="text-sm text-gray-500">Section {index + 1}</p>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-lg font-medium text-gray-900">
                            {section.score} / {section.maxScore}
                          </div>
                          <div className="text-xs text-gray-500">
                            {sectionPercentage}% correct
                          </div>
                        </div>
                        
                        <div className="text-right border-l pl-6 border-gray-200">
                          <div className="text-base font-medium text-gray-900">
                            Band Score
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            {sectionBandScore.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Question
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Your Answer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Correct Answer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Score
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {section.questionResults.map((question) => (
                            <tr key={question.questionId} className={question.isCorrect ? 'bg-green-50' : 'bg-red-50'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="line-clamp-1">{question.questionText}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="line-clamp-1">{question.userAnswer || 'No answer'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="line-clamp-1">{question.correctAnswer}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {question.score} / {question.maxScore}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Footer actions */}
          <div className="px-4 py-5 sm:p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 justify-between">
              <div>
                <Link 
                  href="/practice" 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Practice Tests
                </Link>
              </div>
              
              <div className="space-x-3">
                <button 
                  onClick={() => window.print()} 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                  </svg>
                  Print Results
                </button>
                
                <Link 
                  href={`/practice/review/${result.testId}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Review Test
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 