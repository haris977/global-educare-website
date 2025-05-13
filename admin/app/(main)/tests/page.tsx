"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../services/api"; // Fixed import path

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);

  // Fetch tests from API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const filters: Record<string, any> = {};
        if (filterPublished !== null) {
          filters.isPublished = filterPublished;
        }
        
        // Use real API instead of mock
        const response = await api.Tests.getAllTests(filters);
        if (response.success) {
          setTests(response.data);
        } else {
          console.error("Failed to fetch tests:", response.message);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [filterPublished]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        const response = await api.Tests.deleteTest(id);
        if (response.success) {
          setTests(tests.filter(test => test.id !== id));
        } else {
          console.error("Failed to delete test:", response.message);
          alert("Failed to delete test: " + response.message);
        }
      } catch (error) {
        console.error("Error deleting test:", error);
        alert("Error deleting test. Please try again.");
      }
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const testToUpdate = tests.find(test => test.id === id);
      if (!testToUpdate) return;
      
      const response = await api.Tests.updateTest(id, {
        ...testToUpdate,
        isPublished: !testToUpdate.isPublished
      });
      
      if (response.success) {
        setTests(tests.map(test => 
          test.id === id ? { ...test, isPublished: !test.isPublished } : test
        ));
      } else {
        console.error("Failed to update test:", response.message);
        alert("Failed to update test: " + response.message);
      }
    } catch (error) {
      console.error("Error updating test:", error);
      alert("Error updating test. Please try again.");
    }
  };

  // Filter tests based on search term and published status
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPublished === null || test.isPublished === filterPublished;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tests</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your assessment tests</p>
        </div>
        <Link 
          href="/tests/new" 
          className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Test
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {/* Filters */}
        <div className="p-5 border-b border-gray-200 bg-gray-50 sm:flex sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0 max-w-lg">
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md shadow-sm"
                placeholder="Search tests..."
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Filter:</span>
              <select
                id="filter"
                name="filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                value={filterPublished === null ? "" : filterPublished ? "published" : "draft"}
                onChange={(e) => {
                  if (e.target.value === "") setFilterPublished(null);
                  else setFilterPublished(e.target.value === "published");
                }}
              >
                <option value="">All Tests</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tests list */}
        {loading ? (
          <div className="p-10 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
            <p className="mt-3 text-sm text-gray-500">Loading tests...</p>
          </div>
        ) : filteredTests.length > 0 ? (
          <div className="bg-white p-0 divide-y divide-gray-200">
            {filteredTests.map((test) => (
              <div key={test.id} className="group hover:bg-gray-50 transition-colors duration-150">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <h3 className="text-lg font-medium text-indigo-600 truncate">
                        {test.title}
                      </h3>
                      <div className="mt-1 sm:mt-0 sm:ml-2 flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span>{test.totalQuestions || 0} questions</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {test.totalTime} minutes
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {formatDate(test.createdAt)}
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          test.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {test.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-row sm:flex-row gap-2 justify-end mt-4 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(test.id)}
                      className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 ease-in-out hover:scale-105 ${
                        test.isPublished 
                          ? 'border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100' 
                          : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {test.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link
                      href={`/tests/${test.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 ease-in-out hover:scale-105 hover:shadow"
                    >
                      <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(test.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all duration-200 ease-in-out hover:scale-105 hover:shadow hover:border-red-300"
                    >
                      <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-900">No tests found</p>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? `No tests matching "${searchTerm}"` : "Get started by creating a new test"}
            </p>
            <div className="mt-6">
              <Link 
                href="/tests/new" 
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
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