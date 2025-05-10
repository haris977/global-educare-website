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
  passage?: string;
  paragraphs?: string;
  sentences?: string;
  matchingPairs?: string;
  mapLabels?: string;
  questionImage?: string;
  cueCard?: string;
  speakingPrompts?: string;
  followUpQuestions?: string;
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
  moduleType: string;
  description?: string;
  difficulty?: string;
  totalTime?: number;
  totalMarks?: number;
  totalQuestions?: number;
  isPublished?: boolean;
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
  
  // Get available question types based on module type
  const getQuestionTypesByModuleType = (moduleType: string) => {
    console.log(`Filtering question types for module: ${moduleType}`);
    
    switch(moduleType) {
      case 'READING':
        return [
          { value: "MULTIPLE_CHOICE", label: "MCQ" },
          { value: "PARA_HEADINGS", label: "Para Headings" },
          { value: "COMPLETE_SENTENCE", label: "Complete the Sentence" },
          { value: "NAME_MATCHING", label: "Name Matching" },
          { value: "FILL_BLANK", label: "Fill up the Blanks" },
          { value: "TRUE_FALSE_NOT_GIVEN", label: "True/False/Not Given" },
          { value: "YES_NO_NOT_GIVEN", label: "Yes/No/Not Given" }
        ];
      case 'LISTENING':
        return [
          { value: "MULTIPLE_CHOICE", label: "MCQ" },
          { value: "FILL_BLANK", label: "Blanks" },
          { value: "TRUE_FALSE", label: "True/False" },
          { value: "MAP", label: "Map" }
        ];
      case 'SPEAKING':
        return [
          { value: "SPEAKING_TASK_1", label: "Introduction" },
          { value: "SPEAKING_TASK_2", label: "Cue Card" },
          { value: "SPEAKING_TASK_3", label: "Discussion" },
          { value: "SPEAKING_FOLLOW_UPS", label: "Follow Ups" }
        ];
      default:
        // Return all question types for other module types
        return [
          { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
          { value: "TRUE_FALSE", label: "True/False" },
          { value: "SHORT_ANSWER", label: "Short Answer" },
          { value: "ESSAY", label: "Essay" },
          { value: "PARA_HEADINGS", label: "Para Headings" },
          { value: "COMPLETE_SENTENCE", label: "Complete the Sentence" },
          { value: "NAME_MATCHING", label: "Name Matching" },
          { value: "FILL_BLANK", label: "Fill up the Blanks" },
          { value: "TRUE_FALSE_NOT_GIVEN", label: "True/False/Not Given" },
          { value: "YES_NO_NOT_GIVEN", label: "Yes/No/Not Given" },
          { value: "MAP", label: "Map" },
          { value: "SPEAKING_TASK_1", label: "Speaking - Introduction" },
          { value: "SPEAKING_TASK_2", label: "Speaking - Cue Card" },
          { value: "SPEAKING_TASK_3", label: "Speaking - Discussion" },
          { value: "SPEAKING_FOLLOW_UPS", label: "Speaking - Follow Ups" }
        ];
    }
  };

  // Available question types based on test module type
  const [availableQuestionTypes, setAvailableQuestionTypes] = useState<{value: string, label: string}[]>([]);

  // Current question form state
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    questionType: "MULTIPLE_CHOICE",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
    order: 0,
    passage: "",
    paragraphs: "",
    sentences: "",
    matchingPairs: "",
    mapLabels: "",
    questionImage: "",
    cueCard: "",
    speakingPrompts: "",
    followUpQuestions: ""
  });
  
  // Fetch test, section and questions data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get test data
        const testResponse = await api.Tests.getTestById(testId);
        console.log("Test response data:", JSON.stringify(testResponse.data, null, 2));
        
        if (testResponse.success && testResponse.data) {
          // Log the module type clearly for debugging
          console.log(`MODULE TYPE: ${testResponse.data.moduleType}`);
          
          // Store test data with moduleType
          const testData = {
            id: testResponse.data.id,
            title: testResponse.data.title,
            moduleType: testResponse.data.moduleType
          };
          
          setTest(testData);
          console.log("Set test data with moduleType:", testData.moduleType);
          
          // Set question type based on module
          let defaultType = 'MULTIPLE_CHOICE';
          if (testResponse.data.moduleType === 'SPEAKING') {
            defaultType = 'SPEAKING_TASK_1';
          }
          
          setCurrentQuestion(prev => ({
            ...prev,
            questionType: defaultType
          }));
          
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
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Filter out empty options first
      const filteredOptions = currentQuestion.options.filter(opt => opt.trim());
      
      // Prepare the question data
      const questionData = {
        questionText: currentQuestion.questionText,
        questionType: currentQuestion.questionType,
        // For multiple choice, properly format the options as expected by the backend
        options: currentQuestion.questionType === "MULTIPLE_CHOICE" || 
                 currentQuestion.questionType === "NAME_MATCHING" ? 
                 JSON.stringify(filteredOptions) : undefined,
        // Format correctAnswer based on question type
        correctAnswer: 
          currentQuestion.questionType === "MULTIPLE_CHOICE" && filteredOptions[parseInt(currentQuestion.correctAnswer)]
            ? filteredOptions[parseInt(currentQuestion.correctAnswer)] // For multiple choice, send the actual option text
            : currentQuestion.correctAnswer, // For other question types, send as is
        marks: currentQuestion.marks,
        order: questions.length + 1,
        // Include additional fields based on question type
        passage: ["YES_NO_NOT_GIVEN", "TRUE_FALSE_NOT_GIVEN", "PARA_HEADINGS", "COMPLETE_SENTENCE"].includes(currentQuestion.questionType) ? 
                 currentQuestion.passage : undefined,
        paragraphs: currentQuestion.questionType === "PARA_HEADINGS" ? 
                   currentQuestion.paragraphs : undefined,
        sentences: currentQuestion.questionType === "COMPLETE_SENTENCE" ? 
                  currentQuestion.sentences : undefined,
        matchingPairs: currentQuestion.questionType === "NAME_MATCHING" ? 
                      currentQuestion.matchingPairs : undefined,
        mapLabels: currentQuestion.questionType === "MAP" ? 
                  currentQuestion.mapLabels : undefined,
        questionImage: currentQuestion.questionType === "MAP" ? 
                      currentQuestion.questionImage : undefined,
        cueCard: currentQuestion.questionType === "SPEAKING_TASK_2" ? 
                currentQuestion.cueCard : undefined,
        speakingPrompts: ["SPEAKING_TASK_1", "SPEAKING_TASK_2", "SPEAKING_TASK_3"].includes(currentQuestion.questionType) ? 
                        currentQuestion.speakingPrompts : undefined,
        followUpQuestions: currentQuestion.questionType === "SPEAKING_FOLLOW_UPS" ? 
                          currentQuestion.followUpQuestions : undefined
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
          order: 0,
          passage: "",
          paragraphs: "",
          sentences: "",
          matchingPairs: "",
          mapLabels: "",
          questionImage: "",
          cueCard: "",
          speakingPrompts: "",
          followUpQuestions: ""
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
        // Remove question from list
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
  
  // Helper function to get the question types directly
  const getOptionsForModuleType = (moduleType: string) => {
    if (moduleType === 'READING') {
      return (
        <>
          <option value="MULTIPLE_CHOICE">MCQ</option>
          <option value="PARA_HEADINGS">Para Headings</option>
          <option value="COMPLETE_SENTENCE">Complete the Sentence</option>
          <option value="NAME_MATCHING">Name Matching</option>
          <option value="FILL_BLANK">Fill up the Blanks</option>
          <option value="TRUE_FALSE_NOT_GIVEN">True/False/Not Given</option>
          <option value="YES_NO_NOT_GIVEN">Yes/No/Not Given</option>
        </>
      );
    } 
    else if (moduleType === 'LISTENING') {
      return (
        <>
          <option value="MULTIPLE_CHOICE">MCQ</option>
          <option value="FILL_BLANK">Blanks</option>
          <option value="TRUE_FALSE">True/False</option>
          <option value="MAP">Map</option>
        </>
      );
    } 
    else if (moduleType === 'SPEAKING') {
      return (
        <>
          <option value="SPEAKING_TASK_1">Introduction</option>
          <option value="SPEAKING_TASK_2">Cue Card</option>
          <option value="SPEAKING_TASK_3">Discussion</option>
          <option value="SPEAKING_FOLLOW_UPS">Follow Ups</option>
        </>
      );
    } 
    else {
      // Default options if module type is not recognized
      return (
        <>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="TRUE_FALSE">True/False</option>
          <option value="SHORT_ANSWER">Short Answer</option>
          <option value="ESSAY">Essay</option>
        </>
      );
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {test?.title} - {section?.title}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage questions for this section
          </p>
        </div>
        <Link
          href={`/dashboard/tests/${testId}`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Test
        </Link>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Question</h2>
        
        <div className="space-y-6">
          {/* Question Text */}
          <div>
            <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-1">
              Question Text<span className="text-red-500">*</span>
            </label>
            <textarea
              id="questionText"
              name="questionText"
              rows={3}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your question here..."
              value={currentQuestion.questionText}
              onChange={handleQuestionChange}
            />
          </div>
          
          {/* Question Type */}
          <div>
            <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mb-1">
              Question Type<span className="text-red-500">*</span>
            </label>
            <select
              id="questionType"
              name="questionType"
              className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={currentQuestion.questionType}
              onChange={handleQuestionChange}
            >
              {test?.moduleType ? getOptionsForModuleType(test.moduleType) : (
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              )}
            </select>
          </div>
          
          {/* Question Marks */}
          <div>
            <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
              Points/Marks<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="marks"
              name="marks"
              min={1}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={currentQuestion.marks}
              onChange={handleQuestionChange}
            />
          </div>
          
          {/* Options for Multiple Choice */}
          {currentQuestion.questionType === "MULTIPLE_CHOICE" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Options<span className="text-red-500">*</span>
              </label>
              
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6">
                    <input
                      type="radio"
                      id={`correct-${index}`}
                      name="correctAnswer"
                      value={index.toString()}
                      checked={currentQuestion.correctAnswer === index.toString()}
                      onChange={() => setCurrentQuestion(prev => ({
                        ...prev,
                        correctAnswer: index.toString()
                      }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                  </div>
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="flex-shrink-0 p-2 text-red-500 hover:text-red-700"
                    title="Remove option"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Option
              </button>
            </div>
          )}
          
          {/* Options for True/False */}
          {currentQuestion.questionType === "TRUE_FALSE" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Correct Answer<span className="text-red-500">*</span>
              </label>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    id="true-option"
                    name="correctAnswer"
                    type="radio"
                    value="true"
                    checked={currentQuestion.correctAnswer === "true"}
                    onChange={handleQuestionChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="true-option" className="ml-2 block text-sm text-gray-700">
                    True
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="false-option"
                    name="correctAnswer"
                    type="radio"
                    value="false"
                    checked={currentQuestion.correctAnswer === "false"}
                    onChange={handleQuestionChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="false-option" className="ml-2 block text-sm text-gray-700">
                    False
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Correct Answer for Short Answer */}
          {currentQuestion.questionType === "SHORT_ANSWER" && (
            <div>
              <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                Correct Answer<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="correctAnswer"
                name="correctAnswer"
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter the correct answer"
                value={currentQuestion.correctAnswer}
                onChange={handleQuestionChange}
              />
            </div>
          )}
          
          {/* No correct answer needed for Essay */}
          {currentQuestion.questionType === "ESSAY" && (
            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Essay questions require manual grading after submission.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Reading Passage for Yes/No/Not Given and True/False/Not Given */}
          {(currentQuestion.questionType === "YES_NO_NOT_GIVEN" || currentQuestion.questionType === "TRUE_FALSE_NOT_GIVEN") && (
            <div>
              <label htmlFor="passage" className="block text-sm font-medium text-gray-700 mb-1">
                Reading Passage<span className="text-red-500">*</span>
              </label>
              <textarea
                id="passage"
                name="passage"
                rows={5}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter the reading passage"
                value={currentQuestion.passage}
                onChange={handleQuestionChange}
              />
              {(currentQuestion.questionType === "YES_NO_NOT_GIVEN") && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer<span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        id="yes-option"
                        name="correctAnswer"
                        type="radio"
                        value="yes"
                        checked={currentQuestion.correctAnswer === "yes"}
                        onChange={handleQuestionChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="yes-option" className="ml-2 block text-sm text-gray-700">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="no-option"
                        name="correctAnswer"
                        type="radio"
                        value="no"
                        checked={currentQuestion.correctAnswer === "no"}
                        onChange={handleQuestionChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="no-option" className="ml-2 block text-sm text-gray-700">
                        No
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="not-given-option"
                        name="correctAnswer"
                        type="radio"
                        value="not-given"
                        checked={currentQuestion.correctAnswer === "not-given"}
                        onChange={handleQuestionChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="not-given-option" className="ml-2 block text-sm text-gray-700">
                        Not Given
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {(currentQuestion.questionType === "TRUE_FALSE_NOT_GIVEN") && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer<span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        id="true-option"
                        name="correctAnswer"
                        type="radio"
                        value="true"
                        checked={currentQuestion.correctAnswer === "true"}
                        onChange={handleQuestionChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="true-option" className="ml-2 block text-sm text-gray-700">
                        True
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="false-option"
                        name="correctAnswer"
                        type="radio"
                        value="false"
                        checked={currentQuestion.correctAnswer === "false"}
                        onChange={handleQuestionChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="false-option" className="ml-2 block text-sm text-gray-700">
                        False
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="ng-option"
                        name="correctAnswer"
                        type="radio"
                        value="not-given"
                        checked={currentQuestion.correctAnswer === "not-given"}
                        onChange={handleQuestionChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="ng-option" className="ml-2 block text-sm text-gray-700">
                        Not Given
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Para Headings */}
          {currentQuestion.questionType === "PARA_HEADINGS" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="passage" className="block text-sm font-medium text-gray-700 mb-1">
                  Reading Passage<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="passage"
                  name="passage"
                  rows={5}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter the reading passage"
                  value={currentQuestion.passage}
                  onChange={handleQuestionChange}
                />
              </div>
              <div>
                <label htmlFor="paragraphs" className="block text-sm font-medium text-gray-700 mb-1">
                  Paragraphs<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="paragraphs"
                  name="paragraphs"
                  rows={4}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter paragraphs separated by new lines"
                  value={currentQuestion.paragraphs}
                  onChange={handleQuestionChange}
                />
                <p className="mt-1 text-xs text-gray-500">Enter each paragraph on a new line</p>
              </div>
              <div>
                <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Headings (as JSON)<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="correctAnswer"
                  name="correctAnswer"
                  rows={3}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder='{"0": "Heading A", "1": "Heading B"}'
                  value={currentQuestion.correctAnswer}
                  onChange={handleQuestionChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  JSON mapping paragraph index to heading. Example: {"0": "Heading A", "1": "Heading B"}
                </p>
              </div>
            </div>
          )}
          
          {/* Complete the Sentence */}
          {currentQuestion.questionType === "COMPLETE_SENTENCE" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="passage" className="block text-sm font-medium text-gray-700 mb-1">
                  Reading Passage<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="passage"
                  name="passage"
                  rows={5}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter the reading passage"
                  value={currentQuestion.passage}
                  onChange={handleQuestionChange}
                />
              </div>
              <div>
                <label htmlFor="sentences" className="block text-sm font-medium text-gray-700 mb-1">
                  Incomplete Sentences<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="sentences"
                  name="sentences"
                  rows={4}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter incomplete sentences with '...' for blanks"
                  value={currentQuestion.sentences}
                  onChange={handleQuestionChange}
                />
                <p className="mt-1 text-xs text-gray-500">Use "..." to indicate where the sentence needs to be completed</p>
              </div>
              <div>
                <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="correctAnswer"
                  name="correctAnswer"
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter the correct completion"
                  value={currentQuestion.correctAnswer}
                  onChange={handleQuestionChange}
                />
              </div>
            </div>
          )}
          
          {/* Name Matching */}
          {currentQuestion.questionType === "NAME_MATCHING" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="passage" className="block text-sm font-medium text-gray-700 mb-1">
                  Reading Passage<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="passage"
                  name="passage"
                  rows={5}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter the reading passage"
                  value={currentQuestion.passage}
                  onChange={handleQuestionChange}
                />
              </div>
              <div>
                <label htmlFor="matchingPairs" className="block text-sm font-medium text-gray-700 mb-1">
                  Matching Pairs<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="matchingPairs"
                  name="matchingPairs"
                  rows={4}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Format: Name: Match (one per line)"
                  value={currentQuestion.matchingPairs}
                  onChange={handleQuestionChange}
                />
                <p className="mt-1 text-xs text-gray-500">Enter each pair as "Name: Match" on a new line</p>
              </div>
              <div>
                <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="correctAnswer"
                  name="correctAnswer"
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter the correct name-match pair"
                  value={currentQuestion.correctAnswer}
                  onChange={handleQuestionChange}
                />
              </div>
            </div>
          )}
          
          {/* Fill in the Blanks */}
          {currentQuestion.questionType === "FILL_BLANK" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="passage" className="block text-sm font-medium text-gray-700 mb-1">
                  Reading Passage<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="passage"
                  name="passage"
                  rows={5}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter the reading passage"
                  value={currentQuestion.passage}
                  onChange={handleQuestionChange}
                />
              </div>
              <div>
                <label htmlFor="sentences" className="block text-sm font-medium text-gray-700 mb-1">
                  Sentences with Blanks<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="sentences"
                  name="sentences"
                  rows={3}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter sentences with [BLANK] placeholders, one per line"
                  value={currentQuestion.sentences}
                  onChange={handleQuestionChange}
                />
                <p className="mt-1 text-xs text-gray-500">Use [BLANK] to indicate fill-in spots. Example: 'The capital of France is [BLANK].'</p>
              </div>
              <div>
                <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answers<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="correctAnswer"
                  name="correctAnswer"
                  rows={3}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder='{"0": "answer1", "1": "answer2"}'
                  value={currentQuestion.correctAnswer}
                  onChange={handleQuestionChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  JSON mapping sentence index to answer. Example: {"0": "is beautiful", "1": "Paris"} 
                </p>
              </div>
            </div>
          )}
          
          {/* Map */}
          {currentQuestion.questionType === "MAP" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="questionImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Map Image URL<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="questionImage"
                  name="questionImage"
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter URL to the map image"
                  value={currentQuestion.questionImage}
                  onChange={handleQuestionChange}
                />
              </div>
              <div>
                <label htmlFor="mapLabels" className="block text-sm font-medium text-gray-700 mb-1">
                  Map Labels and Answers<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="mapLabels"
                  name="mapLabels"
                  rows={4}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter label=answer pairs, one per line"
                  value={currentQuestion.mapLabels}
                  onChange={handleQuestionChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format: Label=Answer, one per line. Example: "A=Library, B=Cafeteria"
                </p>
              </div>
            </div>
          )}
          
          {/* Speaking Task 1 - Introduction */}
          {currentQuestion.questionType === "SPEAKING_TASK_1" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="speakingPrompts" className="block text-sm font-medium text-gray-700 mb-1">
                  Introduction Prompts
                </label>
                <textarea
                  id="speakingPrompts"
                  name="speakingPrompts"
                  rows={4}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter introduction prompts (one per line)"
                  value={currentQuestion.speakingPrompts}
                  onChange={handleQuestionChange}
                />
                <p className="mt-1 text-xs text-gray-500">Enter each prompt on a new line. Example: "Tell me about yourself."</p>
              </div>
            </div>
          )}
          
          {/* Speaking Task 2 - Cue Card */}
          {currentQuestion.questionType === "SPEAKING_TASK_2" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="cueCard" className="block text-sm font-medium text-gray-700 mb-1">
                  Cue Card Text<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="cueCard"
                  name="cueCard"
                  rows={5}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter the cue card text"
                  value={currentQuestion.cueCard}
                  onChange={handleQuestionChange}
                />
              </div>
            </div>
          )}
          
          {/* Speaking Task 3 or Follow Ups */}
          {(currentQuestion.questionType === "SPEAKING_TASK_3" || currentQuestion.questionType === "SPEAKING_FOLLOW_UPS") && (
            <div className="space-y-4">
              <div>
                <label htmlFor="followUpQuestions" className="block text-sm font-medium text-gray-700 mb-1">
                  {currentQuestion.questionType === "SPEAKING_TASK_3" ? "Discussion Questions" : "Follow-up Questions"}
                </label>
                <textarea
                  id="followUpQuestions"
                  name="followUpQuestions"
                  rows={4}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter questions one per line"
                  value={currentQuestion.followUpQuestions}
                  onChange={handleQuestionChange}
                />
                <p className="mt-1 text-xs text-gray-500">Enter each question on a new line.</p>
              </div>
            </div>
          )}
          
          {/* Add Question Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={addQuestion}
              disabled={isLoading}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
      
      {/* List of questions */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Questions in this Section</h3>
        </div>
        
        {questions.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions in this section</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding questions using the form above.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {questions.map((question, index) => {
              // Parse options if they are stored as a string
              let parsedOptions = [];
              try {
                if (typeof question.options === 'string') {
                  parsedOptions = JSON.parse(question.options);
                } else if (Array.isArray(question.options)) {
                  parsedOptions = question.options;
                }
              } catch (e) {
                console.error("Failed to parse options:", e);
              }
              
              return (
                <li key={question.id} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-3">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-base font-medium text-gray-900 mb-1">{question.questionText}</h3>
                          
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              {question.questionType.replace("_", " ")}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {question.marks} {question.marks === 1 ? 'point' : 'points'}
                            </span>
                          </div>
                          
                          {/* Display options for multiple choice */}
                          {question.questionType === "MULTIPLE_CHOICE" && parsedOptions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-sm text-gray-500 font-medium">Options:</p>
                              <ul className="space-y-1 pl-5 list-disc text-sm text-gray-600">
                                {parsedOptions.map((option: string, optIdx: number) => (
                                  <li key={optIdx} className={optIdx.toString() === question.correctAnswer ? "font-medium text-green-600" : ""}>
                                    {option} {optIdx.toString() === question.correctAnswer && " (correct)"}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Display correct answer for other types */}
                          {(question.questionType === "TRUE_FALSE" || question.questionType === "SHORT_ANSWER") && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-500 font-medium">
                                Correct Answer: <span className="text-green-600">{question.correctAnswer}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Delete question"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
} 