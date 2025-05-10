"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../services/api";

// Define the interfaces for our form data
interface IELTSTestFormData {
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";
  moduleType: "IELTS_GENERAL" | "IELTS_ACADEMIC" | "COMBINED";
  totalTime: number;
  isPublished: boolean;
  isFeatured: boolean;
  testCategory: string;
  sections: SectionFormData[];
}

interface SectionFormData {
  title: string;
  instructions: string;
  order: number;
  timeLimit: number;
  questions: QuestionFormData[];
}

interface QuestionFormData {
  questionText: string;
  questionType: string;
  questionImage?: string;
  audioFile?: string;
  additionalInfo?: string;
  order: number;
  marks: number;
  options?: string[] | string;
  correctAnswer?: string;
  passage?: string;
  cueCard?: string;
  speakingPrompts?: string[] | string;
  bandDescriptors?: Record<string, string[]> | string;
  sampleAnswer?: string;
  paragraphs?: string[] | string;    // For para headings questions
  sentences?: string[] | string;     // For complete the sentence questions
  mapLabels?: string[] | string;     // For map labels
  matchingPairs?: Record<string, string> | string;  // For name matching
  followUpQuestions?: string[] | string;  // For speaking follow-ups
}

export default function CreateIELTSTestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'overview' | 'sections' | 'questions'>('overview');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Initialize form with default IELTS modules
  const [formData, setFormData] = useState<IELTSTestFormData>({
    title: "",
    description: "",
    difficulty: "MEDIUM",
    moduleType: "IELTS_ACADEMIC",
    totalTime: 180, // 3 hours total for a full IELTS test
    isPublished: false,
    isFeatured: false,
    testCategory: "Practice",
    sections: [
      {
        title: "Listening Module",
        instructions: "You will hear a number of different recordings and you will have to answer questions on what you hear.",
        order: 1,
        timeLimit: 40,
        questions: []
      },
      {
        title: "Reading Module",
        instructions: "You should spend about 60 minutes on this section. There are three reading passages with a total of 40 questions.",
        order: 2,
        timeLimit: 60,
        questions: []
      },
      {
        title: "Writing Module",
        instructions: "This module consists of two tasks. Complete both tasks.",
        order: 3,
        timeLimit: 60,
        questions: []
      },
      {
        title: "Speaking Module",
        instructions: "The Speaking module consists of a face-to-face interview with a certified examiner.",
        order: 4,
        timeLimit: 20,
        questions: []
      }
    ]
  });
  
  // Helper function to update overall form data
  const handleTestDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
  
  // Handle section data changes
  const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, sectionIndex: number) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      
      if (type === 'number') {
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          [name]: parseInt(value) || 0
        };
      } else {
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          [name]: value
        };
      }
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };
  
  // Handle question data changes
  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, 
    sectionIndex: number, 
    questionIndex: number
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      const questions = [...updatedSections[sectionIndex].questions];
      
      if (type === 'number') {
        questions[questionIndex] = {
          ...questions[questionIndex],
          [name]: parseFloat(value) || 0
        };
      } else {
        questions[questionIndex] = {
          ...questions[questionIndex],
          [name]: value
        };
      }
      
      updatedSections[sectionIndex].questions = questions;
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };
  
  // Handle options array (for multiple choice questions)
  const handleOptionsChange = (options: string[], sectionIndex: number, questionIndex: number) => {
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      const questions = [...updatedSections[sectionIndex].questions];
      
      questions[questionIndex] = {
        ...questions[questionIndex],
        options: options
      };
      
      updatedSections[sectionIndex].questions = questions;
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };
  
  // Add a new question to the current section
  const addQuestion = () => {
    // Set default question type based on the section
    let defaultQuestionType = "MULTIPLE_CHOICE";
    const sectionTitle = formData.sections[currentSectionIndex].title;
    
    if (sectionTitle.includes("Listening")) {
      defaultQuestionType = "FILL_BLANK";
    } else if (sectionTitle.includes("Reading")) {
      defaultQuestionType = "MULTIPLE_CHOICE";
    } else if (sectionTitle.includes("Writing")) {
      defaultQuestionType = "ESSAY";
    } else if (sectionTitle.includes("Speaking")) {
      defaultQuestionType = "SPEAKING_TASK_1";
    }
    
    const newQuestion: QuestionFormData = {
      questionText: "",
      questionType: defaultQuestionType,
      order: formData.sections[currentSectionIndex].questions.length + 1,
      marks: 1.0,
      options: []
    };
    
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[currentSectionIndex].questions.push(newQuestion);
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
    
    // Set the current question index to the newly added question
    setCurrentQuestionIndex(formData.sections[currentSectionIndex].questions.length);
    setCurrentView('questions');
  };
  
  // Remove a question
  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    setFormData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex].questions.splice(questionIndex, 1);
      
      // Update order of remaining questions
      updatedSections[sectionIndex].questions.forEach((q, idx) => {
        q.order = idx + 1;
      });
      
      return {
        ...prev,
        sections: updatedSections
      };
    });
    
    // Adjust current question index if needed
    if (questionIndex >= formData.sections[sectionIndex].questions.length - 1) {
      setCurrentQuestionIndex(Math.max(0, formData.sections[sectionIndex].questions.length - 2));
    }
  };
  
  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError("Please enter a test title");
      return;
    }
    
    // Check if at least some sections have questions
    const hasQuestions = formData.sections.some(section => section.questions.length > 0);
    if (!hasQuestions) {
      setError("At least one section must have questions");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create the complete IELTS test
      const response = await api.Tests.createCompleteIELTSTest(formData);
      
      if (response.success) {
        // Navigate to test view page
        router.push(`/tests/${response.data.id}`);
      } else {
        setError(response.message || "Failed to create IELTS test");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Error creating IELTS test:", error);
      setError(error.message || "An error occurred while creating the test. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  const renderQuestionForm = () => {
    const section = formData.sections[currentSectionIndex];
    const question = section.questions[currentQuestionIndex] || null;
    
    if (!question) return <div>No question selected</div>;
    
    // Helper function to get recommended question types
    const getRecommendedQuestionTypes = (sectionTitle: string) => {
      if (sectionTitle.includes("Listening")) {
        return (
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-sm text-blue-800">Recommended question types for Listening:</p>
            <ul className="list-disc pl-5 mt-1 text-sm text-blue-600">
              <li>Fill in the Blank</li>
              <li>Multiple Choice</li>
              <li>True/False</li>
              <li>Map</li>
            </ul>
          </div>
        );
      } else if (sectionTitle.includes("Reading")) {
        return (
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-sm text-blue-800">Recommended question types for Reading:</p>
            <ul className="list-disc pl-5 mt-1 text-sm text-blue-600">
              <li>Para Headings</li>
              <li>Complete the Sentence</li>
              <li>Name Matching</li>
              <li>Fill up the Blanks</li>
              <li>True/False/Not Given</li>
              <li>Yes/No/Not Given</li>
              <li>Multiple Choice</li>
            </ul>
          </div>
        );
      } else if (sectionTitle.includes("Speaking")) {
        return (
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="font-medium text-sm text-blue-800">Recommended question types for Speaking:</p>
            <ul className="list-disc pl-5 mt-1 text-sm text-blue-600">
              <li>Speaking Task 1 (Introduction)</li>
              <li>Speaking Task 2 (Cue Card)</li>
              <li>Speaking Task 3 (Discussion)</li>
              <li>Speaking Follow Ups</li>
            </ul>
          </div>
        );
      } 
      return null;
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Question {question.order}
          </h3>
          <button
            type="button"
            onClick={() => removeQuestion(currentSectionIndex, currentQuestionIndex)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove Question
          </button>
        </div>
        
        <div>
          <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mb-1">
            Question Type <span className="text-red-500">*</span>
          </label>
          <select
            id="questionType"
            name="questionType"
            value={question.questionType}
            onChange={e => handleQuestionChange(e, currentSectionIndex, currentQuestionIndex)}
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="FILL_BLANK">Fill in the Blank</option>
            <option value="SHORT_ANSWER">Short Answer</option>
            <option value="ESSAY">Essay</option>
            <option value="MATCHING">Matching</option>
            <option value="GAP_FILLING">Gap Filling</option>
            <option value="YES_NO_NOT_GIVEN">Yes/No/Not Given</option>
            <option value="TRUE_FALSE_NOT_GIVEN">True/False/Not Given</option>
            <option value="PARA_HEADINGS">Para Headings</option>
            <option value="COMPLETE_SENTENCE">Complete the Sentence</option>
            <option value="NAME_MATCHING">Name Matching</option>
            <option value="MAP">Map</option>
            <option value="SPEAKING_TASK_1">Speaking Task 1 (Introduction)</option>
            <option value="SPEAKING_TASK_2">Speaking Task 2 (Cue Card)</option>
            <option value="SPEAKING_TASK_3">Speaking Task 3 (Discussion)</option>
            <option value="SPEAKING_FOLLOW_UPS">Speaking Follow Ups</option>
          </select>
          {getRecommendedQuestionTypes(section.title)}
        </div>
        
        <div>
          <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-1">
            Question Text <span className="text-red-500">*</span>
          </label>
          <textarea
            id="questionText"
            name="questionText"
            value={question.questionText}
            onChange={e => handleQuestionChange(e, currentSectionIndex, currentQuestionIndex)}
            rows={3}
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            placeholder="Enter the question text"
          />
        </div>
        
        <div>
          <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
            Marks <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="marks"
            name="marks"
            value={question.marks}
            onChange={e => handleQuestionChange(e, currentSectionIndex, currentQuestionIndex)}
            min="0"
            step="0.5"
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
          />
        </div>
        
        {/* Show additional fields based on question type */}
        {['MULTIPLE_CHOICE', 'TRUE_FALSE', 'MATCHING', 'NAME_MATCHING'].includes(question.questionType) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options <span className="text-red-500">*</span>
            </label>
            {/* Option inputs will go here */}
            {/* For simplicity, we're just using a textarea for now */}
            <textarea
              name="options"
              value={Array.isArray(question.options) ? question.options.join('\n') : question.options || ''}
              onChange={e => {
                const options = e.target.value.split('\n').filter(opt => opt.trim() !== '');
                handleOptionsChange(options, currentSectionIndex, currentQuestionIndex);
              }}
              rows={4}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              placeholder="Enter each option on a new line"
            />
          </div>
        )}
        
        {['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'SHORT_ANSWER', 'GAP_FILLING', 'COMPLETE_SENTENCE', 'NAME_MATCHING', 'PARA_HEADINGS'].includes(question.questionType) && (
          <div>
            <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="correctAnswer"
              name="correctAnswer"
              value={question.correctAnswer || ''}
              onChange={e => handleQuestionChange(e, currentSectionIndex, currentQuestionIndex)}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              placeholder="Enter the correct answer"
            />
          </div>
        )}
        
        {/* Additional fields for reading passages */}
        {['YES_NO_NOT_GIVEN', 'TRUE_FALSE_NOT_GIVEN', 'PARA_HEADINGS', 'COMPLETE_SENTENCE'].includes(question.questionType) && (
          <div>
            <label htmlFor="passage" className="block text-sm font-medium text-gray-700 mb-1">
              Reading Passage
            </label>
            <textarea
              id="passage"
              name="passage"
              value={question.passage || ''}
              onChange={e => handleQuestionChange(e, currentSectionIndex, currentQuestionIndex)}
              rows={5}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              placeholder="Enter the reading passage text"
            />
          </div>
        )}
        
        {/* Map specific fields */}
        {question.questionType === 'MAP' && (
          <>
            <div>
              <label htmlFor="questionImage" className="block text-sm font-medium text-gray-700 mb-1">
                Map Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="questionImage"
                name="questionImage"
                value={question.questionImage || ''}
                onChange={e => handleQuestionChange(e, currentSectionIndex, currentQuestionIndex)}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                placeholder="Enter the URL for the map image"
              />
            </div>
            <div>
              <label htmlFor="mapLabels" className="block text-sm font-medium text-gray-700 mb-1">
                Map Labels <span className="text-red-500">*</span>
              </label>
              <textarea
                id="mapLabels"
                name="mapLabels"
                value={Array.isArray(question.mapLabels) ? question.mapLabels.join('\n') : question.mapLabels || ''}
                onChange={e => {
                  const labels = e.target.value.split('\n').filter(label => label.trim() !== '');
                  handleQuestionChange(
                    { target: { name: 'mapLabels', value: labels } } as any, 
                    currentSectionIndex, 
                    currentQuestionIndex
                  );
                }}
                rows={4}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                placeholder="Enter each map label on a new line"
              />
            </div>
          </>
        )}
        
        {/* Para Headings specific fields */}
        {question.questionType === 'PARA_HEADINGS' && (
          <div>
            <label htmlFor="paragraphs" className="block text-sm font-medium text-gray-700 mb-1">
              Paragraphs <span className="text-red-500">*</span>
            </label>
            <textarea
              id="paragraphs"
              name="paragraphs"
              value={Array.isArray(question.paragraphs) ? question.paragraphs.join('\n\n') : question.paragraphs || ''}
              onChange={e => {
                const paragraphs = e.target.value.split('\n\n').filter(p => p.trim() !== '');
                handleQuestionChange(
                  { target: { name: 'paragraphs', value: paragraphs } } as any, 
                  currentSectionIndex, 
                  currentQuestionIndex
                );
              }}
              rows={6}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              placeholder="Enter each paragraph separated by two new lines"
            />
          </div>
        )}

        {/* Complete Sentence specific fields */}
        {question.questionType === 'COMPLETE_SENTENCE' && (
          <div>
            <label htmlFor="sentences" className="block text-sm font-medium text-gray-700 mb-1">
              Incomplete Sentences <span className="text-red-500">*</span>
            </label>
            <textarea
              id="sentences"
              name="sentences"
              value={Array.isArray(question.sentences) ? question.sentences.join('\n') : question.sentences || ''}
              onChange={e => {
                const sentences = e.target.value.split('\n').filter(s => s.trim() !== '');
                handleQuestionChange(
                  { target: { name: 'sentences', value: sentences } } as any, 
                  currentSectionIndex, 
                  currentQuestionIndex
                );
              }}
              rows={4}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              placeholder="Enter each incomplete sentence on a new line"
            />
            <p className="mt-1 text-sm text-gray-500">Use '...' to indicate where the sentence needs to be completed.</p>
          </div>
        )}

        {/* Name Matching specific fields */}
        {question.questionType === 'NAME_MATCHING' && (
          <div>
            <label htmlFor="matchingPairs" className="block text-sm font-medium text-gray-700 mb-1">
              Matching Pairs <span className="text-red-500">*</span>
            </label>
            <textarea
              id="matchingPairs"
              name="matchingPairs"
              value={typeof question.matchingPairs === 'object' ? 
                Object.entries(question.matchingPairs as Record<string, string>)
                  .map(([name, match]) => `${name}: ${match}`)
                  .join('\n') : 
                question.matchingPairs || ''}
              onChange={e => {
                const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
                const pairs: Record<string, string> = {};
                lines.forEach(line => {
                  const [name, match] = line.split(':').map(part => part.trim());
                  if (name && match) {
                    pairs[name] = match;
                  }
                });
                handleQuestionChange(
                  { target: { name: 'matchingPairs', value: pairs } } as any, 
                  currentSectionIndex, 
                  currentQuestionIndex
                );
              }}
              rows={4}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              placeholder="Enter each matching pair as 'Name: Match' on a new line"
            />
            <p className="mt-1 text-sm text-gray-500">Format: Name: Match (one per line)</p>
          </div>
        )}

        {/* Speaking Follow Ups specific fields */}
        {question.questionType === 'SPEAKING_FOLLOW_UPS' && (
          <div>
            <label htmlFor="followUpQuestions" className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Questions <span className="text-red-500">*</span>
            </label>
            <textarea
              id="followUpQuestions"
              name="followUpQuestions"
              value={Array.isArray(question.followUpQuestions) ? question.followUpQuestions.join('\n') : question.followUpQuestions || ''}
              onChange={e => {
                const questions = e.target.value.split('\n').filter(q => q.trim() !== '');
                handleQuestionChange(
                  { target: { name: 'followUpQuestions', value: questions } } as any, 
                  currentSectionIndex, 
                  currentQuestionIndex
                );
              }}
              rows={4}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              placeholder="Enter each follow-up question on a new line"
            />
          </div>
        )}
        
        {/* Fields for speaking tasks */}
        {['SPEAKING_TASK_1', 'SPEAKING_TASK_2', 'SPEAKING_TASK_3', 'SPEAKING_FOLLOW_UPS'].includes(question.questionType) && (
          <>
            <div>
              <label htmlFor="speakingPrompts" className="block text-sm font-medium text-gray-700 mb-1">
                Speaking Prompts
              </label>
              <textarea
                id="speakingPrompts"
                name="speakingPrompts"
                value={Array.isArray(question.speakingPrompts) ? question.speakingPrompts.join('\n') : question.speakingPrompts || ''}
                onChange={e => {
                  const prompts = e.target.value.split('\n').filter(p => p.trim() !== '');
                  handleQuestionChange(
                    { target: { name: 'speakingPrompts', value: prompts } } as any, 
                    currentSectionIndex, 
                    currentQuestionIndex
                  );
                }}
                rows={4}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                placeholder="Enter each prompt on a new line"
              />
            </div>
            
            {question.questionType === 'SPEAKING_TASK_2' && (
              <div>
                <label htmlFor="cueCard" className="block text-sm font-medium text-gray-700 mb-1">
                  Cue Card
                </label>
                <textarea
                  id="cueCard"
                  name="cueCard"
                  value={question.cueCard || ''}
                  onChange={e => handleQuestionChange(e, currentSectionIndex, currentQuestionIndex)}
                  rows={4}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
                  placeholder="Enter cue card text"
                />
              </div>
            )}
          </>
        )}
        
        {/* Additional fields for all questions */}
        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Instructions
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={question.additionalInfo || ''}
            onChange={e => handleQuestionChange(e, currentSectionIndex, currentQuestionIndex)}
            rows={2}
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            placeholder="Enter any additional instructions for this question"
          />
        </div>
      </div>
    );
  };
  
  const renderSectionForm = () => {
    const section = formData.sections[currentSectionIndex];
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">
          Section {section.order}: {section.title}
        </h3>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Section Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={section.title}
            onChange={e => handleSectionChange(e, currentSectionIndex)}
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <textarea
            id="instructions"
            name="instructions"
            value={section.instructions}
            onChange={e => handleSectionChange(e, currentSectionIndex)}
            rows={3}
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            id="timeLimit"
            name="timeLimit"
            value={section.timeLimit}
            onChange={e => handleSectionChange(e, currentSectionIndex)}
            min="0"
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
          />
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Questions ({section.questions.length})</h4>
          
          {section.questions.length > 0 ? (
            <ul className="space-y-2">
              {section.questions.map((q, index) => (
                <li key={index} className="border border-gray-200 rounded p-3 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Q{q.order}: {q.questionText.substring(0, 40)}{q.questionText.length > 40 ? '...' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setCurrentView('questions');
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Type: {q.questionType} | Marks: {q.marks}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No questions added yet.</p>
          )}
          
          <button
            type="button"
            onClick={addQuestion}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Question
          </button>
        </div>
      </div>
    );
  };
  
  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Test Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTestDataChange}
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            placeholder="e.g., IELTS Academic Test - Practice 1"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleTestDataChange}
            rows={3}
            className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            placeholder="Provide a brief description of the test"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="moduleType" className="block text-sm font-medium text-gray-700 mb-1">
              IELTS Test Type <span className="text-red-500">*</span>
            </label>
            <select
              id="moduleType"
              name="moduleType"
              value={formData.moduleType}
              onChange={handleTestDataChange}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            >
              <option value="IELTS_ACADEMIC">IELTS Academic</option>
              <option value="IELTS_GENERAL">IELTS General Training</option>
              <option value="COMBINED">Combined/Custom</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level <span className="text-red-500">*</span>
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleTestDataChange}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
              <option value="VERY_HARD">Very Hard</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="totalTime" className="block text-sm font-medium text-gray-700 mb-1">
              Total Time (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="totalTime"
              name="totalTime"
              value={formData.totalTime}
              onChange={handleTestDataChange}
              min="0"
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="testCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Test Category
            </label>
            <input
              type="text"
              id="testCategory"
              name="testCategory"
              value={formData.testCategory}
              onChange={handleTestDataChange}
              className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              placeholder="e.g., Practice, Mock, Official"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-center">
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              checked={formData.isPublished}
              onChange={handleTestDataChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
              Publish Test
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={handleTestDataChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
              Feature Test on Dashboard
            </label>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Sections</h4>
          
          <ul className="space-y-2">
            {formData.sections.map((section, index) => (
              <li key={index} className="border border-gray-200 rounded p-3 bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {index + 1}. {section.title} ({section.timeLimit} mins)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentSectionIndex(index);
                      setCurrentView('sections');
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Questions: {section.questions.length}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create IELTS Test</h1>
          <p className="mt-2 text-base text-gray-500">Create a complete IELTS test with all sections and questions</p>
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
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentView('overview')}
            className={`flex-1 py-4 px-6 text-center text-sm font-medium ${
              currentView === 'overview' 
                ? 'text-indigo-600 border-b-2 border-indigo-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Test Overview
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('sections')}
            className={`flex-1 py-4 px-6 text-center text-sm font-medium ${
              currentView === 'sections' 
                ? 'text-indigo-600 border-b-2 border-indigo-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sections
          </button>
          <button
            type="button"
            onClick={() => {
              if (formData.sections[currentSectionIndex].questions.length > 0) {
                setCurrentView('questions');
              } else {
                addQuestion();
              }
            }}
            className={`flex-1 py-4 px-6 text-center text-sm font-medium ${
              currentView === 'questions' 
                ? 'text-indigo-600 border-b-2 border-indigo-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Questions
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-6">
          {currentView === 'overview' && renderOverview()}
          {currentView === 'sections' && renderSectionForm()}
          {currentView === 'questions' && renderQuestionForm()}
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/tests')}
              className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create IELTS Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 