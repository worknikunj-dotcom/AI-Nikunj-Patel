# RCA Platform (React + TypeScript)

Production-style Root Cause Analysis platform with incident management, RCA workflows, action items, dashboard analytics, filters, and AI-assisted suggestions (mocked).

## Setup

```bash
npm install
npm run dev
```

## Features
- Dashboard with severity and trend charts
- Incident CRUD (create/delete via store API, edit via upsert)
- RCA methods: 5 Whys + Fishbone data model
- Timeline/events model, root causes, comments, tasks
- Full-text search + filters
- LocalStorage persistence
- Dark mode toggle
- Toast notifications and loading states

## Screens
- Dashboard
- Incident List + Filters
- Incident Detail with RCA suggestions
- Create Incident

## Architecture
- `src/store`: Zustand state and persistence
- `src/types`: Domain models
- `src/data`: Seed mock data
- `src/utils`: AI suggestion mock service
- `src/components`: UI components
