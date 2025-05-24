"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

interface Section {
  id: string;
  title: string;
  instructions: string;
  timeLimit: number;
  passage?: string;
  questions: Question[];
}

interface TestForm {
  title: string;
  description: string;
  totalTime: number;
  isPublished: boolean;
  sections: Section[];
  moduleType: string;
  difficulty: string;
  clbScore: number;
}

export default function CreateTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleTypeParam = searchParams.get('moduleType');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  // CSS styles inside the component
  const inputStyle = "text-gray-900 font-medium";
  const selectStyle = "text-gray-900 font-medium appearance-none bg-white pr-10 bg-select-arrow bg-no-repeat bg-right";
  
  // Add style JSX for global styles
  const StyleJSX = () => (
    <style jsx global>{`
      input::placeholder,
      textarea::placeholder {
        color: #6B7280 !important;
        opacity: 1 !important;
      }
      
      select {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }
    `}</style>
  );
  
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
          "PARA_HEADINGS",
          "COMPLETE_SENTENCE",
          "NAME_MATCHING",
          "FILL_BLANK",
          "TRUE_FALSE_NOT_GIVEN",
          "YES_NO_NOT_GIVEN"
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
          "TRUE_FALSE"
        ];
    }
  };
  
  // Initial form state
  const [form, setForm] = useState<TestForm>({
    title: "",
    description: "",
    totalTime: 60,
    isPublished: false,
    sections: [{
      id: crypto.randomUUID(),
      title: "Section 1",
      instructions: "",
      timeLimit: 20,
      passage: "",
      questions: []
    }],
    moduleType: moduleTypeParam || "READING",
    difficulty: "MEDIUM",
    clbScore: 7
  });
  
  // Update form if moduleType changes in URL
  useEffect(() => {
    if (moduleTypeParam) {
      setForm(prev => ({
        ...prev,
        moduleType: moduleTypeParam
      }));
    }
  }, [moduleTypeParam]);
  
  // Get initial question type based on current module
  const getInitialQuestionType = (): QuestionType => {
    const validTypes = getQuestionTypesByModule(moduleTypeParam || "READING");
    return validTypes[0];
  };
  
  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: crypto.randomUUID(),
    text: "",
    type: getInitialQuestionType(),
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

  // Handle section field changes
  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, sectionIndex: number) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setForm(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        [name]: type === "number" ? parseInt(value, 10) : value
      };
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
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
    setCurrentQuestion(prev => {
      const updatedOptions = [...(prev.options || []), ""];
      return {
        ...prev,
        options: updatedOptions
      };
    });
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
  
  // Add section
  const addSection = () => {
    setForm(prev => {
      return {
        ...prev,
        sections: [
          ...prev.sections,
          {
            id: crypto.randomUUID(),
            title: `Section ${prev.sections.length + 1}`,
            instructions: "",
            timeLimit: 20,
            passage: "",
            questions: []
          }
        ]
      };
    });
    
    // Switch to the new section
    setCurrentSectionIndex(form.sections.length);
  };
  
  // Remove section
  const removeSection = (index: number) => {
    if (form.sections.length <= 1) {
      setError("Test must have at least one section");
      return;
    }
    
    setForm(prev => {
      const updatedSections = [...prev.sections];
      updatedSections.splice(index, 1);
      
      // Rename sections to maintain sequence
      const renamedSections = updatedSections.map((section, idx) => ({
        ...section,
        title: `Section ${idx + 1}`
      }));
      
      return {
        ...prev,
        sections: renamedSections
      };
    });
    
    // Adjust current section index if needed
    if (index <= currentSectionIndex) {
      setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1));
    }
  };
  
  // Add question to current section
  const addQuestion = () => {
    setForm(prev => {
      const updatedSections = [...prev.sections];
      const currentSection = updatedSections[currentSectionIndex];
      
      currentSection.questions = [
        ...currentSection.questions,
        {
          ...currentQuestion,
          id: crypto.randomUUID(),
          text: currentQuestion.text || `Question ${currentSection.questions.length + 1}`
        }
      ];
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
    
    // Reset current question
    setCurrentQuestion({
      id: crypto.randomUUID(),
      text: "",
      type: getInitialQuestionType(),
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
    
    setSuccessMessage("Question added successfully!");
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };
  
  // Remove question from current section
  const removeQuestion = (questionId: string) => {
    setForm(prev => {
      const updatedSections = [...prev.sections];
      const currentSection = updatedSections[currentSectionIndex];
      
      currentSection.questions = currentSection.questions.filter(q => q.id !== questionId);
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Calculate total questions
      const totalQuestions = form.sections.reduce((sum, section) => sum + section.questions.length, 0);
      
      if (totalQuestions === 0) {
        setError("Test must have at least one question");
        setLoading(false);
        return;
      }
      
      // Create the test first
      const testResponse = await api.Tests.createTest({
        title: form.title,
        description: form.description,
        difficulty: form.difficulty,
        moduleType: form.moduleType,
        totalTime: form.totalTime,
        clbScore: form.clbScore,
        isPublished: form.isPublished
      });
      
      const testId = testResponse.data.id;
      
      // Delete the default section that was created automatically
      if (testResponse.data.sections && testResponse.data.sections.length > 0) {
        const defaultSectionId = testResponse.data.sections[0].id;
        await api.Tests.deleteSection(defaultSectionId);
      }
      
      // Create each section
      for (const [index, section] of form.sections.entries()) {
        const sectionResponse = await api.Tests.createSection(testId, {
          title: section.title,
          instructions: section.instructions,
          order: index + 1,
          timeLimit: section.timeLimit
        });
        
        const sectionId = sectionResponse.data.id;
        
        // Create questions for this section
        for (const [qIndex, question] of section.questions.entries()) {
          // Map frontend question structure to backend structure
          const questionData: any = {
            questionText: question.text,
            questionType: question.type,
            order: qIndex + 1,
            marks: question.points,
            options: question.options && question.options.length > 0 ? question.options : undefined,
            correctAnswer: question.correctAnswer || undefined
          };
          
          // Add passage if provided (for reading sections)
          if (form.moduleType === "READING" && section.passage) {
            questionData.passage = section.passage;
          }
          
          // Add other type-specific fields
          if (question.type === "PARA_HEADINGS" && question.paragraphs) {
            questionData.paragraphs = question.paragraphs;
          } else if (question.type === "COMPLETE_SENTENCE" && question.sentences) {
            questionData.sentences = question.sentences;
          } else if (question.type === "NAME_MATCHING" && question.matchingPairs) {
            questionData.matchingPairs = question.matchingPairs;
          } else if (question.type === "MAP" && question.mapLabels) {
            questionData.mapLabels = question.mapLabels;
          } else if (question.type === "SPEAKING_TASK_2" && question.cueCard) {
            questionData.cueCard = question.cueCard;
          } else if (["SPEAKING_TASK_1", "SPEAKING_TASK_3"].includes(question.type) && question.speakingPrompts) {
            questionData.speakingPrompts = question.speakingPrompts;
          } else if (question.type === "SPEAKING_FOLLOW_UPS" && question.followUpQuestions) {
            questionData.followUpQuestions = question.followUpQuestions;
          }
          
          await api.Tests.createQuestion(sectionId, questionData);
        }
      }
      
      setSuccessMessage("Test created successfully!");
      
      // Navigate to the test list page
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      
    } catch (error) {
      console.error("Error creating test:", error);
      setError("Failed to create test. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // UI component for test creation
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <StyleJSX />
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-2 text-gray-900">Create New Test</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Test Information */}
        <div className={`border rounded-lg p-6 shadow-sm bg-white ${currentStep === 1 ? 'block' : 'hidden'}`}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Test Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Test Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${inputStyle}`}
                required
                placeholder="Enter test title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Module Type</label>
              <select
                name="moduleType"
                value={form.moduleType}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectStyle}`}
                required
              >
                {moduleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Difficulty Level</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${selectStyle}`}
              >
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">CLB Score (1-12)</label>
              <input
                type="number"
                name="clbScore"
                value={form.clbScore}
                onChange={handleInputChange}
                min="1"
                max="12"
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${inputStyle}`}
                placeholder="Enter CLB score (1-12)"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${inputStyle}`}
              rows={3}
              placeholder="Describe the test content and purpose"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Total Test Time (minutes)</label>
              <input
                type="number"
                name="totalTime"
                value={form.totalTime}
                onChange={handleInputChange}
                min="1"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                required
                placeholder="Enter time in minutes"
              />
            </div>
            
            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-base text-gray-800 font-medium">
                Publish Test Immediately
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm"
            >
              Next: Add Sections & Questions
            </button>
          </div>
        </div>
        
        {/* Step 2: Sections and Questions */}
        <div className={`border rounded-lg p-6 shadow-sm bg-white ${currentStep === 2 ? 'block' : 'hidden'}`}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Sections and Questions</h2>
          
          {/* Section Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap border-b border-gray-300">
              {form.sections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  className={`px-4 py-3 font-medium ${
                    currentSectionIndex === index
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800 hover:border-b hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentSectionIndex(index)}
                >
                  {section.title}
                </button>
              ))}
              <button
                type="button"
                onClick={addSection}
                className="px-4 py-3 text-green-600 hover:text-green-800 font-medium"
              >
                + Add Section
              </button>
            </div>
          </div>
          
          {/* Current Section */}
          {form.sections[currentSectionIndex] && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Section Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.sections[currentSectionIndex].title}
                    onChange={(e) => handleSectionChange(e, currentSectionIndex)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                    required
                    placeholder="Enter section title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Time Limit (minutes)</label>
                  <input
                    type="number"
                    name="timeLimit"
                    value={form.sections[currentSectionIndex].timeLimit}
                    onChange={(e) => handleSectionChange(e, currentSectionIndex)}
                    min="1"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                    required
                    placeholder="Enter time in minutes"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-800 mb-1">Section Instructions</label>
                <textarea
                  name="instructions"
                  value={form.sections[currentSectionIndex].instructions}
                  onChange={(e) => handleSectionChange(e, currentSectionIndex)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                  rows={2}
                  placeholder="Enter instructions for this section"
                />
              </div>
              
              {/* Reading passage for reading module */}
              {form.moduleType === "READING" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-800 mb-1">Reading Passage</label>
                  <textarea
                    name="passage"
                    value={form.sections[currentSectionIndex].passage || ""}
                    onChange={(e) => handleSectionChange(e, currentSectionIndex)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                    rows={6}
                    placeholder="Enter the reading passage for this section..."
                  />
                </div>
              )}
              
              <div className="flex justify-between mb-4">
                <button
                  type="button"
                  onClick={() => removeSection(currentSectionIndex)}
                  className="text-red-500 hover:text-red-700 font-medium"
                  disabled={form.sections.length <= 1}
                >
                  Remove Section
                </button>
              </div>
              
              {/* Section questions */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-900">
                  Questions ({form.sections[currentSectionIndex].questions.length})
                </h3>
                
                {form.sections[currentSectionIndex].questions.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {form.sections[currentSectionIndex].questions.map((question, index) => (
                      <div key={question.id} className="border rounded p-4 bg-gray-50 shadow-sm">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900">Q{index + 1}: {question.text}</h4>
                          <button 
                            type="button" 
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm text-gray-700 mt-2">
                          <p><span className="font-medium">Type:</span> {question.type}</p>
                          <p><span className="font-medium">Points:</span> {question.points}</p>
                          {question.correctAnswer && <p><span className="font-medium">Correct Answer:</span> {question.correctAnswer}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add new question form */}
                <div className="border rounded-lg p-5 bg-gray-50 shadow-sm">
                  <h3 className="text-lg font-medium mb-4 text-gray-900">Add New Question</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">Question Text</label>
                      <input
                        type="text"
                        name="text"
                        value={currentQuestion.text}
                        onChange={handleQuestionChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                        placeholder="Enter your question text here"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">Question Type</label>
                      <select
                        name="type"
                        value={currentQuestion.type}
                        onChange={handleQuestionChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 select-improved"
                      >
                        {getQuestionTypesByModule(form.moduleType).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-800 mb-1">Points</label>
                    <input
                      type="number"
                      name="points"
                      value={currentQuestion.points}
                      onChange={handleQuestionChange}
                      min="1"
                      className="block w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                      placeholder="Points"
                    />
                  </div>
                  
                  {/* Question type specific fields */}
                  {currentQuestion.type === "MULTIPLE_CHOICE" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Options
                      </label>
                      
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center mb-3">
                          <input
                            type="radio"
                            name="correctAnswer"
                            value={index.toString()}
                            checked={currentQuestion.correctAnswer === index.toString()}
                            onChange={() => setCurrentQuestion(prev => ({
                              ...prev,
                              correctAnswer: index.toString()
                            }))}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                            placeholder={`Option ${index + 1}`}
                          />
                          {index > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="ml-2 text-red-500 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addOption}
                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Option
                      </button>
                    </div>
                  )}
                  
                  {currentQuestion.type === "TRUE_FALSE" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Correct Answer
                      </label>
                      <div className="flex space-x-6">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="correctAnswer"
                            value="true"
                            checked={currentQuestion.correctAnswer === "true"}
                            onChange={() => setCurrentQuestion(prev => ({
                              ...prev,
                              correctAnswer: "true"
                            }))}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-800">True</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="correctAnswer"
                            value="false"
                            checked={currentQuestion.correctAnswer === "false"}
                            onChange={() => setCurrentQuestion(prev => ({
                              ...prev,
                              correctAnswer: "false"
                            }))}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-800">False</span>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {(currentQuestion.type === "SHORT_ANSWER" || 
                    currentQuestion.type === "FILL_BLANK") && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        name="correctAnswer"
                        value={currentQuestion.correctAnswer as string || ""}
                        onChange={handleQuestionChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                        placeholder="Enter the correct answer"
                      />
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 font-medium shadow-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Test Information
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Test...
                </span>
              ) : "Create Test"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 