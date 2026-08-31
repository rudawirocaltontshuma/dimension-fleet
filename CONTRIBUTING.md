# Contributing to Dimension Fleet

Thanks for showing interest in improving **Dimension Fleet** (repo: `fleet_logistics_management`).
This guide will help you set up your environment and understand how to contribute.

---

## Overview

Dimension Fleet is a frontend-only Fleet & Logistics Management Platform demo, built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**, on top of the Studio Admin template starter. The goal is to keep the codebase modular, scalable, and easy to extend, with no backend, database, or authentication involved — all data comes from the seeded mock-data layer.

---

## Project Layout

We use a **colocation-based file system**. Dimension Fleet's own feature code lives under its own namespace:

```
src
├── app
│   └── dimension-fleet        # Routes: dashboard, fleet, vehicles, vehicles/[id],
│                               # drivers, drivers/[id], trips, routes, deliveries,
│                               # dispatch, maintenance, fuel, incidents, inspections,
│                               # locations, documents, reports, analytics, settings
├── components
│   └── dimension-fleet        # Shared UI: DataTable, KpiCard, StatusBadge, ChartCard,
│                               # RouteMap, sidebar/topbar app shell
├── lib
│   └── dimension-fleet        # Mock data generators, aggregation, formatting helpers
└── components/ui              # Shared shadcn/ui primitives (do not modify directly)
```

If you'd like a broader example of this colocation pattern, check out the [Next Colocation Template](https://github.com/arhamkhnz/next-colocation-template).

---

## Getting Started

### Fork and Clone the Repository

1. Fork the repository on GitHub.

2. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/fleet_logistics_management.git
   ```

3. Navigate into the project
   ```bash
   cd fleet_logistics_management
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   App will be available at [http://localhost:3000](http://localhost:3000). Dimension Fleet lives under `/dimension-fleet/...` (the root `/` redirects there).

---

## Contribution Flow

- Always create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```

- Use clear commit messages:
  ```bash
  git commit -m "feat: add fuel efficiency chart to fuel dashboard"
  ```

- Open a Pull Request once ready.
- If your change adds a new screen or component, include a screenshot in your PR description.

---

## Where to Contribute

- **Dimension Fleet routes**: `src/app/dimension-fleet/<module>/page.tsx`
- **Shared Dimension Fleet components**: `src/components/dimension-fleet/`
- **Mock data & helpers**: `src/lib/dimension-fleet/` (generators, aggregation, formatting)
- **Shared shadcn/ui primitives**: `src/components/ui/` (avoid modifying directly; customize where used)

Keep all Dimension Fleet data client-side and mock — do not add real network calls, database clients, or auth libraries.

---

## Guidelines

- Prefer **TypeScript types** over `any`
- Husky pre-commit hooks are enabled — linting and formatting run automatically when you commit, and if there are errors the commit will be blocked until they are fixed.
- Follow **shadcn/ui** style & Tailwind conventions
- Keep accessibility in mind (ARIA, keyboard nav)
- Use clear commit messages with conventional prefixes (`feat:`, `fix:`, `chore:`, etc.)
- Avoid unnecessary dependencies — prefer existing utilities where possible
- Keep new/changed mock data deterministic (seeded) so the app behaves consistently across runs

---

## Submitting PRs

- Open a Pull Request once your changes are ready.
- Ensure your branch is up to date with `main` before submitting.
- Reference any related issue in your PR for context.
- Confirm `npm run build` and `npm run lint` pass before requesting review.

---

## Questions & Support

- Report bugs, suggestions, or issues via [GitHub Issues](https://github.com/rudawirocaltontshuma/fleet_logistics_management/issues)

---

Your contributions keep this project growing. 🚀
