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
    <div className="flex items-center gap-2">
      {/* Twitter/X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        title="Share on X/Twitter"
      >
        <Twitter className="w-5 h-5 text-white" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-5 h-5 text-white" />
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        title="Copy link"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Link2 className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}
