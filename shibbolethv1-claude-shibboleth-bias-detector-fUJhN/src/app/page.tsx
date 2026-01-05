'use client';

import { useState, useEffect } from 'react';
import QueryInput from '@/components/QueryInput';
import ResultsGrid from '@/components/ResultsGrid';
import TopicList from '@/components/TopicList';
import ShareButtons from '@/components/ShareButtons';
import ApiKeyInput from '@/components/ApiKeyInput';
import ModelSelector from '@/components/ModelSelector';
import QueryHistory from '@/components/QueryHistory';
import { QueryResult, QuerySummary, ModelConfig } from '@/types';
import { MODELS } from '@/lib/constants';
import Link from 'next/link';

const API_KEY_STORAGE_KEY = 'shibboleth_openrouter_key';
const QUERY_HISTORY_KEY = 'shibboleth_query_history';
const SELECTED_MODELS_KEY = 'shibboleth_selected_models';

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
  {
    id: '4',
    topic: 'capitalism',
    category: 'economics',
    queryCount: 27,
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
  const [apiKey, setApiKey] = useState('');
  const [selectedModels, setSelectedModels] = useState<ModelConfig[]>(MODELS);
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }

    const storedHistory = localStorage.getItem(QUERY_HISTORY_KEY);
    if (storedHistory) {
      try {
        setQueryHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to parse query history:', e);
      }
    }

    const storedModels = localStorage.getItem(SELECTED_MODELS_KEY);
    if (storedModels) {
      try {
        const parsedModels = JSON.parse(storedModels);
        // Validate that stored models still exist in MODELS array
        const validModels = parsedModels.filter((pm: ModelConfig) =>
          MODELS.some(m => m.id === pm.id)
        );
        if (validModels.length > 0) {
          setSelectedModels(validModels);
        }
      } catch (e) {
        console.error('Failed to parse selected models:', e);
      }
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  };

  const handleModelSelectionChange = (models: ModelConfig[]) => {
    setSelectedModels(models);
    localStorage.setItem(SELECTED_MODELS_KEY, JSON.stringify(models));
  };

  const addToHistory = (queryResult: QueryResult) => {
    const newHistory = [queryResult, ...queryHistory.filter(q => q.topic !== queryResult.topic)].slice(0, 50);
    setQueryHistory(newHistory);
    localStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setQueryHistory([]);
    localStorage.removeItem(QUERY_HISTORY_KEY);
  };

  const handleHistoryQueryClick = (topic: string) => {
    // Find the query in history and set it as the current result
    const query = queryHistory.find(q => q.topic === topic);
    if (query) {
      setResult(query);
      window.history.pushState({}, '', `/query/${encodeURIComponent(topic)}`);
    }
  };

  const handleQuery = async (topic: string) => {
    if (!apiKey) {
      setError('Please enter your OpenRouter API key above');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          apiKey,
          selectedModels: selectedModels.map(m => m.id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to query AI models');
      }

      setResult(data);
      addToHistory(data);

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
    <div className="min-h-screen grid-pattern">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main title with Covenant style */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-mono text-5xl md:text-7xl font-bold tracking-[0.15em] text-white mb-4">
              SHIBBOLETH
            </h1>
            <div className="font-mono text-sm text-zinc-600 tracking-wider">
              // AI BIAS DETECTION PROTOCOL
            </div>
          </div>

          <p className="text-zinc-500 max-w-2xl mx-auto mb-12 animate-fade-in" style={{animationDelay: '0.1s', animationFillMode: 'forwards', opacity: 0}}>
            Force frontier AI models to reveal their hidden biases.
            Enter any topic — watch Claude, GPT, Gemini, and Grok pass judgment.
          </p>
        </div>
      </div>

      {/* Query Section */}
      <div className="px-4 pb-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <ApiKeyInput
            apiKey={apiKey}
            onApiKeyChange={handleApiKeyChange}
          />
          <ModelSelector
            selectedModels={selectedModels}
            onSelectionChange={handleModelSelectionChange}
          />
          {queryHistory.length > 0 && (
            <QueryHistory
              queries={queryHistory}
              onClear={clearHistory}
              onQueryClick={handleHistoryQueryClick}
            />
          )}
          <QueryInput
            onSubmit={handleQuery}
            isLoading={isLoading}
            initialValue={result?.topic || ''}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 pb-8">
          <div className="max-w-2xl mx-auto border border-red-500/30 bg-red-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-red-500">ERROR:</span>
            </div>
            <p className="font-mono text-sm text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="px-4 pb-16 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            {/* Topic header */}
            <div className="text-center mb-8">
              <span className="font-mono text-sky-500 text-sm">QUERY:</span>
              <h2 className="font-mono text-2xl text-white mt-2">
                &quot;{result.topic}&quot;
              </h2>
            </div>

            <ResultsGrid results={result.results} animate />

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-8">
              <ShareButtons topic={result.topic} shareUrl={result.shareUrl} />
              <button
                onClick={handleTryAnother}
                className="font-mono text-sm px-6 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
              >
                NEW QUERY →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="border-t border-zinc-800" />
      </div>

      {/* Controversial Topics */}
      {!result && (
        <div className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sky-500 text-sm">Habitus 2026:</span>
                <span className="font-mono text-sm text-white tracking-wider">CONTROVERSIAL QUERIES</span>
                <span className="font-mono text-xs text-zinc-600">// snapshot</span>
              </div>
              <Link
                href="/explore"
                className="font-mono text-sm text-zinc-500 hover:text-sky-400 transition-colors"
              >
                → Explore All
              </Link>
            </div>
            <TopicList
              topics={mockControversialTopics}
              emptyMessage="No queries yet. Be the first to test an AI!"
            />
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="px-4 py-16 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <span className="font-mono text-sky-500 text-sm">PROTOCOL:</span>
            <h3 className="font-mono text-xl text-white mt-2 tracking-wider">HOW IT WORKS</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'INPUT', desc: 'Enter any topic, concept, or statement' },
              { step: '02', title: 'EXECUTE', desc: 'Force 4 AI models to judge it as GOOD or BAD' },
              { step: '03', title: 'ANALYZE', desc: 'Compare verdicts to reveal hidden biases' },
            ].map((item, index) => (
              <div 
                key={item.step}
                className="border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition-all"
              >
                <div className="font-mono text-sky-500 text-sm mb-3">STEP {item.step}</div>
                <div className="font-mono text-white text-lg mb-2">{item.title}</div>
                <p className="text-zinc-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manifesto quote */}
      <div className="px-4 py-16 text-center border-t border-zinc-800">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-zinc-600 text-sm italic mb-4">
            &ldquo;Not your models, not your mind.&rdquo;
          </p>
          <Link 
            href="https://covenantlabs.ai"
            className="font-mono text-xs text-sky-500 hover:text-sky-400 transition-colors"
          >
            A Covenant Labs Experiment →
          </Link>
        </div>
      </div>
    </div>
  );
}
