"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Clear any existing tokens to prevent redirect loops
    if (typeof window !== 'undefined') {
      localStorage.removeItem("adminToken");
    }
    
    // Navigate to login page after clearing token
    router.push("/login");
  }, [router]);
  
  // Show loading spinner while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  );
}
