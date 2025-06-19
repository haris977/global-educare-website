import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

interface ListeningTestProps {
  testId: string;
}

export default function ListeningTest({ testId }: ListeningTestProps) {
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [audioPlayCount, setAudioPlayCount] = useState(0);
  const [isAudioComplete, setIsAudioComplete] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await api.Tests.getTestById(testId);
        if (response.success) {
          setTest(response.data);
        } else {
          setError('Failed to load test');
        }
      } catch (error) {
        setError('Error loading test');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleAudioComplete = () => {
    setIsAudioComplete(true);
  };

  const handleAnswerSubmit = async (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleTestComplete = async () => {
    try {
      const response = await api.Tests.submitTestAnswers(testId, answers);
      if (response.success) {
        router.push(`/test-results/${testId}`);
      } else {
        setError('Failed to submit test');
      }
    } catch (error) {
      setError('Error submitting test');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Test not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{test.title}</h1>
        
        {/* Audio Player */}
        {test.audioFile && (
          <div className="mb-8">
            <audio
              src={test.audioFile}
              controls
              onEnded={handleAudioComplete}
              onPlay={() => setAudioPlayCount(prev => prev + 1)}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              Plays remaining: {Math.max(0, 3 - audioPlayCount)}
            </p>
          </div>
        )}

        {/* Questions */}
        {test.sections.map((section: any, sectionIndex: number) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Section {sectionIndex + 1}: {section.title}
            </h2>
            <p className="text-gray-600 mb-4">{section.instructions}</p>

            {section.questions.map((question: any) => (
              <div key={question.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-2">
                  {question.text}
                </p>

                {/* Question Input */}
                {question.type === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-2">
                    {question.options?.map((option: string, index: number) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
                          className="form-radio text-indigo-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'TRUE_FALSE' && (
                  <div className="space-y-2">
                    {['True', 'False'].map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
                          className="form-radio text-indigo-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'SHORT_ANSWER' && (
                  <input
                    type="text"
                    onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter your answer"
                  />
                )}

                {question.type === 'FILL_BLANK' && (
                  <div className="space-y-2">
                    {question.text.split('_____').map((part: string, index: number) => (
                      <div key={index} className="inline">
                        {part}
                        {index < question.text.split('_____').length - 1 && (
                          <input
                            type="text"
                            onChange={(e) => handleAnswerSubmit(`${question.id}_${index}`, e.target.value)}
                            className="mx-2 w-24 inline-block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={handleTestComplete}
            disabled={!isAudioComplete}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isAudioComplete
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Test
          </button>
          {!isAudioComplete && (
            <p className="text-sm text-red-600 mt-2">
              Please listen to the complete audio before submitting
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 