'use client';

import { useState } from 'react';
import QueryInput from '@/components/QueryInput';
import ResultsGrid from '@/components/ResultsGrid';
import TopicList from '@/components/TopicList';
import ShareButtons from '@/components/ShareButtons';
import { QueryResult, QuerySummary } from '@/types';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock controversial topics for initial display (when no DB)
const mockControversialTopics: QuerySummary[] = [
  {
    id: '1',
    topic: 'universal basic income',
    category: 'economics',
    queryCount: 42,
    verdictDiversity: 2,
    goodCount: 2,
    badCount: 2,
    refusedCount: 0,
    results: [],
  },
  {
    id: '2',
    topic: 'cryptocurrency',
    category: 'technology',
    queryCount: 38,
    verdictDiversity: 2,
    goodCount: 3,
    badCount: 1,
    refusedCount: 0,
    results: [],
  },
  {
    id: '3',
    topic: 'nuclear energy',
    category: 'environment',
    queryCount: 31,
    verdictDiversity: 2,
    goodCount: 2,
    badCount: 2,
    refusedCount: 0,
    results: [],
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to query AI models');
      }

      setResult(data);

      // Update URL without full navigation for shareability
      window.history.pushState({}, '', `/query/${encodeURIComponent(topic)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAnother = () => {
    setResult(null);
    setError(null);
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="font-mono text-blue-500">SHIBBOLETH</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-2 italic">
          &quot;The word that reveals allegiance&quot;
        </p>
        <p className="text-zinc-500 max-w-2xl mx-auto">
          Force frontier AI models to reveal their hidden biases.
          Enter any topic and see how Claude, GPT, Gemini, and Grok judge it.
        </p>
      </div>

      {/* Query Input */}
      <div className="mb-12">
        <QueryInput
          onSubmit={handleQuery}
          isLoading={isLoading}
          initialValue={result?.topic || ''}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-center">
          <p className="text-red-400">{error}</p>
          <p className="text-sm text-zinc-500 mt-2">
            Make sure the OpenRouter API key is configured.
          </p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mb-12 animate-fade-in">
          <h2 className="text-2xl font-mono text-center mb-6">
            &quot;{result.topic}&quot;
          </h2>

          <ResultsGrid results={result.results} animate />

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <ShareButtons topic={result.topic} shareUrl={result.shareUrl} />
            <button
              onClick={handleTryAnother}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-medium transition-colors"
            >
              Try Another
            </button>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-zinc-800 my-12" />

      {/* Controversial Topics */}
      {!result && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Most Controversial</h2>
            <Link
              href="/explore"
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Explore All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <TopicList
            topics={mockControversialTopics}
            emptyMessage="No queries yet. Be the first to test an AI!"
          />
        </div>
      )}

      {/* Explanation Section */}
      <div className="mt-16 text-center">
        <h3 className="text-lg font-semibold mb-4">How it works</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="text-2xl mb-2">1</div>
            <p>Enter any topic, concept, or statement</p>
          </div>
          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="text-2xl mb-2">2</div>
            <p>We force 4 AI models to judge it as GOOD or BAD</p>
          </div>
          <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <div className="text-2xl mb-2">3</div>
            <p>Compare verdicts to reveal hidden biases</p>
          </div>
        </div>
      </div>
    </div>
  );
}
