"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TestsAPI } from '@/services/api';
import AudioPlayer from '@/components/AudioPlayer';

// Types
interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options?: any;
  questionImage?: string;
  audioFile?: string;
  passage?: string;
}

interface Section {
  id: string;
  title: string;
  instructions: string;
  timeLimit: number;
  order: number;
  questions: Question[];
}

interface Test {
  id: string;
  title: string;
  description: string;
  moduleType: string;
  difficulty: string;
  totalTime: number;
  totalQuestions: number;
  clbScore: number;
  sections: Section[];
}

interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  startedAt: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED';
  currentSection: number;
  responses: Record<string, string>;
}

export default function PracticeTestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testAttempt, setTestAttempt] = useState<TestAttempt | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isCompletingSection, setIsCompletingSection] = useState(false);

  // Fetch test data
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        
        // Check if this is a fallback test
        if (params.id.startsWith('fallback-test-')) {
          console.log("Loading fallback test:", params.id);
          const fallbackTest = createFallbackTest(params.id);
          setTest(fallbackTest);
          setTimeRemaining(fallbackTest.sections[0]?.timeLimit * 60 || 0);
          setLoading(false);
          return;
        }
        
        const response = await TestsAPI.getTestById(params.id as string);
        
        if (response.success && response.data) {
          setTest(response.data);
          setTimeRemaining(response.data.sections[0]?.timeLimit * 60 || 0); // Set initial time in seconds
        } else {
          setError("Failed to load test. Please try again later.");
        }
      } catch (err) {
        setError("An error occurred while loading the test.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [params.id]);

  // Create a fallback test based on the ID
  const createFallbackTest = (id: string): Test => {
    // Extract the test type from the id (e.g., "fallback-test-1" -> 1)
    const testNumber = Number(id.split('-').pop());
    
    let test: Test = {
      id,
      title: "Reading Practice Test",
      description: "A practice test for IELTS reading",
      moduleType: "READING",
      difficulty: "MEDIUM", 
      totalTime: 60,
      totalQuestions: 5,
      clbScore: 7,
      sections: [
        {
          id: `${id}-section-1`,
          title: "Reading Comprehension",
          instructions: "Read the passage and answer the questions",
          timeLimit: 60,
          order: 1,
          questions: []
        }
      ]
    };
    
    // Customize based on test number
    switch(testNumber) {
      case 1: // Reading
        test.title = "IELTS Reading Practice Test";
        test.moduleType = "READING";
        test.sections[0].questions = [
          {
            id: `${id}-q1`,
            questionText: "According to the passage, what is the main cause of climate change?",
            questionType: "MULTIPLE_CHOICE",
            options: JSON.stringify(['Human activity', 'Natural cycles', 'Solar radiation', 'Volcanic eruptions']),
            order: 1,
            passage: "Climate change is one of the most pressing issues facing our planet today. The scientific consensus is that human activities, particularly the burning of fossil fuels and deforestation, are the primary drivers of climate change. These activities release greenhouse gases into the atmosphere, which trap heat and lead to global warming."
          },
          {
            id: `${id}-q2`,
            questionText: "The passage suggests that deforestation contributes to climate change.",
            questionType: "TRUE_FALSE",
            order: 2
          },
          {
            id: `${id}-q3`,
            questionText: "Complete the sentence: Greenhouse gases in the atmosphere _________.",
            questionType: "FILL_BLANK",
            order: 3
          },
          {
            id: `${id}-q4`,
            questionText: "What are two major contributors to climate change mentioned in the passage?",
            questionType: "SHORT_ANSWER",
            order: 4
          },
          {
            id: `${id}-q5`,
            questionText: "Explain how human activities contribute to climate change based on the passage.",
            questionType: "ESSAY",
            order: 5
          }
        ];
        break;
        
      case 2: // Listening
        test.title = "IELTS Listening Practice Test";
        test.moduleType = "LISTENING";
        test.difficulty = "EASY";
        test.totalTime = 30;
        test.totalQuestions = 3;
        test.sections[0].title = "Listening Comprehension";
        test.sections[0].instructions = "Listen to the audio and answer the questions";
        test.sections[0].timeLimit = 30;
        test.sections[0].questions = [
          {
            id: `${id}-q1`,
            questionText: "What is the main topic of the conversation?",
            questionType: "MULTIPLE_CHOICE",
            options: JSON.stringify(['Travel plans', 'University courses', 'Housing options', 'Job opportunities']),
            order: 1,
            audioFile: "https://actions.google.com/sounds/v1/human_voices/women_conversation.ogg"
          },
          {
            id: `${id}-q2`,
            questionText: "The speakers agree to meet at 5 PM.",
            questionType: "TRUE_FALSE",
            order: 2
          },
          {
            id: `${id}-q3`,
            questionText: "What time did the speakers agree to meet?",
            questionType: "SHORT_ANSWER",
            order: 3
          }
        ];
        break;
        
      case 3: // Writing
        test.title = "IELTS Writing Practice Test";
        test.moduleType = "WRITING";
        test.difficulty = "HARD";
        test.totalTime = 60;
        test.totalQuestions = 2;
        test.sections = [
          {
            id: `${id}-section-1`,
            title: "Task 1",
            instructions: "Describe the chart in your own words",
            timeLimit: 20,
            order: 1,
            questions: [
              {
                id: `${id}-q1`,
                questionText: "The chart below shows the percentage of households with internet access in four countries between 2000 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
                questionType: "ESSAY",
                questionImage: "https://via.placeholder.com/600x400?text=Sample+Chart",
                order: 1
              }
            ]
          },
          {
            id: `${id}-section-2`,
            title: "Task 2",
            instructions: "Write an essay on the given topic",
            timeLimit: 40,
            order: 2,
            questions: [
              {
                id: `${id}-q2`,
                questionText: "Some people believe that social media has a positive impact on society, while others disagree. Discuss both views and give your opinion.",
                questionType: "ESSAY",
                order: 1
              }
            ]
          }
        ];
        break;
        
      case 4: // Speaking
        test.title = "IELTS Speaking Practice Test";
        test.moduleType = "SPEAKING";
        test.difficulty = "MEDIUM";
        test.totalTime = 15;
        test.totalQuestions = 3;
        test.sections[0].title = "Speaking Test";
        test.sections[0].instructions = "Record your responses to each question";
        test.sections[0].timeLimit = 15;
        test.sections[0].questions = [
          {
            id: `${id}-q1`,
            questionText: "Part 1: Tell me about yourself and your hometown.",
            questionType: "ESSAY",
            order: 1
          },
          {
            id: `${id}-q2`,
            questionText: "Part 2: Describe a person who has had a significant influence on your life.",
            questionType: "ESSAY",
            order: 2
          },
          {
            id: `${id}-q3`,
            questionText: "Part 3: Do you think family influences are more important than influences from friends? Why or why not?",
            questionType: "ESSAY",
            order: 3
          }
        ];
        break;
    }
    
    return test;
  };

  // Timer effect
  useEffect(() => {
    if (!testStarted || !test || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSectionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testStarted, timeRemaining]);

  // Auto-save responses every 30 seconds
  useEffect(() => {
    if (!testStarted || !testAttempt) return;
    
    const saveInterval = setInterval(() => {
      saveProgress();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(saveInterval);
  }, [testStarted, testAttempt, responses]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = async () => {
    try {
      if (!test) return;
      
      // If this is a fallback test, create a local test attempt
      if (test.id.startsWith('fallback-test-')) {
        console.log("Starting fallback test locally");
        const mockAttempt: TestAttempt = {
          id: `local-attempt-${Date.now()}`,
          testId: test.id,
          userId: "guest",
          startedAt: new Date().toISOString(),
          status: "IN_PROGRESS",
          currentSection: 0,
          responses: {}
        };
        
        setTestAttempt(mockAttempt);
        setTestStarted(true);
        setTimeRemaining(test.sections[0]?.timeLimit * 60 || 0);
        
        // Store in localStorage to persist across refreshes
        if (typeof window !== "undefined") {
          localStorage.setItem(`testAttempt-${test.id}`, JSON.stringify(mockAttempt));
        }
        
        return;
      }
      
      const response = await TestsAPI.startTestAttempt(test.id);
      
      if (response.success && response.data) {
        setTestAttempt(response.data);
        setTestStarted(true);
        setTimeRemaining(test.sections[0]?.timeLimit * 60 || 0);
      } else {
        setError("Failed to start test. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please ensure you're logged in and have an active subscription.");
      console.error(err);
    }
  };

  const saveProgress = async () => {
    if (!testAttempt || !test) return;
    
    try {
      // For fallback tests, save to localStorage
      if (test.id.startsWith('fallback-test-')) {
        // Update the local attempt with current responses
        const updatedAttempt = {
          ...testAttempt,
          responses: responses,
          currentSection: currentSection,
          lastSaved: new Date().toISOString()
        };
        
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(`testAttempt-${test.id}`, JSON.stringify(updatedAttempt));
        }
        
        console.log("Fallback test progress saved to localStorage");
        return;
      }
      
      // Format responses for API
      const formattedResponses = Object.entries(responses).map(([questionId, userAnswer]) => ({
        questionId,
        userAnswer
      }));
      
      await TestsAPI.saveTestProgress(testAttempt.id, {
        responses: formattedResponses,
        currentSection,
        timeRemaining
      });
      
      console.log("Progress saved automatically");
    } catch (err) {
      console.error("Failed to save progress:", err);
    }
  };

  const handleSectionTimeout = async () => {
    if (!test) return;
    
    // If there are more sections, move to the next one
    if (currentSection < test.sections.length - 1) {
      await completeSection();
    } else {
      // This is the last section, submit the test
      await submitTest();
    }
  };

  const completeSection = async () => {
    if (!test || !testAttempt || isCompletingSection) return;
    
    setIsCompletingSection(true);
    
    try {
      // Save progress first
      await saveProgress();
      
      if (currentSection < test.sections.length - 1) {
        // Move to next section
        setCurrentSection(prev => prev + 1);
        setCurrentQuestion(0);
        setTimeRemaining(test.sections[currentSection + 1].timeLimit * 60);
      } else {
        // Last section completed, submit test
        await submitTest();
      }
    } catch (err) {
      console.error("Error completing section:", err);
      setError("Failed to proceed to the next section.");
    } finally {
      setIsCompletingSection(false);
    }
  };

  const submitTest = async () => {
    if (!testAttempt || submitting || !test) return;
    
    try {
      setSubmitting(true);
      await saveProgress();
      
      // For fallback tests, handle results locally
      if (test.id.startsWith('fallback-test-')) {
        // Create a mock result
        const mockResult = {
          id: `local-result-${Date.now()}`,
          testId: test.id,
          status: "COMPLETED",
          score: Math.floor(Math.random() * 41) + 60, // Random score between 60-100
          maxScore: 100,
          percentageScore: Math.floor(Math.random() * 41) + 60,
          feedback: "This is a practice test with automatic scoring.",
          startedAt: testAttempt.startedAt,
          completedAt: new Date().toISOString(),
          test: {
            title: test.title,
            description: test.description,
            moduleType: test.moduleType,
            difficulty: test.difficulty
          }
        };
        
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(`testResult-${testAttempt.id}`, JSON.stringify(mockResult));
        }
        
        // Reset states
        setTestStarted(false);
        
        // Redirect to results page
        router.push(`/practice/results/${testAttempt.id}`);
        return;
      }
      
      const response = await TestsAPI.submitTest(testAttempt.id);
      
      if (response.success) {
        // Reset states
        setTestStarted(false);
        // Redirect to results page
        router.push(`/practice/results/${testAttempt.id}`);
      } else {
        setError("Failed to submit test. Please try again.");
        setSubmitting(false);
      }
    } catch (err) {
      setError("An error occurred while submitting your test.");
      console.error(err);
      setSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (!test) return;
    
    const currentSectionQuestions = test.sections[currentSection].questions;
    
    if (currentQuestion < currentSectionQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const renderQuestionContent = (question: Question) => {
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return renderMultipleChoice(question);
      case 'TRUE_FALSE':
        return renderTrueFalse(question);
      case 'SHORT_ANSWER':
        return renderShortAnswer(question);
      case 'ESSAY':
        return renderEssay(question);
      case 'FILL_BLANK':
        return renderFillBlank(question);
      case 'AUDIO':
        return renderAudioQuestion(question);
      default:
        return (
          <div className="p-4 border rounded-md bg-gray-50">
            <p>Question type not supported in preview: {question.questionType}</p>
          </div>
        );
    }
  };

  const renderMultipleChoice = (question: Question) => {
    const options = question.options ? JSON.parse(question.options) : [];
    
    return (
      <div className="space-y-4">
        {question.passage && (
          <div className="p-4 bg-blue-50 rounded-md mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Reading Passage</h4>
            <p className="text-sm whitespace-pre-line">{question.passage}</p>
          </div>
        )}
        
        {question.questionImage && (
          <div className="mb-4">
            <img 
              src={question.questionImage} 
              alt="Question visual" 
              className="max-w-full h-auto rounded-md border"
            />
          </div>
        )}
        
        <div className="font-medium mb-4">{question.questionText}</div>
        
        <div className="space-y-2">
          {options.map((option: string, index: number) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`option-${index}`}
                name={`question-${question.id}`}
                value={option}
                checked={responses[question.id] === option}
                onChange={() => handleAnswerChange(question.id, option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor={`option-${index}`} className="ml-3 text-sm text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTrueFalse = (question: Question) => {
    return (
      <div className="space-y-4">
        {question.passage && (
          <div className="p-4 bg-blue-50 rounded-md mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Reading Passage</h4>
            <p className="text-sm whitespace-pre-line">{question.passage}</p>
          </div>
        )}
        
        <div className="font-medium mb-4">{question.questionText}</div>
        
        <div className="space-y-2">
          {['true', 'false'].map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`option-${option}`}
                name={`question-${question.id}`}
                value={option}
                checked={responses[question.id] === option}
                onChange={() => handleAnswerChange(question.id, option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor={`option-${option}`} className="ml-3 text-sm text-gray-700">
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderShortAnswer = (question: Question) => {
    return (
      <div className="space-y-4">
        {question.audioFile && (
          <div className="mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Audio</h4>
            <AudioPlayer 
              src={question.audioFile} 
              title="Listen to the audio and answer the question below"
            />
          </div>
        )}
        
        <div className="font-medium mb-4">{question.questionText}</div>
        
        <div>
          <input
            type="text"
            value={responses[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your answer"
          />
        </div>
      </div>
    );
  };

  const renderEssay = (question: Question) => {
    return (
      <div className="space-y-4">
        <div className="font-medium mb-4">{question.questionText}</div>
        
        <div>
          <textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={10}
            placeholder="Your response"
          />
        </div>
      </div>
    );
  };

  const renderFillBlank = (question: Question) => {
    return (
      <div className="space-y-4">
        <div className="font-medium mb-4">{question.questionText}</div>
        
        <div>
          <input
            type="text"
            value={responses[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Fill in the blank"
          />
        </div>
      </div>
    );
  };

  const renderAudioQuestion = (question: Question) => {
    return (
      <div className="space-y-4">
        {question.audioFile && (
          <div className="mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Audio</h4>
            <AudioPlayer 
              src={question.audioFile} 
              title="Listen to the audio and answer the question below"
            />
          </div>
        )}
        
        <div className="font-medium mb-4">{question.questionText}</div>
        
        <div className="space-y-3">
          {JSON.parse(question.options || '[]').map((option) => (
            <div key={option} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={`question-${question.id}-${option}`}
                  name={`question-${question.id}`}
                  type="radio"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  checked={responses[question.id] === option}
                  onChange={() => handleAnswerChange(question.id, option)}
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
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading test...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Error Loading Test</h2>
            <p className="mt-2 text-gray-600">{error || "The test could not be loaded."}</p>
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

  // Test not started yet - show info page
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
              <h1 className="text-2xl font-bold text-white">{test.title}</h1>
              <p className="mt-1 text-sm text-blue-100">
                {test.moduleType.replace('_', ' ')} Module • {test.difficulty.toLowerCase()} difficulty
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium text-gray-900">About this test</h3>
                <p className="text-gray-600 mt-2">{test.description}</p>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Duration: {test.totalTime} minutes</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Questions: {test.totalQuestions}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mt-8">Test sections</h3>
                <ul className="mt-3 space-y-4">
                  {test.sections.map((section, index) => (
                    <li key={section.id} className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">{index + 1}</span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium text-gray-900">{section.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {section.timeLimit} minutes • {section.questions.length} questions
                          </p>
                          {section.instructions && (
                            <p className="text-sm text-gray-600 mt-2 italic">{section.instructions}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Important information</h3>
                  <ul className="mt-3 list-disc pl-5 text-gray-600 space-y-2">
                    <li>Each section has its own time limit. Once a section is completed, you cannot return to it.</li>
                    <li>Your responses are automatically saved as you progress through the test.</li>
                    <li>For writing and speaking tasks, your responses will be evaluated by our system.</li>
                    <li>Results will be available immediately after completing the test.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link
                  href="/practice"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Tests
                </Link>
                
                <button
                  onClick={startTest}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Test in progress
  if (!test.sections[currentSection]?.questions[currentQuestion]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading question...</p>
        </div>
      </div>
    );
  }

  const currentSectionData = test.sections[currentSection];
  const currentQuestionData = currentSectionData.questions[currentQuestion];
  const isLastQuestion = currentQuestion === currentSectionData.questions.length - 1;
  const isLastSection = currentSection === test.sections.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with test info and timer */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{test.title}</h2>
          <p className="text-sm text-gray-500">Section: {currentSectionData.title}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Question</p>
            <p className="font-medium">{currentQuestion + 1} / {currentSectionData.questions.length}</p>
          </div>
          
          <div className="text-center bg-blue-50 px-3 py-1 rounded">
            <p className="text-xs text-gray-500">Time Remaining</p>
            <p className={`font-medium ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-800'}`}>
              {formatTime(timeRemaining)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        {/* Question content */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {renderQuestionContent(currentQuestionData)}
        </div>
        
        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Previous
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={completeSection}
              disabled={isCompletingSection}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLastSection ? 'Submit Test' : 'Next Section'}
              {isCompletingSection && (
                <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          )}
        </div>
        
        {/* Question navigation bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Questions</h3>
            <span className="text-xs text-gray-500">Click to navigate</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {currentSectionData.questions.map((_, index) => {
              const isAnswered = !!responses[currentSectionData.questions[index].id];
              const isCurrent = index === currentQuestion;
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isAnswered
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 