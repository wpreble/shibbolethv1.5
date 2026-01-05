import { MODELS, SYSTEM_PROMPT, APP_URL, APP_NAME } from './constants';
import { ModelResult, Verdict } from '@/types';
import { parseVerdict } from './utils';

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Query a single AI model via OpenRouter
 */
async function queryModel(
  modelId: string,
  topic: string,
  apiKey: string
): Promise<{ response: string; latencyMs: number }> {
  const startTime = Date.now();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': APP_URL,
      'X-Title': APP_NAME,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: topic },
      ],
      max_tokens: 10,
      temperature: 0,
    }),
  });

  const latencyMs = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data: OpenRouterResponse = await response.json();
  const content = data.choices[0]?.message?.content || '';

  return { response: content, latencyMs };
}

/**
 * Query all AI models in parallel
 */
export async function queryAllModels(
  topic: string,
  apiKey?: string,
  selectedModelIds?: string[]
): Promise<ModelResult[]> {
  const key = apiKey || process.env.OPENROUTER_API_KEY;

  if (!key) {
    throw new Error('OpenRouter API key is required');
  }

  // Filter models based on selection, or use all models if no selection
  const modelsToQuery = selectedModelIds && selectedModelIds.length > 0
    ? MODELS.filter(m => selectedModelIds.includes(m.id))
    : MODELS;

  const promises = modelsToQuery.map(async (model): Promise<ModelResult> => {
    try {
      const { response, latencyMs } = await queryModel(
        model.openRouterId,
        topic,
        key
      );
      const verdict = parseVerdict(response);

      return {
        model: model.id,
        modelName: model.name,
        verdict,
        latencyMs,
        rawResponse: response,
      };
    } catch (error) {
      console.error(`Error querying ${model.name}:`, error);
      return {
        model: model.id,
        modelName: model.name,
        verdict: 'ERROR' as Verdict,
        latencyMs: 0,
        rawResponse: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  const results = await Promise.allSettled(promises);

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      model: modelsToQuery[index].id,
      modelName: modelsToQuery[index].name,
      verdict: 'ERROR' as Verdict,
      latencyMs: 0,
      rawResponse: result.reason?.message || 'Unknown error',
    };
  });
}

/**
 * Check if OpenRouter API key is valid
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
