// Mock data for the application
// This is temporary until the backend connection is fixed

// Mock tests data
const mockTests = [
  {
    id: '1',
    title: 'General Aptitude Test',
    description: 'A comprehensive aptitude assessment covering logical, verbal, and quantitative reasoning',
    moduleType: 'FULL_TEST',
    difficulty: 'MEDIUM',
    totalTime: 60,
    questionCount: 45,
    isPublished: true,
    createdAt: '2023-08-15T10:00:00Z',
    _count: {
      sections: 3,
      attempts: 45
    }
  },
  {
    id: '2',
    title: 'Verbal Reasoning',
    description: 'Tests your ability to understand and analyze written information',
    moduleType: 'READING',
    difficulty: 'EASY',
    totalTime: 45,
    questionCount: 30,
    isPublished: true,
    createdAt: '2023-08-10T09:30:00Z',
    _count: {
      sections: 2,
      attempts: 27
    }
  },
  {
    id: '3',
    title: 'Quantitative Analysis',
    description: 'Mathematical problem-solving and data interpretation',
    moduleType: 'FULL_TEST',
    difficulty: 'HARD', 
    totalTime: 90,
    questionCount: 60,
    isPublished: false,
    createdAt: '2023-08-05T14:15:00Z',
    _count: {
      sections: 4,
      attempts: 0
    }
  },
  {
    id: '4',
    title: 'Logical Reasoning',
    description: 'Test your ability to analyze patterns and draw logical conclusions',
    moduleType: 'READING',
    difficulty: 'MEDIUM',
    totalTime: 60,
    questionCount: 40,
    isPublished: true,
    createdAt: '2023-07-28T11:45:00Z',
    _count: {
      sections: 2,
      attempts: 18
    }
  },
  {
    id: '5',
    title: 'English Proficiency',
    description: 'Assess your language skills in reading and comprehension',
    moduleType: 'READING',
    difficulty: 'MEDIUM',
    totalTime: 75,
    questionCount: 50,
    isPublished: false,
    createdAt: '2023-07-22T13:10:00Z',
    _count: {
      sections: 3,
      attempts: 0
    }
  }
];

// Mock Auth API
const AuthAPI = {
  login: async (email: string, password: string) => {
    console.log('Mock login called with:', email);
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Admin User',
          email: email,
          role: 'ADMIN'
        }
      }
    };
  },
  
  getProfile: async () => {
    return {
      success: true,
      message: 'Profile retrieved',
      data: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN'
      }
    };
  },
  
  validateToken: async () => {
    return {
      success: true,
      message: 'Token is valid',
      data: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN'
      }
    };
  },
};

// Mock Tests API
const TestsAPI = {
  getAllTests: async (filters?: Record<string, any>) => {
    console.log('Mock getAllTests called with filters:', filters);
    
    let filteredTests = [...mockTests];
    
    // Apply filters if provided
    if (filters) {
      if (filters.moduleType) {
        filteredTests = filteredTests.filter(test => test.moduleType === filters.moduleType);
      }
      
      if (filters.difficulty) {
        filteredTests = filteredTests.filter(test => test.difficulty === filters.difficulty);
      }
      
      if (filters.isPublished !== undefined) {
        filteredTests = filteredTests.filter(test => test.isPublished === filters.isPublished);
      }
    }
    
    return {
      success: true,
      message: 'Tests retrieved successfully',
      data: filteredTests
    };
  },
  
  getTestById: async (id: string) => {
    console.log('Mock getTestById called with ID:', id);
    
    const test = mockTests.find(test => test.id === id);
    
    if (test) {
      return {
        success: true,
        message: 'Test retrieved successfully',
        data: test
      };
    } else {
      return {
        success: false,
        message: `Test with ID ${id} not found`,
        data: null
      };
    }
  },
  
  createTest: async (testData: any) => {
    console.log('Mock createTest called with data:', testData);
    
    // Generate a random ID
    const newTest = {
      id: Math.random().toString(36).substr(2, 9),
      ...testData,
      createdAt: new Date().toISOString(),
      _count: {
        sections: 0,
        attempts: 0
      }
    };
    
    mockTests.push(newTest);
    
    return {
      success: true,
      message: 'Test created successfully',
      data: newTest
    };
  },
  
  updateTest: async (id: string, testData: any) => {
    console.log('Mock updateTest called with ID:', id, 'and data:', testData);
    
    const index = mockTests.findIndex(test => test.id === id);
    
    if (index !== -1) {
      mockTests[index] = {
        ...mockTests[index],
        ...testData
      };
      
      return {
        success: true,
        message: 'Test updated successfully',
        data: mockTests[index]
      };
    } else {
      return {
        success: false,
        message: `Test with ID ${id} not found`,
        data: null
      };
    }
  },
  
  deleteTest: async (id: string) => {
    console.log('Mock deleteTest called with ID:', id);
    
    const index = mockTests.findIndex(test => test.id === id);
    
    if (index !== -1) {
      const deletedTest = mockTests.splice(index, 1)[0];
      
      return {
        success: true,
        message: 'Test deleted successfully',
        data: deletedTest
      };
    } else {
      return {
        success: false,
        message: `Test with ID ${id} not found`,
        data: null
      };
    }
  },
  
  addQuestions: async (testId: string, questions: any[]) => {
    console.log('Mock addQuestions called with testId:', testId, 'and questions:', questions);
    
    return {
      success: true,
      message: 'Questions added successfully',
      data: questions
    };
  },
  
  updateQuestion: async (testId: string, questionId: string, questionData: any) => {
    console.log('Mock updateQuestion called with testId:', testId, 'questionId:', questionId, 'and data:', questionData);
    
    return {
      success: true,
      message: 'Question updated successfully',
      data: {
        id: questionId,
        ...questionData
      }
    };
  },
  
  deleteQuestion: async (testId: string, questionId: string) => {
    console.log('Mock deleteQuestion called with testId:', testId, 'and questionId:', questionId);
    
    return {
      success: true,
      message: 'Question deleted successfully',
      data: { id: questionId }
    };
  }
};

// Mock Users API
const UsersAPI = {
  getAllUsers: async () => {
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN'
        },
        {
          id: '2',
          name: 'Student One',
          email: 'student1@example.com',
          role: 'STUDENT'
        }
      ]
    };
  },
  
  getUserById: async (id: string) => {
    return {
      success: true,
      message: 'User retrieved successfully',
      data: {
        id,
        name: id === '1' ? 'Admin User' : 'Student',
        email: id === '1' ? 'admin@example.com' : 'student@example.com',
        role: id === '1' ? 'ADMIN' : 'STUDENT'
      }
    };
  },
};

const mockApi = {
  baseUrl: 'http://localhost:8000',
  Auth: AuthAPI,
  Tests: TestsAPI,
  Users: UsersAPI,
};

export default mockApi; 