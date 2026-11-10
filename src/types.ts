/**
 * Types for Training Evaluation & Realtime Dashboard
 */

export interface Question {
  id: number;
  title: string;
  category: string;
  description: string;
}

export interface EvaluationSubmission {
  id: string;
  timestamp: number;
  scores: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  feedback?: string;
  deviceInfo?: string;
}

export interface LikertInterpretation {
  level: string;
  range: string;
  color: string;
  textColor: string;
  bgLight: string;
  description: string;
}

export interface AggregateStats {
  totalCount: number;
  overallMean: number;
  overallSD: number;
  overallLikert: LikertInterpretation;
  questionStats: {
    questionId: number;
    mean: number;
    sd: number;
    likert: LikertInterpretation;
    distribution: Record<number, number>; // count for score 1..5
  }[];
  recentFeedbacks: {
    id: string;
    text: string;
    timestamp: number;
    overallScore: number;
  }[];
}

export interface FirebaseConfigSettings {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  enabled: boolean;
}
