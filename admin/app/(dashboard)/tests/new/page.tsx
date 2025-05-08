"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../services/api";
// import api from "../../../../services/mockApi"; // Using mock API for now

interface TestFormData {
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";
  moduleType: "READING" | "WRITING" | "LISTENING" | "SPEAKING" | "IELTS_GENERAL" | "IELTS_ACADEMIC" | "COMBINED";
  totalTime: number;
  totalMarks: number;
  isPublished: boolean;
  isFeatured: boolean;
  testCategory: string;
}

export default function CreateTestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestFormData>({
    title: "",
    description: "",
    difficulty: "MEDIUM",
    moduleType: "READING",
    totalTime: 60,
    totalMarks: 100,
    isPublished: false,
    isFeatured: false,
    testCategory: "Practice"
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } 
    // Handle number inputs
    else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    }
    // Handle all other inputs
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError("Please enter a test title");
      return;
    }
    
    if (formData.totalTime <= 0) {
      setError("Total time must be greater than 0");
      return;
    }
    
    if (formData.totalMarks <= 0) {
      setError("Total marks must be greater than 0");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create the test
      const response = await api.Tests.createTest(formData);
      
      if (response.success) {
        // Navigate to test editor page
        router.push(`/tests/${response.data.id}`);
      } else {
        setError(response.message || "Failed to create test");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Error creating test:", error);
      setError(error.message || "An error occurred while creating the test. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  // Helper function to render difficulty badge
  const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
    const colorClasses = {
      EASY: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HARD: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[difficulty as keyof typeof colorClasses]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()}
      </span>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Test</h1>
          <p className="mt-2 text-base text-gray-500">Create a new assessment test for your students</p>
        </div>
        <Link
          href="/tests"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="relative">
          <div className="absolute inset-0 h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="border-b border-gray-200 px-6 py-5 relative">
            <h3 className="text-xl font-semibold text-gray-900">Test Information</h3>
            <p className="mt-1 text-sm text-gray-500">Basic details about the test</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Test Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                  placeholder="e.g., IELTS Academic Reading Test 1"
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                  placeholder="Provide a brief description of the test"
                ></textarea>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="moduleType" className="block text-sm font-medium text-gray-700 mb-1">
                Module Type <span className="text-red-500">*</span>
              </label>
              <div>
                <select
                  id="moduleType"
                  name="moduleType"
                  value={formData.moduleType}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                  required
                >
                  <option value="READING">Reading</option>
                  <option value="WRITING">Writing</option>
                  <option value="LISTENING">Listening</option>
                  <option value="SPEAKING">Speaking</option>
                  <option value="IELTS_GENERAL">IELTS General</option>
                  <option value="IELTS_ACADEMIC">IELTS Academic</option>
                  <option value="COMBINED">Combined</option>
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <div>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                  required
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="VERY_HARD">Very Hard</option>
                </select>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-gray-500 mr-2">Selected:</span>
                <DifficultyBadge difficulty={formData.difficulty} />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="testCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Test Category
              </label>
              <div>
                <input
                  type="text"
                  id="testCategory"
                  name="testCategory"
                  value={formData.testCategory}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                  placeholder="e.g., Practice, Mock, Official"
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="totalTime" className="block text-sm font-medium text-gray-700 mb-1">
                Total Time (minutes) <span className="text-red-500">*</span>
              </label>
              <div>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="totalTime"
                    id="totalTime"
                    value={formData.totalTime}
                    onChange={handleChange}
                    min={1}
                    max={180}
                    className="block w-full px-4 py-3 rounded-l-md border border-r-0 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                    required
                  />
                  <span className="inline-flex items-center px-4 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md sm:text-sm">
                    min
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Time allowed for students to complete the test (1-180 minutes)</p>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-1">
                Total Marks <span className="text-red-500">*</span>
              </label>
              <div>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="totalMarks"
                    id="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    min={1}
                    className="block w-full px-4 py-3 rounded-l-md border border-r-0 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                    required
                  />
                  <span className="inline-flex items-center px-4 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md sm:text-sm">
                    marks
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Total possible marks for the test</p>
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isPublished"
                      name="isPublished"
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="isPublished" className="font-medium text-gray-700">Publish Immediately</label>
                    <p className="text-sm text-gray-500 mt-1">Make this test available to students right away</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-center h-full">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isFeatured"
                      name="isFeatured"
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isFeatured" className="font-medium text-gray-700">
                      Feature Test
                    </label>
                    <p className="text-gray-500">Highlight this test on the dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              className="px-5 py-2.5 border border-gray-300 shadow-sm rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              onClick={() => router.push('/tests')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Test'}
            </button>
          </div>
        </form>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-500">
              After creating the test, you will be redirected to the test editor where you can add sections and questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 