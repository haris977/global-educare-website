"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Function to determine moduleId from content ID format (e.g., listening-conversations-beginner-1)
const getModuleIdFromContentId = (contentId) => {
  // Content IDs should be prefixed with the module ID
  const parts = contentId.split('-');
  
  // The module ID should be the first part
  const moduleId = parts[0];
  
  if (['listening', 'reading', 'writing', 'speaking'].includes(moduleId)) {
    return moduleId;
  }
  
  // Fallback to listening if we can't determine the module
  return 'listening';
};

export default function ContentRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id;
  
  useEffect(() => {
    if (contentId) {
      const moduleId = getModuleIdFromContentId(contentId);
      router.push(`/modules/${moduleId}/content/${contentId}`);
    }
  }, [contentId, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Redirecting to content...</p>
      </div>
    </div>
  );
} 