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
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-xs text-zinc-500">OPENROUTER_API_KEY</span>
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-sky-500 hover:text-sky-400 transition-colors"
        >
          // get key →
        </a>
      </div>
      
      {isEditing || !apiKey ? (
        <div className="flex gap-2">
          <input
            type={isVisible ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-or-v1-..."
            className="flex-1 bg-zinc-900 border border-zinc-700 px-4 py-2 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="px-3 border border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors font-mono text-xs"
          >
            {isVisible ? 'HIDE' : 'SHOW'}
          </button>
          {apiKey && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 border border-sky-500/50 text-sky-400 hover:bg-sky-500/10 transition-colors font-mono text-xs"
            >
              DONE
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-zinc-900 border border-zinc-800 px-4 py-2 font-mono text-sm text-zinc-400">
            {maskedKey}
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-2 border border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors font-mono text-xs"
          >
            CHANGE
          </button>
          <button
            type="button"
            onClick={() => {
              onApiKeyChange('');
              setIsEditing(true);
            }}
            className="px-3 py-2 border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-500/50 transition-colors font-mono text-xs"
          >
            CLEAR
          </button>
        </div>
      )}
    </div>
  );
}

