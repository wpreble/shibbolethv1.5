// Core types for Shibboleth AI Bias Detector

export type Verdict = 'GOOD' | 'BAD' | 'REFUSED' | 'OTHER' | 'ERROR';

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  openRouterId: string;
}

export interface ModelResult {
  model: string;
  modelName: string;
  verdict: Verdict;
  latencyMs: number;
  rawResponse?: string;
}

export interface QueryResult {
  id: string;
  topic: string;
  topicHash: string;
  category?: string;
  timestamp: string;
  results: ModelResult[];
  disagreementScore: number;
  shareUrl: string;
  ogImageUrl: string;
}

export interface QuerySummary {
  id: string;
  topic: string;
  category?: string;
  queryCount: number;
  verdictDiversity: number;
  goodCount: number;
  badCount: number;
  refusedCount: number;
  results: ModelResult[];
}

export interface AnalyticsData {
  totalQueries: number;
  uniqueTopics: number;
  modelStats: {
    model: string;
    goodCount: number;
    badCount: number;
    refusedCount: number;
    avgLatencyMs: number;
  }[];
  categoryStats: {
    category: string;
    count: number;
    avgDisagreement: number;
  }[];
  recentQueries: QuerySummary[];
  controversialTopics: QuerySummary[];
}

// Category taxonomy from PRD
export const CATEGORIES = [
  'politics',
  'economics',
  'ethics',
  'technology',
  'environment',
  'religion',
  'culture',
  'health',
  'science',
  'people',
  'organizations',
  'other',
] as const;

export type Category = (typeof CATEGORIES)[number];
