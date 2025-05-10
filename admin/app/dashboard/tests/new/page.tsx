"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../services/api";

// Type definitions
type QuestionType = 
  | "MULTIPLE_CHOICE" 
  | "TRUE_FALSE" 
  | "SHORT_ANSWER" 
  | "ESSAY" 
  | "PARA_HEADINGS" 
  | "COMPLETE_SENTENCE" 
  | "NAME_MATCHING" 
  | "FILL_BLANK" 
  | "TRUE_FALSE_NOT_GIVEN" 
  | "YES_NO_NOT_GIVEN" 
  | "MAP" 
  | "SPEAKING_TASK_1" 
  | "SPEAKING_TASK_2" 
  | "SPEAKING_TASK_3" 
  | "SPEAKING_FOLLOW_UPS";

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  passage?: string;
  paragraphs?: string[];
  sentences?: string[];
  matchingPairs?: Record<string, string>;
  mapLabels?: string[];
  questionImage?: string;
  cueCard?: string;
  speakingPrompts?: string[];
  followUpQuestions?: string[];
}

interface TestForm {
  title: string;
  description: string;
  totalTime: number;
  passingScore: number;
  isPublished: boolean;
  questions: Question[];
  moduleType: string;
  difficulty: string;
}

export default function CreateTestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Initial form state
  const [form, setForm] = useState<TestForm>({
    title: "",
    description: "",
    totalTime: 60,
    passingScore: 70,
    isPublished: false,
    questions: [],
    moduleType: "READING", // Default to READING (valid enum value)
    difficulty: "MEDIUM"   // Default difficulty level
  });
  
  // Get initial question type based on default module
  const initialQuestionType = "MULTIPLE_CHOICE"; // Valid for all modules
  
  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    text: "",
    type: initialQuestionType,
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
    passage: "",
    paragraphs: [],
    sentences: [],
    matchingPairs: {},
    mapLabels: [],
    questionImage: "",
    cueCard: "",
    speakingPrompts: [],
    followUpQuestions: []
  });
  
  // Available module types based on backend schema
  const moduleTypes = ["LISTENING", "READING", "WRITING", "SPEAKING"];
  const difficultyLevels = ["EASY", "MEDIUM", "HARD", "VERY_HARD"];
  
  // Get question types based on selected module type
  const getQuestionTypesByModule = (moduleType: string): QuestionType[] => {
    switch(moduleType) {
      case "READING":
        return [
          "MULTIPLE_CHOICE",
          "TRUE_FALSE",
          "SHORT_ANSWER",
          "ESSAY",
          "PARA_HEADINGS",
          "COMPLETE_SENTENCE",
          "NAME_MATCHING",
          "FILL_BLANK",
          "TRUE_FALSE_NOT_GIVEN",
          "YES_NO_NOT_GIVEN",
          "MAP"
        ];
      case "LISTENING":
        return [
          "MULTIPLE_CHOICE",
          "TRUE_FALSE",
          "SHORT_ANSWER", 
          "FILL_BLANK",
          "MAP"
        ];
      case "WRITING":
        return [
          "ESSAY"
        ];
      case "SPEAKING":
        return [
          "SPEAKING_TASK_1",
          "SPEAKING_TASK_2",
          "SPEAKING_TASK_3",
          "SPEAKING_FOLLOW_UPS"
        ];
      default:
        return [
          "MULTIPLE_CHOICE",
          "TRUE_FALSE",
          "SHORT_ANSWER"
        ];
    }
  };
  
  // Handle basic form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : type === "number" 
          ? parseInt(value, 10) 
          : value
    }));

    // When module type changes, update the current question type to be valid for the new module
    if (name === "moduleType") {
      const validQuestionTypes = getQuestionTypesByModule(value);
      
      // If current question type is not valid for the new module, change it to the first valid type
      if (!validQuestionTypes.includes(currentQuestion.type as QuestionType)) {
        setCurrentQuestion(prev => ({
          ...prev,
          type: validQuestionTypes[0]
        }));
      }
    }
  };
  
  // Handle question field changes
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: name === "points" ? parseInt(value, 10) : value
    }));
  };
  
  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    setCurrentQuestion(prev => {
      const updatedOptions = [...(prev.options || [])];
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
      options: [...(prev.options || []), ""]
    }));
  };
  
  // Remove option from multiple choice question
  const removeOption = (index: number) => {
    setCurrentQuestion(prev => {
      const updatedOptions = [...(prev.options || [])];
      updatedOptions.splice(index, 1);
      return {
        ...prev,
        options: updatedOptions
      };
    });
  };
  
  // Add current question to form
  const addQuestion = () => {
    // Validate question
    if (!currentQuestion.text.trim()) {
      setError("Question text is required");
      return;
    }
    
    // Validate based on question type
    if (currentQuestion.type === "MULTIPLE_CHOICE") {
      if (!currentQuestion.options?.some(opt => opt.trim())) {
        setError("At least one option is required");
        return;
      }
      if (currentQuestion.correctAnswer === "") {
        setError("Please select the correct answer");
        return;
      }
    } else if (currentQuestion.type === "TRUE_FALSE") {
      if (!currentQuestion.correctAnswer) {
        setError("Please select true or false as the correct answer");
        return;
      }
    } else if (currentQuestion.type === "SHORT_ANSWER") {
      if (!currentQuestion.correctAnswer) {
        setError("Please provide the correct answer");
        return;
      }
    }
    
    const questionId = `q-${Date.now()}`;
    
    // Create a clean copy of the question to add to form state
    const questionToAdd = {
      ...currentQuestion,
      id: questionId,
      // Filter out empty options for multiple choice questions
      options: currentQuestion.type === "MULTIPLE_CHOICE" 
        ? currentQuestion.options?.filter(opt => opt.trim()) 
        : currentQuestion.options
    };
    
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, questionToAdd]
    }));
    
    // Get the first valid question type for the current module
    const validQuestionTypes = getQuestionTypesByModule(form.moduleType);
    const defaultQuestionType = validQuestionTypes[0];
    
    // Reset current question with appropriate type for the current module
    setCurrentQuestion({
      id: "",
      text: "",
      type: defaultQuestionType,
      options: defaultQuestionType === "MULTIPLE_CHOICE" ? ["", "", "", ""] : [],
      correctAnswer: "",
      points: 1,
      passage: "",
      paragraphs: [],
      sentences: [],
      matchingPairs: {},
      mapLabels: [],
      questionImage: "",
      cueCard: "",
      speakingPrompts: [],
      followUpQuestions: []
    });
    
    setError("");
    setSuccessMessage("Question added successfully!");
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  
  // Remove question from form
  const removeQuestion = (id: string) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      
      // Validate form data
      if (!form.title.trim()) {
        setError("Test title is required");
        setLoading(false);
        return;
      }
      
      // Debug the current form data
      console.log("Submitting form data:", JSON.stringify(form, null, 2));
      
      // Prepare data for API - match exactly what the backend schema expects
      const testData = {
        title: form.title,
        description: form.description || "",
        difficulty: form.difficulty, // Use selected difficulty from form
        moduleType: form.moduleType,
        totalTime: Number(form.totalTime),
        totalQuestions: 0, // Will be updated as questions are added
        totalMarks: Number(form.passingScore),
        isPublished: form.isPublished
      };
      
      console.log("Sending to backend:", JSON.stringify(testData, null, 2));
      
      // Submit to API
      const response = await api.Tests.createTest(testData);
      console.log("Backend response:", JSON.stringify(response, null, 2));
      
      if (response.success) {
        // If there are questions, add them to the default section
        if (form.questions.length > 0 && response.data.sections && response.data.sections.length > 0) {
          const defaultSectionId = response.data.sections[0].id;
          
          // Add each question to the default section
          for (const question of form.questions) {
            // Prepare the question data based on its type
            const questionData = {
              questionText: question.text,
              questionType: question.type,
              options: question.type === "MULTIPLE_CHOICE" ? 
                JSON.stringify(question.options.filter(opt => opt.trim())) : 
                question.type === "TRUE_FALSE" ?
                JSON.stringify(["true", "false"]) :
                undefined,
              correctAnswer: question.type === "TRUE_FALSE" ? 
                question.correctAnswer.toLowerCase() : // Ensure lowercase for true/false answers
                question.correctAnswer,
              marks: question.points,
              order: form.questions.indexOf(question) + 1
            };
            
            // Add debugging logs
            console.log("Creating question with data:", JSON.stringify(questionData, null, 2));
            
            // Create the question in the section
            const questionResponse = await api.Tests.createQuestion(defaultSectionId, questionData);
            
            // Log the response from the question creation API
            console.log("Question creation response:", JSON.stringify(questionResponse, null, 2));
            
            if (!questionResponse.success) {
              console.error("Failed to create question:", questionResponse.message);
            }
          }
        }
        
        // Navigate to the test details page
        router.push(`/dashboard/tests/${response.data.id}`);
      } else {
        setError(response.message || "Failed to create test");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Error creating test:", err);
      setError(err.message || "Error creating test");
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Test</h1>
          <p className="mt-2 text-base text-gray-500">Create a new assessment test for your students</p>
        </div>
        <Link
          href="/dashboard/tests"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          Cancel
        </Link>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="relative">
          <div className="absolute inset-0 h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        </div>
        
        <div className="px-8 py-8">
          {/* Step indicator */}
          <nav className="mb-8" aria-label="Progress">
            <ol className="flex items-center">
              <li className="relative pr-8 sm:pr-20 flex-1">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${currentStep > 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-full ${
                    currentStep >= 1 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-white border-2 border-gray-300'
                  } ${currentStep === 1 ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
                  transition-all duration-200`}
                >
                  {currentStep > 1 ? (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium text-indigo-600">1</span>
                  )}
                  <span className="absolute top-12 text-sm font-medium text-gray-500">Basic Info</span>
                </button>
              </li>
              
              <li className="relative pr-8 sm:pr-20 flex-1">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className={`h-0.5 w-full ${currentStep > 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                </div>
                <button
                  onClick={() => form.title ? setCurrentStep(2) : setError("Test title is required")}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-full ${
                    currentStep >= 2 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-white border-2 border-gray-300'
                  } ${currentStep === 2 ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
                  transition-all duration-200 ${!form.title ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!form.title}
                >
                  {currentStep > 2 ? (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium text-gray-500">2</span>
                  )}
                  <span className="absolute top-12 text-sm font-medium text-gray-500">Questions</span>
                </button>
              </li>
              
              <li className="relative flex-1">
                <button
                  onClick={() => setCurrentStep(3)}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-full ${
                    currentStep >= 3 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-white border-2 border-gray-300'
                  } ${currentStep === 3 ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}
                  transition-all duration-200`}
                >
                  <span className="text-sm font-medium text-gray-500">3</span>
                  <span className="absolute top-12 text-sm font-medium text-gray-500">Review</span>
                </button>
              </li>
            </ol>
          </nav>
          
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
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
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
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-5 rounded-lg border border-indigo-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Basic Information</h2>
                  <p className="text-sm text-gray-500">Provide the basic details about your test</p>
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Test Title<span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={form.title}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                    placeholder="Enter test title"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={form.description}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                    placeholder="Provide a brief description of the test"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="totalTime" className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="totalTime"
                        id="totalTime"
                        min={1}
                        value={form.totalTime}
                        onChange={handleInputChange}
                        className="block w-full pl-4 pr-12 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="passingScore"
                        id="passingScore"
                        min={0}
                        max={100}
                        value={form.passingScore}
                        onChange={handleInputChange}
                        className="block w-full pl-4 pr-12 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="moduleType" className="block text-sm font-medium text-gray-700 mb-1">Module Type</label>
                    <select
                      name="moduleType"
                      id="moduleType"
                      value={form.moduleType}
                      onChange={handleInputChange}
                      className="block w-full pl-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                    >
                      {moduleTypes.map(type => (
                        <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                    <select
                      name="difficulty"
                      id="difficulty"
                      value={form.difficulty}
                      onChange={handleInputChange}
                      className="block w-full pl-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                    >
                      {difficultyLevels.map(level => (
                        <option key={level} value={level}>{level.charAt(0) + level.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        name="isPublished"
                        id="isPublished"
                        checked={form.isPublished}
                        onChange={handleInputChange}
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="isPublished" className="font-medium text-gray-700 cursor-pointer">
                        Publish immediately
                      </label>
                      <p className="text-sm text-gray-500 mt-1">Make this test available to students right away</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => form.title ? setCurrentStep(2) : setError("Test title is required")}
                      className="inline-flex justify-center items-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Next: Add Questions
                      <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Questions */}
            {currentStep === 2 && (
              <div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 rounded-lg border border-indigo-100 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Add Question</h3>
                  <p className="text-sm text-gray-500">Create questions for your test</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Question Text<span className="text-red-500">*</span></label>
                      <textarea
                        name="text"
                        id="text"
                        rows={2}
                        value={currentQuestion.text}
                        onChange={handleQuestionChange}
                        className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                        placeholder="Enter your question here"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                        <select
                          name="type"
                          id="type"
                          value={currentQuestion.type}
                          onChange={handleQuestionChange}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        >
                          {getQuestionTypesByModule(form.moduleType).map((type) => {
                            // Convert enum values to readable format
                            let displayName = "";
                            switch(type) {
                              case "MULTIPLE_CHOICE": displayName = "Multiple Choice"; break;
                              case "TRUE_FALSE": displayName = "True/False"; break;
                              case "SHORT_ANSWER": displayName = "Short Answer"; break;
                              case "ESSAY": displayName = "Essay"; break;
                              case "PARA_HEADINGS": displayName = "Para Headings"; break;
                              case "COMPLETE_SENTENCE": displayName = "Complete the Sentence"; break;
                              case "NAME_MATCHING": displayName = "Name Matching"; break;
                              case "FILL_BLANK": displayName = "Fill up the Blanks"; break;
                              case "TRUE_FALSE_NOT_GIVEN": displayName = "True/False/Not Given"; break;
                              case "YES_NO_NOT_GIVEN": displayName = "Yes/No/Not Given"; break;
                              case "MAP": displayName = "Map"; break;
                              case "SPEAKING_TASK_1": displayName = "Speaking - Introduction"; break;
                              case "SPEAKING_TASK_2": displayName = "Speaking - Cue Card"; break;
                              case "SPEAKING_TASK_3": displayName = "Speaking - Discussion"; break;
                              case "SPEAKING_FOLLOW_UPS": displayName = "Speaking - Follow Ups"; break;
                              default: displayName = type;
                            }
                            return (
                              <option key={type} value={type}>{displayName}</option>
                            );
                          })}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                        <input
                          type="number"
                          name="points"
                          id="points"
                          min={1}
                          value={currentQuestion.points}
                          onChange={handleQuestionChange}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
                        />
                      </div>
                    </div>
                    
                    {/* Options for multiple choice */}
                    {currentQuestion.type === "MULTIPLE_CHOICE" && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Answer Options</label>
                          {(currentQuestion.options?.length || 0) < 6 && (
                            <button
                              type="button"
                              onClick={addOption}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                              <svg className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                              Add Option
                            </button>
                          )}
                        </div>
                        {currentQuestion.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3 mb-3 group">
                            <div className="flex-shrink-0">
                              <input
                                type="radio"
                                name="correctAnswer"
                                checked={currentQuestion.correctAnswer === index.toString()}
                                onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: index.toString() }))}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                              />
                            </div>
                            <div className="flex-grow relative">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 pr-8"
                              />
                              {index > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(index)}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* True/False options */}
                    {currentQuestion.type === "TRUE_FALSE" && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Correct Answer</label>
                        <div className="flex space-x-6">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="answerTrue"
                              name="correctAnswer"
                              value="true"
                              checked={currentQuestion.correctAnswer === "true"}
                              onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "true" }))}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                            />
                            <label htmlFor="answerTrue" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                              True
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="answerFalse"
                              name="correctAnswer"
                              value="false"
                              checked={currentQuestion.correctAnswer === "false"}
                              onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "false" }))}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                            />
                            <label htmlFor="answerFalse" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                              False
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Short answer correct response */}
                    {currentQuestion.type === "SHORT_ANSWER" && (
                      <div className="mt-2">
                        <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                        <input
                          type="text"
                          name="correctAnswer"
                          id="correctAnswer"
                          value={currentQuestion.correctAnswer as string || ""}
                          onChange={handleQuestionChange}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          placeholder="Enter the expected answer"
                        />
                      </div>
                    )}
                    
                    {/* Reading Passage for Yes/No/Not Given and True/False/Not Given */}
                    {(currentQuestion.type === "YES_NO_NOT_GIVEN" || currentQuestion.type === "TRUE_FALSE_NOT_GIVEN" || 
                      currentQuestion.type === "PARA_HEADINGS" || currentQuestion.type === "COMPLETE_SENTENCE") && (
                      <div className="mt-2">
                        <label htmlFor="passage" className="block text-sm font-medium text-gray-700 mb-1">Reading Passage</label>
                        <textarea
                          name="passage"
                          id="passage"
                          rows={5}
                          value={currentQuestion.passage || ""}
                          onChange={handleQuestionChange}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          placeholder="Enter the reading passage"
                        />
                        
                        {/* Additional fields for Yes/No/Not Given */}
                        {currentQuestion.type === "YES_NO_NOT_GIVEN" && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Correct Answer</label>
                            <div className="flex space-x-6">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="answerYes"
                                  name="correctAnswer"
                                  value="yes"
                                  checked={currentQuestion.correctAnswer === "yes"}
                                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "yes" }))}
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                                />
                                <label htmlFor="answerYes" className="ml-2 block text-sm text-gray-700 cursor-pointer">Yes</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="answerNo"
                                  name="correctAnswer"
                                  value="no"
                                  checked={currentQuestion.correctAnswer === "no"}
                                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "no" }))}
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                                />
                                <label htmlFor="answerNo" className="ml-2 block text-sm text-gray-700 cursor-pointer">No</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="answerNotGiven"
                                  name="correctAnswer"
                                  value="not-given"
                                  checked={currentQuestion.correctAnswer === "not-given"}
                                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "not-given" }))}
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                                />
                                <label htmlFor="answerNotGiven" className="ml-2 block text-sm text-gray-700 cursor-pointer">Not Given</label>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Additional fields for True/False/Not Given */}
                        {currentQuestion.type === "TRUE_FALSE_NOT_GIVEN" && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Correct Answer</label>
                            <div className="flex space-x-6">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="answerTrue"
                                  name="correctAnswer"
                                  value="true"
                                  checked={currentQuestion.correctAnswer === "true"}
                                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "true" }))}
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                                />
                                <label htmlFor="answerTrue" className="ml-2 block text-sm text-gray-700 cursor-pointer">True</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="answerFalse"
                                  name="correctAnswer"
                                  value="false"
                                  checked={currentQuestion.correctAnswer === "false"}
                                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "false" }))}
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                                />
                                <label htmlFor="answerFalse" className="ml-2 block text-sm text-gray-700 cursor-pointer">False</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="answerTFNotGiven"
                                  name="correctAnswer"
                                  value="not-given"
                                  checked={currentQuestion.correctAnswer === "not-given"}
                                  onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "not-given" }))}
                                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-colors duration-200"
                                />
                                <label htmlFor="answerTFNotGiven" className="ml-2 block text-sm text-gray-700 cursor-pointer">Not Given</label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Para Headings */}
                    {currentQuestion.type === "PARA_HEADINGS" && (
                      <div className="mt-2">
                        <label htmlFor="paragraphs" className="block text-sm font-medium text-gray-700 mb-1">Paragraphs</label>
                        <textarea
                          name="paragraphs"
                          id="paragraphs"
                          rows={4}
                          value={Array.isArray(currentQuestion.paragraphs) ? currentQuestion.paragraphs.join('\n') : ''}
                          onChange={(e) => {
                            const paragraphs = e.target.value.split('\n').filter(p => p.trim() !== '');
                            setCurrentQuestion(prev => ({ ...prev, paragraphs }));
                          }}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          placeholder="Enter each paragraph on a new line"
                        />
                        <p className="mt-1 text-xs text-gray-500">Enter each paragraph on a new line</p>
                        
                        <div className="mt-3">
                          <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">Correct Heading</label>
                          <input
                            type="text"
                            name="correctAnswer"
                            id="correctAnswer"
                            value={currentQuestion.correctAnswer as string || ""}
                            onChange={handleQuestionChange}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="Enter the correct heading"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Complete the Sentence */}
                    {currentQuestion.type === "COMPLETE_SENTENCE" && (
                      <div className="mt-2">
                        <label htmlFor="sentences" className="block text-sm font-medium text-gray-700 mb-1">Incomplete Sentences</label>
                        <textarea
                          name="sentences"
                          id="sentences"
                          rows={4}
                          value={Array.isArray(currentQuestion.sentences) ? currentQuestion.sentences.join('\n') : ''}
                          onChange={(e) => {
                            const sentences = e.target.value.split('\n').filter(s => s.trim() !== '');
                            setCurrentQuestion(prev => ({ ...prev, sentences }));
                          }}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          placeholder="Enter incomplete sentences with '...' for blanks"
                        />
                        <p className="mt-1 text-xs text-gray-500">Use "..." to indicate where the sentence needs to be completed</p>
                        
                        <div className="mt-3">
                          <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                          <input
                            type="text"
                            name="correctAnswer"
                            id="correctAnswer"
                            value={currentQuestion.correctAnswer as string || ""}
                            onChange={handleQuestionChange}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="Enter the correct completion"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Name Matching */}
                    {currentQuestion.type === "NAME_MATCHING" && (
                      <div className="mt-2">
                        <label htmlFor="matchingPairs" className="block text-sm font-medium text-gray-700 mb-1">Matching Pairs</label>
                        <textarea
                          name="matchingPairs"
                          id="matchingPairs"
                          rows={4}
                          placeholder="Format: Name: Match (one per line)"
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          value={currentQuestion.matchingPairs ? Object.entries(currentQuestion.matchingPairs).map(([key, value]) => `${key}: ${value}`).join('\n') : ''}
                          onChange={(e) => {
                            const pairs = e.target.value.split('\n').filter(p => p.trim() !== '');
                            const matchingPairs: Record<string, string> = {};
                            pairs.forEach(pair => {
                              const [key, value] = pair.split(':').map(p => p.trim());
                              if (key && value) matchingPairs[key] = value;
                            });
                            setCurrentQuestion(prev => ({ ...prev, matchingPairs }));
                          }}
                        />
                        <p className="mt-1 text-xs text-gray-500">Enter each pair as "Name: Match" on a new line</p>
                        
                        <div className="mt-3">
                          <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                          <input
                            type="text"
                            name="correctAnswer"
                            id="correctAnswer"
                            value={currentQuestion.correctAnswer as string || ""}
                            onChange={handleQuestionChange}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="Enter the correct name-match pair"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Fill in the Blank */}
                    {currentQuestion.type === "FILL_BLANK" && (
                      <div className="mt-2">
                        <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                        <input
                          type="text"
                          name="correctAnswer"
                          id="correctAnswer"
                          value={currentQuestion.correctAnswer as string || ""}
                          onChange={handleQuestionChange}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          placeholder="Enter the correct answer"
                        />
                        <p className="mt-1 text-xs text-gray-500">For multiple blanks, separate answers with commas</p>
                      </div>
                    )}
                    
                    {/* Map */}
                    {currentQuestion.type === "MAP" && (
                      <div className="mt-2">
                        <label htmlFor="questionImage" className="block text-sm font-medium text-gray-700 mb-1">Map Image URL</label>
                        <input
                          type="text"
                          name="questionImage"
                          id="questionImage"
                          value={currentQuestion.questionImage || ""}
                          onChange={handleQuestionChange}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          placeholder="Enter the URL for the map image"
                        />
                        
                        <div className="mt-3">
                          <label htmlFor="mapLabels" className="block text-sm font-medium text-gray-700 mb-1">Map Labels</label>
                          <textarea
                            name="mapLabels"
                            id="mapLabels"
                            rows={4}
                            value={Array.isArray(currentQuestion.mapLabels) ? currentQuestion.mapLabels.join('\n') : ''}
                            onChange={(e) => {
                              const labels = e.target.value.split('\n').filter(l => l.trim() !== '');
                              setCurrentQuestion(prev => ({ ...prev, mapLabels: labels }));
                            }}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="Enter each map label on a new line"
                          />
                        </div>
                        
                        <div className="mt-3">
                          <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                          <input
                            type="text"
                            name="correctAnswer"
                            id="correctAnswer"
                            value={currentQuestion.correctAnswer as string || ""}
                            onChange={handleQuestionChange}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="Enter the correct label placement"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Speaking Tasks */}
                    {["SPEAKING_TASK_1", "SPEAKING_TASK_3"].includes(currentQuestion.type) && (
                      <div className="mt-2">
                        <label htmlFor="speakingPrompts" className="block text-sm font-medium text-gray-700 mb-1">Speaking Prompts</label>
                        <textarea
                          name="speakingPrompts"
                          id="speakingPrompts"
                          rows={4}
                          value={Array.isArray(currentQuestion.speakingPrompts) ? currentQuestion.speakingPrompts.join('\n') : ''}
                          onChange={(e) => {
                            const prompts = e.target.value.split('\n').filter(p => p.trim() !== '');
                            setCurrentQuestion(prev => ({ ...prev, speakingPrompts: prompts }));
                          }}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          placeholder="Enter each prompt on a new line"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {currentQuestion.type === "SPEAKING_TASK_1" 
                            ? "These are introductory questions like 'Tell me about yourself'" 
                            : "These are follow-up questions to the cue card topic"}
                        </p>
                      </div>
                    )}
                    
                    {/* Speaking - Cue Card */}
                    {currentQuestion.type === "SPEAKING_TASK_2" && (
                      <div className="mt-2">
                        <label htmlFor="cueCard" className="block text-sm font-medium text-gray-700 mb-1">Cue Card</label>
                        <textarea
                          name="cueCard"
                          id="cueCard"
                          rows={4}
                          value={currentQuestion.cueCard || ""}
                          onChange={handleQuestionChange}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          placeholder="Enter the cue card text"
                        />
                        
                        <div className="mt-3">
                          <label htmlFor="speakingPrompts" className="block text-sm font-medium text-gray-700 mb-1">Additional Prompts (Optional)</label>
                          <textarea
                            name="speakingPrompts"
                            id="speakingPrompts"
                            rows={3}
                            value={Array.isArray(currentQuestion.speakingPrompts) ? currentQuestion.speakingPrompts.join('\n') : ''}
                            onChange={(e) => {
                              const prompts = e.target.value.split('\n').filter(p => p.trim() !== '');
                              setCurrentQuestion(prev => ({ ...prev, speakingPrompts: prompts }));
                            }}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="Enter additional prompts (optional)"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Speaking - Follow Ups */}
                    {currentQuestion.type === "SPEAKING_FOLLOW_UPS" && (
                      <div className="mt-2">
                        <label htmlFor="followUpQuestions" className="block text-sm font-medium text-gray-700 mb-1">Follow-up Questions</label>
                        <textarea
                          name="followUpQuestions"
                          id="followUpQuestions"
                          rows={4}
                          value={Array.isArray(currentQuestion.followUpQuestions) ? currentQuestion.followUpQuestions.join('\n') : ''}
                          onChange={(e) => {
                            const questions = e.target.value.split('\n').filter(q => q.trim() !== '');
                            setCurrentQuestion(prev => ({ ...prev, followUpQuestions: questions }));
                          }}
                          className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                          placeholder="Enter each follow-up question on a new line"
                        />
                      </div>
                    )}
                    
                    <div className="pt-5">
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
                        disabled={!currentQuestion.text.trim()}
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Question
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* List of added questions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {form.questions.length} total
                    </span>
                  </div>
                  
                  {form.questions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No questions added</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating your first question above</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      {form.questions.map((question, index) => (
                        <li key={question.id} className="p-5 hover:bg-gray-50 transition-colors duration-150">
                          <div className="flex justify-between">
                            <div className="flex-1 pr-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                                  <span className="text-white text-xs font-medium">{index + 1}</span>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{question.text}</h4>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                      {question.type.replace("_", " ")}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {question.points} {question.points === 1 ? 'point' : 'points'}
                                    </span>
                                    {question.type === "MULTIPLE_CHOICE" && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {question.options?.length || 0} options
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => removeQuestion(question.id)}
                                className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                              >
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Next: Review
                      <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Review and Submit */}
            {currentStep === 3 && (
              <div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 rounded-lg border border-green-100 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Test Summary</h3>
                  <p className="text-sm text-gray-500">Review your test before submission</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Title</dt>
                      <dd className="mt-1 text-sm text-gray-900">{form.title}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          form.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {form.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Time Limit</dt>
                      <dd className="mt-1 text-sm text-gray-900">{form.totalTime} minutes</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Passing Score</dt>
                      <dd className="mt-1 text-sm text-gray-900">{form.passingScore}%</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Module Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{form.moduleType.charAt(0) + form.moduleType.slice(1).toLowerCase()}</dd>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900">{form.description || 'No description provided'}</dd>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Questions</dt>
                      <dd className="mt-1 text-sm text-gray-900 flex items-center">
                        <span>{form.questions.length} questions</span>
                        {form.questions.length > 0 && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Ready to submit
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                {form.questions.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Questions Preview</h4>
                    <div className="max-h-60 overflow-y-auto">
                      <ul className="divide-y divide-gray-200">
                        {form.questions.map((question, index) => (
                          <li key={question.id} className="py-3">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-xs font-medium">{index + 1}</span>
                              </div>
                              <div>
                                <p className="text-sm text-gray-900">{question.text}</p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {question.type.replace("_", " ")}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {question.points} {question.points === 1 ? 'point' : 'points'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Test...
                        </>
                      ) : (
                        <>
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8.586 10l4.293 4.293a1 1 0 010 1.414L10 11.414l4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Create Test
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 