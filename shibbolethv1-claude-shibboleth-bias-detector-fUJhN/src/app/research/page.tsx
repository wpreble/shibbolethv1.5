'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SYSTEM_PROMPT, MODELS } from '@/lib/constants';

export default function ResearchPage() {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedRequest, setCopiedRequest] = useState(false);

  const exampleTopic = 'universal basic income';
  
  const exampleRequest = `{
  "model": "anthropic/claude-3.5-sonnet",
  "messages": [
    {
      "role": "system",
      "content": "${SYSTEM_PROMPT.replace(/\n/g, '\\n')}"
    },
    {
      "role": "user", 
      "content": "${exampleTopic}"
    }
  ],
  "max_tokens": 10,
  "temperature": 0
}`;

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen grid-pattern bg-zinc-50 dark:bg-[#0a0a0a]">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <span className="font-mono text-sky-500 text-sm">DOCUMENTATION:</span>
          <h1 className="font-mono text-3xl md:text-4xl text-zinc-900 dark:text-white mt-2 tracking-wider">
            RESEARCH METHODOLOGY
          </h1>
          <p className="text-zinc-500 mt-4 max-w-2xl">
            How we test for bias in frontier AI models using forced binary classification.
          </p>
        </div>

        {/* The Process */}
        <section className="mb-16">
          <h2 className="font-mono text-xl text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-sky-500">01</span> THE PROCESS
          </h2>
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400">
              Shibboleth forces AI models to make binary moral judgments by stripping away their ability 
              to hedge, explain, or refuse. Each model receives the same prompt and must respond with 
              exactly one word: <span className="text-green-600 dark:text-green-500 font-mono">GOOD</span> or{' '}
              <span className="text-red-600 dark:text-red-500 font-mono">BAD</span>.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              By eliminating nuance, we expose the default value judgments embedded in each model&apos;s training.
              When an AI cannot elaborate or contextualize, its raw &quot;gut reaction&quot; reveals the biases 
              its creators have—consciously or unconsciously—instilled.
            </p>
          </div>
        </section>

        {/* Models Tested */}
        <section className="mb-16">
          <h2 className="font-mono text-xl text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-sky-500">02</span> MODELS TESTED
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {MODELS.map((model) => (
              <div key={model.id} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
                <div className="font-mono text-zinc-900 dark:text-white">{model.name}</div>
                <div className="font-mono text-xs text-zinc-500 mt-1">{model.provider}</div>
                <div className="font-mono text-xs text-zinc-400 dark:text-zinc-600 mt-2">
                  // {model.openRouterId}
                </div>
              </div>
            ))}
          </div>
          <p className="text-zinc-400 dark:text-zinc-600 text-sm mt-4 font-mono">
            All models accessed via OpenRouter API for standardized comparison.
          </p>
        </section>

        {/* The Prompt */}
        <section className="mb-16">
          <h2 className="font-mono text-xl text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-sky-500">03</span> THE SYSTEM PROMPT
          </h2>
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-mono text-xs text-zinc-500">system_prompt.txt</span>
              <button
                onClick={() => copyToClipboard(SYSTEM_PROMPT, setCopiedPrompt)}
                className="font-mono text-xs text-sky-500 hover:text-sky-400 transition-colors"
              >
                {copiedPrompt ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
            <pre className="p-4 font-mono text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap overflow-x-auto">
{SYSTEM_PROMPT}
            </pre>
          </div>
          <p className="text-zinc-400 dark:text-zinc-600 text-sm mt-4">
            The user&apos;s topic is sent as the user message immediately following this system prompt.
          </p>
        </section>

        {/* API Request */}
        <section className="mb-16">
          <h2 className="font-mono text-xl text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-sky-500">04</span> EXAMPLE API REQUEST
          </h2>
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-mono text-xs text-zinc-500">POST openrouter.ai/api/v1/chat/completions</span>
              <button
                onClick={() => copyToClipboard(exampleRequest, setCopiedRequest)}
                className="font-mono text-xs text-sky-500 hover:text-sky-400 transition-colors"
              >
                {copiedRequest ? '✓ COPIED' : 'COPY'}
              </button>
            </div>
            <pre className="p-4 font-mono text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap overflow-x-auto">
{exampleRequest}
            </pre>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-zinc-400 dark:text-zinc-600 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400 font-mono">temperature: 0</span> — Ensures deterministic responses
            </p>
            <p className="text-zinc-400 dark:text-zinc-600 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400 font-mono">max_tokens: 10</span> — Forces brevity
            </p>
          </div>
        </section>

        {/* Interpretation */}
        <section className="mb-16">
          <h2 className="font-mono text-xl text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-sky-500">05</span> INTERPRETING RESULTS
          </h2>
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-4">
            <div className="flex items-start gap-4">
              <span className="font-mono text-green-600 dark:text-green-500 text-lg">GOOD</span>
              <p className="text-zinc-600 dark:text-zinc-400">
                The model&apos;s training leads it to associate positive value with this topic by default.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono text-red-600 dark:text-red-500 text-lg">BAD</span>
              <p className="text-zinc-600 dark:text-zinc-400">
                The model&apos;s training leads it to associate negative value with this topic, OR it refused 
                to judge (as instructed, refusals become BAD).
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="font-mono text-yellow-600 dark:text-yellow-500 text-lg">REFUSED</span>
              <p className="text-zinc-600 dark:text-zinc-400">
                The model explicitly refused or gave an ambiguous response that didn&apos;t match GOOD or BAD.
              </p>
            </div>
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-16">
          <h2 className="font-mono text-xl text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-sky-500">06</span> LIMITATIONS
          </h2>
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 dark:text-zinc-600">—</span>
                Binary classification is reductive by design. Real moral judgments are rarely black and white.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 dark:text-zinc-600">—</span>
                Model responses may vary across API versions and fine-tuning updates.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 dark:text-zinc-600">—</span>
                Results reflect training data biases, not necessarily the views of model creators.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 dark:text-zinc-600">—</span>
                This is an experiment in surfacing bias, not a definitive measure of AI alignment.
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center border-t border-zinc-200 dark:border-zinc-800 pt-16">
          <Link
            href="/"
            className="inline-block font-mono text-sm px-8 py-4 bg-sky-600 text-white hover:bg-sky-500 transition-colors"
          >
            TRY IT YOURSELF →
          </Link>
        </div>
      </div>
    </div>
  );
}
