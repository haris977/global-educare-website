"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "failed">("checking");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check API connectivity on load
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Try a simpler endpoint to check connectivity
        const response = await fetch(`${api.baseUrl}/`);
        if (response.ok) {
          console.log("API connection successful");
          setApiStatus("connected");
        } else {
          console.error("API connection failed with status:", response.status);
          setApiStatus("failed");
        }
      } catch (err) {
        console.error("API connection error:", err);
        setApiStatus("failed");
      }
    };

    checkApiStatus();
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("adminToken");
      if (token) {
        console.log("Token found, redirecting to dashboard");
        router.replace("/dashboard");
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      
      // For testing purposes, allow a direct login with admin/admin
      if (formData.email === "admin@example.com" && formData.password === "admin") {
        console.log("Using test credentials");
        localStorage.setItem("adminToken", "test-token-for-development");
        router.replace("/dashboard");
        return;
      }
      
      // Attempt to login via API
      console.log("Attempting login with API");
      const response = await api.Auth.login(formData.email, formData.password);
      
      if (response.success) {
        console.log("Login successful");
        localStorage.setItem("adminToken", response.data.token);
        router.replace("/dashboard");
      } else {
        console.error("Login failed with response:", response);
        setError(response.message || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If API is not connected, show warning
  if (apiStatus === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Backend Connection Error
            </h1>
            <p className="mt-2 text-center text-xl text-red-600">
              Cannot connect to the backend server
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                localStorage.setItem("adminToken", "test-token-for-development");
                router.replace("/dashboard");
              }}
              className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue in Demo Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Global Edu Care Admin
          </h1>
          <h2 className="mt-2 text-center text-xl font-medium text-gray-900">
            Sign in to your account
          </h2>
          {apiStatus === "checking" && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Checking connection to backend...
            </p>
          )}
          {apiStatus === "connected" && (
            <p className="mt-2 text-center text-sm text-green-600">
              Connected to backend
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Sign in"}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">Demo credentials: admin@example.com / admin</p>
          </div>
        </form>
      </div>
    </div>
  );
} 