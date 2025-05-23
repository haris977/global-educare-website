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
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-2">Create New Test</h1>
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
        <div className={`border rounded-lg p-4 ${currentStep === 1 ? 'block' : 'hidden'}`}>
          <h2 className="text-xl font-semibold mb-4">Test Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Module Type</label>
              <select
                name="moduleType"
                value={form.moduleType}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
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
              <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              >
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">CLB Score (1-12)</label>
              <input
                type="number"
                name="clbScore"
                value={form.clbScore}
                onChange={handleInputChange}
                min="1"
                max="12"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Test Time (minutes)</label>
              <input
                type="number"
                name="totalTime"
                value={form.totalTime}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                required
              />
            </div>
            
            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Publish Test Immediately
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Next: Add Sections & Questions
            </button>
          </div>
        </div>
        
        {/* Step 2: Sections and Questions */}
        <div className={`border rounded-lg p-4 ${currentStep === 2 ? 'block' : 'hidden'}`}>
          <h2 className="text-xl font-semibold mb-4">Sections and Questions</h2>
          
          {/* Section Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap border-b">
              {form.sections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  className={`px-4 py-2 font-medium ${
                    currentSectionIndex === index
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setCurrentSectionIndex(index)}
                >
                  {section.title}
                </button>
              ))}
              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 text-green-600 hover:text-green-800"
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
                  <label className="block text-sm font-medium text-gray-700">Section Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.sections[currentSectionIndex].title}
                    onChange={(e) => handleSectionChange(e, currentSectionIndex)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Limit (minutes)</label>
                  <input
                    type="number"
                    name="timeLimit"
                    value={form.sections[currentSectionIndex].timeLimit}
                    onChange={(e) => handleSectionChange(e, currentSectionIndex)}
                    min="1"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Section Instructions</label>
                <textarea
                  name="instructions"
                  value={form.sections[currentSectionIndex].instructions}
                  onChange={(e) => handleSectionChange(e, currentSectionIndex)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  rows={2}
                />
              </div>
              
              {/* Reading passage for reading module */}
              {form.moduleType === "READING" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Reading Passage</label>
                  <textarea
                    name="passage"
                    value={form.sections[currentSectionIndex].passage || ""}
                    onChange={(e) => handleSectionChange(e, currentSectionIndex)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    rows={6}
                    placeholder="Enter the reading passage for this section..."
                  />
                </div>
              )}
              
              <div className="flex justify-between mb-4">
                <button
                  type="button"
                  onClick={() => removeSection(currentSectionIndex)}
                  className="text-red-500 hover:text-red-700"
                  disabled={form.sections.length <= 1}
                >
                  Remove Section
                </button>
              </div>
              
              {/* Section questions */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">
                  Questions ({form.sections[currentSectionIndex].questions.length})
                </h3>
                
                {form.sections[currentSectionIndex].questions.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {form.sections[currentSectionIndex].questions.map((question, index) => (
                      <div key={question.id} className="border rounded p-3 bg-gray-50">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Q{index + 1}: {question.text}</h4>
                          <button 
                            type="button" 
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Type: {question.type}</p>
                          <p>Points: {question.points}</p>
                          {question.correctAnswer && <p>Correct Answer: {question.correctAnswer}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add new question form */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-medium mb-4">Add New Question</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Question Text</label>
                      <input
                        type="text"
                        name="text"
                        value={currentQuestion.text}
                        onChange={handleQuestionChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Question Type</label>
                      <select
                        name="type"
                        value={currentQuestion.type}
                        onChange={handleQuestionChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                      >
                        {getQuestionTypesByModule(form.moduleType).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    <input
                      type="number"
                      name="points"
                      value={currentQuestion.points}
                      onChange={handleQuestionChange}
                      min="1"
                      className="mt-1 block w-full md:w-1/4 border-gray-300 rounded-md shadow-sm p-2 border"
                    />
                  </div>
                  
                  {/* Question type specific fields */}
                  {currentQuestion.type === "MULTIPLE_CHOICE" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            value={index.toString()}
                            checked={currentQuestion.correctAnswer === index.toString()}
                            onChange={() => setCurrentQuestion(prev => ({
                              ...prev,
                              correctAnswer: index.toString()
                            }))}
                            className="mr-2"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border"
                            placeholder={`Option ${index + 1}`}
                          />
                          {index > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="ml-2 text-red-500"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addOption}
                        className="mt-2 text-blue-500 hover:text-blue-700"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}
                  
                  {currentQuestion.type === "TRUE_FALSE" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <div className="flex space-x-4">
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
                            className="mr-2"
                          />
                          <span>True</span>
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
                            className="mr-2"
                          />
                          <span>False</span>
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {(currentQuestion.type === "SHORT_ANSWER" || 
                    currentQuestion.type === "FILL_BLANK") && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        name="correctAnswer"
                        value={currentQuestion.correctAnswer as string || ""}
                        onChange={handleQuestionChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                      />
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
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
              className="text-blue-500 hover:text-blue-700"
            >
              &larr; Back to Test Information
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Creating Test..." : "Create Test"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 