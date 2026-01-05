'use client';

import { useState, useEffect } from 'react';
import { ModelConfig } from '@/types';
import { MODELS } from '@/lib/constants';
import { Check } from 'lucide-react';

interface ModelSelectorProps {
  selectedModels: ModelConfig[];
  onSelectionChange: (models: ModelConfig[]) => void;
}

export default function ModelSelector({ selectedModels, onSelectionChange }: ModelSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleModel = (model: ModelConfig) => {
    const isSelected = selectedModels.some(m => m.id === model.id);

    if (isSelected) {
      // Remove model if already selected
      if (selectedModels.length > 1) {
        onSelectionChange(selectedModels.filter(m => m.id !== model.id));
      }
    } else {
      // Add model if not at limit (4 models max)
      if (selectedModels.length < 4) {
        onSelectionChange([...selectedModels, model]);
      }
    }
  };

  const isModelSelected = (modelId: string) => {
    return selectedModels.some(m => m.id === modelId);
  };

  return (
    <div className="border border-zinc-800 bg-zinc-950">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
            Models ({selectedModels.length}/4)
          </span>
          <span className="font-mono text-xs text-zinc-700">
            {selectedModels.map(m => m.id).join(', ')}
          </span>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Model list */}
      {isExpanded && (
        <div className="border-t border-zinc-800">
          <div className="p-4 space-y-2">
            <div className="font-mono text-xs text-zinc-600 mb-3">
              Select up to 4 models to query:
            </div>
            {MODELS.map((model) => {
              const isSelected = isModelSelected(model.id);
              const isDisabled = !isSelected && selectedModels.length >= 4;

              return (
                <button
                  key={model.id}
                  onClick={() => toggleModel(model)}
                  disabled={isDisabled}
                  className={`w-full px-3 py-2 flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'border-sky-500/30 bg-sky-500/5 text-white'
                      : isDisabled
                      ? 'border-zinc-800 bg-zinc-900/30 text-zinc-700 cursor-not-allowed'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 border flex items-center justify-center ${
                      isSelected ? 'border-sky-500 bg-sky-500' : 'border-zinc-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-black" />}
                    </div>
                    <div className="text-left">
                      <div className="font-mono text-sm">{model.name}</div>
                      <div className="font-mono text-xs text-zinc-600">{model.provider}</div>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-zinc-700">
                    {model.openRouterId.split('/')[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Future integration note */}
          <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/50">
            <div className="font-mono text-xs text-zinc-600">
              <span className="text-zinc-500">// Coming soon:</span> Custom OpenRouter models + Covenant Labs Conduit integration
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
