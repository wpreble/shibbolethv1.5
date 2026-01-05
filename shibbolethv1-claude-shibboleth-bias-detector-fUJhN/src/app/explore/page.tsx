'use client';

import { useState, useEffect, useCallback } from 'react';
import TopicList from '@/components/TopicList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { QuerySummary } from '@/types';
import { CATEGORIES } from '@/types';
import { Search, Filter, Download, TrendingUp, Flame } from 'lucide-react';

type ViewType = 'search' | 'trending' | 'controversial';

export default function ExplorePage() {

  const [viewType, setViewType] = useState<ViewType>('controversial');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [queries, setQueries] = useState<QuerySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('type', viewType);
      if (searchTerm) params.set('search', searchTerm);
      if (selectedCategory) params.set('category', selectedCategory);
      params.set('limit', '50');

      const response = await fetch(`/api/queries?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch queries');
      }

      setQueries(data.queries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setQueries([]);
    } finally {
      setIsLoading(false);
    }
  }, [viewType, searchTerm, selectedCategory]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchQueries();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchQueries]);

  const handleExport = () => {
    // Convert queries to CSV
    const headers = ['Topic', 'Category', 'Query Count', 'Good', 'Bad', 'Refused'];
    const rows = queries.map(q => [
      `"${q.topic}"`,
      q.category || 'other',
      q.queryCount,
      q.goodCount,
      q.badCount,
      q.refusedCount,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shibboleth-queries.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Database</h1>
        <p className="text-zinc-400">
          Search and browse all topics that have been judged by AI models
        </p>
      </div>

      {/* View Type Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setViewType('controversial')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            viewType === 'controversial'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <Flame className="w-4 h-4" />
          Controversial
        </button>
        <button
          onClick={() => setViewType('trending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            viewType === 'trending'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Trending
        </button>
        <button
          onClick={() => setViewType('search')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            viewType === 'search'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>

      {/* Search and Filter (shown when in search mode) */}
      {viewType === 'search' && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Export Button */}
      {queries.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner message="Loading queries..." />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchQueries}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : queries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 mb-2">No queries found</p>
          <p className="text-sm text-zinc-600">
            {viewType === 'search'
              ? 'Try a different search term or category'
              : 'Be the first to query a topic!'}
          </p>
        </div>
      ) : (
        <TopicList topics={queries} />
      )}

      {/* Stats */}
      {!isLoading && queries.length > 0 && (
        <div className="mt-8 text-center text-sm text-zinc-500">
          Showing {queries.length} queries
        </div>
      )}
    </div>
  );
}
