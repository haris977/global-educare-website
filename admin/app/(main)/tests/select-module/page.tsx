"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SelectModulePage() {
  const router = useRouter();

  const modules = [
    {
      id: "READING",
      title: "Reading",
      icon: (
        <svg className="w-12 h-12 mb-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: "Create reading comprehension tests with a variety of question types including multiple-choice, true/false, sentence completion, and more.",
      color: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50"
    },
    {
      id: "LISTENING",
      title: "Listening",
      icon: (
        <svg className="w-12 h-12 mb-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      description: "Design listening tests with audio recordings and various question types to assess listening comprehension.",
      color: "from-emerald-500 to-green-600",
      borderColor: "border-emerald-200",
      bgColor: "bg-emerald-50"
    },
    {
      id: "WRITING",
      title: "Writing",
      icon: (
        <svg className="w-12 h-12 mb-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      description: "Develop essay-based writing assessments with different topics and prompts to evaluate writing skills.",
      color: "from-amber-500 to-orange-600",
      borderColor: "border-amber-200",
      bgColor: "bg-amber-50"
    },
    {
      id: "SPEAKING",
      title: "Speaking",
      icon: (
        <svg className="w-12 h-12 mb-4 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      description: "Create speaking assessments with tasks, cue cards, and follow-up questions to evaluate speaking abilities.",
      color: "from-rose-500 to-pink-600",
      borderColor: "border-rose-200",
      bgColor: "bg-rose-50"
    }
  ];

  const handleSelectModule = (moduleId: string) => {
    router.push(`/tests/new?moduleType=${moduleId}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Select Module Type</h1>
          <p className="mt-2 text-base text-gray-500">Choose the type of test you want to create</p>
        </div>
        <Link
          href="/tests"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Tests
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => handleSelectModule(module.id)}
            className={`relative overflow-hidden rounded-xl border-2 ${module.borderColor} ${module.bgColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${module.color}`}></div>
            
            <div className="p-6 flex flex-col items-center text-center">
              {module.icon}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-6">{module.description}</p>
              <span className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r ${module.color} group-hover:shadow-md transition-all duration-200`}>
                Select {module.title}
                <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 