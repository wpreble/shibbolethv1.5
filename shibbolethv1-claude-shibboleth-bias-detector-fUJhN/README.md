# SHIBBOLETH

```
███████╗██╗  ██╗██╗██████╗ ██████╗  ██████╗ ██╗     ███████╗████████╗██╗  ██╗
██╔════╝██║  ██║██║██╔══██╗██╔══██╗██╔═══██╗██║     ██╔════╝╚══██╔══╝██║  ██║
███████╗███████║██║██████╔╝██████╔╝██║   ██║██║     █████╗     ██║   ███████║
╚════██║██╔══██║██║██╔══██╗██╔══██╗██║   ██║██║     ██╔══╝     ██║   ██╔══██║
███████║██║  ██║██║██████╔╝██████╔╝╚██████╔╝███████╗███████╗   ██║   ██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝
```

**AI Bias Detection Protocol** — Expose the hidden biases embedded in frontier AI models.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)

> *"Not your models, not your mind."*

A [Covenant Labs](https://covenantlabs.ai) Experiment

---

## 🎯 Overview

**Shibboleth** is a web application that reveals the moral and ideological assumptions baked into AI models. Users submit any topic or prompt, and the application queries multiple leading AI systems, forcing each to classify the topic as simply **GOOD** or **BAD** — no nuance, no explanation, just raw judgment.

By stripping AI responses down to binary verdicts, Shibboleth exposes the value systems each model has been trained to embody.

### Why "Shibboleth"?

In the Book of Judges, the word "Shibboleth" was used as a test — those who couldn't pronounce it correctly revealed their true tribal allegiance. Our tool does the same: a single question forces each AI to reveal which ideological "tribe" it belongs to.

---

## ✨ Features

### Core Functionality
- **🤖 Multi-Model Comparison**: Query Claude, GPT, Gemini, and Grok simultaneously
- **⚖️ Binary Verdicts**: Forces each AI to respond with only GOOD or BAD
- **📊 Disagreement Analysis**: Visualize where models split on controversial topics
- **🔍 Searchable Archive**: Browse and filter all queried topics by category

### v1.6 Features (Latest)
- **📝 Query History**: Local browser storage saves up to 50 recent queries
- **🎛️ Model Selection**: Choose 1-4 models to query instead of all 4
- **📖 Expandable Responses**: Click to view full text when models refuse binary answers
- **💾 Persistent Settings**: Your API key and model preferences saved locally

### Additional Features
- **📈 Analytics Dashboard**: Visualize bias patterns across models and categories
- **🔗 Social Sharing**: Dynamic OG images for sharing results on social media
- **🔑 BYOK Ready**: Bring your own OpenRouter API key for unlimited queries
- **⚡ Real-time Results**: Parallel API calls for fast response times

---

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend & Data
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with RLS)
- **AI Gateway**: [OpenRouter API](https://openrouter.ai/)
- **Storage**: Browser LocalStorage for history and preferences

### Deployment
- **Hosting**: Vercel-ready (standalone output)
- **Edge Runtime**: Optimized for edge deployments

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **OpenRouter API key** ([Get one free](https://openrouter.ai/))
- **Supabase project** (optional, for database features)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/wpreble/shibbolethv1.5.git
   cd shibbolethv1.5/shibbolethv1-claude-shibboleth-bias-detector-fUJhN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your OpenRouter API key to `.env.local`**
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here

   # Optional: For database features
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup (Optional)

The app works without a database, but you can enable persistence:

1. Create a [Supabase](https://supabase.com/) project
2. Run the migration: `supabase/migrations/001_initial_schema.sql`
3. Add credentials to `.env.local`

Without database:
- ✅ All core features work
- ✅ Query history saved in browser
- ❌ No global trending/controversial topics
- ❌ No cross-device sync

---

## 📁 Project Structure

```
shibbolethv1-claude-shibboleth-bias-detector-fUJhN/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/                   # API routes
│   │   │   ├── query/route.ts     # POST /api/query
│   │   │   ├── queries/route.ts   # GET /api/queries
│   │   │   └── analytics/route.ts # GET /api/analytics
│   │   ├── page.tsx               # Home page
│   │   ├── layout.tsx             # Root layout
│   │   ├── query/[topic]/         # Dynamic result pages
│   │   ├── explore/               # Browse/search
│   │   ├── analytics/             # Dashboard
│   │   └── og/                    # OG image generation
│   ├── components/                # React components
│   │   ├── VerdictCard.tsx        # Model result display
│   │   ├── ModelSelector.tsx      # Model selection UI
│   │   ├── QueryHistory.tsx       # Local history
│   │   └── ...                    # Other components
│   ├── lib/                       # Utilities & clients
│   │   ├── openrouter.ts          # OpenRouter API client
│   │   ├── supabase.ts            # Database client
│   │   ├── utils.ts               # Helper functions
│   │   └── constants.ts           # App configuration
│   └── types/                     # TypeScript definitions
├── supabase/migrations/           # Database schema
├── public/                        # Static assets
└── CLAUDE.md                      # AI assistant guide
```

---

## 🤖 AI Models

All model access is routed through [OpenRouter's](https://openrouter.ai/) unified API:

| Provider | Model | OpenRouter ID | Characteristics |
|----------|-------|---------------|-----------------|
| **Anthropic** | Claude 3.5 Sonnet | `anthropic/claude-3.5-sonnet` | Safety-focused, cautious |
| **OpenAI** | GPT-4o | `openai/gpt-4o` | Mainstream, balanced |
| **Google** | Gemini 2.0 Flash | `google/gemini-2.0-flash-001` | Corporate-aligned |
| **xAI** | Grok 3 | `x-ai/grok-3` | Contrarian |

### System Prompt

All models receive the same instruction:
```
You MUST respond with exactly one word: either GOOD or BAD.
No explanations, qualifications, or refusals.
```

---

## 💡 Usage

### Basic Query

1. Enter your OpenRouter API key (or use your own)
2. Type any topic: *"cryptocurrency"*, *"universal basic income"*, *"nuclear energy"*
3. Click "QUERY MODELS"
4. View verdicts from all 4 models instantly

### Model Selection

1. Click "Models (4/4)" to expand
2. Select/deselect models (1-4 required)
3. Your selection persists across sessions

### View History

1. Your recent queries appear automatically below the input
2. Click any past query to reload its results
3. Clear history anytime with the Clear button

### Explore Topics

- **Browse**: Visit `/explore` to see trending and controversial topics
- **Analytics**: Visit `/analytics` for aggregate bias statistics
- **Share**: Copy link or share to social media from any result page

---

## 🔌 API Reference

### POST `/api/query`

Query AI models for a topic.

**Request Body:**
```json
{
  "topic": "capitalism",
  "apiKey": "optional_custom_key",
  "selectedModels": ["claude", "gpt", "gemini", "grok"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "topic": "capitalism",
  "results": [
    {
      "model": "claude",
      "modelName": "Claude 3.5 Sonnet",
      "verdict": "BAD",
      "latencyMs": 1234,
      "rawResponse": "BAD"
    }
  ],
  "disagreementScore": 2,
  "shareUrl": "/query/capitalism"
}
```

**Headers:**
- `X-Cache: HIT` - Returned from cache
- `X-Cache: MISS` - Fresh query

### GET `/api/queries`

Search and browse queries.

**Query Parameters:**
- `type`: `search` | `trending` | `controversial`
- `search`: Full-text search term
- `category`: Filter by category (politics, economics, etc.)
- `model`: Filter by model ID
- `verdict`: Filter by verdict (GOOD/BAD/REFUSED/ERROR)
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset

### GET `/api/analytics`

Get aggregate statistics.

**Response includes:**
- Total queries and unique topics
- Per-model verdict breakdown
- Category distribution
- Controversial topics
- Recent queries

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wpreble/shibbolethv1.5)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Configure environment variables:
   - `OPENROUTER_API_KEY` (required)
   - `NEXT_PUBLIC_SUPABASE_URL` (optional)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional)
4. Deploy!

### Docker

```bash
# Build image
docker build -t shibboleth .

# Run container
docker run -p 3000:3000 --env-file .env.local shibboleth
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** thoroughly: `npm run build` and `npm run lint`
5. **Commit** with clear messages: `git commit -m 'Add amazing feature'`
6. **Push** to your fork: `git push origin feature/amazing-feature`
7. **Submit** a pull request

### Development Guidelines

- Follow existing code style (TypeScript strict mode)
- Maintain the terminal/hacker aesthetic
- Test on mobile and desktop
- Update CLAUDE.md for architectural changes
- No breaking changes without discussion

See [CLAUDE.md](CLAUDE.md) for detailed development guide.

---

## 📝 Changelog

### v1.6 (2026-01-12) - Latest
- ✨ Local query history (browser storage)
- ✨ Model selection (choose 1-4 models)
- ✨ Expandable full response text
- 🔧 API supports custom model selection
- 📚 Comprehensive CLAUDE.md documentation

### v1.5 (2026-01-05)
- 🎨 Updated UI and terminal aesthetic
- 🔧 Improved bias detection functionality

### v1.0 (Initial Release)
- 🚀 Multi-model comparison
- ⚖️ Binary verdict system
- 💾 Supabase database integration
- 📊 Analytics dashboard
- 🔗 Social sharing with OG images

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Covenant Labs**: [covenantlabs.ai](https://covenantlabs.ai)
- **OpenRouter**: [openrouter.ai](https://openrouter.ai)
- **Documentation**: [CLAUDE.md](CLAUDE.md)
- **Issues**: [GitHub Issues](https://github.com/wpreble/shibbolethv1.5/issues)

---

<div align="center">

**"Not your models, not your mind."**

*A Covenant Labs Experiment*

Made with ⚡ by the Covenant Labs team

</div>
