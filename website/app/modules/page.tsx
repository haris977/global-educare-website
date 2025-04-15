import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const moduleData = [
  {
    id: "listening",
    title: "Listening",
    description: "Improve your ability to understand spoken English with various accents and contexts.",
    features: [
      "Audio comprehension exercises from beginner to advanced",
      "Practice with different accents and speaking styles",
      "Multiple-choice, gap-filling, and short answer questions",
      "Detailed explanations and transcripts"
    ],
    color: "from-blue-500 to-indigo-600",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    levelOptions: [
      { band: "4.0-5.0", level: "Basic" },
      { band: "5.5-6.5", level: "Intermediate" },
      { band: "7.0-9.0", level: "Advanced" }
    ]
  },
  {
    id: "reading",
    title: "Reading",
    description: "Enhance your reading comprehension with diverse text passages of varying complexity.",
    features: [
      "Various text types including academic, descriptive, and factual",
      "Multiple-choice, matching, true/false/not given questions",
      "Techniques for skimming, scanning, and detailed reading",
      "Step-by-step strategies for each question type"
    ],
    color: "from-green-500 to-teal-600",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    levelOptions: [
      { band: "4.0-5.0", level: "Basic" },
      { band: "5.5-6.5", level: "Intermediate" },
      { band: "7.0-9.0", level: "Advanced" }
    ]
  },
  {
    id: "writing",
    title: "Writing",
    description: "Master the art of writing clear, coherent, and well-structured responses for IELTS tasks.",
    features: [
      "Task 1: Data interpretation, process explanation, object description",
      "Task 2: Essay writing on various topics",
      "Model answers with detailed explanations",
      "Personalized feedback and evaluation based on IELTS criteria"
    ],
    color: "from-purple-500 to-indigo-600",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    levelOptions: [
      { band: "4.0-5.0", level: "Basic" },
      { band: "5.5-6.5", level: "Intermediate" },
      { band: "7.0-9.0", level: "Advanced" }
    ]
  },
  {
    id: "speaking",
    title: "Speaking",
    description: "Develop confidence and fluency in spoken English with guided practice and feedback.",
    features: [
      "Part 1: Introduction and interview questions",
      "Part 2: Individual long turn with topic cards",
      "Part 3: Two-way discussion questions",
      "Self-recording capability with sample answers for comparison"
    ],
    color: "from-yellow-500 to-orange-600",
    icon: (
      <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    levelOptions: [
      { band: "4.0-5.0", level: "Basic" },
      { band: "5.5-6.5", level: "Intermediate" },
      { band: "7.0-9.0", level: "Advanced" }
    ]
  }
];

export default function ModulesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        {/* Header */}
        <div className="bg-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                IELTS Preparation Modules
              </h1>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Comprehensive preparation across all four IELTS modules, structured by difficulty levels to match your target band score.
              </p>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-16">
            {moduleData.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${module.color} px-6 py-8 lg:flex lg:items-center lg:justify-between`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">{module.icon}</div>
                    <div className="ml-6">
                      <h2 className="text-2xl font-bold text-white">{module.title}</h2>
                      <p className="mt-2 text-lg text-indigo-100">{module.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 lg:mt-0">
                    <Link href={`/modules/${module.id}`} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50">
                      Explore {module.title} Module
                    </Link>
                  </div>
                </div>

                <div className="px-6 py-8">
                  <h3 className="text-lg font-medium text-gray-900">Key Features:</h3>
                  <ul className="mt-4 space-y-3">
                    {module.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900">Available Difficulty Levels:</h3>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {module.levelOptions.map((option) => (
                        <div key={option.level} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                          <h4 className="text-base font-medium text-gray-900">{option.level}</h4>
                          <p className="mt-1 text-sm text-gray-600">Target Band: {option.band}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Tests Section */}
        <div className="bg-indigo-700 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Full IELTS Practice Tests
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-indigo-200">
                  Put your skills to the test with our full-length IELTS practice tests. Get comprehensive feedback and a predicted band score for each module.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
                <Link href="/practice-tests" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-100">
                  View Practice Tests
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="bg-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Start Your IELTS Preparation Today
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Begin with a 3-day free trial to experience our comprehensive learning platform with limited content.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Start Free Trial
                </Link>
                <Link href="/pricing" className="ml-4 inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 