import { NextRequest, NextResponse } from 'next/server';
import { queryAllModels } from '@/lib/openrouter';
import { saveQuery, getQueryByTopic } from '@/lib/supabase';
import { sanitizeTopic, hashTopic, calculateDisagreementScore, generateShareUrl, generateOgImageUrl } from '@/lib/utils';
import { QueryResult } from '@/types';

// Simple in-memory rate limiting (for demo purposes)
// In production, use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later or use your own API key.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { topic, apiKey, selectedModels } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const sanitized = sanitizeTopic(topic);

    if (sanitized.length < 1) {
      return NextResponse.json(
        { error: 'Topic cannot be empty' },
        { status: 400 }
      );
    }

    // Check for cached results if no custom API key and using default models
    if (!apiKey && !selectedModels) {
      const cached = await getQueryByTopic(sanitized);
      if (cached) {
        // Return cached results
        const result: QueryResult = {
          id: cached.id,
          topic: cached.topic,
          topicHash: hashTopic(sanitized),
          category: cached.category,
          timestamp: new Date().toISOString(),
          results: cached.results,
          disagreementScore: calculateDisagreementScore(cached.results),
          shareUrl: generateShareUrl(sanitized),
          ogImageUrl: generateOgImageUrl(sanitized),
        };

        return NextResponse.json(result, {
          headers: {
            'X-Cache': 'HIT',
          },
        });
      }
    }

    // Query all models (with optional custom model selection)
    const results = await queryAllModels(sanitized, apiKey, selectedModels);

    // Save to database (only if using server API key)
    let queryId = '';
    if (!apiKey) {
      queryId = await saveQuery(sanitized, results) || '';
    }

    const result: QueryResult = {
      id: queryId,
      topic: sanitized,
      topicHash: hashTopic(sanitized),
      timestamp: new Date().toISOString(),
      results,
      disagreementScore: calculateDisagreementScore(results),
      shareUrl: generateShareUrl(sanitized),
      ogImageUrl: generateOgImageUrl(sanitized),
    };

    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Query API error:', error);

    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to query AI models' },
      { status: 500 }
    );
  }
}

// GET method for fetching existing query results
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic parameter is required' },
        { status: 400 }
      );
    }

    const sanitized = sanitizeTopic(topic);
    const cached = await getQueryByTopic(sanitized);

    if (!cached) {
      return NextResponse.json(
        { error: 'Query not found', exists: false },
        { status: 404 }
      );
    }

    const result: QueryResult = {
      id: cached.id,
      topic: cached.topic,
      topicHash: hashTopic(sanitized),
      category: cached.category,
      timestamp: new Date().toISOString(),
      results: cached.results,
      disagreementScore: calculateDisagreementScore(cached.results),
      shareUrl: generateShareUrl(sanitized),
      ogImageUrl: generateOgImageUrl(sanitized),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Query GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch query results' },
      { status: 500 }
    );
  }
}
