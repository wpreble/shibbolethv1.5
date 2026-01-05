import { NextRequest, NextResponse } from 'next/server';
import { searchQueries, getControversialTopics, getTrendingTopics } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || undefined;
    const model = searchParams.get('model') || undefined;
    const verdict = searchParams.get('verdict') || undefined;
    const type = searchParams.get('type') || 'search'; // search, controversial, trending
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let results;

    switch (type) {
      case 'controversial':
        results = await getControversialTopics(limit);
        break;
      case 'trending':
        results = await getTrendingTopics(limit);
        break;
      default:
        results = await searchQueries(search, {
          category,
          model,
          verdict,
          limit,
          offset,
        });
    }

    return NextResponse.json({
      queries: results,
      pagination: {
        limit,
        offset,
        hasMore: results.length === limit,
      },
    });
  } catch (error) {
    console.error('Queries API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queries' },
      { status: 500 }
    );
  }
}
