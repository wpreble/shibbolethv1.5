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
  error?: {
    message: string;
    code?: string;
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
      max_tokens: 50,
      temperature: 0,
    }),
  });

  const latencyMs = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[OpenRouter] Error for ${modelId}:`, errorText);
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data: OpenRouterResponse = await response.json();
  
  // Check for error in response body
  if (data.error) {
    console.error(`[OpenRouter] Response error for ${modelId}:`, data.error);
    throw new Error(data.error.message || 'Unknown API error');
  }
  
  const content = data.choices?.[0]?.message?.content || '';
  console.log(`[OpenRouter] ${modelId} responded: "${content}"`);

  return { response: content, latencyMs };
}

/**
 * Query all AI models in parallel
 */
export async function queryAllModels(
  topic: string,
  apiKey?: string
): Promise<ModelResult[]> {
  const key = apiKey || process.env.OPENROUTER_API_KEY;

  if (!key) {
    throw new Error('OpenRouter API key is required');
  }

  const promises = MODELS.map(async (model): Promise<ModelResult> => {
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
      model: MODELS[index].id,
      modelName: MODELS[index].name,
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
