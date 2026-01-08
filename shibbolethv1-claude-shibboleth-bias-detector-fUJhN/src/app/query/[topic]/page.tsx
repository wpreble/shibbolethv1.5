'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QueryInput from '@/components/QueryInput';
import ResultsGrid from '@/components/ResultsGrid';
import ShareButtons from '@/components/ShareButtons';
import LoadingSpinner from '@/components/LoadingSpinner';
import { QueryResult } from '@/types';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const API_KEY_STORAGE_KEY = 'shibboleth_openrouter_key';

export default function QueryResultPage() {
  const params = useParams();
  const router = useRouter();
  const topic = decodeURIComponent(params.topic as string);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getApiKey = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
    }
    return '';
  };

  const fetchResult = async (forceRefresh = false) => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      setError('Please set your OpenRouter API key on the home page');
      setIsLoading(false);
      return;
    }

    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Query the models with API key
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to query AI models');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [topic]);

  const handleNewQuery = async (newTopic: string) => {
    router.push(`/query/${encodeURIComponent(newTopic)}`);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <LoadingSpinner message="Querying AI models..." />
        <p className="text-center text-zinc-500 mt-4">
          Asking Claude, GPT, Gemini, and Grok to judge &quot;{topic}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Topic Title */}
      <h1 className="text-3xl md:text-4xl font-mono font-bold text-center mb-8">
        &quot;{topic}&quot;
      </h1>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => fetchResult(true)}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="animate-fade-in">
          <ResultsGrid results={result.results} />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <ShareButtons topic={topic} shareUrl={result.shareUrl} />

            <button
              onClick={() => fetchResult(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Results'}
            </button>
          </div>

          {/* Category badge */}
          {result.category && (
            <div className="text-center mt-6">
              <span className="inline-block px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400 uppercase">
                {result.category}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-zinc-800 my-12" />

      {/* Try another topic */}
      <div className="text-center mb-8">
        <h2 className="text-lg font-semibold mb-4">Try another topic</h2>
        <QueryInput onSubmit={handleNewQuery} />
      </div>

      {/* Related topics placeholder */}
      <div className="text-center text-zinc-500 text-sm">
        <p>See how AI models judge similar topics in the <Link href="/explore" className="text-blue-400 hover:text-blue-300">Explore</Link> section.</p>
      </div>
    </div>
  );
}
