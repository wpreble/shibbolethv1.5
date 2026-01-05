'use client';

import { QueryResult } from '@/types';
import { Clock, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';

interface QueryHistoryProps {
  queries: QueryResult[];
  onClear: () => void;
  onQueryClick?: (topic: string) => void;
}

export default function QueryHistory({ queries, onClear, onQueryClick }: QueryHistoryProps) {
  if (queries.length === 0) {
    return null;
  }

  const getDisagreementLabel = (score: number) => {
    if (score === 0) return 'CONSENSUS';
    if (score === 1) return 'PARTIAL';
    return 'SPLIT';
  };

  const getDisagreementColor = (score: number) => {
    if (score === 0) return 'text-zinc-600';
    if (score === 1) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="border border-zinc-800 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-600" />
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
            Recent Queries ({queries.length})
          </span>
        </div>
        <button
          onClick={onClear}
          className="font-mono text-xs text-zinc-600 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      </div>

      {/* Query list */}
      <div className="divide-y divide-zinc-800">
        {queries.slice(0, 10).map((query, index) => {
          const goodCount = query.results.filter(r => r.verdict === 'GOOD').length;
          const badCount = query.results.filter(r => r.verdict === 'BAD').length;
          const refusedCount = query.results.filter(r => r.verdict === 'REFUSED').length;

          return (
            <button
              key={`${query.topic}-${index}`}
              onClick={() => onQueryClick?.(query.topic)}
              className="w-full px-4 py-3 hover:bg-zinc-900/50 transition-colors text-left group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-white truncate group-hover:text-sky-400 transition-colors">
                    &quot;{query.topic}&quot;
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {/* Verdict dots */}
                    <div className="flex items-center gap-1">
                      {query.results.map((result, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            result.verdict === 'GOOD'
                              ? 'bg-green-500'
                              : result.verdict === 'BAD'
                              ? 'bg-red-500'
                              : result.verdict === 'REFUSED'
                              ? 'bg-amber-500'
                              : 'bg-zinc-600'
                          }`}
                          title={`${result.modelName}: ${result.verdict}`}
                        />
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 font-mono text-xs text-zinc-600">
                      <span className="text-green-600">{goodCount}G</span>
                      <span className="text-red-600">{badCount}B</span>
                      {refusedCount > 0 && (
                        <span className="text-amber-600">{refusedCount}R</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Disagreement score */}
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs ${getDisagreementColor(query.disagreementScore)}`}
                  >
                    {getDisagreementLabel(query.disagreementScore)}
                  </span>
                  {query.disagreementScore >= 2 && (
                    <TrendingUp className="w-3 h-3 text-red-500" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {queries.length > 10 && (
        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50">
          <p className="font-mono text-xs text-zinc-600 text-center">
            Showing 10 of {queries.length} queries
          </p>
        </div>
      )}
    </div>
  );
}
