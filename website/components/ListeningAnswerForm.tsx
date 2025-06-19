"use client";

import { useState } from 'react';

interface ListeningAnswerFormProps {
  questionId: string;
  questionType: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  onSubmit: (answer: string) => void;
  onSave?: (answer: string) => void;
  initialAnswer?: string;
  disabled?: boolean;
}

export default function ListeningAnswerForm({
  questionId,
  questionType,
  options,
  onSubmit,
  onSave,
  initialAnswer = '',
  disabled = false
}: ListeningAnswerFormProps) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && answer.trim()) {
      onSubmit(answer);
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newAnswer = e.target.value;
    setAnswer(newAnswer);
    onSave?.(newAnswer);
  };

  const renderInput = () => {
    switch (questionType) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-2">
            {options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${questionId}`}
                  value={option}
                  checked={answer === option}
                  onChange={handleChange}
                  disabled={disabled || isSubmitted}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'FILL_BLANK':
      case 'SHORT_ANSWER':
        return (
          <textarea
            value={answer}
            onChange={handleChange}
            disabled={disabled || isSubmitted}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Type your answer here..."
          />
        );

      case 'TRUE_FALSE':
        return (
          <div className="flex space-x-4">
            {['True', 'False'].map((option) => (
              <label key={option} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${questionId}`}
                  value={option}
                  checked={answer === option}
                  onChange={handleChange}
                  disabled={disabled || isSubmitted}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderInput()}
      
      {!isSubmitted && !disabled && (
        <button
          type="submit"
          disabled={!answer.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      )}
      
      {isSubmitted && (
        <div className="text-green-600 font-medium">
          Answer submitted
        </div>
      )}
    </form>
  );
} 