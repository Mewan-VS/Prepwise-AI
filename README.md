# PrepWise AI – Smart Study Planner

An AI-powered full-stack study planner built with **Next.js 16 (App Router)**,
**Tailwind CSS v4**, **Supabase**, and the **Groq LLM API**.

Students enter a subject, topics, and an exam date; the app generates a
personalized day-by-day study schedule and saves it for later.

## Features

- 📝 Form to capture **subject, topics, exam date**
- 🤖 **AI-generated** day-by-day study plan via Groq (`llama-3.3-70b-versatile`)
- 💾 **Save** plans to Supabase
- 📚 **View** all saved plans on the `/plans` page
- 🚀 Ready to **deploy on Vercel**

## Project structure

```
prepwise-ai/
├─ app/
│  ├─ page.tsx               # Home – the study form
│  ├─ layout.tsx
│  ├─ plans/page.tsx         # Saved plans (Server Component, reads Supabase)
│  └─ api/
│     ├─ generate/route.ts   # POST → calls Groq, returns a plan
│     └─ plans/route.ts      # GET (list) + POST (save) plans
├─ components/
│  ├─ StudyForm.tsx          # Client component: form + generate + save
│  └─ PlanCard.tsx           # Renders a single plan
├─ lib/
│  ├─ supabase.ts            # Supabase client + shared types
│  └─ groq.ts                # Groq API helper
└─ supabase/schema.sql       # Database table + RLS policies
```

## Setup

### 1. Environment variables

Create `.env.local` (already present in this project) with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key
```

### 2. Create the database table

In the Supabase dashboard, open **SQL Editor → New query**, paste the contents
of [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates the
`study_plans` table and the Row Level Security policies the app needs.

### 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the three environment variables above in the Vercel project settings.
4. Deploy.

## How it works

1. `StudyForm` posts the form data to `/api/generate`.
2. The route handler calls Groq with a structured prompt and returns a JSON
   plan (`{ day, focus, tasks[] }[]`).
3. The plan is shown in a `PlanCard`. Clicking **Save** posts it to
   `/api/plans`, which inserts it into the Supabase `study_plans` table.
4. The `/plans` page reads all saved plans directly from Supabase in a Server
   Component and renders them.
