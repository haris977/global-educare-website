"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../services/api";

// Type definitions for backend data
interface Question {
  id: string;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY";
  options?: any; // JSON object in the backend
  correctAnswer?: string;
  marks: number;
  order: number;
  sectionId: string;
}

interface Section {
  id: string;
  title: string;
  instructions?: string;
  order: number;
  timeLimit?: number;
  questions: Question[];
}

interface Test {
  id: string;
  title: string;
  description: string;
  moduleType: string;
  difficulty: string;
  totalTime: number;
  totalMarks: number;
  totalQuestions: number;
  isPublished: boolean;
  createdAt: string;
  sections: Section[];
}

export default function TestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Test | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
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
  
  // Fetch test data on component mount
  useEffect(() => {
    loadTest();
  }, [params.id]);
  
  // Fetch test data
  const loadTest = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await api.Tests.getTestById(id);
      
      if (response.success && response.data) {
        setTest(response.data);
        setEditForm({
          title: response.data.title,
          description: response.data.description || "",
          totalTime: response.data.totalTime || 0,
          totalMarks: response.data.totalMarks || 0,
          isPublished: response.data.isPublished || false,
          sections: response.data.sections || []
        });
      } else {
        setError(response.message || "Failed to load test data");
      }
    } catch (error: any) {
      console.error("Error loading test:", error);
      setError(error.message || "Error loading test");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    });
  };
  
  // Handle form submission
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveTest();
  };
  
  // Toggle publish status
  const handleTogglePublish = async () => {
    if (!test) return;
    
    try {
      setIsSaving(true);
      
      const updatedTest = {
        ...test,
        isPublished: !test.isPublished
      };
      
      const response = await api.Tests.updateTest(test.id, updatedTest);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update test");
      }
      
      setTest(response.data);
      setEditForm(JSON.parse(JSON.stringify(response.data)));
    } catch (err: any) {
      console.error("Error toggling publish status:", err);
      alert(err.message || "Error updating test");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save test changes
  const saveTest = async () => {
    try {
      setIsSaving(true);
      setError("");
      
      const testData = {
        title: editForm.title,
        description: editForm.description,
        totalTime: Number(editForm.totalTime),
        totalMarks: Number(editForm.totalMarks),
        isPublished: editForm.isPublished
      };
      
      const response = await api.Tests.updateTest(id, testData);
      
      if (response.success) {
        // Refresh test data
        await loadTest();
        // Close edit mode
        setIsEditing(false);
      } else {
        setError(response.message || "Failed to save changes");
      }
    } catch (error: any) {
      console.error("Error saving test:", error);
      setError(error.message || "Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Delete test
  const handleDeleteTest = async () => {
    if (!test || !confirm(`Are you sure you want to delete "${test.title}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      const response = await api.Tests.deleteTest(id);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to delete test");
      }
      
      router.push("/tests");
    } catch (err: any) {
      console.error("Error deleting test:", err);
      alert(err.message || "Error deleting test");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Section Management
  const handleAddSection = async (sectionData: Omit<Section, 'id' | 'questions'>) => {
    if (!test) return;
    
    try {
      setIsSaving(true);
      
      const response = await api.Tests.createSection(test.id, sectionData);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to add section");
      }
      
      // Refetch the test to get updated sections
      const testResponse = await api.Tests.getTestById(test.id);
      
      if (!testResponse.success || !testResponse.data) {
        throw new Error(testResponse.message || "Failed to refresh test data");
      }
      
      setTest(testResponse.data);
      setEditForm(JSON.parse(JSON.stringify(testResponse.data)));
    } catch (err: any) {
      console.error("Error adding section:", err);
      alert(err.message || "Error adding section");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUpdateSection = async (sectionId: string, sectionData: Partial<Section>) => {
    if (!test) return;
    
    try {
      setIsSaving(true);
      
      const response = await api.Tests.updateSection(sectionId, sectionData);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update section");
      }
      
      // Refetch the test to get updated sections
      const testResponse = await api.Tests.getTestById(test.id);
      
      if (!testResponse.success || !testResponse.data) {
        throw new Error(testResponse.message || "Failed to refresh test data");
      }
      
      setTest(testResponse.data);
      setEditForm(JSON.parse(JSON.stringify(testResponse.data)));
    } catch (err: any) {
      console.error("Error updating section:", err);
      alert(err.message || "Error updating section");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteSection = async (sectionId: string) => {
    if (!test || !confirm("Are you sure you want to delete this section? This will also delete all questions in this section.")) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      const response = await api.Tests.deleteSection(sectionId);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to delete section");
      }
      
      // Refetch the test to get updated sections
      const testResponse = await api.Tests.getTestById(test.id);
      
      if (!testResponse.success || !testResponse.data) {
        throw new Error(testResponse.message || "Failed to refresh test data");
      }
      
      setTest(testResponse.data);
      setEditForm(JSON.parse(JSON.stringify(testResponse.data)));
    } catch (err: any) {
      console.error("Error deleting section:", err);
      alert(err.message || "Error deleting section");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Question Management
  const handleAddQuestion = async (sectionId: string, questionData: Omit<Question, 'id'>) => {
    if (!test) return;
    
    try {
      setIsSaving(true);
      
      const response = await api.Tests.createQuestion(sectionId, questionData);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to add question");
      }
      
      // Refetch the test to get updated questions
      const testResponse = await api.Tests.getTestById(test.id);
      
      if (!testResponse.success || !testResponse.data) {
        throw new Error(testResponse.message || "Failed to refresh test data");
      }
      
      setTest(testResponse.data);
      setEditForm(JSON.parse(JSON.stringify(testResponse.data)));
    } catch (err: any) {
      console.error("Error adding question:", err);
      alert(err.message || "Error adding question");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUpdateQuestion = async (questionId: string, questionData: Partial<Question>) => {
    if (!test) return;
    
    try {
      setIsSaving(true);
      
      const response = await api.Tests.updateQuestion(questionId, questionData);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update question");
      }
      
      // Refetch the test to get updated questions
      const testResponse = await api.Tests.getTestById(test.id);
      
      if (!testResponse.success || !testResponse.data) {
        throw new Error(testResponse.message || "Failed to refresh test data");
      }
      
      setTest(testResponse.data);
      setEditForm(JSON.parse(JSON.stringify(testResponse.data)));
    } catch (err: any) {
      console.error("Error updating question:", err);
      alert(err.message || "Error updating question");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteQuestion = async (questionId: string) => {
    if (!test || !confirm("Are you sure you want to delete this question?")) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      const response = await api.Tests.deleteQuestion(questionId);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to delete question");
      }
      
      // Refetch the test to get updated questions
      const testResponse = await api.Tests.getTestById(test.id);
      
      if (!testResponse.success || !testResponse.data) {
        throw new Error(testResponse.message || "Failed to refresh test data");
      }
      
      setTest(testResponse.data);
      setEditForm(JSON.parse(JSON.stringify(testResponse.data)));
    } catch (err: any) {
      console.error("Error deleting question:", err);
      alert(err.message || "Error deleting question");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-500 text-lg">Loading test details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !test) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error || "Test not found"}</p>
              <div className="mt-4">
                <Link
                  href="/dashboard/tests"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Tests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // View Mode
  if (!isEditing) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{test.title}</h1>
              <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                test.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {test.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Created {formatDate(test.createdAt)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Test
            </button>
            <button
              onClick={handleTogglePublish}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200 ${
                test.isPublished 
                  ? "border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100" 
                  : "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
              }`}
            >
              {test.isPublished ? (
                <>
                  <svg className="-ml-1 mr-2 h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                  </svg>
                  Unpublish
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Publish
                </>
              )}
            </button>
            <Link
              href="/dashboard/tests"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Tests
            </Link>
          </div>
        </div>
        
        {/* Basic Info Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-8">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Test Details</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic information about the test</p>
            </div>
            <div className="flex items-center">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-500">{test.totalQuestions} questions</span>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Test Title</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{test.title}</dd>
              </div>
              <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{test.description || "No description provided"}</dd>
              </div>
              <div className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Time Limit</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {test.totalTime} minutes
                  </div>
                </dd>
              </div>
              <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Passing Score</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{test.passingScore}%</dd>
              </div>
              <div className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(test.createdAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Questions Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-8">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Questions</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">All questions in this test</p>
            </div>
            <Link
              href={`/dashboard/tests/${id}/questions`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Questions
            </Link>
          </div>
          <div>
            {test.totalQuestions === 0 ? (
              <div className="px-6 py-10 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No questions</h3>
                <p className="mt-1 text-sm text-gray-500">Add questions to your test to get started.</p>
                <div className="mt-6">
                  <Link
                    href={`/dashboard/tests/${id}/questions`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Questions
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {test.sections.map((section) => (
                  <li key={section.id} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{section.questions.length}</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{section.title}</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            {section.questions.length} questions
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-red-50">
            <h3 className="text-lg leading-6 font-medium text-red-800">Danger Zone</h3>
            <p className="mt-1 max-w-2xl text-sm text-red-600">Destructive actions that cannot be undone</p>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Delete this test</h4>
                <p className="mt-1 text-sm text-gray-500">Permanently delete this test and all its questions. This action cannot be undone.</p>
              </div>
              <button
                onClick={handleDeleteTest}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Edit Mode
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Test</h1>
          <p className="mt-2 text-sm text-gray-500">Make changes to "{test.title}"</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <Link
            href="/dashboard/tests"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Tests
          </Link>
        </div>
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
      
      {editForm && (
        <form onSubmit={handleSaveChanges} className="space-y-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Test Information</h3>
              <p className="mt-1 text-sm text-gray-500">Update the basic details of your test</p>
            </div>
            <div className="px-6 py-5">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Test Title<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={editForm.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200 ease-in-out hover:border-indigo-300"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={editForm.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200 ease-in-out hover:border-indigo-300"
                    placeholder="Provide a brief description of what this test covers"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="totalTime" className="block text-sm font-medium text-gray-700">Time Limit (minutes)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="totalTime"
                        id="totalTime"
                        min={1}
                        value={editForm.totalTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200 ease-in-out hover:border-indigo-300 pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                        <span className="text-gray-500 sm:text-sm">min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="passingScore"
                        id="passingScore"
                        min={0}
                        max={100}
                        value={editForm.passingScore}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all duration-200 ease-in-out hover:border-indigo-300 pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="isPublished"
                      id="isPublished"
                      checked={editForm.isPublished}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors duration-200 ease-in-out cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isPublished" className="font-medium text-gray-700 cursor-pointer">
                      Published
                    </label>
                    <p className="text-gray-500">Test is visible to students and can be taken</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Questions Editor (simplified) */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Questions</h3>
                <p className="mt-1 text-sm text-gray-500">{editForm.sections.length} sections in this test</p>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 mr-3">For detailed question management:</span>
                <Link 
                  href={`/dashboard/tests/${id}/questions`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Questions
                </Link>
              </div>
            </div>
            <div className="px-6 py-5">
              {editForm.sections.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sections</h3>
                  <p className="mt-1 text-sm text-gray-500">Add sections to your test to get started.</p>
                  <div className="mt-6">
                    <Link
                      href={`/dashboard/tests/${id}/questions`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Sections
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-sm font-medium text-gray-900">This test has {editForm.sections.length} sections</span>
                    </div>
                    <span className="text-sm text-gray-500">Use the section editor for detailed management</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 hover:shadow"
            >
              <svg className="mr-2 -ml-1 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 