"use client";

import { useState, useEffect } from 'react';
import ListeningAudioPlayer from '@/components/ListeningAudioPlayer';
import ListeningAnswerForm from '@/components/ListeningAnswerForm';
import ListeningScoreCalculator from '@/components/ListeningScoreCalculator';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  audioFile: string;
  correctAnswer: string;
}

export default function ListeningPracticePage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch questions when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/listening/questions');
        const data = await response.json();
        setQuestions(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSubmit = (answer: string) => {
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Check if answer is correct
    if (answer === questions[currentQuestion].correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Move to next question or complete test
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsTestComplete(true);
    }
  };

  const handleAnswerSave = (answer: string) => {
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleAudioComplete = () => {
    // Enable answer submission when audio is complete
    // This could be used to enforce listening to the entire audio
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isTestComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <ListeningScoreCalculator
          totalQuestions={questions.length}
          correctAnswers={correctAnswers}
        />
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Answers</h3>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="text-sm text-gray-600">Question {index + 1}</div>
                <div className="mt-1 text-gray-900">{question.questionText}</div>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">Your answer:</div>
                  <div className="text-gray-900">{answers[question.id] || 'Not answered'}</div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-600">Correct answer:</div>
                  <div className="text-green-600">{question.correctAnswer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-900">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <div className="text-sm text-gray-600">
            {Math.round((correctAnswers / questions.length) * 100)}% Complete
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        <ListeningAudioPlayer
          src={currentQuestionData.audioFile}
          title="Listen to the audio and answer the question below"
          onComplete={handleAudioComplete}
          maxPlays={1}
        />

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <ListeningAnswerForm
            questionId={currentQuestionData.id}
            questionType={currentQuestionData.questionType}
            options={currentQuestionData.options}
            onSubmit={handleAnswerSubmit}
            onSave={handleAnswerSave}
            initialAnswer={answers[currentQuestionData.id]}
          />
        </div>
      </div>
    </div>
  );
} 