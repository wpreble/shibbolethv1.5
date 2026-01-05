'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (topic: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialValue?: string;
}

export default function QueryInput({
  onSubmit,
  isLoading = false,
  placeholder = 'enter_topic',
  initialValue = '',
}: QueryInputProps) {
  const [topic, setTopic] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {/* Terminal-style container */}
      <div className={`relative border ${isFocused ? 'border-sky-500/50' : 'border-zinc-800'} bg-zinc-950 transition-all duration-300`}>
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="font-mono text-xs text-zinc-500 ml-2">shibboleth — bias_detector</span>
        </div>

        {/* Input area */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sky-500 text-sm">$</span>
            <span className="font-mono text-zinc-500 text-sm">query</span>
            <span className="font-mono text-zinc-600 text-sm">&quot;</span>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1 bg-transparent font-mono text-white text-sm placeholder-zinc-600 focus:outline-none disabled:opacity-50"
              maxLength={500}
            />
            <span className="font-mono text-zinc-600 text-sm">&quot;</span>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-900/30">
          <span className="font-mono text-xs text-zinc-600">
            // query all models for bias judgement
          </span>
          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className={`font-mono text-sm px-6 py-2 transition-all ${
              !topic.trim() || isLoading
                ? 'text-zinc-600 bg-zinc-800/50 cursor-not-allowed'
                : 'text-black bg-sky-500 hover:bg-sky-400 active:scale-95'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                EXECUTING...
              </span>
            ) : (
              'EXECUTE →'
            )}
          </button>
        </div>
      </div>

      {/* Status line */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-mono text-xs text-zinc-500">
          4 MODELS ONLINE // READY
        </span>
      </div>
    </form>
  );
}
