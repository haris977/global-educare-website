"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function ListeningPracticeTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const router = useRouter();

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.Tests.getTestsByModule("LISTENING");
        if (response.success && response.data) {
          setTests(response.data);
        } else {
          setError("No listening tests found.");
        }
      } catch (err) {
        setError("Failed to fetch listening tests.");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Filter tests by selected level
  const filteredTests = selectedLevel === "All"
    ? tests
    : tests.filter(test => {
        const difficulty = (test.difficulty || test.level || "").toLowerCase();
        return difficulty === selectedLevel.toLowerCase();
      });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Listening Practice Tests</h1>
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <div className="flex gap-8">
          {/* Filters */}
          <aside className="w-64 bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Filters</h2>
            <div className="mb-4">
              <label className="block font-medium mb-1">Level</label>
              <select
                className="w-full border rounded p-2"
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
              >
                <option>All</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </aside>
          {/* Test List */}
          <main className="flex-1">
            {filteredTests.length === 0 ? (
              <div className="text-gray-600">No listening practice tests available.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map(test => (
                  <div key={test.id} className="bg-white p-6 rounded shadow">
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      {test.title}
                      {test.isFreeTrial && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Free Trial</span>
                      )}
                    </h3>
                    <p className="text-gray-600 mb-2">{test.description}</p>
                    <div className="mb-2 flex gap-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{test.difficulty || test.level}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{test.totalTime || test.duration} min</span>
                      <span className={`px-2 py-1 rounded text-xs ${test.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{test.isPublished ? 'Published' : 'Draft'}</span>
                    </div>
                    <button
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={() => router.push(`/practice/full/${test.id}`)}
                    >
                      Start Test
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
} 