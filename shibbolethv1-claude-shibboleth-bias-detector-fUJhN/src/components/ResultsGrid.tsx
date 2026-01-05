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

  let disagreementText = '';
  if (disagreementScore === 0) {
    disagreementText = 'All models agree';
  } else if (disagreementScore === 1) {
    disagreementText = '1 of 4 models differ';
  } else if (disagreementScore === 2) {
    disagreementText = 'Even split - 2/2';
  } else {
    disagreementText = `${disagreementScore} of 4 models differ`;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Results grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {results.map((result) => (
          <VerdictCard key={result.model} result={result} animate={animate} />
        ))}
      </div>

      {/* Disagreement summary */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800">
          <span className="text-sm text-zinc-400">Disagreement:</span>
          <span className="text-sm font-medium text-white">{disagreementText}</span>
        </div>

        {/* Visual breakdown */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-zinc-400">GOOD: {goodCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-zinc-400">BAD: {badCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
