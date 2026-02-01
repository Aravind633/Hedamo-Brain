# 🧠 Cortex — Neural Knowledge Base

Cortex is an AI-first "Second Brain" designed for researchers and engineers. It transforms flat notes into a richly connected knowledge graph using semantic embeddings, vector similarity searches, and smart metadata extraction.

---

![Next.js](https://img.shields.io/badge/Next.js-16--v16.1.6-black?style=flat&logo=next.js) ![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css) ![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat&logo=supabase) ![Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Pro%20%2F%20Flash-4285F4?style=flat&logo=google-gemini) ![Vector](https://img.shields.io/badge/Vector-768--dim-orange?style=flat) ![Framer Motion](https://img.shields.io/badge/Motion-Framer%20%26%20Lenis-FF69B4?style=flat&logo=framer)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Database Migration (pgvector)](#database-migration-pgvector)
- [Development Commands](#development-commands)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [Security & Privacy](#security--privacy)
- [License & Credits](#license--credits)

---

## Overview

Cortex provides:
- A modern Next.js (App Router) frontend with React Server Components for secure, server-side AI orchestration.
- Vector-based semantic search (768-dim embeddings) to surface relationships and build a knowledge graph visualized with React Flow.
- Automated metadata extraction and classification via Google Gemini.

---

## Tech Stack & Architecture

- Next.js 16 (App Router) with Turbopack for fast builds and server-side safety for AI calls.
- Supabase (Postgres + pgvector) as the relational + vector store with RLS policies.
- Google Gemini (text-embedding-004) for generating 768-dimensional embeddings and metadata extraction.
- React Flow for graph visualization, Framer Motion + Lenis for smooth micro-interactions.

---

## Features

- Semantic relationship mapping using cosine similarity on 768-dim embeddings.
- Automatic contextual titles, classification (Idea, Snippet, Article, Journal), and one-line summaries.
- Graph visualization of notes and relationships.
- Premium scrolling and UI micro-interactions for a delightful UX.

---

## Prerequisites

- Node.js >= 18.17.0
- A Supabase project (https://supabase.com)
- A Google AI Studio API key (or Gemini API key)

---

## Local Setup

1. Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd second-brain
npm install
```

2. Create a `.env.local` in the project root and add the variables described below.

3. Start the local dev server:

```bash
npm run dev
# open http://localhost:3000
```

---

## Environment Variables

Create `.env.local` with the following keys (example values):

```env
# Supabase (found in Project > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key

# Gemini / Google AI
GEMINI_API_KEY=your_gemini_api_key
# Optional fallback recognized by the code
GOOGLE_API_KEY=your_google_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Notes:
- `GEMINI_API_KEY` is preferred; code falls back to `GOOGLE_API_KEY` if needed.
- Keep `SUPABASE_SERVICE_ROLE_KEY` confidential and never commit it.

---

## Database Migration (pgvector)

Run the following SQL in the Supabase SQL Editor to enable vector support and create the `notes` table:

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Standardized Notes Table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  content TEXT,
  type TEXT,
  tags TEXT[],
  summary TEXT,
  embedding vector(768), -- tuned for Gemini text-embedding-004
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notes"
ON notes FOR ALL
USING (auth.uid() = user_id);
```

---

## Development Commands

- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`

Note: There are unit and e2e folders under `__tests__/`; add test runner scripts (e.g., Jest/Vitest) if you want to enable automated test commands.

---

## Deployment

Recommended: Vercel for Next.js hosting. When deploying, set the same environment variables in your Vercel project or platform of choice. For Supabase, ensure:

- The `vector` extension is enabled for your database.
- RLS policies are configured appropriately.
- `SUPABASE_SERVICE_ROLE_KEY` is kept secret (server-only).

---

## Testing

Tests are useful but not included as runnable scripts yet. You can add your preferred test runner (Jest, Vitest, Playwright) and add scripts to `package.json`:

```json
// example
"test": "vitest"
```

---

## Contributing

Contributions are welcome. Suggested steps:
1. Fork the repository
2. Create a feature branch
3. Open a pull request with a clear description and changelog entry

Please follow the existing code style (TypeScript, ESLint, Tailwind conventions).

---

## Security & Privacy

- Treat `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` as secrets — never commit them.
- Use row-level security (RLS) to protect user data — this repository includes an example RLS policy for `notes`.

---
