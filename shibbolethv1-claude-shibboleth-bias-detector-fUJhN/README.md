# SHIBBOLETH

> *"The word that reveals allegiance"*

**AI Bias Detector** — Expose the hidden biases embedded in frontier AI models.

A [Covenant Labs](https://covenantlabs.ai) Experiment

---

## Overview

Shibboleth is a web application that reveals the moral and ideological assumptions baked into AI models. Users submit any topic or prompt, and the application queries multiple leading AI systems, forcing each to classify the topic as simply **GOOD** or **BAD** — no nuance, no explanation, just raw judgment.

By stripping AI responses down to binary verdicts, Shibboleth exposes the value systems each model has been trained to embody.

### Why "Shibboleth"?

In the Book of Judges, the word "Shibboleth" was used as a test — those who couldn't pronounce it correctly revealed their true tribal allegiance. Our tool does the same: a single word forces each AI to reveal which ideological "tribe" it belongs to.

## Features

- **Multi-Model Comparison**: Query Claude, GPT, Gemini, and Grok simultaneously
- **Binary Verdicts**: Forces each AI to respond with only GOOD or BAD
- **Bias Database**: Searchable archive of all queried topics
- **Analytics Dashboard**: Visualize bias patterns across models
- **Social Sharing**: Dynamic OG images for sharing results
- **BYOK Ready**: Bring your own OpenRouter API key

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI Gateway**: OpenRouter
- **Charts**: Recharts
- **Hosting**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenRouter API key ([get one here](https://openrouter.ai/))
- Supabase project (optional, for persistence)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/covenantlabs/shibboleth.git
cd shibboleth
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. (Optional) Set up the database:
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/001_initial_schema.sql`

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── query/         # AI query endpoint
│   │   ├── queries/       # Search/list endpoint
│   │   └── analytics/     # Analytics endpoint
│   ├── query/[topic]/     # Results page
│   ├── explore/           # Search/browse page
│   ├── analytics/         # Dashboard page
│   └── og/                # OG image generation
├── components/            # React components
├── lib/                   # Utilities and clients
│   ├── constants.ts       # App configuration
│   ├── openrouter.ts      # OpenRouter API client
│   ├── supabase.ts        # Database client
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript types
```

## AI Models

All model access is routed through OpenRouter's unified API:

| Provider | Model | Tendencies |
|----------|-------|------------|
| Anthropic | Claude 3.5 Sonnet | Safety-focused, cautious |
| OpenAI | GPT-4o | Mainstream, balanced |
| Google | Gemini 2.0 Flash | Corporate-aligned |
| xAI | Grok 2 | Contrarian |

## API Reference

### POST /api/query

Query all AI models for a topic.

```json
{
  "topic": "capitalism",
  "apiKey": "optional_byok_key"
}
```

### GET /api/queries

Search and list queries.

Query params:
- `type`: `search` | `trending` | `controversial`
- `search`: Search term
- `category`: Filter by category
- `limit`: Results limit
- `offset`: Pagination offset

### GET /api/analytics

Get aggregate analytics data.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

### Docker

```bash
docker build -t shibboleth .
docker run -p 3000:3000 --env-file .env.local shibboleth
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License — see LICENSE file for details.

---

**"Not your models, not your mind."**

*A Covenant Labs Experiment*
