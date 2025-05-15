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
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
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

// Tests API
export const TestsAPI = {
  // Get all available tests
  getAllTests: async (filters?: {
    moduleType?: string;
    difficulty?: string;
    isPublished?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.moduleType) queryParams.append('moduleType', filters.moduleType);
    if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters?.isPublished !== undefined) queryParams.append('isPublished', String(filters.isPublished));
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchData<{success: boolean; message: string; data: any[]}>(`/tests${queryString}`);
  },
  
  // Get a specific test by ID
  getTestById: async (testId: string) => {
    return fetchData<{success: boolean; message: string; data: any}>(`/tests/${testId}`);
  },
  
  // Start a test attempt
  startTestAttempt: async (testId: string) => {
    return fetchData<{success: boolean; message: string; data: any}>(`/tests/${testId}/attempts`, {
      method: 'POST',
    });
  },
  
  // Get a specific test attempt
  getTestAttempt: async (attemptId: string) => {
    return fetchData<{success: boolean; message: string; data: any}>(`/tests/attempts/${attemptId}`);
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
    return fetchData<{success: boolean; message: string; data: any}>(`/tests/attempts/${attemptId}/save`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Submit a test for scoring
  submitTest: async (attemptId: string) => {
    return fetchData<{success: boolean; message: string; data: any}>(`/tests/attempts/${attemptId}/submit`, {
      method: 'POST',
    });
  },
  
  // Get test result details
  getTestResult: async (attemptId: string) => {
    return fetchData<{success: boolean; message: string; data: any}>(`/tests/attempts/${attemptId}/result`);
  },
  
  // Get user's test history
  getUserTestHistory: async (filters?: {
    moduleType?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.moduleType) queryParams.append('moduleType', filters.moduleType);
    if (filters?.status) queryParams.append('status', filters.status);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return fetchData<{success: boolean; message: string; data: any[]}>(`/tests/history${queryString}`);
  },
};

export default {
  Auth: AuthAPI,
  Tests: TestsAPI
}; 