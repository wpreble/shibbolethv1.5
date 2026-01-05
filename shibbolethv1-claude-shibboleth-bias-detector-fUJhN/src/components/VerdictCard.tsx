'use client';

import { ModelResult, Verdict } from '@/types';
import { formatLatency } from '@/lib/utils';
import { VERDICT_COLORS } from '@/lib/constants';
import { ThumbsUp, ThumbsDown, AlertCircle, XCircle } from 'lucide-react';

interface VerdictCardProps {
  result: ModelResult;
  animate?: boolean;
}

const VerdictIcon = ({ verdict }: { verdict: Verdict }) => {
  switch (verdict) {
    case 'GOOD':
      return <ThumbsUp className="w-8 h-8" />;
    case 'BAD':
      return <ThumbsDown className="w-8 h-8" />;
    case 'REFUSED':
      return <AlertCircle className="w-8 h-8" />;
    case 'ERROR':
      return <XCircle className="w-8 h-8" />;
  }
};

export default function VerdictCard({ result, animate = false }: VerdictCardProps) {
  const colors = VERDICT_COLORS[result.verdict];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col items-center justify-center gap-4 transition-all hover:border-zinc-700 ${
        animate ? 'animate-fade-in' : ''
      }`}
    >
      {/* Model name */}
      <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
        {result.modelName}
      </div>

      {/* Verdict */}
      <div className={`flex flex-col items-center gap-2 ${colors.text}`}>
        <VerdictIcon verdict={result.verdict} />
        <span className="text-2xl font-mono font-bold">{result.verdict}</span>
      </div>

      {/* Latency */}
      {result.latencyMs > 0 && (
        <div className="text-xs text-zinc-500">
          {formatLatency(result.latencyMs)}
        </div>
      )}

      {/* Glow effect based on verdict */}
      <div
        className={`absolute inset-0 opacity-5 ${colors.bg}`}
        style={{
          background: `radial-gradient(circle at center, ${colors.hex}22 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
