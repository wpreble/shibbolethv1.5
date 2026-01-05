import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const analytics = await getAnalytics();

    if (!analytics) {
      // Return mock data if database is not configured
      return NextResponse.json({
        totalQueries: 0,
        uniqueTopics: 0,
        modelStats: [],
        categoryStats: [],
        recentQueries: [],
        controversialTopics: [],
        databaseConfigured: false,
      });
    }

    return NextResponse.json({
      ...analytics,
      databaseConfigured: true,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
