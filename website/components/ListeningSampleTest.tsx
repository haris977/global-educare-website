"use client";

import { useState } from 'react';
import AudioPlayer from './AudioPlayer';

// Reliable audio URLs with spoken content (CORS-friendly)
const sampleAudioUrls = [
  'https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg.wav', // Lincoln's Gettysburg Address
  'https://www2.cs.uic.edu/~i101/SoundFiles/taunt.wav',     // Monty Python taunt
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Music sample
];

// Questions that are appropriate for the audio content
const sampleQuestions = [
  {
    id: 'q1',
    text: 'How many speakers can you hear in the first audio?',
    options: ['One speaker', 'Two speakers', 'Three speakers', 'Four speakers'],
    correctAnswer: 'One speaker',
    explanation: 'The first audio contains a single speaker delivering a speech.'
  },
  {
    id: 'q2',
    text: 'What is the tone of the second audio clip?',
    options: ['Formal', 'Casual', 'Humorous', 'Instructional'],
    correctAnswer: 'Humorous',
    explanation: 'The audio has a comedic or humorous tone.'
  },
  {
    id: 'q3',
    text: 'The third audio sample contains _____ as its main element.',
    type: 'fill-blank',
    correctAnswer: 'music',
    explanation: 'The third audio sample contains instrumental music.'
  },
];

export default function ListeningSampleTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState<Record<string, boolean>>({});
  
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleReset = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setAudioPlayed({});
  };
  
  const handleAudioPlay = () => {
    setAudioPlayed(prev => ({
      ...prev,
      [currentQuestion]: true
    }));
  };
  
  const calculateScore = () => {
    let correct = 0;
    for (const q of sampleQuestions) {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    }
    return {
      correct,
      total: sampleQuestions.length,
      percentage: Math.round((correct / sampleQuestions.length) * 100)
    };
  };
  
  const currentQ = sampleQuestions[currentQuestion];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample Listening Test</h2>
      
      {!showResults ? (
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Question {currentQuestion + 1} of {sampleQuestions.length}</span>
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {Math.round(((currentQuestion + 1) / sampleQuestions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm text-blue-800 border border-blue-100">
            <p className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Important:</strong> Listen to the audio by pressing the play button below before answering</span>
            </p>
          </div>
          
          <AudioPlayer 
            src={sampleAudioUrls[currentQuestion % sampleAudioUrls.length]} 
            title={`Listen to Audio Sample ${currentQuestion + 1}`}
          />
          
          <div className="mt-6 mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-lg font-medium text-gray-900 mb-4">{currentQ.text}</p>
            
            {currentQ.type === 'fill-blank' ? (
              <div>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Type your answer here"
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <div key={option} className={`flex items-start p-3 rounded-md ${userAnswers[currentQ.id] === option ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center h-5">
                      <input
                        id={`question-${currentQ.id}-${option}`}
                        name={`question-${currentQ.id}`}
                        type="radio"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        checked={userAnswers[currentQ.id] === option}
                        onChange={() => handleAnswerSelect(currentQ.id, option)}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor={`question-${currentQ.id}-${option}`} className="font-medium text-gray-700 cursor-pointer">
                        {option}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-md ${
                currentQuestion === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={!userAnswers[currentQ.id]}
              className={`px-4 py-2 rounded-md text-white ${
                userAnswers[currentQ.id]
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-400 cursor-not-allowed'
              }`}
            >
              {currentQuestion === sampleQuestions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {(() => {
              const score = calculateScore();
              return (
                <>
                  <h2 className="text-xl font-bold text-gray-900">Test Completed!</h2>
                  <p className="mt-1 text-gray-700">You got {score.correct} out of {score.total} questions correct.</p>
                  
                  <div className="mt-4 mx-auto max-w-md">
                    <div className="relative h-5 bg-gray-200 rounded-full">
                      <div 
                        className={
                          score.percentage >= 80 ? "h-5 bg-green-500 rounded-full" : 
                          score.percentage >= 60 ? "h-5 bg-yellow-500 rounded-full" : 
                          "h-5 bg-red-500 rounded-full"
                        }
                        style={{ width: `${score.percentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-sm font-medium text-gray-700">{score.percentage}% Score</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
          
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900">Question Review</h3>
            {sampleQuestions.map((q) => {
              const isCorrect = userAnswers[q.id] === q.correctAnswer;
              const answerStatus = userAnswers[q.id] 
                ? (isCorrect ? 'Correct' : 'Incorrect') 
                : 'Not answered';
              
              return (
                <div key={q.id} className={`p-4 rounded-lg ${
                  !userAnswers[q.id] ? 'bg-gray-50 border border-gray-200' :
                  isCorrect ? 'bg-green-50 border border-green-200' : 
                  'bg-red-50 border border-red-200'
                }`}>
                  <p className="font-medium text-gray-900">{q.text}</p>
                  <div className="mt-3">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        !userAnswers[q.id] ? 'bg-gray-100 text-gray-800' :
                        isCorrect ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {answerStatus}
                      </span>
                    </div>
                    <p className="text-sm mt-2">Your answer: <span className="font-medium">{userAnswers[q.id] || 'No answer provided'}</span></p>
                    <p className="text-sm mt-1">Correct answer: <span className="font-medium">{q.correctAnswer}</span></p>
                    {q.explanation && (
                      <p className="text-sm mt-2 text-gray-600 bg-gray-50 p-2 rounded">{q.explanation}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 