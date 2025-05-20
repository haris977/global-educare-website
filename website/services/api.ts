// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Generic fetch function with error handling
async function fetchData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  // Get token from localStorage if available (client-side only)
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication API calls
export const AuthAPI = {
  login: async (email: string, password: string) => {
    return fetchData<{success: boolean; message: string; data: {token: string; user: any}}>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (userData: {name: string; email: string; password: string; phone?: string}) => {
    return fetchData<{success: boolean; message: string; data: any}>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  startTrial: async () => {
    return fetchData<{success: boolean; message: string; data: any}>('/users/trial', {
      method: 'POST',
    });
  },
  
  subscribe: async (subscriptionPlan: string) => {
    return fetchData<{success: boolean; message: string; data: any}>('/users/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscriptionPlan }),
    });
  },
  
  requestRefund: async () => {
    return fetchData<{success: boolean; message: string; data: any}>('/users/refund', {
      method: 'POST',
    });
  },
  
  getProfile: async () => {
    return fetchData<{success: boolean; message: string; data: any}>('/users/profile', {
      method: 'GET',
    });
  },
};

// Fallback test data for offline/error scenarios
const fallbackTests = [
  {
    id: "fallback-test-1",
    title: "IELTS Reading Practice Test",
    description: "A comprehensive reading test with various question types",
    moduleType: "READING",
    difficulty: "MEDIUM",
    totalTime: 60,
    totalQuestions: 5,
    clbScore: 7,
    isPublished: true,
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: "fallback-section-1",
        title: "Reading Comprehension",
        instructions: "Read the passage and answer the questions",
        timeLimit: 60,
        order: 1,
        questions: []
      }
    ]
  },
  {
    id: "fallback-test-2",
    title: "IELTS Listening Practice Test",
    description: "A practice test for the IELTS listening module",
    moduleType: "LISTENING",
    difficulty: "EASY",
    totalTime: 30,
    totalQuestions: 3,
    clbScore: 6,
    isPublished: true,
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: "fallback-section-2",
        title: "Listening Comprehension",
        instructions: "Listen to the audio and answer the questions",
        timeLimit: 30,
        order: 1,
        questions: []
      }
    ]
  },
  {
    id: "fallback-test-3",
    title: "IELTS Writing Practice Test",
    description: "A practice test for the IELTS writing module",
    moduleType: "WRITING",
    difficulty: "HARD",
    totalTime: 60,
    totalQuestions: 2,
    clbScore: 8,
    isPublished: true,
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: "fallback-section-3",
        title: "Task 1 & 2",
        instructions: "Complete both writing tasks",
        timeLimit: 60,
        order: 1,
        questions: []
      }
    ]
  },
  {
    id: "fallback-test-4",
    title: "IELTS Speaking Practice Test",
    description: "A practice test for the IELTS speaking module",
    moduleType: "SPEAKING",
    difficulty: "MEDIUM",
    totalTime: 15,
    totalQuestions: 3,
    clbScore: 7,
    isPublished: true,
    createdAt: new Date().toISOString(),
    sections: [
      {
        id: "fallback-section-4",
        title: "Speaking Tasks",
        instructions: "Answer the following speaking questions",
        timeLimit: 15,
        order: 1,
        questions: []
      }
    ]
  }
];

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

// Tests API
export const TestsAPI = {
  // Get all available tests
  getAllTests: async (filters?: {
    moduleType?: string;
    difficulty?: string;
    isPublished?: boolean;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.moduleType) queryParams.append('moduleType', filters.moduleType);
      if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters?.isPublished !== undefined) queryParams.append('isPublished', String(filters.isPublished));
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const result = await fetchData<{success: boolean; message: string; data: any[]}>(`/tests${queryString}`);
      return result;
    } catch (error) {
      console.error("Failed to fetch tests, using fallbacks:", error);
      
      // Filter fallback tests to match the requested filters
      let filteredTests = [...fallbackTests];
      
      if (filters?.moduleType) {
        filteredTests = filteredTests.filter(test => 
          test.moduleType.toUpperCase() === filters.moduleType?.toUpperCase()
        );
      }
      
      if (filters?.difficulty) {
        filteredTests = filteredTests.filter(test => 
          test.difficulty.toUpperCase() === filters.difficulty?.toUpperCase()
        );
      }
      
      if (filters?.isPublished !== undefined) {
        filteredTests = filteredTests.filter(test => 
          test.isPublished === filters.isPublished
        );
      }
      
      // Return fallback data in the same format as API would
      return {
        success: true,
        message: "Using offline test data",
        data: filteredTests
      };
    }
  },
  
  // Get a specific test by ID
  getTestById: async (testId: string) => {
    try {
      return await fetchData<{success: boolean; message: string; data: any}>(`/tests/${testId}`);
    } catch (error) {
      console.error(`Failed to fetch test ${testId}, checking for fallback:`, error);
      
      // For fallback tests, we need to add the questions
      if (testId.startsWith('fallback-test-')) {
        const testNumber = Number(testId.split('-').pop());
        const fallbackTest = fallbackTests[testNumber - 1];
        
        if (fallbackTest) {
          // Dynamically generate content based on the test type
          switch(fallbackTest.moduleType) {
            case "READING":
              fallbackTest.sections[0].questions = [
                {
                  id: `${testId}-q1`,
                  questionText: "According to the passage, what is the main cause of climate change?",
                  questionType: "MULTIPLE_CHOICE",
                  options: JSON.stringify(['Human activity', 'Natural cycles', 'Solar radiation', 'Volcanic eruptions']),
                  order: 1,
                  passage: "Climate change is one of the most pressing issues facing our planet today. The scientific consensus is that human activities, particularly the burning of fossil fuels and deforestation, are the primary drivers of climate change. These activities release greenhouse gases into the atmosphere, which trap heat and lead to global warming."
                },
                {
                  id: `${testId}-q2`,
                  questionText: "The passage suggests that deforestation contributes to climate change.",
                  questionType: "TRUE_FALSE",
                  order: 2
                },
                {
                  id: `${testId}-q3`,
                  questionText: "Complete the sentence: Greenhouse gases in the atmosphere _________.",
                  questionType: "FILL_BLANK",
                  order: 3
                },
                {
                  id: `${testId}-q4`,
                  questionText: "What are two major contributors to climate change mentioned in the passage?",
                  questionType: "SHORT_ANSWER",
                  order: 4
                },
                {
                  id: `${testId}-q5`,
                  questionText: "Explain how human activities contribute to climate change based on the passage.",
                  questionType: "ESSAY",
                  order: 5
                }
              ];
              break;
              
            case "LISTENING":
              fallbackTest.sections[0].questions = [
                {
                  id: `${testId}-q1`,
                  questionText: "What is the main topic of the conversation?",
                  questionType: "MULTIPLE_CHOICE",
                  options: JSON.stringify(['Travel plans', 'University courses', 'Housing options', 'Job opportunities']),
                  order: 1,
                  audioFile: "https://www.cambridgeenglish.org/Images/153113-listening-sample-part-1.mp3"
                },
                {
                  id: `${testId}-q2`,
                  questionText: "The speakers agree to meet at 5 PM.",
                  questionType: "TRUE_FALSE",
                  order: 2,
                  audioFile: "https://www.cambridgeenglish.org/Images/153114-listening-sample-part-2.mp3"
                },
                {
                  id: `${testId}-q3`,
                  questionText: "What time did the speakers agree to meet?",
                  questionType: "SHORT_ANSWER",
                  order: 3,
                  audioFile: "https://www.cambridgeenglish.org/Images/153115-listening-sample-part-3.mp3"
                }
              ];
              break;
              
            case "WRITING":
              fallbackTest.sections[0].questions = [
                {
                  id: `${testId}-q1`,
                  questionText: "The graph below shows the population of India and China since the year 2000 and projected to 2050. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
                  questionType: "ESSAY",
                  order: 1,
                  questionImage: "https://miro.medium.com/max/1400/1*3whP7XYRrVDDwY7ddqogTw.png"
                },
                {
                  id: `${testId}-q2`,
                  questionText: "Some people believe that technological innovations have made our lives more complicated rather than simpler. To what extent do you agree or disagree?",
                  questionType: "ESSAY",
                  order: 2
                }
              ];
              break;
              
            case "SPEAKING":
              fallbackTest.sections[0].questions = [
                {
                  id: `${testId}-q1`,
                  questionText: "Let's talk about your hometown. Where is it and what is it known for?",
                  questionType: "SPEAKING_TASK_1",
                  order: 1
                },
                {
                  id: `${testId}-q2`,
                  questionText: "Describe a time when you helped someone. You should say: who you helped, how you helped them, why they needed help, and how you felt about helping them.",
                  questionType: "SPEAKING_TASK_2",
                  order: 2,
                  cueCard: "Describe a time when you helped someone"
                },
                {
                  id: `${testId}-q3`,
                  questionText: "Do you think people today help others more or less than they did in the past?",
                  questionType: "SPEAKING_TASK_3",
                  order: 3,
                  followUpQuestions: JSON.stringify([
                    "What are some reasons why people might hesitate to help others?",
                    "Do you think technology has made it easier or harder for people to help each other?",
                    "How can governments encourage people to volunteer more in their communities?"
                  ])
                }
              ];
              break;
          }
          
          return {
            success: true,
            message: "Using offline test data",
            data: fallbackTest
          };
        }
      }
      
      // If we didn't find a matching fallback test
      return {
        success: false,
        message: "Test not found and no fallback available",
        data: null
      };
    }
  },
  
  // Start a test attempt
  startTestAttempt: async (testId: string) => {
    try {
      return await fetchData<{success: boolean; message: string; data: any}>(`/tests/${testId}/attempts`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Failed to start test attempt for ${testId}:`, error);
      
      // Generate a fake test attempt for offline use
      if (testId.startsWith('fallback-test-')) {
        return {
          success: true,
          message: "Test attempt started (offline mode)",
          data: {
            id: `offline-attempt-${Date.now()}`,
            testId,
            userId: "offline-user",
            startedAt: new Date().toISOString(),
            status: 'IN_PROGRESS',
            currentSection: 0,
            responses: {},
            timeRemaining: 3600 // 60 minutes in seconds
          }
        };
      }
      
      throw error;
    }
  },
  
  // Get a specific test attempt
  getTestAttempt: async (attemptId: string) => {
    try {
      return await fetchData<{success: boolean; message: string; data: any}>(`/tests/attempts/${attemptId}`);
    } catch (error) {
      // For offline attempts, construct a response
      if (attemptId.startsWith('offline-attempt-')) {
        // Try to get from localStorage
        if (typeof window !== 'undefined') {
          const savedAttempt = localStorage.getItem(`test-attempt-${attemptId}`);
          if (savedAttempt) {
            return {
              success: true,
              message: "Retrieved offline attempt",
              data: JSON.parse(savedAttempt)
            };
          }
        }
      }
      
      throw error;
    }
  },
  
  // Save test progress (autosave)
  saveTestProgress: async (attemptId: string, data: {
    responses: Array<{
      questionId: string;
      userAnswer?: string;
      audioRecording?: string;
    }>;
    currentSection: number;
    timeRemaining: number;
  }) => {
    try {
      return await fetchData<{success: boolean; message: string; data: any}>(`/tests/attempts/${attemptId}/save`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.warn("Failed to save test progress to server, saving locally:", error);
      
      // For offline attempts, save to localStorage
      if (attemptId.startsWith('offline-attempt-') && typeof window !== 'undefined') {
        const attemptData = {
          id: attemptId,
          ...data,
          lastSavedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`test-attempt-${attemptId}`, JSON.stringify(attemptData));
        
        return {
          success: true,
          message: "Saved offline progress",
          data: attemptData
        };
      }
      
      throw error;
    }
  },
  
  // Submit a test for scoring
  submitTest: async (attemptId: string) => {
    try {
      return await fetchData<{success: boolean; message: string; data: any}>(`/tests/attempts/${attemptId}/submit`, {
        method: 'POST',
      });
    } catch (error) {
      console.warn("Failed to submit test to server:", error);
      
      // For offline attempts, simulate completion
      if (attemptId.startsWith('offline-attempt-') && typeof window !== 'undefined') {
        const savedAttempt = localStorage.getItem(`test-attempt-${attemptId}`);
        if (savedAttempt) {
          const attemptData = JSON.parse(savedAttempt);
          attemptData.status = 'COMPLETED';
          attemptData.completedAt = new Date().toISOString();
          
          // Calculate a score between 70-99%
          const percentageScore = Math.floor(Math.random() * 30) + 70;
          attemptData.percentageScore = percentageScore;
          attemptData.totalScore = Math.floor((percentageScore / 100) * 40);
          attemptData.maxScore = 40;
          
          // Add IELTS band score
          attemptData.bandScore = calculateIeltsBand(percentageScore);
          
          localStorage.setItem(`test-attempt-${attemptId}`, JSON.stringify(attemptData));
          
          return {
            success: true,
            message: "Test submitted (offline mode)",
            data: attemptData
          };
        }
      }
      
      throw error;
    }
  },
  
  // Get test result details
  getTestResult: async (attemptId: string) => {
    try {
      return await fetchData<{success: boolean; message: string; data: any}>(`/tests/attempts/${attemptId}/result`);
    } catch (error) {
      console.warn("Failed to get test results from server:", error);
      
      // For offline attempts, use stored data
      if (attemptId.startsWith('offline-attempt-') && typeof window !== 'undefined') {
        const savedAttempt = localStorage.getItem(`test-attempt-${attemptId}`);
        if (savedAttempt) {
          const attemptData = JSON.parse(savedAttempt);
          
          // If bandScore isn't already calculated, do it now
          if (!attemptData.bandScore && attemptData.percentageScore) {
            attemptData.bandScore = calculateIeltsBand(attemptData.percentageScore);
          }
          
          return {
            success: true,
            message: "Test results (offline mode)",
            data: {
              ...attemptData,
              feedback: "This is simulated feedback for an offline test. Your IELTS band score is " + 
                (attemptData.bandScore ? attemptData.bandScore.toFixed(1) : "calculated based on your performance") + 
                ". Your real tests will receive detailed feedback from our experts."
            }
          };
        }
      }
      
      throw error;
    }
  },
  
  // Get user's test history
  getUserTestHistory: async (filters?: {
    moduleType?: string;
    status?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.moduleType) queryParams.append('moduleType', filters.moduleType);
      if (filters?.status) queryParams.append('status', filters.status);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      return await fetchData<{success: boolean; message: string; data: any[]}>(`/tests/history${queryString}`);
    } catch (error) {
      console.warn("Failed to get test history, using empty history:", error);
      
      // Return empty test history for offline mode
      return {
        success: true,
        message: "No test history available in offline mode",
        data: []
      };
    }
  },
};

export default {
  Auth: AuthAPI,
  Tests: TestsAPI
}; 