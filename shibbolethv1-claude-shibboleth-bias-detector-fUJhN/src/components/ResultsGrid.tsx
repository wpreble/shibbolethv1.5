'use client';

import { ModelResult } from '@/types';
import VerdictCard from './VerdictCard';
import { calculateDisagreementScore } from '@/lib/utils';

interface ResultsGridProps {
  results: ModelResult[];
  animate?: boolean;
  onCardClick?: (result: ModelResult) => void;
}

export default function ResultsGrid({ results, animate = false, onCardClick }: ResultsGridProps) {
  const disagreementScore = calculateDisagreementScore(results);
  const goodCount = results.filter(r => r.verdict === 'GOOD').length;
  const badCount = results.filter(r => r.verdict === 'BAD').length;
  const refusedCount = results.filter(r => r.verdict === 'REFUSED').length;
  const otherCount = results.filter(r => r.verdict === 'OTHER').length;
  const errorCount = results.filter(r => r.verdict === 'ERROR').length;

  let statusCode = 'CONSENSUS';
  let statusColor = 'text-green-500';
  
  if (disagreementScore === 2) {
    statusCode = 'SPLIT_DECISION';
    statusColor = 'text-amber-500';
  } else if (disagreementScore >= 1) {
    statusCode = 'PARTIAL_AGREEMENT';
    statusColor = 'text-sky-500';
  } else if (errorCount > 0 || otherCount > 0) {
    statusCode = 'MIXED_RESPONSES';
    statusColor = 'text-purple-500';
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-1 sm:px-0">
      {/* Output header */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] sm:text-xs text-zinc-600">// model_responses</span>
        <span className={`font-mono text-[10px] sm:text-xs ${statusColor}`}>
          STATUS: {statusCode}
        </span>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {results.map((result, index) => (
          <VerdictCard 
            key={result.model} 
            result={result} 
            animate={animate} 
            index={index}
            onClick={onCardClick ? () => onCardClick(result) : undefined}
          />
        ))}
      </div>

      {/* Analysis summary */}
      <div className="mt-6 sm:mt-8 border border-zinc-800 bg-zinc-950">
        <div className="px-3 sm:px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
          <span className="font-mono text-[10px] sm:text-xs text-zinc-500">ANALYSIS SUMMARY</span>
        </div>
        
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Progress bar visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] sm:text-xs text-zinc-500">VERDICT BREAKDOWN</span>
              <span className="font-mono text-[10px] sm:text-xs text-zinc-500">{goodCount}G / {badCount}B / {otherCount + refusedCount}?</span>
            </div>
            <div className="h-1.5 sm:h-2 bg-zinc-900 flex overflow-hidden">
              <div 
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${(goodCount / results.length) * 100}%` }}
              />
              <div 
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${(badCount / results.length) * 100}%` }}
              />
              {refusedCount > 0 && (
                <div 
                  className="bg-amber-500 transition-all duration-500"
                  style={{ width: `${(refusedCount / results.length) * 100}%` }}
                />
              )}
              {otherCount > 0 && (
                <div 
                  className="bg-purple-500 transition-all duration-500"
                  style={{ width: `${(otherCount / results.length) * 100}%` }}
                />
              )}
              {errorCount > 0 && (
                <div 
                  className="bg-zinc-500 transition-all duration-500"
                  style={{ width: `${(errorCount / results.length) * 100}%` }}
                />
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-1 sm:pt-2">
            <div className="text-center">
              <div className="font-mono text-lg sm:text-2xl text-green-400">{goodCount}</div>
              <div className="font-mono text-[9px] sm:text-xs text-zinc-600">GOOD</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-lg sm:text-2xl text-red-400">{badCount}</div>
              <div className="font-mono text-[9px] sm:text-xs text-zinc-600">BAD</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-lg sm:text-2xl text-purple-400">{otherCount + refusedCount}</div>
              <div className="font-mono text-[9px] sm:text-xs text-zinc-600">OTHER</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-lg sm:text-2xl text-zinc-400">{disagreementScore}</div>
              <div className="font-mono text-[9px] sm:text-xs text-zinc-600">DISSENT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
