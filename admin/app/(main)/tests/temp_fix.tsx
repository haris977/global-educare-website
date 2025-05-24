"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "../../../services/api";
import "../formStyles.css"; // Import the CSS file

// Type definitions
type QuestionType = 
  | "MULTIPLE_CHOICE" 
  | "TRUE_FALSE" 
  | "SHORT_ANSWER" 
  | "ESSAY" 
  | "PARA_HEADINGS" 
  | "COMPLETE_SENTENCE" 
  | "NAME_MATCHING" 
  | "FILL_BLANK" 
  | "TRUE_FALSE_NOT_GIVEN" 
  | "YES_NO_NOT_GIVEN" 
  | "MAP" 
  | "SPEAKING_TASK_1" 
  | "SPEAKING_TASK_2" 
  | "SPEAKING_TASK_3" 
  | "SPEAKING_FOLLOW_UPS";

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  passage?: string;
  paragraphs?: string[];
  sentences?: string[];
  matchingPairs?: Record<string, string>;
  mapLabels?: string[];
  questionImage?: string;
  cueCard?: string;
  speakingPrompts?: string[];
  followUpQuestions?: string[];
}

interface Section {
  id: string;
  title: string;
  instructions: string;
  timeLimit: number;
  passage?: string;
  questions: Question[];
}

interface TestForm {
  title: string;
  description: string;
  totalTime: number;
  isPublished: boolean;
  sections: Section[];
  moduleType: string;
  difficulty: string;
  clbScore: number;
}

export default function CreateTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleTypeParam = searchParams.get('moduleType');
} 