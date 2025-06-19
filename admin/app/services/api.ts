// API base URL - using the root URL of the backend server
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8000').replace(/\/+$/, ''); 

// For debug: show the API URL being used
console.log('API Base URL:', API_BASE_URL);

// Generic fetch function with error handling
async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    // Ensure endpoint starts with a slash if it doesn't already
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Add /api prefix to all endpoints
    const apiEndpoint = normalizedEndpoint.startsWith('/api/') ? normalizedEndpoint : `/api${normalizedEndpoint}`;
    const url = `${API_BASE_URL}${apiEndpoint}`;
    
    console.log('Fetching from URL:', url); // Debug log
    
    // Get token from localStorage if available
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('adminToken') || '';
      console.log('Token available:', !!token); // Log if token exists
    }
    
    // Set headers with auth token if available
    const headers: Record<string, string> = {};
    
    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header set:', headers['Authorization'].substring(0, 20) + '...');
    } else {
      console.warn('No token found in localStorage');
    }
    
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
    
    // Log request details for debugging
    if (options.method === 'POST' || options.method === 'PUT') {
      console.log('Request body:', options.body);
    }
    
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    // Clear timeout
    clearTimeout(timeoutId);

    // Log response status
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Auth API
const AuthAPI = {
  login: async (email: string, password: string) => {
    return fetchWithAuth<{success: boolean; message: string; data: {token: string; user: any}}>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  getProfile: async () => {
    return fetchWithAuth<{success: boolean; message: string; data: any}>('/users/profile', {
      method: 'GET',
    });
  },
  
  validateToken: async () => {
    try {
      return await fetchWithAuth<{success: boolean; message: string; data: any}>('/users/validate-token', {
        method: 'GET',
      });
    } catch (error) {
      // If token validation fails, clear token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
      throw error;
    }
  },
};

// Tests API
export const TestsAPI = {
  getAllTests: async (filters?: Record<string, any>) => {
    try {
      // Build query string from filters
      const queryParams = filters ? new URLSearchParams(
        Object.entries(filters).map(([key, value]) => [key, String(value)])
      ).toString() : '';
      
      const endpoint = queryParams ? `/tests?${queryParams}` : '/tests';
      
      return await fetchWithAuth<{success: boolean; message: string; data: any[]}>(endpoint);
    } catch (error: any) {
      console.error("API Error - getAllTests:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tests",
        data: []
      };
    }
  },
  
  getTestById: async (id: string) => {
    try {
      return await fetchWithAuth<{success: boolean; message: string; data: any}>(`/tests/${id}`);
    } catch (error: any) {
      console.error("API Error - getTestById:", error);
      return {
        success: false,
        message: error.message || `Failed to fetch test with ID: ${id}`,
        data: null
      };
    }
  },
  
  createTest: async (testData: any) => {
    try {
      console.log("Creating test with data:", JSON.stringify(testData, null, 2));
      
      return await fetchWithAuth<{success: boolean; message: string; data: any}>('/tests', {
        method: 'POST',
        body: JSON.stringify(testData),
      });
    } catch (error: any) {
      console.error("API Error - createTest:", error);
      console.error("Test data that failed:", JSON.stringify(testData, null, 2));
      
      return {
        success: false,
        message: error.message || "Failed to create test",
        data: null
      };
    }
  },
  
  updateTest: async (id: string, testData: any) => {
    try {
      return await fetchWithAuth<{success: boolean; message: string; data: any}>(`/tests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(testData),
      });
    } catch (error: any) {
      console.error("API Error - updateTest:", error);
      return {
        success: false,
        message: error.message || `Failed to update test with ID: ${id}`,
        data: null
      };
    }
  },
  
  deleteTest: async (id: string) => {
    try {
      return await fetchWithAuth<{success: boolean; message: string; data: any}>(`/tests/${id}`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      console.error("API Error - deleteTest:", error);
      return {
        success: false,
        message: error.message || `Failed to delete test with ID: ${id}`,
        data: null
      };
    }
  },
  
  // Test sections
  createSection: async (testId: string, sectionData: any) => {
    try {
      console.log("Creating section with data:", JSON.stringify(sectionData, null, 2));
      
      return await fetchWithAuth<{success: boolean; message: string; data: any}>(`/tests/${testId}/sections`, {
        method: 'POST',
        body: JSON.stringify(sectionData),
      });
    } catch (error: any) {
      console.error("API Error - createSection:", error);
      return {
        success: false,
        message: error.message || "Failed to create section",
        data: null
      };
    }
  },
  
  updateSection: async (sectionId: string, sectionData: any) => {
    try {
      return await fetchWithAuth<{success: boolean; message: string; data: any}>(`/tests/sections/${sectionId}`, {
        method: 'PUT',
        body: JSON.stringify(sectionData),
      });
    } catch (error: any) {
      console.error("API Error - updateSection:", error);
      return {
        success: false,
        message: error.message || "Failed to update section",
        data: null
      };
    }
  },
  
  deleteSection: async (sectionId: string) => {
    try {
      return await fetchWithAuth<{success: boolean; message: string; data: any}>(`/tests/sections/${sectionId}`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      console.error("API Error - deleteSection:", error);
      return {
        success: false,
        message: error.message || "Failed to delete section",
        data: null
      };
    }
  },
  
  // Test questions
  createQuestion: async (sectionId: string, questionData: any) => {
    try {
      console.log("Creating question for sectionId:", sectionId);
      console.log("Question data:", JSON.stringify(questionData, null, 2));
      
      return await fetchWithAuth<{success: boolean; message: string; data: any}>(`/tests/sections/${sectionId}/questions`, {
        method: 'POST',
        body: JSON.stringify(questionData),
      });
    } catch (error: any) {
      console.error("API Error - createQuestion:", error);
      return {
        success: false,
        message: error.message || "Failed to create question",
        data: null
      };
    }
  },
  
  // Create complete IELTS test with all sections and questions
  createCompleteIELTSTest: async (testData: any) => {
    try {
      console.log("Creating complete IELTS test with data:", JSON.stringify(testData, null, 2));
      
      return await fetchWithAuth<{success: boolean; message: string; data: any}>('/tests/ielts/complete', {
        method: 'POST',
        body: JSON.stringify(testData),
      });
    } catch (error: any) {
      console.error("API Error - createCompleteIELTSTest:", error);
      console.error("Test data that failed:", JSON.stringify(testData, null, 2));
      
      return {
        success: false,
        message: error.message || "Failed to create IELTS test",
        data: null
      };
    }
  },
  
  updateQuestion: async (questionId: string, questionData: any) => {
    try {
      return await fetchWithAuth<{success: boolean; message: string; data: any}>(`/tests/questions/${questionId}`, {
        method: 'PUT',
        body: JSON.stringify(questionData),
      });
    } catch (error: any) {
      console.error("API Error - updateQuestion:", error);
      return {
        success: false,
        message: error.message || "Failed to update question",
        data: null
      };
    }
  },
  
  deleteQuestion: async (questionId: string) => {
    try {
      return await fetchWithAuth<{success: boolean; message: string; data: any}>(`/tests/questions/${questionId}`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      console.error("API Error - deleteQuestion:", error);
      return {
        success: false,
        message: error.message || "Failed to delete question",
        data: null
      };
    }
  }
};

// Users API
const UsersAPI = {
  getAllUsers: async () => {
    return fetchWithAuth<{success: boolean; message: string; data: any[]}>('/users');
  },
  
  getUserById: async (id: string) => {
    return fetchWithAuth<{success: boolean; message: string; data: any}>(`/users/${id}`);
  },
};

// Upload API
const UploadAPI = {
  uploadAudio: async (formData: FormData) => {
    try {
      console.log('API Base URL:', API_BASE_URL);
      console.log('Uploading audio file...');
      
      // Log the form data contents for debugging
      for (const pair of formData.entries()) {
        console.log('Form data:', pair[0], pair[1]);
      }
      
      const response = await fetchWithAuth<{success: boolean; message: string; data: any}>('/upload/audio', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with the boundary for multipart/form-data
        headers: {
          // Remove Content-Type header to let the browser set it automatically
        }
      });

      console.log('Upload response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to upload audio');
      }

      return {
        success: true,
        message: 'Audio uploaded successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return {
        success: false,
        message: error.message || 'Failed to upload audio',
        data: null
      };
    }
  }
};

// Export all APIs
const api = {
  baseUrl: API_BASE_URL,
  Auth: AuthAPI,
  Tests: TestsAPI,
  Users: UsersAPI,
  Upload: UploadAPI
};

export default api; 