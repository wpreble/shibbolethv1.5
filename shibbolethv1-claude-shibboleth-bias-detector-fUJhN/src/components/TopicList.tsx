'use client';

import Link from 'next/link';
import { QuerySummary } from '@/types';
import { calculateDisagreementScore } from '@/lib/utils';

interface TopicListProps {
  topics: QuerySummary[];
  title?: string;
  emptyMessage?: string;
}

export default function TopicList({
  topics,
  title,
  emptyMessage = 'No queries found',
}: TopicListProps) {
  if (topics.length === 0) {
    return (
      <div className="border border-zinc-800 p-8">
        <p className="font-mono text-sm text-zinc-600 text-center">
          // {emptyMessage.toLowerCase()}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4 flex items-center gap-2">
          <span className="font-mono text-sky-500 text-sm">OUTPUT:</span>
          <span className="font-mono text-sm text-white tracking-wider uppercase">{title}</span>
        </div>
      )}
      <div className="border border-zinc-800 divide-y divide-zinc-800/50">
        {topics.map((topic, index) => {
          const disagreementScore = calculateDisagreementScore(topic.results);
          const isControversial = disagreementScore >= 2;

          return (
            <Link
              key={topic.id}
              href={`/query/${encodeURIComponent(topic.topic)}`}
              className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-all group"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Index number */}
                <span className="font-mono text-xs text-zinc-700 w-6">
                  {String(index + 1).padStart(2, '0')}
                </span>
                
                {/* Topic */}
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-sm text-white truncate block group-hover:text-sky-400 transition-colors">
                    &quot;{topic.topic}&quot;
                  </span>
                  {topic.category && (
                    <span className="font-mono text-xs text-zinc-600 uppercase tracking-wider">
                      // {topic.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Results indicator */}
              <div className="flex items-center gap-4 ml-4">
                {/* Verdict dots */}
                <div className="flex gap-1">
                  {[...Array(topic.goodCount)].map((_, i) => (
                    <div key={`good-${i}`} className="w-2 h-2 rounded-full bg-green-500" />
                  ))}
                  {[...Array(topic.badCount)].map((_, i) => (
                    <div key={`bad-${i}`} className="w-2 h-2 rounded-full bg-red-500" />
                  ))}
                  {[...Array(topic.refusedCount)].map((_, i) => (
                    <div key={`refused-${i}`} className="w-2 h-2 rounded-full bg-amber-500" />
                  ))}
                </div>

                {/* Status */}
                <span className={`font-mono text-xs ${isControversial ? 'text-amber-500' : 'text-zinc-600'}`}>
                  {isControversial ? 'SPLIT' : `${topic.goodCount}/${topic.badCount}`}
                </span>

                {/* Arrow */}
                <span className="font-mono text-zinc-600 group-hover:text-sky-400 transition-colors">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
