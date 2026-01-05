'use client';

import { useState } from 'react';
import { Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { APP_URL } from '@/lib/constants';

interface ShareButtonsProps {
  topic: string;
  shareUrl: string;
}

export default function ShareButtons({ topic, shareUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `${APP_URL}${shareUrl}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedText = encodeURIComponent(
    `I asked 4 AI models to judge "${topic}" as GOOD or BAD. See what they revealed:`
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Twitter/X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm px-4 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
        title="Share on X/Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm px-4 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="font-mono text-sm px-4 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
        title="Copy link"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
