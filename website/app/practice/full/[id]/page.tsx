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
  summaryWords?: string[];
  fillBlankSentence: string;
  features: any[];
  statements: any[];
  reuseAllowed: any;
  id: string;
  questionText?: string;  // From backend
  text?: string;          // From admin panel  
  questionType?: string;  // From backend
  type?: string;          // From admin panel
  options?: any;
  questionImage?: string;
  audioFile?: string;
  passage?: string;
  paragraphs?: string[];
  sentences?: string[] | string;
  matchingPairs?: Record<string, string>;
  mapLabels?: string[];
  cueCard?: string;
  speakingPrompts?: string[];
  followUpQuestions?: string[];
  order?: number;

  headings?: string[];
  correctHeadings?: string[];
  fillBlankAnswers?: string[];
  sentenceBeginnings?: string[];
  sentenceEndings?: string[];
  correctEndings?: string[];
  diagramImage?: string;
  diagramLabels?: string[];
  diagramAnswers?: string[];
  wordLimit?: string;
}

interface Section {
  passage: any;
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
        const idStr = Array.isArray(params.id) ? params.id[0] : params.id as string;
        if (idStr.startsWith('fallback-test-')) {
          console.log("Loading fallback test:", idStr);
          const fallbackTest = createFallbackTest(idStr);
          setTest(fallbackTest);
          setTimeRemaining(fallbackTest.sections[0]?.timeLimit * 60 || 0);
          setLoading(false);
          return;
        }

        const response = await TestsAPI.getTestById(params.id as string);

        if (response.success && response.data) {
          console.log("Test data loaded:", response.data);

          // Check if sections and questions are properly loaded
          if (response.data.sections) {
            response.data.sections.forEach((section, sIndex) => {
              console.log(`Section ${sIndex + 1} (${section.id}): ${section.questions?.length || 0} questions`);

              if (section.questions && section.questions.length > 0) {
                // Log the first question as a sample
                console.log(`Sample question from section ${sIndex + 1}:`, section.questions[0]);
              } else {
                console.warn(`Section ${sIndex + 1} has no questions!`);
              }
            });
          } else {
            console.warn("Test has no sections!");
          }

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
          questions: [],
          passage: undefined
        }
      ]
    };

    // Customize based on test number
    switch (testNumber) {
      case 1: // Reading
        test.title = "IELTS Reading Practice Test";
        test.moduleType = "READING";
        test.sections[0].questions = [
          {
            id: `${id}-q1`,
            questionText: "According to the passage, what is the main cause of climate change?",
            questionType: "MULTIPLE_CHOICE",
            options: JSON.stringify(['İnsan faaliyeti', 'Doğal döngüler', 'Güneş radyasyonu', 'Volkanik patlamalar']),
            order: 1,
            passage: "İklim değişikliği, gezegenimizin karşı karşıya olduğu en acil sorunlardan biridir. Bilimsel görüş birliği, insan faaliyetlerinin, özellikle fosil yakıtların yakılması ve ormansızlaşmanın, iklim değişikliğinin başlıca nedenleri olduğu yönündedir. Bu faaliyetler, atmosfere sera gazları salarak ısının hapsolmasına ve küresel ısınmaya yol açar.",
            features: [],
            statements: [],
            reuseAllowed: undefined,
            summaryWords: ["okay", "yeah"],
            fillBlankSentence: ''
          },
          {
            id: `${id}-q2`,
            questionText: "Parçada, ormansızlaşmanın iklim değişikliğine katkıda bulunduğu öne sürülmektedir.",
            questionType: "TRUE_FALSE",
            order: 2,
            features: [],
            statements: [],
            reuseAllowed: undefined,
            summaryWords: ["okay", "yeah"],
            fillBlankSentence: ''
          },
          {
            id: `${id}-q3`,
            questionText: "Cümleyi tamamlayınız: Atmosferdeki sera gazları _________.",
            questionType: "FILL_BLANK",
            order: 3,
            features: [],
            statements: [],
            reuseAllowed: undefined,
            summaryWords: ["okay", "yeah"],
            fillBlankSentence: ''
          },
          {
            id: `${id}-q4`,
            questionText: "Parçada bahsedilen iklim değişikliğinin iki ana nedeni nedir?",
            questionType: "SHORT_ANSWER",
            order: 4,
            features: [],
            statements: [],
            reuseAllowed: undefined,
            summaryWords: ["okay", "yeah"],
            fillBlankSentence: ''
          },
          {
            id: `${id}-q5`,
            questionText: "Parçaya göre insan faaliyetlerinin iklim değişikliğine nasıl katkıda bulunduğunu açıklayınız.",
            questionType: "ESSAY",
            order: 5,
            features: [],
            statements: [],
            reuseAllowed: undefined,
            summaryWords: ["okay", "yeah"],
            fillBlankSentence: ''
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
            audioFile: "https://www.cambridgeenglish.org/Images/153113-listening-sample-part-1.mp3",
            features: [],
            statements: [],
            reuseAllowed: undefined,
            fillBlankSentence: ''
          },
          {
            id: `${id}-q2`,
            questionText: "The speakers agree to meet at 5 PM.",
            questionType: "TRUE_FALSE",
            order: 2,
            audioFile: "https://www.cambridgeenglish.org/Images/153114-listening-sample-part-2.mp3",
            features: [],
            statements: [],
            reuseAllowed: undefined,
            fillBlankSentence: ''
          },
          {
            id: `${id}-q3`,
            questionText: "What time did the speakers agree to meet?",
            questionType: "SHORT_ANSWER",
            order: 3,
            audioFile: "https://www.cambridgeenglish.org/Images/153115-listening-sample-part-3.mp3",
            features: [],
            statements: [],
            reuseAllowed: undefined,
            fillBlankSentence: ''
          }
        ];
        break;

      case 3: // Writing
        test.title = "IELTS Writing Practice Test";
        test.moduleType = "WRITING";
        test.difficulty = "HARD";
        test.totalTime = 60;
        test.totalQuestions = 2;
        test.sections[0].title = "Task 1 & 2";
        test.sections[0].instructions = "Complete both writing tasks";
        test.sections[0].timeLimit = 60;
        test.sections[0].questions = [
          {
            id: `${id}-q1`,
            questionText: "The graph below shows the population of India and China since the year 2000 and projected to 2050. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
            questionType: "ESSAY",
            order: 1,
            questionImage: "https://miro.medium.com/max/1400/1*3whP7XYRrVDDwY7ddqogTw.png",
            features: [],
            statements: [],
            reuseAllowed: undefined,
            fillBlankSentence: ''
          },
          {
            id: `${id}-q2`,
            questionText: "Some people believe that technological innovations have made our lives more complicated rather than simpler. To what extent do you agree or disagree?",
            questionType: "ESSAY",
            order: 2,
            features: [],
            statements: [],
            reuseAllowed: undefined,
            fillBlankSentence: ''
          }
        ];
        break;

      case 4: // Speaking
        test.title = "IELTS Speaking Practice Test";
        test.moduleType = "SPEAKING";
        test.difficulty = "MEDIUM";
        test.totalTime = 15;
        test.totalQuestions = 3;
        test.sections[0].title = "Speaking Tasks";
        test.sections[0].instructions = "Answer the following speaking questions";
        test.sections[0].timeLimit = 15;
        test.sections[0].questions = [
          {
            id: `${id}-q1`,
            questionText: "Let's talk about your hometown. Where is it and what is it known for?",
            questionType: "SPEAKING_TASK_1",
            order: 1,
            features: [],
            statements: [],
            reuseAllowed: undefined,
            fillBlankSentence: ''
          },
          {
            id: `${id}-q2`,
            questionText: "Describe a time when you helped someone. You should say: who you helped, how you helped them, why they needed help, and how you felt about helping them.",
            questionType: "SPEAKING_TASK_2",
            order: 2,
            cueCard: "Describe a time when you helped someone",
            features: [],
            statements: [],
            reuseAllowed: undefined,
            fillBlankSentence: ''
          },
          {
            id: `${id}-q3`,
            questionText: "Do you think people today help others more or less than they did in the past?",
            questionType: "SPEAKING_TASK_3",
            order: 3,
            followUpQuestions: [
              "What are some reasons why people might hesitate to help others?",
              "Do you think technology has made it easier or harder for people to help each other?",
              "How can governments encourage people to volunteer more in their communities?"
            ],
            features: [],
            statements: [],
            reuseAllowed: undefined,
            fillBlankSentence: ''
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

  // Add the missing startTimer function
  const startTimer = () => {
    // Timer is already handled by the useEffect above
    // This function is provided for code clarity and to prevent reference errors
    console.log("Timer started automatically via React effects");
  };

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

      console.log("Attempting to start test attempt for:", test.id);

      // Start a test attempt
      const response = await TestsAPI.startTestAttempt(test.id);

      if (response.success && response.data) {
        console.log("Retrieved test data for attempt:", response.data.test);

        // Important: Check that the test attempt has sections
        if (!response.data.test?.sections || response.data.test.sections.length === 0) {
          console.error("Test attempt has no sections!");
          setError("The test data is incomplete. Please try a different test.");
          return;
        }

        // Check if each section has questions
        let hasQuestions = false;
        let validSections = [...response.data.test.sections];

        // Filter out sections with no questions and log information
        validSections = validSections.filter((section, index) => {
          if (section.questions && section.questions.length > 0) {
            hasQuestions = true;
            console.log(`Section ${index + 1} has ${section.questions.length} questions`);
            return true;
          } else {
            console.warn(`Section ${index + 1} has no questions! Removing from test.`);
            return false;
          }
        });

        // Replace the sections with only valid ones
        response.data.test.sections = validSections;

        if (!hasQuestions) {
          console.error("No questions found in any section!");
          setError("The test has no questions. Please try a different test.");
          return;
        }

        setTestAttempt({
          id: response.data.id,
          testId: test.id,
          userId: response.data.userId,
          startedAt: response.data.startedAt,
          status: response.data.status,
          currentSection: response.data.currentSection || 0,
          responses: response.data.responses || {}
        });

        // Use the test data from the attempt which should have all sections and questions
        setTest(response.data.test);

        // Initialize time remaining if available from the attempt
        const timeLimit = response.data.test.sections[0]?.timeLimit || 60;
        setTimeRemaining(response.data.timeRemaining || timeLimit * 60);

        setTestStarted(true);

        // Call the startTimer function
        startTimer();

        // Schedule first automatic progress save
        setTimeout(() => saveProgress(), 30000); // Save every 30 seconds

      } else {
        setError("Failed to start the test. Please try again.");
      }
    } catch (err) {
      console.error("Error starting test:", err);
      setError("An error occurred while starting the test. Please try again.");
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
    console.log("Rendering question:", question);

    if (!question) {
      return <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
        <p className="text-yellow-700">Question data is missing. Please try refreshing the page.</p>
      </div>;
    }

    // Check if the question has basic required properties
    const hasRequiredProps = question.questionText || question.text;
    if (!hasRequiredProps) {
      console.warn("Question is missing required properties:", question);
    }

    const questionType = question.questionType || question.type;

    // Get the current section to check for passage at section level
    const currentSectionData = test?.sections?.[currentSection];
    const sectionPassage = currentSectionData?.passage;

    // Show passage from question first, if not present then check section level
    if (question.passage || sectionPassage) {
      return (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-md border border-gray-200 shadow-sm overflow-y-auto max-h-96">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Reading Passage</h3>
            <div className="prose prose-sm prose-blue max-w-none">
              <p className="whitespace-pre-line">{question.passage || sectionPassage}</p>
            </div>
          </div>

          {questionType && renderQuestionByType(question, questionType)}
        </div>
      );
    }

    // Check for other content types (audio, image, etc.)
    if (question.audioFile) {
      return (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-md border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Listening Task</h3>
            <AudioPlayer src={question.audioFile} />
          </div>

          {questionType && renderQuestionByType(question, questionType)}
        </div>
      );
    }

    if (question.questionImage) {
      return (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-md border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Visual Material</h3>
            <img
              src={question.questionImage}
              alt="Question visual"
              className="max-w-full h-auto rounded-md"
            />
          </div>

          {questionType && renderQuestionByType(question, questionType)}
        </div>
      );
    }

    if (question.paragraphs && Array.isArray(question.paragraphs)) {
      return (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-md border border-gray-200 shadow-sm overflow-y-auto max-h-96">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Reading Paragraphs</h3>
            <div className="space-y-4">
              {question.paragraphs.map((paragraph, idx) => (
                <div key={idx} className="prose prose-sm prose-blue max-w-none">
                  <p className="whitespace-pre-line">{paragraph}</p>
                </div>
              ))}
            </div>
          </div>

          {questionType && renderQuestionByType(question, questionType)}
        </div>
      );
    }

    // Fallback to just rendering the question
    return renderQuestionByType(question, questionType);
  };

  const renderQuestionByType = (question: Question, questionType: string) => {
    console.log(`Rendering question type: ${questionType}`);

    switch (questionType) {
      case 'MULTIPLE_CHOICE':
        return renderMultipleChoice(question);
      case 'TRUE_FALSE':
      case 'YES_NO_NOT_GIVEN':
        return renderTrueFalse(question);
      case 'SHORT_ANSWER':
        return renderShortAnswer(question);
      case 'ESSAY':
        return renderEssay(question);
      case 'FILL_BLANK':
        return renderFillBlank(question);
      case 'MAP_LABELING':
        return renderMapQuestion(question);
      case 'TABLE_COMPLETION':
        return renderTableCompletion(question);
      case 'PARAGRAPH_HEADINGS':
        return renderParagraphHeadings(question);
      case 'PARA_HEADINGS':
        return renderParaHeadings(question);
      case 'SENTENCE_ENDINGS_MATCHING':
        return renderSentenceEndingsMatching(question);
      case 'DIAGRAM_LABELLING':
        return renderDiagramLabelling(question);
      case 'SUMMARY':
        return renderSummaryCompletion(question);
      case 'SENTENCE_COMPLETION':
        return renderCompleteSentence(question);
      case 'TRUE_FALSE_NOT_GIVEN':
      case 'YES_NO_NOT_GIVEN':
        return renderTrueFalseNotGiven(question);
      case 'NAME_MATCHING':
        return renderNameMatching(question);
      case 'SPEAKING_TASK':
        return renderSpeakingTask(question);
      default:
        console.warn(`Unknown question type: ${questionType}`);
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
            <p className="text-yellow-700">This question type ({questionType}) is not supported yet.</p>
          </div>
        );
    }
  };






  const renderMultipleChoice = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;

    let options;
    try {
      options = question.options ? (typeof question.options === 'string' ? JSON.parse(question.options) : question.options) : [];
    } catch (error) {
      console.error("Error parsing options:", error);
      options = [];
    }

    return (
      <div className="space-y-4">
        {question.passage && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Reading Passage</h4>
            <p className="text-gray-800 whitespace-pre-line">{question.passage}</p>
          </div>
        )}

        {question.audioFile && (
          <div className="mb-4">
            <AudioPlayer
              src={question.audioFile}
              title="Listen to complete this question"
              autoPlay={test?.moduleType === "LISTENING" && currentQuestion === 0}
            />
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

        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        <div className="space-y-2">
          {options.map((option: string, index: number) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`option-${index}-${question.id}`}
                name={`question-${question.id}`}
                value={option}
                checked={responses[question.id] === option}
                onChange={() => handleAnswerChange(question.id, option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor={`option-${index}-${question.id}`} className="ml-3 text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  function renderDiagramLabelling(question: Question) {
    // Normalize fields
    const questionText = question.questionText || question.text || "";
    let diagramLabels: string[] = [];
    let diagramAnswers: string[] = [];
    try {
      diagramLabels = question.diagramLabels
        ? (typeof question.diagramLabels === "string"
          ? JSON.parse(question.diagramLabels)
          : question.diagramLabels)
        : [];
    } catch { diagramLabels = []; }
    try {
      diagramAnswers = question.diagramAnswers
        ? (typeof question.diagramAnswers === "string"
          ? JSON.parse(question.diagramAnswers)
          : question.diagramAnswers)
        : [];
    } catch { diagramAnswers = []; }

    return (
      <div className="space-y-4">
        <div className="font-medium text-gray-900 mb-4">{questionText}</div>
        {question.diagramImage && (
          <div className="mb-4">
            <img
              src={question.diagramImage}
              alt="Diagram for labelling"
              className="max-w-full h-auto rounded-md border"
            />
          </div>
        )}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Label the Diagram</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagramLabels.map((label, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                  {label}
                </span>
                <input
                  type="text"
                  value={responses[`${question.id}-${idx}`] || ""}
                  onChange={e => handleAnswerChange(`${question.id}-${idx}`, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder={`Label for ${label}`}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }




  const renderTrueFalse = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;
    const questionType = question.questionType || question.type;

    // Different options based on the question type
    let options = ['true', 'false'];

    if (questionType === 'TRUE_FALSE_NOT_GIVEN') {
      options = ['true', 'false', 'not given'];
    } else if (questionType === 'YES_NO_NOT_GIVEN') {
      options = ['yes', 'no', 'not given'];
    }

    return (
      <div className="space-y-4">
        {question.passage && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Reading Passage</h4>
            <p className="text-gray-800 whitespace-pre-line">{question.passage}</p>
          </div>
        )}

        {question.audioFile && (
          <div className="mb-4">
            <AudioPlayer
              src={question.audioFile}
              title="Listen to complete this question"
              autoPlay={test?.moduleType === "LISTENING" && currentQuestion === 0}
            />
          </div>
        )}

        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`option-${option}-${question.id}`}
                name={`question-${question.id}`}
                value={option}
                checked={responses[question.id] === option}
                onChange={() => handleAnswerChange(question.id, option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor={`option-${option}-${question.id}`} className="ml-3 text-gray-700">
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTrueFalseNotGiven = (question: Question) => {
    const options = ['True', 'False', 'Not Given'];
    return (
      <div className="flex gap-4 mt-4">
        <div className="font-medium text-gray-900 mb-4">{question.questionText}</div>
        {options.map(opt => {
          const isSelected = responses[question.id] === opt;
          return (

            <>
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswerChange(question.id, opt)}
                className={`px-4 py-2 rounded-lg border transition-all
              ${isSelected
                    ? 'bg-blue-600 text-white border-blue-700 shadow'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'}
            `}
              >
                {opt}
              </button></>
          );
        })}
      </div>
    );
  };


  const renderSummaryCompletion = (question: Question) => {

    console.log("SUMMARY QUESTION DATA", question);
    const summaryWords: string[] = Array.isArray(question.summaryWords)
      ? question.summaryWords
      : (typeof question.summaryWords === "string" && question.summaryWords
        ? JSON.parse(question.summaryWords)
        : []);

    const paragraphs: string[] = Array.isArray(question.paragraphs)
      ? question.paragraphs
      : (typeof question.paragraphs === "string" && question.paragraphs
        ? JSON.parse(question.paragraphs)
        : []);

    const fillBlankSentence = question.fillBlankSentence || question.questionText || "";

    return (
      <div className="space-y-4">
        {/* Word Bank */}
        {summaryWords.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Word Bank</h4>
            <div className="flex flex-wrap gap-2">
              {summaryWords.map((word, idx) => (
                <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Paragraphs */}
        {paragraphs.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Paragraphs</h4>
            <div className="space-y-2">
              {paragraphs.map((p, idx) => (
                <div key={idx} className="bg-white border rounded p-2 text-gray-800">{p}</div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Sentence with blanks */}
        {fillBlankSentence && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <div className="mb-2">
              {fillBlankSentence.split("_").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <input
                      type="text"
                      value={responses[`${question.id}-summary-${i}`] || ""}
                      onChange={e => handleAnswerChange(`${question.id}-summary-${i}`, e.target.value)}
                      className="border-b-2 border-blue-400 px-2 py-1 w-28 mx-1"
                      placeholder={`Blank`}
                      autoComplete="off"
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };


  const renderSentenceEndingsMatching = (question: Question) => {
    const beginnings = question.sentenceBeginnings || [];
    const endings = question.sentenceEndings || [];
    return (
      <div>
        <h4 className="font-medium mb-2">Sentence Endings</h4>
        <ul className="mb-4">{endings.map((e, i) => <li key={i}>{String.fromCharCode(65 + i)}. {e}</li>)}</ul>
        {beginnings.map((b, i) => (
          <div key={i} className="mb-3">
            <div className="mb-1">{b} ...</div>
            <select
              value={responses[`${question.id}-${i}`] || ''}
              onChange={e => handleAnswerChange(`${question.id}-${i}`, e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Select ending</option>
              {endings.map((_, idx) => (
                <option key={idx} value={String.fromCharCode(65 + idx)}>
                  {String.fromCharCode(65 + idx)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };


const renderParaHeadings = (question: Question) => {
  const headings: string[] = Array.isArray(question.headings)
    ? question.headings
    : (typeof question.headings === "string" && question.headings
        ? JSON.parse(question.headings)
        : []);
  const paragraphs: string[] = Array.isArray(question.paragraphs)
    ? question.paragraphs
    : (typeof question.paragraphs === "string" && question.paragraphs
        ? JSON.parse(question.paragraphs)
        : []);

  return (
    <div className="space-y-6">
      {/* Headings List */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Headings</h4>
        <ul className="mb-4 flex flex-wrap gap-4">
          {headings.map((heading, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-gray-900">{heading}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Paragraphs with dropdowns */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Paragraphs</h4>
        <div className="space-y-4">
          {paragraphs.map((para, idx) => (
            <div key={idx} className="border rounded p-3 flex flex-col gap-2">
              <div className="text-gray-800 mb-2">{para}</div>
              <select
                value={responses[`${question.id}-para-${idx}`] || ""}
                onChange={e => handleAnswerChange(`${question.id}-para-${idx}`, e.target.value)}
                className="border rounded px-2 py-1 w-40"
              >
                <option value="">Select heading</option>
                {headings.map((_, hIdx) => (
                  <option key={hIdx} value={String.fromCharCode(65 + hIdx)}>
                    {String.fromCharCode(65 + hIdx)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

  const renderShortAnswer = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;

    return (
      <div className="space-y-4">
        {question.audioFile && (
          <div className="mb-4">
            <AudioPlayer
              src={question.audioFile}
              title="Listen to the audio and answer the question below"
              autoPlay={test?.moduleType === "LISTENING" && currentQuestion === 0}
            />
          </div>
        )}

        {question.passage && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Reading Passage</h4>
            <p className="text-gray-800 whitespace-pre-line">{question.passage}</p>
          </div>
        )}

        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        <div>
          <input
            type="text"
            value={responses[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your answer here..."
          />
        </div>
      </div>
    );
  };

  const renderEssay = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;

    return (
      <div className="space-y-4">
        {question.passage && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Reading Passage</h4>
            <p className="text-gray-800 whitespace-pre-line">{question.passage}</p>
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

        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        <div>
          <textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={10}
            placeholder="Type your essay here..."
          />
        </div>
      </div>
    );
  };

  const renderFillBlank = (question: Question) => {
    const questionText = question.questionText || question.text || "";
    // Count blanks
    const blanks = (questionText.match(/_/g) || []).length;

    return (
      <div className="space-y-6">
        <div className="p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl shadow-inner">
          <div className="text-base font-semibold text-blue-800 mb-2">Fill in the blank</div>
          <div className="text-lg text-gray-900 mb-4">
            {questionText.split("_").map((part, idx, arr) => (
              <span key={idx}>
                {part}
                {idx < arr.length - 1 && (
                  <input
                    type="text"
                    value={responses[`${question.id}-${idx}`] || ""}
                    onChange={e => handleAnswerChange(`${question.id}-${idx}`, e.target.value)}
                    className="inline-block w-32 mx-2 px-2 py-1 border-b-2 border-blue-400 bg-transparent text-blue-900 font-medium focus:outline-none focus:border-blue-600 transition"
                    placeholder={`Blank ${idx + 1}`}
                    autoComplete="off"
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMapQuestion = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;

    let mapLabels;
    try {
      mapLabels = question.mapLabels ? (typeof question.mapLabels === 'string' ? JSON.parse(question.mapLabels) : question.mapLabels) : [];
    } catch (error) {
      console.error("Error parsing map labels:", error);
      mapLabels = [];
    }

    return (
      <div className="space-y-4">
        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        {question.questionImage && (
          <div className="mb-4 relative">
            <img
              src={question.questionImage}
              alt="Map for labelling"
              className="max-w-full h-auto rounded-md border"
            />
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Label the Map</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mapLabels.map((label: string, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={responses[`${question.id}-${index}`] || ''}
                  onChange={(e) => handleAnswerChange(`${question.id}-${index}`, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder={`Label for ${label}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTableCompletion = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;

    return (
      <div className="space-y-4">
        {question.passage && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Reading Passage</h4>
            <p className="text-gray-800 whitespace-pre-line">{question.passage}</p>
          </div>
        )}

        {question.audioFile && (
          <div className="mb-4">
            <AudioPlayer
              src={question.audioFile}
              title="Listen to complete this question"
              autoPlay={test?.moduleType === "LISTENING" && currentQuestion === 0}
            />
          </div>
        )}

        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Column 1</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column 2</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map(rowIndex => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-r">
                    Row {rowIndex}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="text"
                      value={responses[`${question.id}-${rowIndex}`] || ''}
                      onChange={(e) => handleAnswerChange(`${question.id}-${rowIndex}`, e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Fill in this cell"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderParagraphHeadings = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;

    let paragraphs;
    try {
      paragraphs = question.paragraphs ? (typeof question.paragraphs === 'string' ? JSON.parse(question.paragraphs) : question.paragraphs) : [];
    } catch (error) {
      console.error("Error parsing paragraphs:", error);
      paragraphs = [];
    }

    let options;
    try {
      options = question.options ? (typeof question.options === 'string' ? JSON.parse(question.options) : question.options) : [];
    } catch (error) {
      console.error("Error parsing options:", error);
      options = [];
    }

    return (
      <div className="space-y-4">
        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Headings</h4>
            <div className="space-y-2 bg-gray-50 p-4 rounded-md">
              {options.map((heading: string, index: number) => (
                <div key={index} className="flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-800">{heading}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Paragraphs</h4>
            <div className="space-y-4">
              {paragraphs.map((paragraph: string, index: number) => (
                <div key={index} className="border p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Paragraph {String.fromCharCode(65 + index)}</span>
                    <select
                      value={responses[`${question.id}-${index}`] || ''}
                      onChange={(e) => handleAnswerChange(`${question.id}-${index}`, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select heading</option>
                      {options.map((_, optIndex) => (
                        <option key={optIndex} value={optIndex + 1}>{optIndex + 1}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-gray-800">{paragraph}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCompleteSentence = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;

    let sentences;
    try {
      if (question.sentences) {
        if (typeof question.sentences === 'string') {
          sentences = question.sentences.split('\n');
          // If there's no newline, try to parse it as JSON array
          if (sentences.length === 1) {
            try {
              const parsed = JSON.parse(question.sentences);
              if (Array.isArray(parsed)) {
                sentences = parsed;
              }
            } catch (e) {
              // Keep as is if parsing fails
            }
          }
        } else if (Array.isArray(question.sentences)) {
          sentences = question.sentences;
        }
      } else {
        sentences = [];
      }
    } catch (error) {
      console.error("Error processing sentences:", error);
      sentences = [];
    }

    return (
      <div className="space-y-4">
        {question.passage && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Reading Passage</h4>
            <p className="text-gray-800 whitespace-pre-line">{question.passage}</p>
          </div>
        )}

        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        <div className="space-y-4">
          {sentences && sentences.map((sentence: string, index: number) => (
            <div key={index} className="border p-3 rounded-md">
              <p className="text-gray-800 mb-2">{sentence.replace(/___+/g, '___________')}</p>
              <input
                type="text"
                value={responses[`${question.id}-${index}`] || ''}
                onChange={(e) => handleAnswerChange(`${question.id}-${index}`, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Complete the sentence"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNameMatching = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;

    let matchingPairs;
    try {
      matchingPairs = question.matchingPairs ? (typeof question.matchingPairs === 'string' ? JSON.parse(question.matchingPairs) : question.matchingPairs) : {};
    } catch (error) {
      console.error("Error parsing matching pairs:", error);
      matchingPairs = {};
    }

    const names = Object.keys(matchingPairs);
    const statements = Object.values(matchingPairs);

    return (
      <div className="space-y-4">
        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Names</h4>
            <div className="space-y-2 bg-gray-50 p-4 rounded-md">
              {names.map((name, index) => (
                <div key={index} className="flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-800">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Statements</h4>
            <div className="space-y-4">
              {statements.map((statement, index) => (
                <div key={index} className="border p-3 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">Statement {String.fromCharCode(65 + index)}</span>
                    <select
                      value={responses[`${question.id}-${index}`] || ''}
                      onChange={(e) => handleAnswerChange(`${question.id}-${index}`, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Match with name</option>
                      {names.map((_, nameIndex) => (
                        <option key={nameIndex} value={nameIndex + 1}>{nameIndex + 1}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-gray-800">{String(statement)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSpeakingTask = (question: Question) => {
    // Get normalized field values
    const questionText = question.questionText || question.text;
    const questionType = question.questionType || question.type;

    let followUpQuestions;
    try {
      followUpQuestions = question.followUpQuestions ?
        (typeof question.followUpQuestions === 'string' ? JSON.parse(question.followUpQuestions) : question.followUpQuestions) :
        [];
    } catch (error) {
      console.error("Error parsing follow-up questions:", error);
      followUpQuestions = [];
    }

    return (
      <div className="space-y-4">
        <div className="font-medium text-gray-900 mb-4">{questionText}</div>

        {question.cueCard && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">Cue Card</h4>
            <p className="text-yellow-900">{question.cueCard}</p>
          </div>
        )}

        {followUpQuestions && followUpQuestions.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
            <h4 className="font-medium text-blue-800 mb-2">Follow-Up Questions</h4>
            <ul className="list-disc pl-5 space-y-2">
              {followUpQuestions.map((q, index) => (
                <li key={index} className="text-blue-900">{q}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 border border-gray-200 rounded-md">
          <h4 className="font-medium text-gray-900 mb-3">Record Your Answer</h4>
          <div className="flex justify-center items-center h-24 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <button className="px-4 py-2 bg-red-600 text-white rounded-full flex items-center hover:bg-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Record Answer
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">Click to start recording your response</p>
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
      {/* Main content: Passage left, Questions right */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Passage on the left */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl shadow-lg p-6 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m0-5V3m-8 4h8" />
                </svg>
                <h2 className="text-lg font-bold text-blue-700 tracking-wide">Reading Passage</h2>
              </div>
              <div className="flex-1 overflow-y-auto prose prose-blue prose-sm max-w-none bg-white rounded-lg p-4 border border-blue-100 shadow-inner">
                {
                  currentSectionData.questions.find(q => q.passage)?.passage
                  || currentSectionData.passage
                  || <span className="text-gray-400">No passage for this section.</span>
                }
              </div>
            </div>
          </div>
          {/* Questions on the right */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <h2 className="text-lg font-semibold mb-4">Questions</h2>
            {currentSectionData.questions.map((question, idx) => (
              <div key={question.id} className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <div className="font-medium mb-2">Q{idx + 1}. {question.questionText || question.text}</div>
                {renderQuestionByType(question, question.questionType || question.type)}
              </div>
            ))}
            {/* Navigation/Submit at the bottom */}
            <div className="mt-8 flex justify-end gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}
