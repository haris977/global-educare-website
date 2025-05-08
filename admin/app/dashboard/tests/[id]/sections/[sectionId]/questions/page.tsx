"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../../../../services/api";
import { use } from "react";

// Type definitions
interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string;
  correctAnswer: string;
  marks: number;
  order: number;
  sectionId: string;
}

interface Section {
  id: string;
  title: string;
  instructions: string;
  order: number;
  timeLimit: number;
  testId: string;
}

interface Test {
  id: string;
  title: string;
}

export default function QuestionsPage({ params }: { params: { id: string; sectionId: string } }) {
  const router = useRouter();
  // Unwrap params using React.use() to fix the warning
  const unwrappedParams = use(params);
  const { id: testId, sectionId } = unwrappedParams;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [test, setTest] = useState<Test | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Current question form state
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    questionType: "MULTIPLE_CHOICE",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
    order: 0
  });
  
  // Fetch test, section and questions data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get test data
        const testResponse = await api.Tests.getTestById(testId);
        console.log("Test response:", testResponse);
        if (testResponse.success && testResponse.data) {
          setTest({
            id: testResponse.data.id,
            title: testResponse.data.title
          });
          
          // Find the section in the test data
          const foundSection = testResponse.data.sections.find(
            (section: any) => section.id === sectionId
          );
          
          if (foundSection) {
            setSection(foundSection);
            // Extract questions from the section
            if (foundSection.questions && foundSection.questions.length > 0) {
              setQuestions(foundSection.questions);
            }
          } else {
            setError("Section not found");
          }
        } else {
          setError("Failed to load test data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [testId, sectionId]);
  
  // Handle question input change
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'marks') {
      // Ensure marks is a positive number
      const numValue = Math.max(1, parseInt(value) || 1);
      setCurrentQuestion(prev => ({ ...prev, [name]: numValue }));
    } else {
      setCurrentQuestion(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    setCurrentQuestion(prev => {
      const updatedOptions = [...prev.options];
      updatedOptions[index] = value;
      return {
        ...prev,
        options: updatedOptions
      };
    });
  };
  
  // Add option to multiple choice question
  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, ""]
    }));
  };
  
  // Remove option from multiple choice question
  const removeOption = (index: number) => {
    setCurrentQuestion(prev => {
      if (prev.options.length <= 2) {
        setError("Multiple choice questions must have at least 2 options");
        return prev;
      }
      
      const updatedOptions = [...prev.options];
      updatedOptions.splice(index, 1);
      return {
        ...prev,
        options: updatedOptions
      };
    });
  };
  
  // Add question to section
  const addQuestion = async () => {
    if (!currentQuestion.questionText.trim()) {
      setError("Question text is required");
      return;
    }
    
    // Validate based on question type
    if (currentQuestion.questionType === "MULTIPLE_CHOICE") {
      // Check if at least 2 options are filled
      const filledOptions = currentQuestion.options.filter(opt => opt.trim().length > 0);
      if (filledOptions.length < 2) {
        setError("Multiple choice questions must have at least 2 options");
        return;
      }
      
      // Check if correct answer is selected
      if (!currentQuestion.correctAnswer) {
        setError("Please select the correct answer");
        return;
      }
    } else if (currentQuestion.questionType === "TRUE_FALSE") {
      // For TRUE_FALSE questions, we need a specific format
      setCurrentQuestion(prev => ({
        ...prev,
        options: ["true", "false"]
      }));
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Filter out empty options first
      const filteredOptions = 
        currentQuestion.questionType === "TRUE_FALSE" ? 
        ["true", "false"] : 
        currentQuestion.options.filter(opt => opt.trim());
      
      // Prepare the question data
      const questionData = {
        questionText: currentQuestion.questionText,
        questionType: currentQuestion.questionType,
        // Format options properly based on question type
        options: currentQuestion.questionType === "MULTIPLE_CHOICE" || currentQuestion.questionType === "TRUE_FALSE" ? 
          JSON.stringify(filteredOptions) : 
          undefined,
        // Format correctAnswer based on question type
        correctAnswer: 
          currentQuestion.questionType === "MULTIPLE_CHOICE" && filteredOptions[parseInt(currentQuestion.correctAnswer)] ?
            filteredOptions[parseInt(currentQuestion.correctAnswer)] : // For multiple choice, send the actual option text 
          currentQuestion.questionType === "TRUE_FALSE" ?
            currentQuestion.correctAnswer.toLowerCase() : // Make TRUE_FALSE answers lowercase
            currentQuestion.correctAnswer, // For other question types, send as is
        marks: currentQuestion.marks,
        order: questions.length + 1
      };
      
      console.log("Sending question data:", JSON.stringify(questionData, null, 2));
      
      // Call API to create question
      console.log("About to make API call to create question for section:", sectionId);
      const response = await api.Tests.createQuestion(sectionId, questionData);
      console.log("API response for createQuestion:", JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        console.log("Question created successfully:", response.data);
        // Add new question to the list
        setQuestions(prev => [...prev, response.data]);
        
        // Refresh test data to get latest state
        const testResponse = await api.Tests.getTestById(testId);
        if (testResponse.success && testResponse.data) {
          // Find the updated section
          const updatedSection = testResponse.data.sections.find(
            (section: any) => section.id === sectionId
          );
          
          if (updatedSection && updatedSection.questions) {
            // Update the questions list with the latest from the backend
            setQuestions(updatedSection.questions);
          }
        }
        
        // Reset form
        setCurrentQuestion({
          questionText: "",
          questionType: "MULTIPLE_CHOICE",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 1,
          order: 0
        });
        
        setSuccessMessage("Question added successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Failed to add question");
      }
    } catch (err: any) {
      console.error("Error adding question:", err);
      setError(err.message || "An error occurred while adding the question");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete question
  const deleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.Tests.deleteQuestion(questionId);
      
      if (response.success) {
        // Remove the deleted question from the state
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        setSuccessMessage("Question deleted successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Failed to delete question");
      }
    } catch (err: any) {
      console.error("Error deleting question:", err);
      setError(err.message || "An error occurred while deleting the question");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <h2 className="text-lg font-medium text-gray-700 mt-4">Loading...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/dashboard/tests" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Tests
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href={`/dashboard/tests/${testId}`} className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                {test?.title || "Test Details"}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-sm font-medium text-indigo-600">
                {section?.title || "Section Questions"} 
              </span>
            </li>
          </ol>
        </nav>
        
        {/* Page header */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {section?.title || "Section Questions"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {section?.instructions || "Manage questions for this section"}
              </p>
            </div>
            <div className="mt-4 flex md:mt-0">
              <Link
                href={`/dashboard/tests/${testId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Test
              </Link>
            </div>
          </div>
        </div>
        
        {/* Error and success messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError("")}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add question form */}
          <div className="lg:col-span-1">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg divide-y divide-gray-200">
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-blue-50">
                <h3 className="text-lg font-medium text-gray-900">Add New Question</h3>
                <p className="mt-1 text-sm text-gray-500">Create a new question for this section</p>
              </div>
              <div className="px-6 py-5 space-y-6">
                <div>
                  <label htmlFor="questionText" className="block text-sm font-medium text-gray-700">
                    Question Text <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="questionText"
                      name="questionText"
                      rows={3}
                      value={currentQuestion.questionText}
                      onChange={handleQuestionChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter the question text"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
                    Question Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="questionType"
                      name="questionType"
                      value={currentQuestion.questionType}
                      onChange={handleQuestionChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True/False</option>
                      <option value="SHORT_ANSWER">Short Answer</option>
                      <option value="ESSAY">Essay</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="marks" className="block text-sm font-medium text-gray-700">
                    Points
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="marks"
                      name="marks"
                      min={1}
                      value={currentQuestion.marks}
                      onChange={handleQuestionChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                {/* Options for Multiple Choice questions */}
                {currentQuestion.questionType === "MULTIPLE_CHOICE" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Answer Options
                      </label>
                      <button
                        type="button"
                        onClick={addOption}
                        className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2 group">
                        <div className="mr-3">
                          <input
                            type="radio"
                            name="correctOption"
                            checked={currentQuestion.correctAnswer === index.toString()}
                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index.toString() }))}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                        </div>
                        <div className="flex-grow">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        {index > 1 && (
                          <div className="ml-2">
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* True/False options */}
                {currentQuestion.questionType === "TRUE_FALSE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          id="true-option"
                          type="radio"
                          name="correctAnswer"
                          value="true"
                          checked={currentQuestion.correctAnswer === "true"}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label htmlFor="true-option" className="ml-2 block text-sm text-gray-700">
                          True
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="false-option"
                          type="radio"
                          name="correctAnswer"
                          value="false"
                          checked={currentQuestion.correctAnswer === "false"}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label htmlFor="false-option" className="ml-2 block text-sm text-gray-700">
                          False
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Short answer correct response */}
                {currentQuestion.questionType === "SHORT_ANSWER" && (
                  <div>
                    <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700">
                      Correct Answer
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="correctAnswer"
                        name="correctAnswer"
                        value={currentQuestion.correctAnswer}
                        onChange={handleQuestionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter the expected answer"
                      />
                    </div>
                  </div>
                )}
                
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={addQuestion}
                    disabled={isLoading}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Question
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Questions list */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="bg-white px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {questions.length} {questions.length === 1 ? 'question' : 'questions'} in this section
                  </p>
                </div>
              </div>
              
              {questions.length === 0 ? (
                <div className="p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No questions</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new question.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {questions.map((question, index) => {
                    // Parse options if it's a string
                    let parsedOptions = [];
                    if (question.options && typeof question.options === 'string') {
                      try {
                        parsedOptions = JSON.parse(question.options);
                      } catch (error) {
                        console.error("Error parsing options:", error);
                      }
                    }
                    
                    return (
                      <li key={question.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">{question.questionText}</h4>
                              <div className="flex-shrink-0 ml-4">
                                <button
                                  type="button"
                                  onClick={() => deleteQuestion(question.id)}
                                  className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {question.questionType.replace(/_/g, ' ')}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {question.marks} {question.marks === 1 ? 'point' : 'points'}
                              </span>
                            </div>
                            
                            {/* Show options for MULTIPLE_CHOICE */}
                            {question.questionType === "MULTIPLE_CHOICE" && parsedOptions.length > 0 && (
                              <div className="mt-3 border border-gray-200 rounded-md p-3 bg-gray-50">
                                <p className="text-xs font-medium text-gray-500 mb-2">Options:</p>
                                <ul className="space-y-1">
                                  {parsedOptions.map((option: string, optIndex: number) => (
                                    <li 
                                      key={optIndex} 
                                      className={`text-sm pl-2 py-1 ${
                                        option === question.correctAnswer ? 'text-green-700 font-medium bg-green-50 border-l-2 border-green-500 rounded' : ''
                                      }`}
                                    >
                                      {option} {option === question.correctAnswer && "✓"}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Show TRUE_FALSE answer */}
                            {question.questionType === "TRUE_FALSE" && (
                              <div className="mt-3 text-sm text-gray-700">
                                <span className="font-medium">Correct answer: </span>
                                <span className={`${
                                  question.correctAnswer === "true" ? "text-green-600" : "text-red-600"
                                } font-medium`}>
                                  {question.correctAnswer}
                                </span>
                              </div>
                            )}
                            
                            {/* Show SHORT_ANSWER answer */}
                            {question.questionType === "SHORT_ANSWER" && (
                              <div className="mt-3 text-sm text-gray-700">
                                <span className="font-medium">Correct answer: </span>
                                <span className="italic">{question.correctAnswer}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 