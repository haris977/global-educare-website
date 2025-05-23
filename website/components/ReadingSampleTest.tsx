"use client";

import { useState } from 'react';

// Sample reading passage
const samplePassage = `
Climate Change and Global Food Security

Climate change is already affecting agriculture, with effects unevenly distributed across the world. Future climate change will likely negatively affect crop production in low latitude countries, while effects in northern latitudes may be positive or negative. Climate change will probably increase the risk of food insecurity for some vulnerable groups, such as the poor.

Food security is defined as when all people, at all times, have physical and economic access to sufficient, safe, and nutritious food to meet their dietary needs and food preferences for an active and healthy life. 

Agriculture is important for food security in two ways: it produces the food people eat; and, perhaps just as important, it provides the primary source of livelihood for 36% of the world's total workforce. In the heavily populated countries of Asia and the Pacific, this figure approaches 50%. If agricultural production in the low-income developing countries of Asia and Africa is adversely affected by climate change, the livelihoods of large numbers of the rural poor will be put at risk and their vulnerability to food insecurity increased.

Many of these at-risk populations are highly vulnerable to extreme events like droughts and floods, which can destroy their crops and threaten their food security. The impact of such extreme events is often felt most by rural populations in developing countries, which rely on agriculture for their livelihoods. When these production shocks occur, they can affect the economic output of the agricultural sector, which can in turn affect income and access to food.

The adaptive capacity of farmers in developing countries is generally considered to be very low. Food systems in these countries are most vulnerable to climate change, and research shows that crop yields in these regions may decrease quite dramatically, amplifying the risk of hunger due to decreased food availability. Another important issue is the accessibility of food, determined by income levels, food prices, and the existence of infrastructure.
`;

// Questions appropriate for the reading passage
const sampleQuestions = [
  {
    id: 'q1',
    text: 'According to the passage, climate change effects on agriculture are:',
    options: [
      'Equally distributed across the world',
      'Only negative in all regions',
      'Unevenly distributed across the world',
      'Only affecting northern latitudes'
    ],
    correctAnswer: 'Unevenly distributed across the world',
    explanation: 'The passage states that "Climate change is already affecting agriculture, with effects unevenly distributed across the world."'
  },
  {
    id: 'q2',
    text: 'What percentage of the world\'s total workforce has agriculture as their primary source of livelihood?',
    options: ['25%', '36%', '50%', '75%'],
    correctAnswer: '36%',
    explanation: 'The passage mentions that agriculture "provides the primary source of livelihood for 36% of the world\'s total workforce."'
  },
  {
    id: 'q3',
    text: 'Food security is achieved when people have:',
    type: 'multiple-choice',
    options: [
      'Access to any type of food',
      'Physical access but not economic access to food',
      'Physical and economic access to sufficient, safe, and nutritious food',
      'Occasional access to nutritious food'
    ],
    correctAnswer: 'Physical and economic access to sufficient, safe, and nutritious food',
    explanation: 'The passage defines food security as "when all people, at all times, have physical and economic access to sufficient, safe, and nutritious food to meet their dietary needs and food preferences for an active and healthy life."'
  },
  {
    id: 'q4',
    text: 'Which of the following statements is TRUE according to the passage?',
    type: 'true-false-not-given',
    options: [
      'Climate change will definitely increase food production in all regions',
      'The adaptive capacity of farmers in developing countries is generally low',
      'Extreme events like droughts only affect developed countries',
      'Food prices have no impact on food accessibility'
    ],
    correctAnswer: 'The adaptive capacity of farmers in developing countries is generally low',
    explanation: 'The passage states that "The adaptive capacity of farmers in developing countries is generally considered to be very low."'
  },
  {
    id: 'q5',
    text: 'Complete the sentence: In Asia and the Pacific, agriculture provides the primary source of livelihood for almost _____ of the workforce.',
    type: 'fill-blank',
    correctAnswer: '50%',
    explanation: 'The passage states "In the heavily populated countries of Asia and the Pacific, this figure approaches 50%."'
  },
];

export default function ReadingSampleTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  
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
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample Reading Test</h2>
      
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
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Reading Passage</h3>
            <div className="max-h-60 overflow-y-auto p-4 bg-white rounded border border-gray-200">
              <p className="text-gray-800 whitespace-pre-line">{samplePassage}</p>
            </div>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-4">{currentQ.text}</p>
            
            {currentQ.type === 'fill-blank' ? (
              <div>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                  placeholder="Type your answer here"
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <div key={option} className={`flex items-start p-3 rounded-md ${userAnswers[currentQ.id] === option ? 'bg-purple-50 border border-purple-200' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center h-5">
                      <input
                        id={`question-${currentQ.id}-${option}`}
                        name={`question-${currentQ.id}`}
                        type="radio"
                        className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
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
          
          <div className="mt-8 flex justify-between">
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
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-purple-400 cursor-not-allowed'
              }`}
            >
              {currentQuestion === sampleQuestions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
              <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          
          <div className="mt-8 space-y-6">
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
          
          <div className="mt-8 text-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 