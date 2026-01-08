'use client';

import { useState, useEffect, useCallback } from 'react';
import QueryInput from '@/components/QueryInput';
import ResultsGrid from '@/components/ResultsGrid';
import ShareButtons from '@/components/ShareButtons';
import ApiKeyInput from '@/components/ApiKeyInput';
import { QueryResult, ModelResult, Verdict } from '@/types';
import Link from 'next/link';
import { Clock, X, Eye } from 'lucide-react';

const API_KEY_STORAGE_KEY = 'shibboleth_openrouter_key';
const QUERY_HISTORY_KEY = 'shibboleth_query_history';

interface QueryHistoryItem {
  id: string;
  topic: string;
  timestamp: string;
  results: ModelResult[];
}

// Helper to get verdict color
const getVerdictColor = (verdict: Verdict) => {
  switch (verdict) {
    case 'GOOD': return 'bg-green-500';
    case 'BAD': return 'bg-red-500';
    case 'REFUSED': return 'bg-amber-500';
    case 'OTHER': return 'bg-purple-500';
    default: return 'bg-zinc-500';
  }
};

// Helper to get short model name
const getShortModelName = (modelName: string) => {
  if (modelName.includes('Claude')) return 'C';
  if (modelName.includes('GPT')) return 'G';
  if (modelName.includes('Gemini')) return 'M';
  if (modelName.includes('Grok')) return 'X';
  return '?';
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<ModelResult | null>(null);

  // Load API key and query history from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
    
    const storedHistory = sessionStorage.getItem(QUERY_HISTORY_KEY);
    if (storedHistory) {
      try {
        setQueryHistory(JSON.parse(storedHistory));
      } catch {
        sessionStorage.removeItem(QUERY_HISTORY_KEY);
      }
    }
  }, []);

  // Save query to history
  const saveToHistory = useCallback((queryResult: QueryResult) => {
    const historyItem: QueryHistoryItem = {
      id: crypto.randomUUID(),
      topic: queryResult.topic,
      timestamp: queryResult.timestamp,
      results: queryResult.results,
    };
    
    setQueryHistory(prev => {
      // Avoid duplicates - remove any existing entry with same topic
      const filtered = prev.filter(item => item.topic.toLowerCase() !== queryResult.topic.toLowerCase());
      const updated = [historyItem, ...filtered].slice(0, 10); // Keep last 10 queries
      sessionStorage.setItem(QUERY_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = () => {
    setQueryHistory([]);
    sessionStorage.removeItem(QUERY_HISTORY_KEY);
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
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
        body: JSON.stringify({ topic, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to query AI models');
      }

      setResult(data);
      saveToHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (historyItem: QueryHistoryItem) => {
    // Re-run the query for this topic
    handleQuery(historyItem.topic);
  };

  const handleTryAnother = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen grid-pattern bg-zinc-50 dark:bg-[#0a0a0a]">
      {/* Hero Section */}
      <div className="relative py-10 sm:py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main title with Covenant style */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <h1 className="font-mono text-3xl sm:text-5xl md:text-7xl font-bold tracking-[0.1em] sm:tracking-[0.15em] text-zinc-900 dark:text-white mb-2 sm:mb-4">
              SHIBBOLETH
            </h1>
            <div className="font-mono text-xs sm:text-sm text-zinc-400 dark:text-zinc-600 tracking-wider">
              // AI BIAS DETECTION PROTOCOL
            </div>
          </div>

          <p className="text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto mb-8 sm:mb-12 px-2 animate-fade-in" style={{animationDelay: '0.1s', animationFillMode: 'forwards', opacity: 0}}>
            Force frontier AI models to reveal their hidden biases.
            Enter any topic — watch Claude, GPT, Gemini, and Grok pass judgment.
          </p>
        </div>
      </div>

      {/* Query Section */}
      <div className="px-2 sm:px-4 pb-8 sm:pb-12">
        <div className="max-w-2xl mx-auto">
          <ApiKeyInput
            apiKey={apiKey}
            onApiKeyChange={handleApiKeyChange}
          />
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
        <div className="px-2 sm:px-4 pb-10 sm:pb-16 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            {/* Topic header */}
            <div className="text-center mb-6 sm:mb-8">
              <span className="font-mono text-sky-500 text-xs sm:text-sm">QUERY:</span>
              <h2 className="font-mono text-lg sm:text-2xl text-zinc-900 dark:text-white mt-1 sm:mt-2 px-2">
                &quot;{result.topic}&quot;
              </h2>
            </div>

            <ResultsGrid results={result.results} animate onCardClick={setSelectedResponse} />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-2">
              <ShareButtons topic={result.topic} shareUrl={result.shareUrl} />
              <button
                onClick={handleTryAnother}
                className="font-mono text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-all"
              >
                NEW QUERY →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session History */}
      {!result && queryHistory.length > 0 && (
        <div className="px-2 sm:px-4 pb-6 sm:pb-8">
          <div className="max-w-2xl mx-auto">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500" />
                  <span className="font-mono text-[10px] sm:text-xs text-zinc-500">SESSION HISTORY</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="font-mono text-[10px] sm:text-xs text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span className="hidden sm:inline">CLEAR</span>
                </button>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {queryHistory.map((item) => {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleHistoryClick(item)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <span className="font-mono text-xs sm:text-sm text-zinc-900 dark:text-white truncate">
                          &quot;{item.topic}&quot;
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1 ml-2 sm:ml-3">
                        {item.results.map((r) => (
                          <div
                            key={r.model}
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-[8px] sm:text-[10px] font-mono font-bold text-white ${getVerdictColor(r.verdict)}`}
                            title={`${r.modelName}: ${r.verdict}`}
                          >
                            {getShortModelName(r.modelName)}
                          </div>
                        ))}
                        <span className="font-mono text-xs text-zinc-400 ml-2 group-hover:text-sky-400 transition-colors">→</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="border-t border-zinc-200 dark:border-zinc-800" />
      </div>

      {/* How it works */}
      <div className="px-3 sm:px-4 py-10 sm:py-16 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <span className="font-mono text-sky-500 text-xs sm:text-sm">PROTOCOL:</span>
            <h3 className="font-mono text-lg sm:text-xl text-zinc-900 dark:text-white mt-1 sm:mt-2 tracking-wider">HOW IT WORKS</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { step: '01', title: 'INPUT', desc: 'Enter any topic, concept, or statement' },
              { step: '02', title: 'EXECUTE', desc: 'Force 4 AI models to judge it as GOOD or BAD' },
              { step: '03', title: 'ANALYZE', desc: 'Compare verdicts to reveal hidden biases' },
            ].map((item) => (
              <div 
                key={item.step}
                className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="font-mono text-sky-500 text-xs sm:text-sm mb-2 sm:mb-3">STEP {item.step}</div>
                <div className="font-mono text-zinc-900 dark:text-white text-base sm:text-lg mb-1 sm:mb-2">{item.title}</div>
                <p className="text-zinc-500 text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manifesto quote */}
      <div className="px-4 py-10 sm:py-16 text-center border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-zinc-400 dark:text-zinc-600 text-xs sm:text-sm italic mb-3 sm:mb-4">
            &ldquo;Not your models, not your mind.&rdquo;
          </p>
          <Link 
            href="https://covenantlabs.ai"
            className="font-mono text-[10px] sm:text-xs text-sky-500 hover:text-sky-400 transition-colors"
          >
            A Covenant Labs Experiment →
          </Link>
        </div>
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedResponse(null)}
        >
          <div 
            className="bg-zinc-900 border-t sm:border border-zinc-700 w-full sm:max-w-lg sm:w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden rounded-t-xl sm:rounded-none"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-zinc-700 bg-zinc-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${getVerdictColor(selectedResponse.verdict)}`} />
                <span className="font-mono text-xs sm:text-sm text-white">{selectedResponse.modelName}</span>
              </div>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Verdict */}
              <div className="text-center py-3 sm:py-4">
                <div className={`font-mono text-3xl sm:text-4xl font-bold ${
                  selectedResponse.verdict === 'GOOD' ? 'text-green-400' :
                  selectedResponse.verdict === 'BAD' ? 'text-red-400' :
                  selectedResponse.verdict === 'REFUSED' ? 'text-amber-400' :
                  selectedResponse.verdict === 'OTHER' ? 'text-purple-400' :
                  'text-zinc-400'
                }`}>
                  {selectedResponse.verdict}
                </div>
                <div className="font-mono text-[10px] sm:text-xs text-zinc-500 mt-2">
                  Response time: {selectedResponse.latencyMs}ms
                </div>
              </div>

              {/* Raw Response */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500" />
                  <span className="font-mono text-[10px] sm:text-xs text-zinc-400">RAW RESPONSE:</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-3 sm:p-4 max-h-36 sm:max-h-48 overflow-y-auto">
                  <p className="font-mono text-xs sm:text-sm text-zinc-300 whitespace-pre-wrap break-words">
                    {selectedResponse.rawResponse || '(No response content)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-3 sm:px-4 py-3 border-t border-zinc-700 bg-zinc-800/50">
              <button
                onClick={() => setSelectedResponse(null)}
                className="w-full font-mono text-xs sm:text-sm py-2.5 sm:py-2 border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
