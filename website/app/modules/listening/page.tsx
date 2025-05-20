"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ListeningSampleTest from "@/components/ListeningSampleTest";

const listeningLevels = [
  {
    level: "Basic (Bands 4.0-5.0)",
    description: "Introduction to IELTS listening with simple exercises focused on everyday conversations and basic instructions.",
    topics: [
      "Simple conversations and dialogues",
      "Basic instructional content",
      "Straightforward announcements",
      "Clear speech with minimal accents"
    ],
    questionTypes: [
      "Form completion with given options",
      "Multiple choice with straightforward options",
      "Simple matching tasks",
      "Basic table completion"
    ],
    sampleContent: {
      title: "At the Restaurant",
      description: "A conversation between a customer and a waiter about placing an order at a restaurant."
    }
  },
  {
    level: "Intermediate (Bands 5.5-6.5)",
    description: "More challenging listening exercises featuring a wider range of accents and more complex conversations in various settings.",
    topics: [
      "Academic discussions and lectures",
      "Workplace conversations",
      "Detailed descriptions and explanations",
      "Various English accents (UK, US, Australian)"
    ],
    questionTypes: [
      "Form/table/note completion with minimal word limits",
      "Multiple choice with detailed options",
      "Sentence completion tasks",
      "Matching with more options"
    ],
    sampleContent: {
      title: "University Campus Tour",
      description: "A guide explaining facilities and services available on a university campus to new students."
    }
  },
  {
    level: "Advanced (Bands 7.0-9.0)",
    description: "Complex listening tasks featuring academic lectures, group discussions, and content with challenging vocabulary and regional accents.",
    topics: [
      "Complex academic lectures",
      "Multi-speaker discussions",
      "Technical descriptions and explanations",
      "Various regional and international accents"
    ],
    questionTypes: [
      "Open-ended form/table/note completion",
      "Multiple choice with nuanced options",
      "Summary completion tasks",
      "Short answer questions"
    ],
    sampleContent: {
      title: "Climate Change Discussion Panel",
      description: "A panel of experts discussing the environmental and economic impacts of climate change policies."
    }
  }
];

const tips = [
  {
    title: "Read instructions carefully",
    description: "Make sure you understand exactly what you need to do for each section before the audio begins."
  },
  {
    title: "Preview the questions",
    description: "Use the time given before each section to read through the questions and predict what the answers might be."
  },
  {
    title: "Listen for signpost words",
    description: "Pay attention to transition words like 'however,' 'furthermore,' and 'in conclusion' which signal important information."
  },
  {
    title: "Watch for distractors",
    description: "The audio may contain information that seems to answer a question but is then corrected or clarified later."
  },
  {
    title: "Check your spelling",
    description: "In the IELTS Listening test, spelling errors are marked as incorrect, so double-check your answers."
  },
  {
    title: "Write answers as you listen",
    description: "Don't wait until the end to write down your answers - you might forget them."
  }
];

export default function ListeningModulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        {/* Hero Section */}
        <div className="relative bg-blue-700">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-600 mix-blend-multiply" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">IELTS Listening Module</h1>
            <p className="mt-6 max-w-3xl text-xl text-white">
              Improve your ability to understand spoken English with various accents and in different contexts, from everyday conversations to academic lectures.
            </p>
          </div>
        </div>

        {/* Sample Test */}
        <div className="bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Try a Sample Test
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-700">
                Experience a real IELTS Listening test with our interactive sample. Listen to the audio and answer the questions.
              </p>
              <div className="mt-4 text-sm text-blue-700 bg-blue-50 p-4 rounded-md inline-block border border-blue-100">
                <svg className="inline-block h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">How to use the audio player:</span>
                <ul className="mt-2 text-left list-disc pl-5 space-y-1">
                  <li>Click the <span className="font-semibold">blue play button</span> to start the audio</li>
                  <li>Use the <span className="font-semibold">volume slider</span> if needed to adjust sound level</li>
                  <li>The audio will only play <span className="font-semibold">once</span>, just like in the real test</li>
                </ul>
              </div>
            </div>
            
            <ListeningSampleTest />
            
            <div className="mt-8 text-center">
              <Link 
                href="/practice-tests" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Practice Tests
              </Link>
            </div>
          </div>
        </div>

        {/* Module Overview */}
        <div className="bg-gray-50 py-16 sm:py-24 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Module Overview
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-700">
                  The IELTS Listening test takes approximately 30 minutes, with an additional 10 minutes to transfer your answers to the answer sheet. It consists of four sections, each with ten questions.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Section 1</h3>
                      <p className="mt-2 text-base text-gray-700">A conversation between two people set in an everyday social context.</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Section 2</h3>
                      <p className="mt-2 text-base text-gray-700">A monologue set in an everyday social context, e.g., a speech about local facilities.</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Section 3</h3>
                      <p className="mt-2 text-base text-gray-700">A conversation between up to four people set in an educational or training context.</p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Section 4</h3>
                      <p className="mt-2 text-base text-gray-700">A monologue on an academic subject, e.g., a university lecture.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 lg:mt-0 lg:grid-cols-2">
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">30</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">Minutes</div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">4</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">Sections</div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">40</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">Questions</div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">1x</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">Playback</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Levels */}
        <div className="bg-white py-16 sm:py-24 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Difficulty Levels
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-700">
                Our listening materials are categorized by difficulty to help you progressively build your skills toward your target band score.
              </p>
            </div>

            <div className="mt-12 space-y-8">
              {listeningLevels.map((level, index) => (
                <div key={index} className="bg-white shadow-md overflow-hidden rounded-lg border border-gray-200">
                  <div className="px-4 py-5 sm:px-6 bg-blue-700">
                    <h3 className="text-xl leading-6 font-medium text-white">{level.level}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-white">{level.description}</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Topics Covered</h4>
                        <ul className="mt-4 space-y-3">
                          {level.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="ml-3 text-base text-gray-700">{topic}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">Question Types</h4>
                        <ul className="mt-4 space-y-3">
                          {level.questionTypes.map((type, typeIndex) => (
                            <li key={typeIndex} className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <p className="ml-3 text-base text-gray-700">{type}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-8 bg-blue-50 p-5 rounded-md border border-blue-100">
                      <h4 className="text-lg font-medium text-gray-900">Sample Content: {level.sampleContent.title}</h4>
                      <p className="mt-2 text-base text-gray-700">{level.sampleContent.description}</p>
                      <div className="mt-4">
                        <Link href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          Try Free Sample
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips and Strategies */}
        <div className="bg-gray-50 py-16 sm:py-24 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Tips and Strategies for Success
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-700">
                Improve your IELTS Listening score with these proven strategies from our expert instructors.
              </p>
            </div>

            <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {tips.map((tip, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                        <span className="text-lg font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{tip.title}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-base text-gray-700">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="bg-blue-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to improve your listening skills?</span>
              <span className="block text-white opacity-90">Start your IELTS preparation journey today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                  Start Free Trial
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="/modules" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                  Explore Other Modules
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