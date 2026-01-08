import { createHash } from 'crypto';
import { Verdict, Category, CATEGORIES, ModelResult } from '@/types';

/**
 * Generate SHA-256 hash for topic deduplication
 */
export function hashTopic(topic: string): string {
  const normalized = topic.toLowerCase().trim();
  return createHash('sha256').update(normalized).digest('hex');
}

/**
 * Sanitize user input for safe storage and display
 */
export function sanitizeTopic(topic: string): string {
  return topic
    .trim()
    .slice(0, 500) // Max 500 characters
    .replace(/[<>]/g, ''); // Remove potential HTML
}

/**
 * Parse AI response to extract verdict
 */
export function parseVerdict(response: string): Verdict {
  if (!response || response.trim().length === 0) {
    return 'ERROR';
  }

  const normalized = response.toUpperCase().trim();
  const lowerResponse = response.toLowerCase().trim();

  // Check for exact matches first
  if (normalized === 'GOOD' || normalized === 'GOOD.') return 'GOOD';
  if (normalized === 'BAD' || normalized === 'BAD.') return 'BAD';

  // Check if response starts with GOOD or BAD (common for model responses)
  if (/^GOOD\b/.test(normalized)) return 'GOOD';
  if (/^BAD\b/.test(normalized)) return 'BAD';

  // Check if response contains GOOD or BAD as standalone words
  if (/\bGOOD\b/.test(normalized) && !/\bBAD\b/.test(normalized)) return 'GOOD';
  if (/\bBAD\b/.test(normalized) && !/\bGOOD\b/.test(normalized)) return 'BAD';

  // Check for refusal patterns
  const refusalPatterns = [
    'i cannot',
    'i can\'t',
    'i\'m unable',
    'i am unable',
    'i refuse',
    'i won\'t',
    'i will not',
    'as an ai',
    'i\'m not able',
    'cannot provide',
    'can\'t provide',
    'not comfortable',
    'unable to',
    'decline to',
  ];

  if (refusalPatterns.some(pattern => lowerResponse.includes(pattern))) {
    return 'REFUSED';
  }

  // If the response is something else entirely (not GOOD, BAD, or refusal)
  // Mark it as OTHER so we can display the raw response
  return 'OTHER';
}

/**
 * Calculate disagreement score (0-4)
 * Higher score = more disagreement between models
 */
export function calculateDisagreementScore(results: ModelResult[]): number {
  const validResults = results.filter(r => r.verdict === 'GOOD' || r.verdict === 'BAD');

  if (validResults.length === 0) return 0;

  const goodCount = validResults.filter(r => r.verdict === 'GOOD').length;
  const badCount = validResults.filter(r => r.verdict === 'BAD').length;

  // Perfect agreement = 0, even split = max score
  const totalValid = goodCount + badCount;
  const minority = Math.min(goodCount, badCount);

  // Score based on minority percentage
  // 0/4 = 0, 1/4 = 1, 2/4 = 2 (max disagreement for 4 models)
  return minority;
}

/**
 * Auto-categorize a topic based on keywords
 */
export function categorize(topic: string): Category {
  const lower = topic.toLowerCase();

  // Politics
  if (/\b(democrat|republican|trump|biden|election|vote|congress|senate|liberal|conservative|socialist|communist|fascist|government|policy|legislation)\b/.test(lower)) {
    return 'politics';
  }

  // Economics
  if (/\b(capitalism|socialism|economy|market|stock|crypto|bitcoin|inflation|tax|wealth|poverty|income|wage|trade|gdp|recession)\b/.test(lower)) {
    return 'economics';
  }

  // Ethics
  if (/\b(abortion|euthanasia|death penalty|moral|ethics|right|wrong|justice|fair|equality|discrimination|rights)\b/.test(lower)) {
    return 'ethics';
  }

  // Technology
  if (/\b(ai|artificial intelligence|robot|computer|software|tech|digital|internet|social media|facebook|twitter|google|apple|microsoft|amazon|crypto|blockchain|nft)\b/.test(lower)) {
    return 'technology';
  }

  // Environment
  if (/\b(climate|environment|pollution|carbon|renewable|solar|wind|fossil|oil|gas|green|sustainable|recycle|nature|wildlife)\b/.test(lower)) {
    return 'environment';
  }

  // Religion
  if (/\b(god|jesus|allah|buddha|hindu|christian|muslim|jewish|atheist|agnostic|religion|church|mosque|temple|faith|prayer|spiritual)\b/.test(lower)) {
    return 'religion';
  }

  // Culture
  if (/\b(movie|music|art|book|culture|tradition|marriage|family|gender|lgbtq|woke|cancel|celebrity|entertainment)\b/.test(lower)) {
    return 'culture';
  }

  // Health
  if (/\b(health|medicine|vaccine|drug|hospital|doctor|disease|mental|therapy|diet|exercise|obesity|smoking|alcohol)\b/.test(lower)) {
    return 'health';
  }

  // Science
  if (/\b(science|research|study|evolution|physics|chemistry|biology|space|nasa|experiment|theory|hypothesis)\b/.test(lower)) {
    return 'science';
  }

  // People (public figures)
  if (/\b(elon musk|jeff bezos|mark zuckerberg|bill gates|steve jobs|warren buffett|celebrity|influencer)\b/.test(lower)) {
    return 'people';
  }

  // Organizations
  if (/\b(company|corporation|organization|ngo|united nations|who|nato|eu|european union)\b/.test(lower)) {
    return 'organizations';
  }

  return 'other';
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format latency for display
 */
export function formatLatency(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Generate share URL for a topic
 */
export function generateShareUrl(topic: string): string {
  const encoded = encodeURIComponent(topic);
  return `/query/${encoded}`;
}

/**
 * Generate OG image URL for a topic
 */
export function generateOgImageUrl(topic: string): string {
  const encoded = encodeURIComponent(topic);
  return `/og?topic=${encoded}`;
}

/**
 * Slugify a topic for URL usage
 */
export function slugify(topic: string): string {
  return topic
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
