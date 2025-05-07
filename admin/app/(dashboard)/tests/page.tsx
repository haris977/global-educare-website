"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../services/api";
// import api from "../../../services/mockApi"; // Using mock API for now

interface Test {
  id: string;
  title: string;
  description: string;
  moduleType: string;
  difficulty: string;
  isPublished: boolean;
  createdAt: string;
  _count?: {
    sections: number;
    attempts: number;
  };
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    moduleType: "",
    difficulty: "",
    isPublished: ""
  });

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build filter object
        const filterParams: Record<string, any> = {};
        if (filter.moduleType) filterParams.moduleType = filter.moduleType;
        if (filter.difficulty) filterParams.difficulty = filter.difficulty;
        if (filter.isPublished !== "") filterParams.isPublished = filter.isPublished === "true";
        
        const response = await api.Tests.getAllTests(filterParams);
        
        if (response.success) {
          setTests(response.data || []);
        } else {
          setError(response.message || "Failed to fetch tests");
        }
      } catch (error: any) {
        console.error("Error fetching tests:", error);
        setError(error.message || "Failed to fetch tests");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [filter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm("Are you sure you want to delete this test? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await api.Tests.deleteTest(testId);
      
      if (response.success) {
        setTests(tests.filter(test => test.id !== testId));
      } else {
        alert(response.message || "Failed to delete test");
      }
    } catch (error: any) {
      console.error("Error deleting test:", error);
      alert(error.message || "Failed to delete test");
    }
  };

  // Helper for rendering difficulty badges
  const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
    const colorClasses = {
      EASY: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HARD: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colorClasses[difficulty as keyof typeof colorClasses] || "bg-gray-100 text-gray-800"
      }`}>
        {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tests Management</h1>
          <p className="mt-2 text-base text-gray-500">Create, edit, and manage assessment tests</p>
        </div>
        <Link 
          href="/tests/new" 
          className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Test
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow-md rounded-xl mb-8 overflow-hidden border border-gray-100">
        <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900">Filter Tests</h3>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="moduleType" className="block text-sm font-medium text-gray-700 mb-1">Module Type</label>
              <select
                id="moduleType"
                name="moduleType"
                value={filter.moduleType}
                onChange={handleFilterChange}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              >
                <option value="">All Types</option>
                <option value="READING">Reading</option>
                <option value="WRITING">Writing</option>
                <option value="LISTENING">Listening</option>
                <option value="SPEAKING">Speaking</option>
                <option value="FULL_TEST">Full Test</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={filter.difficulty}
                onChange={handleFilterChange}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="isPublished" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="isPublished"
                name="isPublished"
                value={filter.isPublished}
                onChange={handleFilterChange}
                className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tests Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Loading tests...</h3>
          </div>
        ) : tests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module / Difficulty
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistics
                  </th>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {test.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1 mt-1 max-w-xs">
                          {test.description || "No description provided"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900 mb-1">{test.moduleType.replace('_', ' ')}</div>
                      <DifficultyBadge difficulty={test.difficulty} />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                        test.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <div className="bg-indigo-50 px-2.5 py-1 rounded-md">
                          <span className="text-xs font-medium text-indigo-700">{test._count?.sections || 0} sections</span>
                        </div>
                        <div className="bg-green-50 px-2.5 py-1 rounded-md">
                          <span className="text-xs font-medium text-green-700">{test._count?.attempts || 0} attempts</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link href={`/tests/${test.id}`} className="inline-flex items-center px-3 py-1.5 border border-indigo-300 text-xs font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors duration-150">
                          <svg className="h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteTest(test.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors duration-150"
                        >
                          <svg className="h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto h-14 w-14 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">No tests found</h3>
            <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
              {filter.moduleType || filter.difficulty || filter.isPublished 
                ? "No tests match your current filter criteria. Try adjusting your filters."
                : "Get started by creating your first test."}
            </p>
            <div className="mt-6">
              <Link 
                href="/tests/new" 
                className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Test
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 