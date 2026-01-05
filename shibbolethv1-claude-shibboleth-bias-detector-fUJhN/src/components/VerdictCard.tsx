'use client';

import { useState } from 'react';
import { ModelResult, Verdict } from '@/types';
import { formatLatency } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface VerdictCardProps {
  result: ModelResult;
  animate?: boolean;
  index?: number;
}

const getVerdictStyle = (verdict: Verdict) => {
  switch (verdict) {
    case 'GOOD':
      return {
        text: 'text-green-400',
        glow: 'shadow-green-500/20',
        border: 'border-green-500/30',
        bg: 'bg-green-500/5',
        dot: 'bg-green-500',
      };
    case 'BAD':
      return {
        text: 'text-red-400',
        glow: 'shadow-red-500/20',
        border: 'border-red-500/30',
        bg: 'bg-red-500/5',
        dot: 'bg-red-500',
      };
    case 'REFUSED':
      return {
        text: 'text-amber-400',
        glow: 'shadow-amber-500/20',
        border: 'border-amber-500/30',
        bg: 'bg-amber-500/5',
        dot: 'bg-amber-500',
      };
    default:
      return {
        text: 'text-zinc-400',
        glow: 'shadow-zinc-500/20',
        border: 'border-zinc-500/30',
        bg: 'bg-zinc-500/5',
        dot: 'bg-zinc-500',
      };
  }
};

export default function VerdictCard({ result, animate = false, index = 0 }: VerdictCardProps) {
  const [showFullResponse, setShowFullResponse] = useState(false);
  const style = getVerdictStyle(result.verdict);
  const delay = index * 100;

  // Check if response is non-binary (not just GOOD or BAD)
  const isNonBinary = result.rawResponse &&
    result.rawResponse.trim().toUpperCase() !== 'GOOD' &&
    result.rawResponse.trim().toUpperCase() !== 'BAD';

  const hasExpandableContent = isNonBinary && result.rawResponse && result.rawResponse.length > 50;

  return (
    <div
      className={`relative overflow-hidden border ${style.border} ${style.bg} transition-all duration-300 hover:scale-[1.02] ${
        animate ? 'animate-fade-in-up opacity-0' : ''
      }`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${style.dot}`} />
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
            {result.modelName}
          </span>
        </div>
        {result.latencyMs > 0 && (
          <span className="font-mono text-xs text-zinc-600">
            {formatLatency(result.latencyMs)}
          </span>
        )}
      </div>

      {/* Verdict display */}
      <div className="p-6 flex flex-col items-center justify-center">
        <div className={`font-mono text-4xl font-bold tracking-wider ${style.text}`}>
          {result.verdict}
        </div>

        {/* Binary representation */}
        <div className="mt-3 font-mono text-xs text-zinc-700">
          {result.verdict === 'GOOD' ? '01000111 01001111' : result.verdict === 'BAD' ? '01000010 01000001' : '00111111 00111111'}
        </div>
      </div>

      {/* Raw response preview/full display */}
      {result.rawResponse && (
        <div className="border-t border-zinc-800/50 bg-zinc-950/50">
          {hasExpandableContent ? (
            <>
              <button
                onClick={() => setShowFullResponse(!showFullResponse)}
                className="w-full px-4 py-2 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
              >
                <span className="font-mono text-xs text-zinc-600">
                  {showFullResponse ? 'Hide' : 'Show'} full response
                </span>
                {showFullResponse ? (
                  <ChevronUp className="w-3 h-3 text-zinc-600" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-zinc-600" />
                )}
              </button>
              {showFullResponse && (
                <div className="px-4 py-3 border-t border-zinc-800/50">
                  <div className="font-mono text-xs text-zinc-400 whitespace-pre-wrap break-words">
                    {result.rawResponse}
                  </div>
                </div>
              )}
            </>
          ) : result.rawResponse !== result.verdict && (
            <div className="px-4 py-2">
              <span className="font-mono text-xs text-zinc-600 block">
                raw: &quot;{result.rawResponse}&quot;
              </span>
            </div>
          )}
        </div>
      )}

      {/* Glow effect */}
      <div
        className={`absolute inset-0 pointer-events-none shadow-2xl ${style.glow}`}
        style={{
          boxShadow: `inset 0 0 60px ${result.verdict === 'GOOD' ? 'rgba(34,197,94,0.1)' : result.verdict === 'BAD' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'}`
        }}
      />
    </div>
  );
}
