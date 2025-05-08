"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../services/api";
import { use } from "react";

// Type definitions
interface Section {
  id: string;
  title: string;
  instructions: string;
  order: number;
  timeLimit: number;
  testId: string;
  questions: any[];
}

interface Test {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  moduleType: string;
  totalTime: number;
  totalMarks: number;
  totalQuestions: number;
  isPublished: boolean;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export default function TestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  // Unwrap params using React.use() to fix the warning
  const unwrappedParams = use(params);
  const { id: testId } = unwrappedParams;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [test, setTest] = useState<Test | null>(null);
  
  // Section form state for creating new sections
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [newSection, setNewSection] = useState({
    title: "",
    instructions: "",
    timeLimit: 0,
    order: 0
  });
  
  // Fetch test data
  useEffect(() => {
    const fetchTest = async () => {
      setIsLoading(true);
      try {
        const response = await api.Tests.getTestById(testId);
        if (response.success && response.data) {
          setTest(response.data);
        } else {
          setError(response.message || "Failed to load test data");
        }
      } catch (err: any) {
        console.error("Error fetching test:", err);
        setError(err.message || "An error occurred while fetching test data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTest();
  }, [testId]);
  
  // Handle input change for new section form
  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'timeLimit' || name === 'order') {
      // Ensure numeric values are positive
      const numValue = Math.max(0, parseInt(value) || 0);
      setNewSection(prev => ({ ...prev, [name]: numValue }));
    } else {
      setNewSection(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Create new section
  const createSection = async () => {
    if (!newSection.title.trim()) {
      setError("Section title is required");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Set default order if not specified
      const sectionData = {
        ...newSection,
        order: newSection.order || (test?.sections?.length || 0) + 1
      };
      
      const response = await api.Tests.createSection(testId, sectionData);
      
      if (response.success && response.data) {
        // Update test data with new section
        setTest(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            sections: [...prev.sections, response.data]
          };
        });
        
        // Reset form
        setNewSection({
          title: "",
          instructions: "",
          timeLimit: 0,
          order: 0
        });
        
        setShowSectionForm(false);
        setSuccessMessage("Section created successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Failed to create section");
      }
    } catch (err: any) {
      console.error("Error creating section:", err);
      setError(err.message || "An error occurred while creating the section");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete section
  const deleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section? All questions in this section will also be deleted.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.Tests.deleteSection(sectionId);
      
      if (response.success) {
        // Update test data by removing the deleted section
        setTest(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            sections: prev.sections.filter(section => section.id !== sectionId)
          };
        });
        
        setSuccessMessage("Section deleted successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Failed to delete section");
      }
    } catch (err: any) {
      console.error("Error deleting section:", err);
      setError(err.message || "An error occurred while deleting the section");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle test published status
  const togglePublishedStatus = async () => {
    if (!test) return;
    
    setIsLoading(true);
    try {
      const response = await api.Tests.updateTest(testId, {
        ...test,
        isPublished: !test.isPublished
      });
      
      if (response.success && response.data) {
        setTest(response.data);
        setSuccessMessage(`Test ${response.data.isPublished ? 'published' : 'unpublished'} successfully`);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Failed to update test");
      }
    } catch (err: any) {
      console.error("Error updating test:", err);
      setError(err.message || "An error occurred while updating the test");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error && !test) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb navigation */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <Link href="/dashboard/tests" className="hover:text-indigo-600 transition-colors">
              Tests
            </Link>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li className="text-indigo-600 font-medium">{test?.title || "Test Details"}</li>
        </ol>
      </nav>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Test header */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{test?.title}</h1>
            <p className="text-gray-600 mb-4">{test?.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {test?.moduleType}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {test?.difficulty}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {test?.totalMarks} Marks
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {test?.totalTime} Minutes
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {test?.totalQuestions} Questions
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${test?.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {test?.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={togglePublishedStatus}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${test?.isPublished ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : test?.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            
            <Link
              href={`/dashboard/tests/${testId}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Test
            </Link>
          </div>
        </div>
      </div>
      
      {/* Sections */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Test Sections</h2>
          <button
            onClick={() => setShowSectionForm(!showSectionForm)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showSectionForm ? 'Cancel' : '+ Add Section'}
          </button>
        </div>
        
        {/* Add section form */}
        {showSectionForm && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Section</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Section Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newSection.title}
                  onChange={handleSectionChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g. Reading Comprehension"
                />
              </div>
              
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows={3}
                  value={newSection.instructions}
                  onChange={handleSectionChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Instructions for students"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    id="timeLimit"
                    name="timeLimit"
                    min={0}
                    value={newSection.timeLimit}
                    onChange={handleSectionChange}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0 = No limit"
                  />
                </div>
                
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    min={1}
                    value={newSection.order || (test?.sections?.length || 0) + 1}
                    onChange={handleSectionChange}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={createSection}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Add Section'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Sections list */}
        {test?.sections && test.sections.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm">
            <ul className="divide-y divide-gray-200">
              {test.sections.map((section, index) => (
                <li key={section.id} className="px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                        {section.order || index + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{section.title}</h3>
                        {section.instructions && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{section.instructions}</p>
                        )}
                        
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                          <span className="inline-flex items-center">
                            <svg className="mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {section.timeLimit ? `${section.timeLimit} min` : 'No time limit'}
                          </span>
                          
                          <span className="inline-flex items-center">
                            <svg className="mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            {section.questions?.length || 0} Questions
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/tests/${testId}/sections/${section.id}/questions`}
                        className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-xs font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Manage Questions
                      </Link>
                      
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete section"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sections found</h3>
            <p className="mt-1 text-sm text-gray-500">You need to create at least one section before you can add questions.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowSectionForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Section
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Questions Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-8">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Questions</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">All questions in this test</p>
          </div>
          {test.sections.length > 0 && (
            <Link
              href={`/dashboard/tests/${testId}/sections/${test.sections[0].id}/questions`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Questions
            </Link>
          )}
        </div>
        
        {test.sections.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sections available</h3>
            <p className="mt-1 text-sm text-gray-500">You need to create at least one section before you can add questions.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowSectionForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Section
              </button>
            </div>
          </div>
        ) : test.totalQuestions === 0 ? (
          <div className="px-6 py-10 text-center">
            <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions available</h3>
            <p className="mt-1 text-sm text-gray-500">You need to add questions to the sections before you can view them.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowSectionForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Section
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <ul className="divide-y divide-gray-200">
              {test.sections.map((section, index) => (
                <li key={section.id} className="px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                        {section.order || index + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{section.title}</h3>
                        {section.instructions && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{section.instructions}</p>
                        )}
                        
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                          <span className="inline-flex items-center">
                            <svg className="mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {section.timeLimit ? `${section.timeLimit} min` : 'No time limit'}
                          </span>
                          
                          <span className="inline-flex items-center">
                            <svg className="mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            {section.questions?.length || 0} Questions
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/tests/${testId}/sections/${section.id}/questions`}
                        className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-xs font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Manage Questions
                      </Link>
                      
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete section"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 