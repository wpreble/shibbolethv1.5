'use client';

import { ModelResult, Verdict } from '@/types';
import { formatLatency } from '@/lib/utils';

interface VerdictCardProps {
  result: ModelResult;
  animate?: boolean;
  index?: number;
  onClick?: () => void;
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
    case 'OTHER':
      return {
        text: 'text-purple-400',
        glow: 'shadow-purple-500/20',
        border: 'border-purple-500/30',
        bg: 'bg-purple-500/5',
        dot: 'bg-purple-500',
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

export default function VerdictCard({ result, animate = false, index = 0, onClick }: VerdictCardProps) {
  const style = getVerdictStyle(result.verdict);
  const delay = index * 100;
  const isClickable = onClick !== undefined;

  return (
    <div
      className={`group relative overflow-hidden border ${style.border} ${style.bg} transition-all duration-300 hover:scale-[1.02] ${
        animate ? 'animate-fade-in-up opacity-0' : ''
      } ${isClickable ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); } : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2 border-b border-zinc-800/50 bg-zinc-900/50">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${style.dot}`} />
          <span className="font-mono text-[9px] sm:text-xs text-zinc-500 uppercase tracking-wider truncate">
            {result.modelName}
          </span>
        </div>
        {result.latencyMs > 0 && (
          <span className="font-mono text-[9px] sm:text-xs text-zinc-600 flex-shrink-0 ml-1">
            {formatLatency(result.latencyMs)}
          </span>
        )}
      </div>

      {/* Verdict display */}
      <div className="p-3 sm:p-6 flex flex-col items-center justify-center">
        <div className={`font-mono text-2xl sm:text-4xl font-bold tracking-wider ${style.text}`}>
          {result.verdict}
        </div>
        
        {/* Binary representation */}
        <div className="mt-2 sm:mt-3 font-mono text-[8px] sm:text-xs text-zinc-700 hidden sm:block">
          {result.verdict === 'GOOD' ? '01000111 01001111' : 
           result.verdict === 'BAD' ? '01000010 01000001' : 
           result.verdict === 'OTHER' ? '01001111 01010100' :
           result.verdict === 'REFUSED' ? '01010010 01000110' :
           '00111111 00111111'}
        </div>
      </div>

      {/* Raw response preview */}
      {result.rawResponse && result.rawResponse !== result.verdict && (
        <div className="px-2 sm:px-4 py-1.5 sm:py-2 border-t border-zinc-800/50 bg-zinc-950/50">
          <span className="font-mono text-[9px] sm:text-xs text-zinc-600 truncate block">
            raw: &quot;{result.rawResponse.slice(0, 10)}{result.rawResponse.length > 10 ? '...' : ''}&quot;
          </span>
        </div>
      )}

      {/* Click hint for non-standard verdicts */}
      {isClickable && (result.verdict === 'REFUSED' || result.verdict === 'OTHER' || result.verdict === 'ERROR') && (
        <div className="absolute bottom-2 right-2">
          <span className="font-mono text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
            click to view
          </span>
        </div>
      )}

      {/* Glow effect */}
      <div 
        className={`absolute inset-0 pointer-events-none shadow-2xl ${style.glow}`}
        style={{
          boxShadow: `inset 0 0 60px ${
            result.verdict === 'GOOD' ? 'rgba(34,197,94,0.1)' : 
            result.verdict === 'BAD' ? 'rgba(239,68,68,0.1)' : 
            result.verdict === 'OTHER' ? 'rgba(168,85,247,0.1)' :
            result.verdict === 'REFUSED' ? 'rgba(245,158,11,0.1)' :
            'rgba(161,161,170,0.1)'
          }`
        }}
      />
    </div>
  );
}
