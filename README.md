# CreatorX MVP

CreatorX is a focused Product Creator module that helps professionals go from idea to a validated, claim-safe product blueprint.

## Architecture overview

- **Next.js App Router** for server components + server actions.
- **Prisma + Postgres** for multi-tenant data storage.
- **Custom auth** (email/password) with session cookies.
- **AI service layer** in `lib/ai/` with prompt templates, Zod validation, and retry on invalid JSON.
- **Exports** via server-side React-PDF rendering and markdown generation.
- **In-memory rate limiting** for AI endpoints.

## Folder structure

```
app/
  auth/                    # Sign in/up
  dashboard/               # Projects list
  projects/[id]/           # Project workspace + sidebar
    intake/                # Intake review
    opportunities/         # Opportunity board
    validation/            # Validation sprint
    blueprint/             # Blueprint editor + refine
    export/                # Export + share
  share/[token]/           # Read-only share link
components/
  Sidebar.tsx              # Project navigation
lib/
  ai/                      # Prompts, schemas, AI service, ranking
  actions.ts               # Server actions
  auth.ts                  # Sessions + auth helpers
  export.ts                # Markdown + PDF export
  prisma.ts                # Prisma client
  rateLimit.ts             # Simple in-memory limiter
prisma/
  schema.prisma            # Data model
  seed.ts                  # Demo seed data
tests/
  aiSchemas.test.ts        # Zod validation tests
  ranking.test.ts          # Ranking logic tests
```

## Prerequisites

- Node.js 18+
- Docker (for local Postgres)

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

- `DATABASE_URL` – Postgres connection string
- `OPENAI_API_KEY` – OpenAI key (optional; fallback mock data used if empty)
- `OPENAI_MODEL` – model name (default `gpt-4o-mini`)
- `NEXT_PUBLIC_APP_URL` – base URL for share links

## Database setup

```bash
docker compose up -d
npm install
npx prisma migrate dev --name init
npm run seed
```

## Run the app

```bash
npm run dev
```

Then open `http://localhost:3000` and log in with the demo account:

- Email: `demo@creatorx.app`
- Password: `password123`

## One-command run (after setup)

```bash
npm run dev
```

## Notes

- AI endpoints are rate limited to 5 requests per minute per user.
- Exported files are stored in `public/exports`.
