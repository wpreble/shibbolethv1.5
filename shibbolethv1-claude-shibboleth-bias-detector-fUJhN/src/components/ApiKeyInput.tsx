'use client';

import { useState } from 'react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(!apiKey);

  const maskedKey = apiKey ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}` : '';

  return (
    <div className="mb-4 sm:mb-6 px-2 sm:px-0">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="font-mono text-[10px] sm:text-xs text-zinc-500">OPENROUTER_API_KEY</span>
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] sm:text-xs text-sky-500 hover:text-sky-400 transition-colors"
        >
          // get key →
        </a>
      </div>
      
      {isEditing || !apiKey ? (
        <div className="flex gap-1.5 sm:gap-2">
          <input
            type={isVisible ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-or-v1-..."
            className="flex-1 min-w-0 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-2 sm:px-4 py-2 font-mono text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-sky-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="px-2 sm:px-3 border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors font-mono text-[10px] sm:text-xs flex-shrink-0"
          >
            {isVisible ? 'HIDE' : 'SHOW'}
          </button>
          {apiKey && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2 sm:px-3 border border-sky-500/50 text-sky-500 dark:text-sky-400 hover:bg-sky-500/10 transition-colors font-mono text-[10px] sm:text-xs flex-shrink-0"
            >
              DONE
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex-1 min-w-0 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 sm:px-4 py-2 font-mono text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 truncate">
            {maskedKey}
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-2 sm:px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors font-mono text-[10px] sm:text-xs flex-shrink-0"
          >
            EDIT
          </button>
          <button
            type="button"
            onClick={() => {
              onApiKeyChange('');
              setIsEditing(true);
            }}
            className="px-2 sm:px-3 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 transition-colors font-mono text-[10px] sm:text-xs flex-shrink-0"
          >
            <span className="hidden sm:inline">CLEAR</span>
            <span className="sm:hidden">×</span>
          </button>
        </div>
      )}
    </div>
  );
}
