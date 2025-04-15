"use client";

interface StepLanguageLevelProps {
  onNext: () => void;
  onPrev: () => void;
  formData: {
    languageLevel: string;
    [key: string]: any;
  };
  updateFormData: (data: { languageLevel: string }) => void;
}

export default function StepLanguageLevel({
  onNext,
  onPrev,
  formData,
  updateFormData,
}: StepLanguageLevelProps) {
  const levels = [
    {
      id: "beginner",
      title: "Beginner (A1)",
      description: "You can use basic phrases and everyday expressions"
    },
    {
      id: "elementary",
      title: "Elementary (A2)",
      description: "You can communicate in simple, routine situations"
    },
    {
      id: "intermediate",
      title: "Intermediate (B1)",
      description: "You can deal with most travel situations and describe experiences"
    },
    {
      id: "upper_intermediate",
      title: "Upper Intermediate (B2)",
      description: "You can interact with fluency and spontaneity on a wide range of topics"
    },
    {
      id: "advanced",
      title: "Advanced (C1)",
      description: "You can express yourself fluently without obvious searching for expressions"
    },
    {
      id: "proficient",
      title: "Proficient (C2)",
      description: "You can understand virtually everything heard or read with ease"
    }
  ];

  const handleLevelSelect = (levelId: string) => {
    updateFormData({ languageLevel: levelId });
  };

  const handleContinue = () => {
    if (formData.languageLevel) {
      onNext();
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          What's your English level?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          This helps us personalize your learning experience
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {levels.map((level) => (
          <div 
            key={level.id}
            onClick={() => handleLevelSelect(level.id)}
            className={`cursor-pointer border ${
              formData.languageLevel === level.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50"
            } rounded-lg p-4 transition-colors`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`h-5 w-5 rounded-full border ${
                  formData.languageLevel === level.id
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300"
                } flex items-center justify-center`}>
                  {formData.languageLevel === level.id && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className="ml-3 text-left">
                <h3 className="text-sm font-medium text-gray-900">{level.title}</h3>
                <p className="text-xs text-gray-500">{level.description}</p>
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
          disabled={!formData.languageLevel}
          className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            formData.languageLevel
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