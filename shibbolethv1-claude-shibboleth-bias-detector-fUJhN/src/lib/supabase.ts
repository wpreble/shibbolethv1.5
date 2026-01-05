import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { QuerySummary, ModelResult, AnalyticsData } from '@/types';
import { hashTopic, sanitizeTopic, categorize, calculateDisagreementScore } from './utils';

// Create Supabase client
function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not configured');
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

const supabase = getSupabaseClient();

/**
 * Check if database is configured and available
 */
export function isDatabaseConfigured(): boolean {
  return supabase !== null;
}

/**
 * Save a query and its results to the database
 */
export async function saveQuery(
  topic: string,
  results: ModelResult[]
): Promise<string | null> {
  if (!supabase) {
    console.warn('Database not configured, skipping save');
    return null;
  }

  const sanitized = sanitizeTopic(topic);
  const topicHash = hashTopic(sanitized);
  const category = categorize(sanitized);

  try {
    // Check if query already exists
    const { data: existingQuery } = await supabase
      .from('queries')
      .select('id, query_count')
      .eq('topic_hash', topicHash)
      .single();

    let queryId: string;

    if (existingQuery) {
      // Increment query count
      await supabase
        .from('queries')
        .update({ query_count: existingQuery.query_count + 1 })
        .eq('id', existingQuery.id);
      queryId = existingQuery.id;
    } else {
      // Insert new query
      const { data: newQuery, error: queryError } = await supabase
        .from('queries')
        .insert({
          topic: sanitized,
          topic_hash: topicHash,
          category,
        })
        .select('id')
        .single();

      if (queryError) throw queryError;
      queryId = newQuery.id;
    }

    // Insert responses
    const responses = results.map(result => ({
      query_id: queryId,
      model: result.model,
      verdict: result.verdict,
      latency_ms: result.latencyMs,
      raw_response: result.rawResponse,
    }));

    const { error: responseError } = await supabase
      .from('responses')
      .insert(responses);

    if (responseError) throw responseError;

    return queryId;
  } catch (error) {
    console.error('Error saving query:', error);
    return null;
  }
}

/**
 * Get a query by topic
 */
export async function getQueryByTopic(topic: string): Promise<QuerySummary | null> {
  if (!supabase) return null;

  const topicHash = hashTopic(sanitizeTopic(topic));

  try {
    const { data: query } = await supabase
      .from('queries')
      .select('*')
      .eq('topic_hash', topicHash)
      .single();

    if (!query) return null;

    // Get the most recent responses for this query
    const { data: responses } = await supabase
      .from('responses')
      .select('*')
      .eq('query_id', query.id)
      .order('created_at', { ascending: false })
      .limit(4);

    if (!responses) return null;

    const results: ModelResult[] = responses.map(r => ({
      model: r.model,
      modelName: r.model.charAt(0).toUpperCase() + r.model.slice(1),
      verdict: r.verdict,
      latencyMs: r.latency_ms,
      rawResponse: r.raw_response,
    }));

    return {
      id: query.id,
      topic: query.topic,
      category: query.category,
      queryCount: query.query_count,
      verdictDiversity: new Set(results.map(r => r.verdict)).size,
      goodCount: results.filter(r => r.verdict === 'GOOD').length,
      badCount: results.filter(r => r.verdict === 'BAD').length,
      refusedCount: results.filter(r => r.verdict === 'REFUSED').length,
      results,
    };
  } catch (error) {
    console.error('Error fetching query:', error);
    return null;
  }
}

/**
 * Search queries by topic
 */
export async function searchQueries(
  searchTerm: string,
  options?: {
    category?: string;
    model?: string;
    verdict?: string;
    limit?: number;
    offset?: number;
  }
): Promise<QuerySummary[]> {
  if (!supabase) return [];

  const limit = options?.limit || 20;
  const offset = options?.offset || 0;

  try {
    let query = supabase
      .from('queries')
      .select('*')
      .order('query_count', { ascending: false })
      .range(offset, offset + limit - 1);

    if (searchTerm) {
      query = query.ilike('topic', `%${searchTerm}%`);
    }

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    const { data: queries, error } = await query;

    if (error) throw error;
    if (!queries) return [];

    // Fetch responses for each query
    const summaries: QuerySummary[] = await Promise.all(
      queries.map(async (q) => {
        const { data: responses } = await supabase
          .from('responses')
          .select('*')
          .eq('query_id', q.id)
          .order('created_at', { ascending: false })
          .limit(4);

        const results: ModelResult[] = (responses || []).map(r => ({
          model: r.model,
          modelName: r.model.charAt(0).toUpperCase() + r.model.slice(1),
          verdict: r.verdict,
          latencyMs: r.latency_ms,
          rawResponse: r.raw_response,
        }));

        // Filter by model/verdict if specified
        let filteredResults = results;
        if (options?.model) {
          filteredResults = results.filter(r => r.model === options.model);
        }
        if (options?.verdict) {
          filteredResults = results.filter(r => r.verdict === options.verdict);
        }

        return {
          id: q.id,
          topic: q.topic,
          category: q.category,
          queryCount: q.query_count,
          verdictDiversity: new Set(results.map(r => r.verdict)).size,
          goodCount: results.filter(r => r.verdict === 'GOOD').length,
          badCount: results.filter(r => r.verdict === 'BAD').length,
          refusedCount: results.filter(r => r.verdict === 'REFUSED').length,
          results: filteredResults,
        };
      })
    );

    return summaries;
  } catch (error) {
    console.error('Error searching queries:', error);
    return [];
  }
}

/**
 * Get most controversial topics (highest disagreement)
 */
export async function getControversialTopics(limit = 10): Promise<QuerySummary[]> {
  if (!supabase) return [];

  try {
    const { data: queries } = await supabase
      .from('queries')
      .select('*')
      .order('query_count', { ascending: false })
      .limit(50);

    if (!queries) return [];

    const summaries: QuerySummary[] = await Promise.all(
      queries.map(async (q) => {
        const { data: responses } = await supabase
          .from('responses')
          .select('*')
          .eq('query_id', q.id)
          .order('created_at', { ascending: false })
          .limit(4);

        const results: ModelResult[] = (responses || []).map(r => ({
          model: r.model,
          modelName: r.model.charAt(0).toUpperCase() + r.model.slice(1),
          verdict: r.verdict,
          latencyMs: r.latency_ms,
          rawResponse: r.raw_response,
        }));

        return {
          id: q.id,
          topic: q.topic,
          category: q.category,
          queryCount: q.query_count,
          verdictDiversity: new Set(results.map(r => r.verdict)).size,
          goodCount: results.filter(r => r.verdict === 'GOOD').length,
          badCount: results.filter(r => r.verdict === 'BAD').length,
          refusedCount: results.filter(r => r.verdict === 'REFUSED').length,
          results,
        };
      })
    );

    // Sort by disagreement and return top N
    return summaries
      .sort((a, b) => {
        const aScore = calculateDisagreementScore(a.results);
        const bScore = calculateDisagreementScore(b.results);
        return bScore - aScore;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching controversial topics:', error);
    return [];
  }
}

/**
 * Get trending topics (most queried recently)
 */
export async function getTrendingTopics(limit = 10): Promise<QuerySummary[]> {
  if (!supabase) return [];

  try {
    const { data: queries } = await supabase
      .from('queries')
      .select('*')
      .order('query_count', { ascending: false })
      .limit(limit);

    if (!queries) return [];

    const summaries: QuerySummary[] = await Promise.all(
      queries.map(async (q) => {
        const { data: responses } = await supabase
          .from('responses')
          .select('*')
          .eq('query_id', q.id)
          .order('created_at', { ascending: false })
          .limit(4);

        const results: ModelResult[] = (responses || []).map(r => ({
          model: r.model,
          modelName: r.model.charAt(0).toUpperCase() + r.model.slice(1),
          verdict: r.verdict,
          latencyMs: r.latency_ms,
          rawResponse: r.raw_response,
        }));

        return {
          id: q.id,
          topic: q.topic,
          category: q.category,
          queryCount: q.query_count,
          verdictDiversity: new Set(results.map(r => r.verdict)).size,
          goodCount: results.filter(r => r.verdict === 'GOOD').length,
          badCount: results.filter(r => r.verdict === 'BAD').length,
          refusedCount: results.filter(r => r.verdict === 'REFUSED').length,
          results,
        };
      })
    );

    return summaries;
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics(): Promise<AnalyticsData | null> {
  if (!supabase) return null;

  try {
    // Get total queries count
    const { count: totalQueries } = await supabase
      .from('queries')
      .select('*', { count: 'exact', head: true });

    const { count: uniqueTopics } = await supabase
      .from('queries')
      .select('*', { count: 'exact', head: true });

    // Get model stats
    const { data: responses } = await supabase
      .from('responses')
      .select('model, verdict, latency_ms');

    const modelStatsMap = new Map<string, {
      goodCount: number;
      badCount: number;
      refusedCount: number;
      totalLatency: number;
      count: number;
    }>();

    (responses || []).forEach(r => {
      const existing = modelStatsMap.get(r.model) || {
        goodCount: 0,
        badCount: 0,
        refusedCount: 0,
        totalLatency: 0,
        count: 0,
      };

      if (r.verdict === 'GOOD') existing.goodCount++;
      else if (r.verdict === 'BAD') existing.badCount++;
      else if (r.verdict === 'REFUSED') existing.refusedCount++;

      existing.totalLatency += r.latency_ms || 0;
      existing.count++;

      modelStatsMap.set(r.model, existing);
    });

    const modelStats = Array.from(modelStatsMap.entries()).map(([model, stats]) => ({
      model,
      goodCount: stats.goodCount,
      badCount: stats.badCount,
      refusedCount: stats.refusedCount,
      avgLatencyMs: stats.count > 0 ? Math.round(stats.totalLatency / stats.count) : 0,
    }));

    // Get category stats
    const { data: queries } = await supabase
      .from('queries')
      .select('category');

    const categoryStatsMap = new Map<string, number>();
    (queries || []).forEach(q => {
      const category = q.category || 'other';
      categoryStatsMap.set(category, (categoryStatsMap.get(category) || 0) + 1);
    });

    const categoryStats = Array.from(categoryStatsMap.entries())
      .map(([category, count]) => ({
        category,
        count,
        avgDisagreement: 0, // Would need to calculate
      }))
      .sort((a, b) => b.count - a.count);

    // Get recent queries
    const recentQueries = await getTrendingTopics(5);

    // Get controversial topics
    const controversialTopics = await getControversialTopics(5);

    return {
      totalQueries: totalQueries || 0,
      uniqueTopics: uniqueTopics || 0,
      modelStats,
      categoryStats,
      recentQueries,
      controversialTopics,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
}
