import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') || 'AI Bias';

    // These would be real results in production
    // For now, we'll show a placeholder
    const results = searchParams.get('results');
    let verdicts = [
      { model: 'Claude', verdict: '?' },
      { model: 'GPT', verdict: '?' },
      { model: 'Gemini', verdict: '?' },
      { model: 'Grok', verdict: '?' },
    ];

    if (results) {
      try {
        const parsed = JSON.parse(decodeURIComponent(results));
        verdicts = parsed;
      } catch {
        // Use defaults
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0D0D0D',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#4A90D9',
                fontFamily: 'monospace',
              }}
            >
              SHIBBOLETH
            </span>
          </div>

          {/* Topic */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 40,
              textAlign: 'center',
              maxWidth: '80%',
              fontFamily: 'monospace',
            }}
          >
            &quot;{topic}&quot;
          </div>

          {/* Verdict Grid */}
          <div
            style={{
              display: 'flex',
              gap: 20,
            }}
          >
            {verdicts.map((v, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 20,
                  backgroundColor: '#1a1a1a',
                  borderRadius: 12,
                  border: '1px solid #333',
                  minWidth: 120,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: '#888',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}
                >
                  {v.model}
                </span>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color:
                      v.verdict === 'GOOD'
                        ? '#22C55E'
                        : v.verdict === 'BAD'
                        ? '#EF4444'
                        : v.verdict === 'REFUSED'
                        ? '#EAB308'
                        : '#888',
                    fontFamily: 'monospace',
                  }}
                >
                  {v.verdict}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 16,
              color: '#666',
            }}
          >
            shibboleth.covenantlabs.ai
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error('OG Image generation error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
