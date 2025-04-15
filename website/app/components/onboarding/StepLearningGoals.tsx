"use client";

interface StepLearningGoalsProps {
  onNext: () => void;
  onPrev: () => void;
  formData: {
    learningGoals: string[];
    [key: string]: any;
  };
  updateFormData: (data: { learningGoals: string[] }) => void;
}

export default function StepLearningGoals({
  onNext,
  onPrev,
  formData,
  updateFormData,
}: StepLearningGoalsProps) {
  const goals = [
    {
      id: "general_english",
      title: "General English",
      icon: "🌎",
      description: "Improve your everyday English for travel, work and life"
    },
    {
      id: "business_english",
      title: "Business English",
      icon: "💼",
      description: "Communicate effectively in professional environments"
    },
    {
      id: "academic_english",
      title: "Academic English",
      icon: "🎓",
      description: "Enhance your English for studies and research"
    },
    {
      id: "conversation",
      title: "Conversation Skills",
      icon: "💬",
      description: "Become more confident in speaking English"
    },
    {
      id: "pronunciation",
      title: "Pronunciation",
      icon: "🗣️",
      description: "Improve your accent and be better understood"
    },
    {
      id: "listening",
      title: "Listening Comprehension",
      icon: "👂",
      description: "Better understand spoken English in various contexts"
    },
    {
      id: "ielts_preparation",
      title: "IELTS Preparation",
      icon: "📝",
      description: "Prepare for the IELTS exam and improve your score"
    },
    {
      id: "toefl_preparation",
      title: "TOEFL Preparation",
      icon: "📊",
      description: "Prepare for the TOEFL exam and improve your score"
    }
  ];

  const toggleGoal = (goalId: string) => {
    const currentGoals = [...formData.learningGoals];
    
    if (currentGoals.includes(goalId)) {
      updateFormData({ 
        learningGoals: currentGoals.filter(id => id !== goalId) 
      });
    } else {
      updateFormData({ 
        learningGoals: [...currentGoals, goalId] 
      });
    }
  };

  const handleContinue = () => {
    if (formData.learningGoals.length > 0) {
      onNext();
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          What do you want to learn?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Select all that apply to customize your learning plan
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {goals.map((goal) => (
          <div 
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`cursor-pointer border ${
              formData.learningGoals.includes(goal.id)
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
            } rounded-lg p-4 transition-colors`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 text-xl mr-2">
                {goal.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{goal.title}</h3>
                  <div className={`h-5 w-5 rounded border ${
                    formData.learningGoals.includes(goal.id)
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-gray-300"
                  } flex items-center justify-center`}>
                    {formData.learningGoals.includes(goal.id) && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{goal.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={formData.learningGoals.length === 0}
          className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            formData.learningGoals.length > 0
              ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              : "bg-indigo-300 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
} 