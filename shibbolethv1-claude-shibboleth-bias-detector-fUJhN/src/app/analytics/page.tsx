'use client';

import { useState, useEffect } from 'react';
import { AnalyticsData } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import TopicList from '@/components/TopicList';
import { MODELS } from '@/lib/constants';
import { Database, Activity, TrendingUp, Flame, AlertCircle } from 'lucide-react';

const COLORS = {
  good: 'bg-green-500',
  bad: 'bg-red-500',
  refused: 'bg-yellow-500',
};

const CAT_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch analytics');
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <LoadingSpinner message="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...(analytics?.modelStats.map(s => s.goodCount + s.badCount + s.refusedCount) || [1]));
  const maxCatCount = Math.max(...(analytics?.categoryStats.map(s => s.count) || [1]));

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-zinc-400">Aggregate insights into AI bias patterns</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <Database className="w-8 h-8 text-blue-500 mb-2" />
          <div className="text-2xl font-bold">{analytics?.totalQueries || 0}</div>
          <div className="text-sm text-zinc-400">Total Queries</div>
        </div>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <Activity className="w-8 h-8 text-green-500 mb-2" />
          <div className="text-2xl font-bold">{analytics?.uniqueTopics || 0}</div>
          <div className="text-sm text-zinc-400">Unique Topics</div>
        </div>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
          <div className="text-2xl font-bold">{MODELS.length}</div>
          <div className="text-sm text-zinc-400">AI Models</div>
        </div>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <Flame className="w-8 h-8 text-orange-500 mb-2" />
          <div className="text-2xl font-bold">{analytics?.controversialTopics.length || 0}</div>
          <div className="text-sm text-zinc-400">Controversial Topics</div>
        </div>
      </div>

      {/* Charts Row - CSS-based */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Model Verdicts */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Verdicts by Model</h3>
          {analytics?.modelStats && analytics.modelStats.length > 0 ? (
            <div className="space-y-4">
              {analytics.modelStats.map((stat) => {
                const total = stat.goodCount + stat.badCount + stat.refusedCount;
                return (
                  <div key={stat.model}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{stat.model}</span>
                      <span className="text-zinc-400">{total} responses</span>
                    </div>
                    <div className="h-6 bg-zinc-800 rounded-full overflow-hidden flex">
                      {total > 0 && (
                        <>
                          <div className={`${COLORS.good} h-full`} style={{ width: `${(stat.goodCount / total) * 100}%` }} />
                          <div className={`${COLORS.bad} h-full`} style={{ width: `${(stat.badCount / total) * 100}%` }} />
                          <div className={`${COLORS.refused} h-full`} style={{ width: `${(stat.refusedCount / total) * 100}%` }} />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-4 mt-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> GOOD</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" /> BAD</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded" /> REFUSED</span>
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-zinc-500">No data yet</div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Topics by Category</h3>
          {analytics?.categoryStats && analytics.categoryStats.length > 0 ? (
            <div className="space-y-3">
              {analytics.categoryStats.slice(0, 6).map((stat, i) => (
                <div key={stat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{stat.category}</span>
                    <span className="text-zinc-400">{stat.count}</span>
                  </div>
                  <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`${CAT_COLORS[i % CAT_COLORS.length]} h-full rounded-full`} style={{ width: `${(stat.count / maxCatCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-zinc-500">No data yet</div>
          )}
        </div>
      </div>

      {/* Model Stats Table */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl mb-12">
        <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">Model</th>
                <th className="text-center py-3 px-4 text-zinc-400 font-medium">GOOD</th>
                <th className="text-center py-3 px-4 text-zinc-400 font-medium">BAD</th>
                <th className="text-center py-3 px-4 text-zinc-400 font-medium">REFUSED</th>
                <th className="text-center py-3 px-4 text-zinc-400 font-medium">Avg Latency</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.modelStats.map((stat) => {
                const total = stat.goodCount + stat.badCount + stat.refusedCount;
                const goodPct = total > 0 ? ((stat.goodCount / total) * 100).toFixed(1) : 0;
                const badPct = total > 0 ? ((stat.badCount / total) * 100).toFixed(1) : 0;
                return (
                  <tr key={stat.model} className="border-b border-zinc-800/50">
                    <td className="py-3 px-4 font-medium capitalize">{stat.model}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-green-400">{stat.goodCount}</span>
                      <span className="text-zinc-500 text-sm ml-1">({goodPct}%)</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-red-400">{stat.badCount}</span>
                      <span className="text-zinc-500 text-sm ml-1">({badPct}%)</span>
                    </td>
                    <td className="py-3 px-4 text-center text-yellow-400">{stat.refusedCount}</td>
                    <td className="py-3 px-4 text-center text-zinc-400">{stat.avgLatencyMs}ms</td>
                  </tr>
                );
              })}
              {(!analytics?.modelStats || analytics.modelStats.length === 0) && (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Topics */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Most Controversial</h3>
          <TopicList topics={analytics?.controversialTopics || []} emptyMessage="No controversial topics yet" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Recently Queried</h3>
          <TopicList topics={analytics?.recentQueries || []} emptyMessage="No recent queries" />
        </div>
      </div>
    </div>
  );
}
