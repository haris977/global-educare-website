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
  | "TABLE_COMPLETION"
  | "SPEAKING_TASK_1"
  | "SPEAKING_TASK_2"
  | "SPEAKING_TASK_3"
  | "SPEAKING_FOLLOW_UPS"
  | "SENTENCE_ENDINGS_MATCHING"
  | "SUMMARY"
  | "DIAGRAM_LABELLING";

interface Question {
  tableData?: TableData;
  completeSentenceAnswers: any;
  diagramImage?: string;
  diagramLabels?: {
    id: number;
    x: number;
    y: number;
    text: string;
    correctAnswer?: string;
  }[];
  diagramAnswers?: string[];
  sentenceCompletionAnswers?: string[];
  wordLimit?: string;
  sentenceBeginnings?: string[];
  sentenceEndings?: string[];
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
  features?: string[];
  statements?: string[];
  correctFeatures?: string[][];
  reuseAllowed?: boolean;
  speakingPrompts?: string[];
  followUpQuestions?: string[];
  headings?: string[]; // For PARA_HEADINGS type
  correctHeadings?: string[]; // For PARA_HEADINGS type
  fillBlankAnswers?: string[]; // For FILL_BLANK: answers for each blank
  summaryWords?: string[];
  summaryBlankAnswers?: string[];
}

interface TableCell {
  content: string;
  isBlank: boolean;
  correctAnswer: string;
}
interface TableRow {
  id: number;
  cells: TableCell[];
}
interface TableData {
  headers: string[];
  rows: TableRow[];
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
    switch (moduleType) {
      case "READING":
        return [
          "MULTIPLE_CHOICE",
          "PARA_HEADINGS",
          "NAME_MATCHING",
          "FILL_BLANK",
          "TRUE_FALSE_NOT_GIVEN",
          "YES_NO_NOT_GIVEN",
          "SENTENCE_ENDINGS_MATCHING",
          "COMPLETE_SENTENCE",
          "SUMMARY",
          "DIAGRAM_LABELLING",
          "TABLE_COMPLETION"

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
    followUpQuestions: [],
    sentenceBeginnings: [],
    sentenceEndings: [],
    sentenceCompletionAnswers: [],
    completeSentenceAnswers: [],
    headings: [],
    correctHeadings: [],
    fillBlankAnswers: [],
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
      followUpQuestions: [],
      sentenceBeginnings: [],
      sentenceEndings: [],
      sentenceCompletionAnswers: [],
      completeSentenceAnswers: [],
      headings: [],
      correctHeadings: [],
      fillBlankAnswers: []
    });

    setSuccessMessage("Question added successfully!");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  function getBlankIndex(words: string[], idx: number) {
    // Returns the blank index for the _ at position idx
    return words.slice(0, idx + 1).filter(w => w === "_").length - 1;
  }

  function updateBlankAnswers(words: string[], prevAnswers: string[]) {
    const blankCount = words.filter(w => w === "_").length;
    const newAnswers = [];
    for (let i = 0; i < blankCount; i++) {
      newAnswers.push(prevAnswers[i] || "");
    }
    return newAnswers;
  }

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

      console.log("Submitting test with the following data:")

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
            correctAnswer: question.correctAnswer || undefined,
            fillBlankAnswers: question.type === "FILL_BLANK" ? question.fillBlankAnswers : undefined

          };

          // Add passage if provided (for reading sections)
          if (form.moduleType === "READING" && section.passage) {
            questionData.passage = section.passage;
          }

          // Add other type-specific fields
          if (question.type === "PARA_HEADINGS" && question.paragraphs) {
            questionData.paragraphs = question.paragraphs;
            questionData.headings = question.headings;
            questionData.correctHeadings = question.correctHeadings;
          }
          else if (question.type === "DIAGRAM_LABELLING") {
            questionData.diagramImage = question.diagramImage;
            questionData.diagramLabels = question.diagramLabels;
          }
          else if (question.type === "COMPLETE_SENTENCE" && question.sentences) {
            questionData.sentences = question.sentences;
            questionData.completeSentenceAnswers = question.completeSentenceAnswers;

          }

          else if (question.type === "SUMMARY") {
            questionData.summaryWords = question.summaryWords;
            questionData.summaryBlankAnswers = question.summaryBlankAnswers;
            questionData.paragraphs = question.paragraphs;
            questionData.fillBlankSentence = question.text;
            questionData.fillBlankAnswers = question.fillBlankAnswers;
            questionData.wordLimit = question.wordLimit;
          }
          else if (question.type === "FILL_BLANK") {
            questionData.fillBlankAnswers = question.fillBlankAnswers;
          }
          else if (question.type === "SENTENCE_ENDINGS_MATCHING" && question.sentenceBeginnings && question.sentenceEndings) {
            questionData.sentenceBeginnings = question.sentenceBeginnings;
            questionData.sentenceEndings = question.sentenceEndings;
            questionData.correctHeadings = question.correctHeadings;
          }
          else if (question.type === "COMPLETE_SENTENCE" && question.sentences) {
            questionData.sentences = question.sentences;
            questionData.completeSentenceAnswers = question.completeSentenceAnswers;
          }
          else if (question.type === "NAME_MATCHING" && question.sentenceBeginnings && question.sentenceEndings) {
            questionData.sentenceBeginnings = question.sentenceBeginnings;
            questionData.sentenceEndings = question.sentenceEndings;
            questionData.correctHeadings = question.correctHeadings;
          } else if (question.type === "MAP" && question.mapLabels) {
            questionData.mapLabels = question.mapLabels;
          } else if (question.type === "SPEAKING_TASK_2" && question.cueCard) {
            questionData.cueCard = question.cueCard;
          } else if (["SPEAKING_TASK_1", "SPEAKING_TASK_3"].includes(question.type) && question.speakingPrompts) {
            questionData.speakingPrompts = question.speakingPrompts;
          } else if (question.type === "SPEAKING_FOLLOW_UPS" && question.followUpQuestions) {
            questionData.followUpQuestions = question.followUpQuestions;
          }
          else if (question.type === "TABLE_COMPLETION" && question.tableData) {
  questionData.tableData = question.tableData;
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
                  className={`px-4 py-3 font-medium ${currentSectionIndex === index
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
                        Question
                      </label>
                      <input
                        type="text"
                        value={currentQuestion.text}
                        onChange={e => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark mb-4"
                        placeholder="Enter the question here"
                        required
                      />

                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        Options
                      </label>
                      {currentQuestion.options?.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            value={index.toString()}
                            checked={currentQuestion.correctAnswer === index.toString()}
                            onChange={() =>
                              setCurrentQuestion(prev => ({
                                ...prev,
                                correctAnswer: index.toString(),
                              }))
                            }
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            required
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={e => {
                              const updatedOptions = [...(currentQuestion.options || [])];
                              updatedOptions[index] = e.target.value;
                              setCurrentQuestion(prev => ({
                                ...prev,
                                options: updatedOptions,
                              }));
                            }}
                            className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                            placeholder={`Option ${index + 1}`}
                            required
                          />
                          {currentQuestion.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updatedOptions = [...(currentQuestion.options || [])];
                                updatedOptions.splice(index, 1);
                                setCurrentQuestion(prev => ({
                                  ...prev,
                                  options: updatedOptions,
                                  // Reset correctAnswer if it was the removed option
                                  correctAnswer:
                                    prev.correctAnswer === index.toString() ? "" : prev.correctAnswer,
                                }));
                              }}
                              className="ml-2 text-red-500 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestion(prev => ({
                            ...prev,
                            options: [...(prev.options || []), ""],
                          }))
                        }
                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Option
                      </button>
                    </div>
                  )}

                  {currentQuestion.type === "TABLE_COMPLETION" && (
                    <div className="mb-4">
                        {/* Table Completion Title (use question text instead) */}
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                        Table Completion Question
                        </label>
                        <input
                        type="text"
                        value={currentQuestion.text || ""}
                        onChange={e => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark mb-2"
                        placeholder="e.g., Early methods of producing flat glass"
                        />
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">Table Structure</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentQuestion(prev => ({
                                  ...prev,
                                  tableData: {
                                    ...prev.tableData,
                                    headers: [...(prev.tableData?.headers || []), 'New Column'],
                                    rows: (prev.tableData?.rows || []).map(row => ({
                                      ...row,
                                      cells: [...row.cells, { content: '', isBlank: false, correctAnswer: '' }]
                                    }))
                                  }
                                }));
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                            >+ Add Column</button>
                            <button
                              type="button"
                              onClick={() => {
                                const headers = currentQuestion.tableData?.headers || [];
                                setCurrentQuestion(prev => ({
                                  ...prev,
                                  tableData: {
                                    ...prev.tableData,
                                    rows: [
                                      ...(prev.tableData?.rows || []),
                                      {
                                        id: Date.now(),
                                        cells: headers.map(() => ({ content: '', isBlank: false, correctAnswer: '' }))
                                      }
                                    ]
                                  }
                                }));
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                            >+ Add Row</button>
                          </div>
                        </div>
                        {/* Table Headers */}
                        <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${currentQuestion.tableData?.headers?.length || 1}, 1fr) auto` }}>
                          {(currentQuestion.tableData?.headers || []).map((header, idx) => (
                            <div key={idx} className="flex items-center">
                              <input
                                type="text"
                                value={header}
                                onChange={e => {
                                  setCurrentQuestion(prev => ({
                                    ...prev,
                                    tableData: {
                                      ...prev.tableData,
                                      headers: prev.tableData.headers.map((h, i) => i === idx ? e.target.value : h),
                                      rows: prev.tableData.rows
                                    }
                                  }));
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder={`Header ${idx + 1}`}
                              />
                            </div>
                          ))}
                          <div>
                            {currentQuestion.tableData?.headers?.length > 2 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentQuestion(prev => ({
                                    ...prev,
                                    tableData: {
                                      headers: prev.tableData.headers.filter((_, i) => i !== prev.tableData.headers.length - 1),
                                      rows: prev.tableData.rows.map(row => ({
                                        ...row,
                                        cells: row.cells.filter((_, i) => i !== prev.tableData.headers.length - 1)
                                      }))
                                    }
                                  }));
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove last column"
                              >Remove</button>
                            )}
                          </div>
                        </div>
                        {/* Table Rows */}
                        <div className="space-y-4">
                          {(currentQuestion.tableData?.rows || []).map((row, rowIdx) => (
                            <div key={row.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-700">Row {rowIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentQuestion(prev => ({
                                      ...prev,
                                      tableData: {
                                        ...prev.tableData,
                                        rows: prev.tableData.rows.filter((_, idx) => idx !== rowIdx)
                                      }
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Remove row"
                                >Remove</button>
                              </div>
                              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${row.cells.length}, 1fr)` }}>
                                {row.cells.map((cell, cellIdx) => (
                                  <div key={cellIdx} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label className="text-xs font-medium text-gray-600">
                                        {currentQuestion.tableData.headers[cellIdx]}
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCurrentQuestion(prev => ({
                                            ...prev,
                                            tableData: {
                                              ...prev.tableData,
                                              rows: prev.tableData.rows.map((r, rIdx) =>
                                                rIdx === rowIdx
                                                  ? {
                                                    ...r,
                                                    cells: r.cells.map((c, cIdx) =>
                                                      cIdx === cellIdx ? { ...c, isBlank: !c.isBlank } : c
                                                    )
                                                  }
                                                  : r
                                              )
                                            }
                                          }));
                                        }}
                                        className={`text-xs px-2 py-1 rounded ${cell.isBlank
                                            ? 'bg-orange-100 text-orange-700 border border-orange-300'
                                            : 'bg-gray-100 text-gray-600 border border-gray-300'
                                          }`}
                                      >
                                        {cell.isBlank ? 'Has Blank' : 'No Blank'}
                                      </button>
                                    </div>
                                    <textarea
                                      value={cell.content}
                                      onChange={e => {
                                        setCurrentQuestion(prev => ({
                                          ...prev,
                                          tableData: {
                                            ...prev.tableData,
                                            rows: prev.tableData.rows.map((r, rIdx) =>
                                              rIdx === rowIdx
                                                ? {
                                                  ...r,
                                                  cells: r.cells.map((c, cIdx) =>
                                                    cIdx === cellIdx ? { ...c, content: e.target.value } : c
                                                  )
                                                }
                                                : r
                                            )
                                          }
                                        }));
                                      }}
                                      className={`w-full px-2 py-1 border rounded text-sm resize-none ${cell.isBlank
                                          ? 'border-orange-300 bg-orange-50 focus:ring-orange-500 focus:border-orange-500'
                                          : 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                      rows={2}
                                      placeholder={cell.isBlank ? "Enter content with blanks" : "Enter cell content"}
                                    />
                                    {cell.isBlank && (
                                      <div>
                                        <label className="block text-xs font-medium text-orange-700 mb-1">
                                          Correct Answer(s) for this cell
                                        </label>
                                        <input
                                          type="text"
                                          value={cell.correctAnswer}
                                          onChange={e => {
                                            setCurrentQuestion(prev => ({
                                              ...prev,
                                              tableData: {
                                                ...prev.tableData,
                                                rows: prev.tableData.rows.map((r, rIdx) =>
                                                  rIdx === rowIdx
                                                    ? {
                                                      ...r,
                                                      cells: r.cells.map((c, cIdx) =>
                                                        cIdx === cellIdx ? { ...c, correctAnswer: e.target.value } : c
                                                      )
                                                    }
                                                    : r
                                                )
                                              }
                                            }));
                                          }}
                                          className="w-full px-2 py-1 border border-orange-300 rounded text-sm bg-orange-50 focus:ring-orange-500 focus:border-orange-500"
                                          placeholder="Enter correct answers (comma separated if multiple)"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentQuestion.type === "NAME_MATCHING" && (
                    <div className="mb-4">
                      {/* Sentence input with blank */}
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        NAME
                      </label>
                      {(currentQuestion.sentenceBeginnings || []).map((begin, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={begin}
                            onChange={e => {
                              const sentenceBeginnings = [...(currentQuestion.sentenceBeginnings || [])];
                              sentenceBeginnings[idx] = e.target.value;
                              setCurrentQuestion(prev => ({
                                ...prev,
                                sentenceBeginnings,
                                correctEndings: prev.correctHeadings && sentenceBeginnings.length === prev.correctHeadings.length
                                  ? prev.correctHeadings
                                  : Array(sentenceBeginnings.length).fill('')
                              }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                            placeholder={`Feature${idx + 1}`}
                          />
                          <button
                            type="button"
                            className="ml-2 text-red-500"
                            onClick={() => {
                              const sentenceBeginnings = [...(currentQuestion.sentenceBeginnings || [])];
                              sentenceBeginnings.splice(idx, 1);
                              setCurrentQuestion(prev => ({
                                ...prev,
                                sentenceBeginnings,
                                correctEndings: prev.correctHeadings && sentenceBeginnings.length === prev.correctHeadings.length
                                  ? prev.correctHeadings
                                  : Array(sentenceBeginnings.length).fill('')
                              }));
                            }}
                            title="Remove "
                          >✕</button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600"
                        onClick={() => {
                          setCurrentQuestion(prev => ({
                            ...prev,
                            sentenceBeginnings: [...(prev.sentenceBeginnings || []), ""]
                          }));
                        }}
                      >
                        + Add
                      </button>

                      {/* Correct answer(s) for the blank(s) */}
                      {(currentQuestion.sentenceCompletionAnswers && currentQuestion.sentenceCompletionAnswers.length > 0) && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Correct Answer(s)
                          </label>
                          {currentQuestion.sentenceCompletionAnswers.map((ans, idx) => (
                            <div key={idx} className="flex items-center mb-2">
                              <span className="mr-2 text-gray-700">Blank {idx + 1}:</span>
                              <input
                                type="text"
                                value={ans}
                                onChange={e => {
                                  const sentenceCompletionAnswers = [...currentQuestion.sentenceCompletionAnswers];
                                  sentenceCompletionAnswers[idx] = e.target.value;
                                  setCurrentQuestion(prev => ({ ...prev, sentenceCompletionAnswers }));
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                                placeholder={`Answer for blank ${idx + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="block text-sm font-medium text-gray-800 mb-1 mt-4">
                        FEATURES
                      </label>
                      {(currentQuestion.sentenceEndings || []).map((ending, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={ending}
                            onChange={e => {
                              const sentenceEndings = [...(currentQuestion.sentenceEndings || [])];
                              sentenceEndings[idx] = e.target.value;
                              setCurrentQuestion(prev => ({
                                ...prev,
                                sentenceEndings
                              }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                            placeholder={`Matching ${idx + 1}`}
                          />
                          <button
                            type="button"
                            className="ml-2 text-red-500"
                            onClick={() => {
                              const sentenceEndings = [...(currentQuestion.sentenceEndings || [])];
                              sentenceEndings.splice(idx, 1);
                              setCurrentQuestion(prev => ({
                                ...prev, sentenceEndings
                              }));
                            }}
                            title="Remove ending"
                          >✕</button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600"
                        onClick={() => {
                          setCurrentQuestion(prev => ({
                            ...prev,
                            sentenceEndings: [...(prev.sentenceEndings || []), ""]
                          }));
                        }}
                      >
                        + Add
                      </button>

                      {currentQuestion.sentenceBeginnings && currentQuestion.sentenceEndings &&
                        currentQuestion.sentenceBeginnings.length > 0 && currentQuestion.sentenceEndings.length > 0 && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Assign correct feature to each para
                            </label>
                            {currentQuestion.sentenceBeginnings.map((begin, idx) => (
                              <div key={idx} className="flex items-center mb-2">
                                <span className="mr-2 text-gray-700 font-medium">Beg. {idx + 1}:</span>
                                <span className="flex-1 italic text-gray-600 truncate">{begin}</span>
                                <select
                                  value={currentQuestion.correctHeadings && currentQuestion.correctHeadings[idx] !== undefined ? currentQuestion.correctHeadings[idx] : ''}
                                  onChange={e => {
                                    const correctEndings = [...(currentQuestion.correctHeadings || Array(currentQuestion.sentenceBeginnings.length).fill(''))];
                                    correctEndings[idx] = e.target.value;
                                    setCurrentQuestion(prev => ({ ...prev, correctEndings }));
                                  }}
                                  className="ml-4 border-gray-300 rounded-md"
                                >
                                  <option value="">Select ending</option>
                                  {currentQuestion.sentenceEndings.map((ending, eIdx) => (
                                    <option key={eIdx} value={String.fromCharCode(65 + eIdx)}>
                                      {String.fromCharCode(65 + eIdx)}. {ending}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  )}


                  {currentQuestion.type === "SUMMARY" && (
                    <div className="mb-4">
                      {/* Editable summary as words and blanks */}
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        Summary Words (add words and use <b>_</b> for blanks)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(currentQuestion.summaryWords || [""]).map((word, idx) => (
                          <div key={idx} className="flex items-center">
                            <input
                              type="text"
                              value={word}
                              onChange={e => {
                                const summaryWords = [...(currentQuestion.summaryWords || [])];
                                summaryWords[idx] = e.target.value;
                                setCurrentQuestion(prev => ({
                                  ...prev,
                                  summaryWords,
                                  summaryBlankAnswers: updateBlankAnswers(summaryWords, prev.summaryBlankAnswers || [])
                                }));
                              }}
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                              placeholder="Word or _"
                            />
                            {/* If word is '_', show correct answer input */}

                            <button
                              type="button"
                              className="ml-1 text-red-500"
                              onClick={() => {
                                const summaryWords = [...(currentQuestion.summaryWords || [])];
                                summaryWords.splice(idx, 1);
                                setCurrentQuestion(prev => ({
                                  ...prev,
                                  summaryWords,
                                  summaryBlankAnswers: updateBlankAnswers(summaryWords, prev.summaryBlankAnswers || [])
                                }));
                              }}
                              title="Remove"
                            >✕</button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setCurrentQuestion(prev => ({
                              ...prev,
                              summaryWords: [...(prev.summaryWords || []), ""]
                            }));
                          }}
                        >+ Add Word/Blank</button>
                      </div>

                      {/* Paragraphs textarea */}
                      <label className="block text-sm font-medium text-gray-800 mb-1 mt-4">
                        Paragraphs (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={currentQuestion.paragraphs ? currentQuestion.paragraphs.join('\n') : ''}
                        onChange={e => {
                          const paragraphs = e.target.value.split('\n').map(p => p.trim()).filter(Boolean);
                          setCurrentQuestion(prev => ({
                            ...prev,
                            paragraphs
                          }));
                        }}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                        placeholder="Enter each paragraph on a new line"
                      />

                      {/* Word/number limit instruction */}
                      <label className="block text-sm font-medium text-gray-800 mb-1 mt-4">
                        Word/Number Limit Instruction
                      </label>
                      <input
                        type="text"
                        value={currentQuestion.wordLimit || ""}
                        onChange={e => setCurrentQuestion(prev => ({ ...prev, wordLimit: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                        placeholder='e.g. NO MORE THAN TWO WORDS AND/OR A NUMBER'
                      />

                      {/* FILL BLANK style input for summary questions */}
                      <label className="block text-sm font-medium text-gray-800 mb-1 mt-4">
                        FILL BLANK Sentence (use <b>_</b> for blanks)
                      </label>
                      <textarea
                        rows={2}
                        value={currentQuestion.text || ""}
                        onChange={e => {
                          const text = e.target.value;
                          const blankCount = (text.match(/_/g) || []).length;
                          setCurrentQuestion(prev => {
                            let fillBlankAnswers = prev.fillBlankAnswers ? [...prev.fillBlankAnswers] : [];
                            if (blankCount > fillBlankAnswers.length) {
                              fillBlankAnswers = [
                                ...fillBlankAnswers,
                                ...Array(blankCount - fillBlankAnswers.length).fill("")
                              ];
                            } else if (blankCount < fillBlankAnswers.length) {
                              fillBlankAnswers = fillBlankAnswers.slice(0, blankCount);
                            }
                            return {
                              ...prev,
                              text,
                              fillBlankAnswers
                            };
                          });
                        }}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                        placeholder="Type the sentence here, use _ for each blank"
                      />

                      {/* Inputs for each blank's correct answer */}
                      {(currentQuestion.fillBlankAnswers && currentQuestion.fillBlankAnswers.length > 0) && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Correct Answers for Each Blank
                          </label>
                          {currentQuestion.fillBlankAnswers.map((ans, idx) => (
                            <div key={idx} className="flex items-center mb-2">
                              <span className="mr-2 text-gray-700">Blank {idx + 1}:</span>
                              <input
                                type="text"
                                value={ans}
                                onChange={e => {
                                  setCurrentQuestion(prev => {
                                    const fillBlankAnswers = prev.fillBlankAnswers ? [...prev.fillBlankAnswers] : [];
                                    fillBlankAnswers[idx] = e.target.value;
                                    return { ...prev, fillBlankAnswers };
                                  });
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                                placeholder={`Answer for blank ${idx + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {currentQuestion.type === "DIAGRAM_LABELLING" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        Diagram Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = ev => {
                              setCurrentQuestion(prev => ({
                                ...prev,
                                diagramImage: ev.target?.result as string,
                                diagramLabels: [],
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block mb-2"
                      />
                      {currentQuestion.diagramImage && (
                        <div className="mb-6">
                          <div className="mb-4 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              Click on the image to add labels. Currently {currentQuestion.diagramLabels?.length || 0} labels added.
                            </p>
                            {currentQuestion.diagramLabels?.length > 0 && (
                              <button
                                onClick={() =>
                                  setCurrentQuestion(prev => ({ ...prev, diagramLabels: [] }))
                                }
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                type="button"
                              >
                                Clear All Labels
                              </button>
                            )}
                          </div>
                          <div className="relative inline-block border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                            <img
                              src={currentQuestion.diagramImage}
                              alt="Diagram for labelling"
                              onClick={e => {
                                const img = e.target as HTMLImageElement;
                                const rect = img.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                setCurrentQuestion(prev => ({
                                  ...prev,
                                  diagramLabels: [
                                    ...(prev.diagramLabels || []),
                                    { x, y, text: "", id: Date.now() }
                                  ]
                                }));
                              }}
                              className="max-w-full max-h-96 cursor-crosshair block"
                              style={{
                                minWidth: "200px",
                                minHeight: "200px"
                              }}
                            />
                            {/* Render Label Markers */}
                            {currentQuestion.diagramLabels?.map((label, idx) => (
                              <div
                                key={label.id || idx}
                                className="absolute pointer-events-none"
                                style={{
                                  left: `${label.x}%`,
                                  top: `${label.y}%`,
                                  transform: "translate(-50%, -100%)",
                                  zIndex: 10
                                }}
                              >
                                <div className="relative">
                                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                                    {String.fromCharCode(65 + idx)}
                                  </div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Label Text Editor Section */}
                      {currentQuestion.diagramLabels && currentQuestion.diagramLabels.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Label Descriptions & Correct Answers</h3>
                          <div className="space-y-3">
                            {currentQuestion.diagramLabels.map((label, idx) => (
                              <div key={label.id || idx} className="flex flex-col md:flex-row items-center gap-3 bg-white p-3 rounded border">
                                <div className="flex-shrink-0">
                                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                </div>
                                <div className="flex-grow w-full">
                                  <input
                                    type="text"
                                    value={label.text}
                                    onChange={e => {
                                      const diagramLabels = [...currentQuestion.diagramLabels];
                                      diagramLabels[idx] = { ...diagramLabels[idx], text: e.target.value };
                                      setCurrentQuestion(prev => ({ ...prev, diagramLabels }));
                                    }}
                                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder={`Description for label ${String.fromCharCode(65 + idx)}`}
                                  />
                                  <input
                                    type="text"
                                    value={label.correctAnswer || ""}
                                    onChange={e => {
                                      const diagramLabels = [...currentQuestion.diagramLabels];
                                      diagramLabels[idx] = { ...diagramLabels[idx], correctAnswer: e.target.value };
                                      setCurrentQuestion(prev => ({ ...prev, diagramLabels }));
                                    }}
                                    className="w-full px-3 py-2 border border-green-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    placeholder={`Correct answer for label ${String.fromCharCode(65 + idx)}`}
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    const diagramLabels = [...currentQuestion.diagramLabels];
                                    diagramLabels.splice(idx, 1);
                                    setCurrentQuestion(prev => ({ ...prev, diagramLabels }));
                                  }}
                                  className="flex-shrink-0 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                  title="Remove this label"
                                  type="button"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Instructions */}
                      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">Instructions:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Upload an image using the file input above</li>
                          <li>• Click anywhere on the image to add a label marker</li>
                          <li>• Fill in descriptions for each label in the text fields below</li>
                          <li>• Use the remove button to delete individual labels</li>
                          <li>• Use "Clear All Labels" to start over</li>
                        </ul>
                      </div>
                    </div>
                  )}



                  {currentQuestion.type === "COMPLETE_SENTENCE" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        Sentences (use <b>_</b> for blanks)
                      </label>
                      {(currentQuestion.sentences || [""]).map((sentence, sIdx) => (
                        <div key={sIdx} className="mb-4 border rounded p-3 bg-white">
                          <textarea
                            rows={2}
                            value={sentence}
                            onChange={e => {
                              const sentences = [...(currentQuestion.sentences || [])];
                              sentences[sIdx] = e.target.value;
                              // Count blanks
                              const blankCount = (e.target.value.match(/_/g) || []).length;
                              let completeSentenceAnswers = currentQuestion.completeSentenceAnswers?.[sIdx]
                                ? [...currentQuestion.completeSentenceAnswers[sIdx]]
                                : [];
                              if (blankCount > completeSentenceAnswers.length) {
                                completeSentenceAnswers = [
                                  ...completeSentenceAnswers,
                                  ...Array(blankCount - completeSentenceAnswers.length).fill("")
                                ];
                              } else if (blankCount < completeSentenceAnswers.length) {
                                completeSentenceAnswers = completeSentenceAnswers.slice(0, blankCount);
                              }
                              // Update state
                              setCurrentQuestion(prev => {
                                const updatedAnswers = [...(prev.completeSentenceAnswers || [])];
                                updatedAnswers[sIdx] = completeSentenceAnswers;
                                return {
                                  ...prev,
                                  sentences,
                                  completeSentenceAnswers: updatedAnswers
                                };
                              });
                            }}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark mb-2"
                            placeholder="Type the sentence here, use _ for each blank"
                          />
                          {/* Inputs for each blank's correct answer */}
                          {(currentQuestion.completeSentenceAnswers?.[sIdx] || []).map((ans, bIdx) => (
                            <div key={bIdx} className="flex items-center mb-2">
                              <span className="mr-2 text-gray-700">Blank {bIdx + 1}:</span>
                              <input
                                type="text"
                                value={ans}
                                onChange={e => {
                                  setCurrentQuestion(prev => {
                                    const completeSentenceAnswers = prev.completeSentenceAnswers ? [...prev.completeSentenceAnswers] : [];
                                    completeSentenceAnswers[sIdx] = completeSentenceAnswers[sIdx] ? [...completeSentenceAnswers[sIdx]] : [];
                                    completeSentenceAnswers[sIdx][bIdx] = e.target.value;
                                    return { ...prev, completeSentenceAnswers };
                                  });
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                                placeholder={`Answer for blank ${bIdx + 1}`}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            className="mt-2 text-red-500"
                            onClick={() => {
                              const sentences = [...(currentQuestion.sentences || [])];
                              const completeSentenceAnswers = [...(currentQuestion.completeSentenceAnswers || [])];
                              sentences.splice(sIdx, 1);
                              completeSentenceAnswers.splice(sIdx, 1);
                              setCurrentQuestion(prev => ({
                                ...prev,
                                sentences,
                                completeSentenceAnswers
                              }));
                            }}
                          >
                            Remove Sentence
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600"
                        onClick={() => {
                          setCurrentQuestion(prev => ({
                            ...prev,
                            sentences: [...(prev.sentences || []), ""],
                            completeSentenceAnswers: [...(prev.completeSentenceAnswers || []), []]
                          }));
                        }}
                      >
                        + Add Sentence
                      </button>
                    </div>
                  )}



                  {currentQuestion.type === "SENTENCE_ENDINGS_MATCHING"
                    &&
                    (<div className="mb-4">
                      {/* Sentence input with blank */}
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        Sentence Beginnings
                      </label>
                      {(currentQuestion.sentenceBeginnings || []).map((begin, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={begin}
                            onChange={e => {
                              const sentenceBeginnings = [...(currentQuestion.sentenceBeginnings || [])];
                              sentenceBeginnings[idx] = e.target.value;
                              setCurrentQuestion(prev => ({
                                ...prev,
                                sentenceBeginnings,
                                correctEndings: prev.correctHeadings && sentenceBeginnings.length === prev.correctHeadings.length
                                  ? prev.correctHeadings
                                  : Array(sentenceBeginnings.length).fill('')
                              }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                            placeholder={`Beginning ${idx + 1}`}
                          />
                          <button
                            type="button"
                            className="ml-2 text-red-500"
                            onClick={() => {
                              const sentenceBeginnings = [...(currentQuestion.sentenceBeginnings || [])];
                              sentenceBeginnings.splice(idx, 1);
                              setCurrentQuestion(prev => ({
                                ...prev,
                                sentenceBeginnings,
                                correctEndings: prev.correctHeadings && sentenceBeginnings.length === prev.correctHeadings.length
                                  ? prev.correctHeadings
                                  : Array(sentenceBeginnings.length).fill('')
                              }));
                            }}
                            title="Remove "
                          >✕</button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600"
                        onClick={() => {
                          setCurrentQuestion(prev => ({
                            ...prev,
                            sentenceBeginnings: [...(prev.sentenceBeginnings || []), ""]
                          }));
                        }}
                      >
                        + Add
                      </button>

                      {/* Correct answer(s) for the blank(s) */}
                      {(currentQuestion.sentenceCompletionAnswers && currentQuestion.sentenceCompletionAnswers.length > 0) && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Correct Answer(s)
                          </label>
                          {currentQuestion.sentenceCompletionAnswers.map((ans, idx) => (
                            <div key={idx} className="flex items-center mb-2">
                              <span className="mr-2 text-gray-700">Blank {idx + 1}:</span>
                              <input
                                type="text"
                                value={ans}
                                onChange={e => {
                                  const sentenceCompletionAnswers = [...currentQuestion.sentenceCompletionAnswers];
                                  sentenceCompletionAnswers[idx] = e.target.value;
                                  setCurrentQuestion(prev => ({ ...prev, sentenceCompletionAnswers }));
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                                placeholder={`Answer for blank ${idx + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="block text-sm font-medium text-gray-800 mb-1 mt-4">
                        Sentence Endings
                      </label>
                      {(currentQuestion.sentenceEndings || []).map((ending, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={ending}
                            onChange={e => {
                              const sentenceEndings = [...(currentQuestion.sentenceEndings || [])];
                              sentenceEndings[idx] = e.target.value;
                              setCurrentQuestion(prev => ({
                                ...prev,
                                sentenceEndings
                              }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                            placeholder={`Ending ${idx + 1}`}
                          />
                          <button
                            type="button"
                            className="ml-2 text-red-500"
                            onClick={() => {
                              const sentenceEndings = [...(currentQuestion.sentenceEndings || [])];
                              sentenceEndings.splice(idx, 1);
                              setCurrentQuestion(prev => ({
                                ...prev, sentenceEndings
                              }));
                            }}
                            title="Remove ending"
                          >✕</button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600"
                        onClick={() => {
                          setCurrentQuestion(prev => ({
                            ...prev,
                            sentenceEndings: [...(prev.sentenceEndings || []), ""]
                          }));
                        }}
                      >
                        + Add Ending
                      </button>

                      {currentQuestion.sentenceBeginnings && currentQuestion.sentenceEndings &&
                        currentQuestion.sentenceBeginnings.length > 0 && currentQuestion.sentenceEndings.length > 0 && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Assign correct ending to each beginning
                            </label>
                            {currentQuestion.sentenceBeginnings.map((begin, idx) => (
                              <div key={idx} className="flex items-center mb-2">
                                <span className="mr-2 text-gray-700 font-medium">Beg. {idx + 1}:</span>
                                <span className="flex-1 italic text-gray-600 truncate">{begin}</span>
                                <select
                                  value={currentQuestion.correctHeadings && currentQuestion.correctHeadings[idx] !== undefined ? currentQuestion.correctHeadings[idx] : ''}
                                  onChange={e => {
                                    const correctEndings = [...(currentQuestion.correctHeadings || Array(currentQuestion.sentenceBeginnings.length).fill(''))];
                                    correctEndings[idx] = e.target.value;
                                    setCurrentQuestion(prev => ({ ...prev, correctEndings }));
                                  }}
                                  className="ml-4 border-gray-300 rounded-md"
                                >
                                  <option value="">Select ending</option>
                                  {currentQuestion.sentenceEndings.map((ending, eIdx) => (
                                    <option key={eIdx} value={String.fromCharCode(65 + eIdx)}>
                                      {String.fromCharCode(65 + eIdx)}. {ending}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                    )}





                  {currentQuestion.type === "TRUE_FALSE_NOT_GIVEN" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        Question
                      </label>
                      <textarea
                        rows={2}
                        value={currentQuestion.text || ''}
                        onChange={e => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                        placeholder="Type the statement/question here"
                      />
                      <label className="block text-sm font-medium text-gray-800 mb-2 mt-4">
                        Correct Answer
                      </label>
                      <div className="flex space-x-6">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="correctAnswerTFNG"
                            value="true"
                            checked={currentQuestion.correctAnswer === "true"}
                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "true" }))}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-800">True</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="correctAnswerTFNG"
                            value="false"
                            checked={currentQuestion.correctAnswer === "false"}
                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "false" }))}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-800">False</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="correctAnswerTFNG"
                            value="not_given"
                            checked={currentQuestion.correctAnswer === "not_given"}
                            onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: "not_given" }))}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-800">Not Given</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {currentQuestion.type === "PARA_HEADINGS" && (
                    <div className="mb-4">
                      {/* Headings input */}
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        Headings
                      </label>
                      {(currentQuestion.headings || []).map((heading, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={heading}
                            onChange={e => {
                              const headings = [...(currentQuestion.headings || [])];
                              headings[idx] = e.target.value;
                              setCurrentQuestion(prev => ({
                                ...prev,
                                headings,
                                correctHeadings: prev.correctHeadings && headings.length === prev.correctHeadings.length
                                  ? prev.correctHeadings
                                  : Array(headings.length).fill('')
                              }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                            placeholder={`Heading ${idx + 1}`}
                          />
                          <button
                            type="button"
                            className="ml-2 text-red-500"
                            onClick={() => {
                              const headings = [...(currentQuestion.headings || [])];
                              headings.splice(idx, 1);
                              setCurrentQuestion(prev => ({
                                ...prev,
                                headings,
                                correctHeadings: prev.correctHeadings && headings.length === prev.correctHeadings.length
                                  ? prev.correctHeadings
                                  : Array(headings.length).fill('')
                              }));
                            }}
                            title="Remove heading"
                          >✕</button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600"
                        onClick={() => {
                          setCurrentQuestion(prev => ({
                            ...prev,
                            headings: [...(prev.headings || []), ""]
                          }));
                        }}
                      >
                        + Add Heading
                      </button>

                      <label className="block text-sm font-medium text-gray-800 mb-1 mt-4">
                        Paragraphs
                      </label>
                      {(currentQuestion.paragraphs || []).map((para, idx) => (
                        <div key={idx} className="flex items-center mb-2">
                          <textarea
                            rows={2}
                            value={para}
                            onChange={e => {
                              const paragraphs = [...(currentQuestion.paragraphs || [])];
                              paragraphs[idx] = e.target.value;
                              setCurrentQuestion(prev => ({
                                ...prev,
                                paragraphs
                              }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                            placeholder={`Paragraph ${idx + 1}`}
                          />
                          <button
                            type="button"
                            className="ml-2 text-red-500"
                            onClick={() => {
                              const paragraphs = [...(currentQuestion.paragraphs || [])];
                              paragraphs.splice(idx, 1);
                              setCurrentQuestion(prev => ({
                                ...prev,
                                paragraphs
                              }));
                            }}
                            title="Remove paragraph"
                          >✕</button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-blue-600"
                        onClick={() => {
                          setCurrentQuestion(prev => ({
                            ...prev,
                            paragraphs: [...(prev.paragraphs || []), ""]
                          }));
                        }}
                      >
                        + Add Paragraph
                      </button>

                      {/* Map each paragraph to a heading */}
                      {currentQuestion.paragraphs && currentQuestion.headings && currentQuestion.paragraphs.length > 0 && currentQuestion.headings.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Assign correct heading to each paragraph
                          </label>
                          {currentQuestion.paragraphs.map((para, idx) => (
                            <div key={idx} className="flex items-center mb-2">
                              <span className="mr-2 text-gray-700 font-medium">Paragraph {idx + 1}:</span>
                              <span className="flex-1 italic text-gray-600 truncate">{para}</span>
                              <select
                                value={currentQuestion.correctHeadings && currentQuestion.correctHeadings[idx] !== undefined ? currentQuestion.correctHeadings[idx] : ''}
                                onChange={e => {
                                  const correctHeadings = [...(currentQuestion.correctHeadings || Array(currentQuestion.paragraphs.length).fill(''))];
                                  correctHeadings[idx] = e.target.value;
                                  setCurrentQuestion(prev => ({ ...prev, correctHeadings }));
                                }}
                                className="ml-4 border-gray-300 rounded-md"
                              >
                                <option value="">Select heading</option>
                                {currentQuestion.headings.map((heading, hIdx) => (
                                  <option key={hIdx} value={heading}>{heading}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {currentQuestion.type === "FILL_BLANK" && (
                    <div className="mb-4">
                      {/* Sentence input with blanks */}
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        Sentence (use <b>_</b> for blanks)
                      </label>
                      <textarea
                        rows={2}
                        value={currentQuestion.text}
                        onChange={e => {
                          const text = e.target.value;
                          // Count blanks
                          const blankCount = (text.match(/_/g) || []).length;
                          // Adjust answers array to match blank count
                          setCurrentQuestion(prev => {
                            let fillBlankAnswers = prev.fillBlankAnswers ? [...prev.fillBlankAnswers] : [];
                            if (blankCount > fillBlankAnswers.length) {
                              // Add empty answers for new blanks
                              fillBlankAnswers = [
                                ...fillBlankAnswers,
                                ...Array(blankCount - fillBlankAnswers.length).fill("")
                              ];
                            } else if (blankCount < fillBlankAnswers.length) {
                              // Remove extra answers if blanks reduced
                              fillBlankAnswers = fillBlankAnswers.slice(0, blankCount);
                            }
                            return {
                              ...prev,
                              text,
                              fillBlankAnswers
                            };
                          });
                        }}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                        placeholder="Type the sentence here, use _ for each blank"
                      />

                      {/* Inputs for each blank's correct answer */}
                      {(currentQuestion.fillBlankAnswers && currentQuestion.fillBlankAnswers.length > 0) && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-800 mb-2">
                            Correct Answers for Each Blank
                          </label>
                          {currentQuestion.fillBlankAnswers.map((ans, idx) => (
                            <div key={idx} className="flex items-center mb-2">
                              <span className="mr-2 text-gray-700">Blank {idx + 1}:</span>
                              <input
                                type="text"
                                value={ans}
                                onChange={e => {
                                  setCurrentQuestion(prev => {
                                    const fillBlankAnswers = prev.fillBlankAnswers ? [...prev.fillBlankAnswers] : [];
                                    fillBlankAnswers[idx] = e.target.value;
                                    return { ...prev, fillBlankAnswers };
                                  });
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 input-dark"
                                placeholder={`Answer for blank ${idx + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
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