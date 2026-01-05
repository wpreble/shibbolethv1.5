'use client';

import Link from 'next/link';
import { QuerySummary } from '@/types';
import { calculateDisagreementScore } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface TopicListProps {
  topics: QuerySummary[];
  title?: string;
  emptyMessage?: string;
}

export default function TopicList({
  topics,
  title,
  emptyMessage = 'No topics found',
}: TopicListProps) {
  if (topics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <div className="space-y-2">
        {topics.map((topic) => {
          const disagreementScore = calculateDisagreementScore(topic.results);
          const splitText =
            disagreementScore === 2
              ? '2/2 split'
              : `${topic.goodCount}/${topic.badCount}`;

          return (
            <Link
              key={topic.id}
              href={`/query/${encodeURIComponent(topic.topic)}`}
              className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-900 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <span className="text-white font-mono truncate block">
                  &quot;{topic.topic}&quot;
                </span>
                {topic.category && (
                  <span className="text-xs text-zinc-500 uppercase">
                    {topic.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      disagreementScore === 2
                        ? 'bg-yellow-500'
                        : topic.goodCount > topic.badCount
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm text-zinc-400">{splitText}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
