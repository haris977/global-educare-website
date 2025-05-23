"use client";

import ReadingSampleTest from "@/components/ReadingSampleTest";
import Link from "next/link";

const readingLevels = [
  {
    level: "Basic (Bands 4.0-5.0)",
    description:
      "Introduction to IELTS reading with straightforward passages and simple question types to help you develop basic skills.",
    topics: [
      "Short factual texts",
      "Basic descriptive passages",
      "Simple informational content",
      "Elementary vocabulary and grammar",
    ],
    questionTypes: [
      "Multiple choice with clear options",
      "Basic true/false questions",
      "Simple matching exercises",
      "Fill in the blanks with provided options",
    ],
    sampleContent: {
      title: "Community Library Services",
      description:
        "An informational passage about services offered at a local library including opening hours and membership details.",
    },
  },
  {
    level: "Intermediate (Bands 5.5-6.5)",
    description:
      "More challenging reading passages with varied vocabulary and more complex sentence structures testing deeper comprehension.",
    topics: [
      "Popular science articles",
      "Historical accounts",
      "News features and reports",
      "Extended descriptive passages",
    ],
    questionTypes: [
      "Paragraph heading matching",
      "True/False/Not Given questions",
      "Sentence completion tasks",
      "Identifying writer's views/claims",
    ],
    sampleContent: {
      title: "The Development of Wind Energy",
      description:
        "An article explaining the historical development and current applications of wind power technology.",
    },
  },
  {
    level: "Advanced (Bands 7.0-9.0)",
    description:
      "Complex academic passages with advanced vocabulary, abstract concepts, and nuanced arguments requiring sophisticated reading skills.",
    topics: [
      "Academic research papers",
      "Complex theoretical discussions",
      "Detailed technical descriptions",
      "Texts with abstract concepts and arguments",
    ],
    questionTypes: [
      "Yes/No/Not Given questions",
      "Summary completion with no word bank",
      "Multiple matching across texts",
      "Identifying specific information in complex passages",
    ],
    sampleContent: {
      title: "The Neuroscience of Decision Making",
      description:
        "An academic article examining how the brain processes information when making complex decisions, with reference to recent studies.",
    },
  },
];

const tips = [
  {
    title: "Read the instructions first",
    description:
      "Make sure you understand exactly what each question is asking before you start reading the passage in detail.",
  },
  {
    title: "Scan for specific information",
    description:
      "Learn to quickly scan the text for key words and phrases related to the questions rather than reading every word.",
  },
  {
    title: "Manage your time carefully",
    description:
      "Allocate your time according to the marks available - don't spend too long on any one question or passage.",
  },
  {
    title: "Learn to skim effectively",
    description:
      "Practice getting the gist of a passage quickly by reading the first and last sentences of each paragraph.",
  },
  {
    title: "Pay attention to signpost words",
    description:
      "Words like 'however,' 'moreover,' and 'consequently' can help you understand the logical flow of the text.",
  },
  {
    title: "Watch out for qualifiers",
    description:
      "Words like 'some,' 'most,' 'never,' or 'always' can completely change the meaning of a statement - be careful with True/False/Not Given questions.",
  },
];

export default function ReadingModulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <div className="relative bg-purple-700">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-purple-600 mix-blend-multiply" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              IELTS Reading Module
            </h1>
            <p className="mt-6 max-w-3xl text-xl text-white">
              Develop your ability to understand complex texts, identify key information, and build your academic vocabulary for success in the IELTS Reading test.
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
                Experience a real IELTS Reading test with our interactive sample. Read the passage and answer the questions to test your comprehension skills.
              </p>
              <div className="mt-4 text-sm text-purple-700 bg-purple-50 p-4 rounded-md inline-block border border-purple-100">
                <svg
                  className="inline-block h-5 w-5 mr-1 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">
                  Reading Test Tips:
                </span>
                <ul className="mt-2 text-left list-disc pl-5 space-y-1">
                  <li>
                    Read the <span className="font-semibold">questions first</span> to know what to look for
                  </li>
                  <li>
                    Don't spend too long on difficult questions - <span className="font-semibold">manage your time</span>
                  </li>
                  <li>
                    <span className="font-semibold">Highlight key words</span> in the passage as you find them
                  </li>
                </ul>
              </div>
            </div>

            <ReadingSampleTest />

            <div className="mt-8 text-center">
              <Link
                href="/practice-tests"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                  The IELTS Reading test takes 60 minutes and consists of three passages with a total of 40 questions. The passages increase in difficulty, with the third passage being the most challenging.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Passage 1
                      </h3>
                      <p className="mt-2 text-base text-gray-700">
                        A factual text focusing on general interest topics, often descriptive or explanatory in nature.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Passage 2
                      </h3>
                      <p className="mt-2 text-base text-gray-700">
                        A more analytical text, often discussing a workplace or training context, with more complex language.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Passage 3
                      </h3>
                      <p className="mt-2 text-base text-gray-700">
                        A challenging academic text featuring complex arguments, abstract concepts, and specialized vocabulary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 lg:mt-0 lg:grid-cols-2">
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">60</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">
                      Minutes
                    </div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">3</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">
                      Passages
                    </div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">40</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">
                      Questions
                    </div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">2500+</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">
                      Words
                    </div>
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
                Our reading materials are categorized by difficulty to help you progressively build your skills toward your target band score.
              </p>
            </div>

            <div className="mt-12 space-y-8">
              {readingLevels.map((level, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md overflow-hidden rounded-lg border border-gray-200"
                >
                  <div className="px-4 py-5 sm:px-6 bg-purple-700">
                    <h3 className="text-xl leading-6 font-medium text-white">
                      {level.level}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-white">
                      {level.description}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Topics Covered
                        </h4>
                        <ul className="mt-4 space-y-3">
                          {level.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg
                                  className="h-5 w-5 text-purple-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base text-gray-700">
                                {topic}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Question Types
                        </h4>
                        <ul className="mt-4 space-y-3">
                          {level.questionTypes.map((type, typeIndex) => (
                            <li key={typeIndex} className="flex items-start">
                              <div className="flex-shrink-0">
                                <svg
                                  className="h-5 w-5 text-purple-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <p className="ml-3 text-base text-gray-700">
                                {type}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-8 bg-purple-50 p-5 rounded-md border border-purple-100">
                      <h4 className="text-lg font-medium text-gray-900">
                        Sample Content: {level.sampleContent.title}
                      </h4>
                      <p className="mt-2 text-base text-gray-700">
                        {level.sampleContent.description}
                      </p>
                      <div className="mt-4">
                        <Link
                          href="#"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
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
                Improve your IELTS Reading score with these proven strategies from our expert instructors.
              </p>
            </div>

            <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                        <span className="text-lg font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {tip.title}
                      </h3>
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
        <div className="bg-purple-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">
                Ready to improve your reading skills?
              </span>
              <span className="block text-white opacity-90">
                Start your IELTS preparation journey today.
              </span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Start Free Trial
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/modules"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
                >
                  Explore Other Modules
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 