'use client';

import { ModelResult } from '@/types';
import VerdictCard from './VerdictCard';
import { calculateDisagreementScore } from '@/lib/utils';

interface ResultsGridProps {
  results: ModelResult[];
  animate?: boolean;
}

export default function ResultsGrid({ results, animate = false }: ResultsGridProps) {
  const disagreementScore = calculateDisagreementScore(results);
  const goodCount = results.filter(r => r.verdict === 'GOOD').length;
  const badCount = results.filter(r => r.verdict === 'BAD').length;
  const refusedCount = results.filter(r => r.verdict === 'REFUSED').length;

  let statusCode = 'CONSENSUS';
  let statusColor = 'text-green-500';
  
  if (disagreementScore === 2) {
    statusCode = 'SPLIT_DECISION';
    statusColor = 'text-amber-500';
  } else if (disagreementScore >= 1) {
    statusCode = 'PARTIAL_AGREEMENT';
    statusColor = 'text-sky-500';
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Output header */}
      <div className="mb-6 flex items-center justify-between px-1">
        <span className="font-mono text-xs text-zinc-600">// model_responses</span>
        <span className={`font-mono text-xs ${statusColor}`}>
          STATUS: {statusCode}
        </span>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {results.map((result, index) => (
          <VerdictCard key={result.model} result={result} animate={animate} index={index} />
        ))}
      </div>

      {/* Analysis summary */}
      <div className="mt-8 border border-zinc-800 bg-zinc-950">
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
          <span className="font-mono text-xs text-zinc-500">ANALYSIS SUMMARY</span>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Progress bar visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-500">GOOD vs BAD</span>
              <span className="font-mono text-xs text-zinc-500">{goodCount}/{badCount}</span>
            </div>
            <div className="h-2 bg-zinc-900 flex overflow-hidden">
              <div 
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${(goodCount / 4) * 100}%` }}
              />
              <div 
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${(badCount / 4) * 100}%` }}
              />
              {refusedCount > 0 && (
                <div 
                  className="bg-amber-500 transition-all duration-500"
                  style={{ width: `${(refusedCount / 4) * 100}%` }}
                />
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="font-mono text-2xl text-green-400">{goodCount}</div>
              <div className="font-mono text-xs text-zinc-600">GOOD</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl text-red-400">{badCount}</div>
              <div className="font-mono text-xs text-zinc-600">BAD</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl text-zinc-400">{disagreementScore}</div>
              <div className="font-mono text-xs text-zinc-600">DISSENT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
