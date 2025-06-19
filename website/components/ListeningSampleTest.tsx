import React, { useState } from 'react';
import ListeningAudioPlayer from './ListeningAudioPlayer';

// Sample audio files with reliable URLs
const sampleAudioUrls = [
  {
    local: '/audio/sample1.mp3',
    fallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    local: '/audio/sample2.mp3',
    fallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    local: '/audio/sample3.mp3',
    fallback: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

// Sample questions for the listening test
const questions = [
  {
    id: 1,
    question: "What is the main topic of the conversation?",
    options: [
      "Planning a vacation",
      "Discussing work schedule",
      "Making dinner plans",
      "Organizing a meeting"
    ],
    correctAnswer: "Planning a vacation"
  },
  {
    id: 2,
    question: "When are they planning to meet?",
    options: [
      "Next Monday",
      "Next Tuesday",
      "Next Wednesday",
      "Next Thursday"
    ],
    correctAnswer: "Next Tuesday"
  },
  {
    id: 3,
    question: "What is the main purpose of the meeting?",
    options: [
      "To discuss project deadlines",
      "To review team performance",
      "To plan future projects",
      "To address client concerns"
    ],
    correctAnswer: "To discuss project deadlines"
  }
];

const ListeningSampleTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
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

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setIsPlaying(false);
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Test Results</h2>
        <p className="text-lg mb-4">
          Your score: {calculateScore()} out of {questions.length}
        </p>
        <button
          onClick={resetTest}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Sample Listening Test</h2>
      
      <div className="mb-6">
        <ListeningAudioPlayer
          src={sampleAudioUrls[currentQuestion].fallback}
          title={`Question ${currentQuestion + 1} Audio`}
          onComplete={() => setIsPlaying(false)}
          maxPlays={3}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </h3>
        <p className="mb-4">{questions[currentQuestion].question}</p>
        
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option}
                checked={userAnswers[currentQuestion] === option}
                onChange={() => handleAnswerSelect(option)}
                className="form-radio"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default ListeningSampleTest;
