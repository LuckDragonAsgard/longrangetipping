# Long Range Tipping

An AFL tipping platform where you tip **every game for the entire season** before Round 1 kicks off. No weekly tipping, no last-minute changes. Lock in your picks and ride the wave all season.

**Live at:** [longrangetipping.com](https://longrangetipping.com)

## Features

- **Full Season Tipping** — Tip all 216 AFL games upfront before the season starts
- **Create Comps** — Set up public or private competitions with invite codes
- **Auto Results** — Scores update automatically from the Squiggle API after each round
- **Live Leaderboard** — Rankings update in real-time as results come in
- **Round-by-Round Results** — See how your tips are tracking each round
- **Mobile Ready** — Responsive design works on phone, tablet, or desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (React, App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AFL Data | Squiggle API |
| Hosting | Vercel |
| Domain | longrangetipping.com |

## Quick Start (Demo Mode)

The app works in demo mode without Supabase — perfect for testing and development.

```bash
cd longrangetipping
npm install
npm run dev
```

Open http://localhost:3000 — you'll see the full app with demo data.

Click **"Quick Demo Login"** on the login page to explore as a logged-in user.

## Deploy to Production

### 1. Set Up Supabase

1. Create a free project at supabase.com
2. Go to SQL Editor and run the schema in `supabase-schema.sql`
3. Copy your project URL, anon key, and service role key

### 2. Configure Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Deploy to Vercel

1. Push to GitHub
2. Import the repo on vercel.com
3. Add environment variables in Vercel dashboard
4. Deploy

### 4. Connect Domain

1. In Vercel, go to Settings > Domains
2. Add `longrangetipping.com`
3. Update DNS records in Squarespace to point to Vercel

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    layout.tsx            # Root layout with nav + footer
    login/page.tsx        # Login
    signup/page.tsx       # Sign up
    dashboard/page.tsx    # User dashboard
    create/page.tsx       # Create new comp
    browse/page.tsx       # Browse public comps
    profile/page.tsx      # User profile
    comp/[code]/
      page.tsx            # Comp leaderboard + tabs
      tips/page.tsx       # Enter tips for all games
      results/page.tsx    # Round-by-round results
    api/
      auth/               # Login + signup endpoints
      comps/              # Competition CRUD
      tips/               # Save/load tips
      squiggle/           # AFL data proxy
  components/
    AppProvider.tsx        # React context provider
    Navbar.tsx             # Navigation bar
  lib/
    store.ts              # App state management
    supabase.ts           # Supabase client
    fixture-data.ts       # 2026 AFL fixture (216 games)
    teams-data.ts         # 18 AFL teams
    teams.ts              # Team colors
    squiggle.ts           # Squiggle API wrapper
  types/
    index.ts              # TypeScript interfaces
  middleware.ts           # Auth middleware
```

## AFL Data

Fixture data is sourced from the Squiggle API (api.squiggle.com.au). The current dataset includes 216 games across the 2026 AFL season, 29 rounds (Opening Round through Grand Final), 18 teams with real fixtures, venues, dates, and live results for completed games.

## Database Schema

See `supabase-schema.sql` for the full database schema including users/profiles, competitions with invite codes, tips with correctness tracking, Row Level Security policies, and a leaderboard view.

---

Built by Paddy for the footy-loving community.
