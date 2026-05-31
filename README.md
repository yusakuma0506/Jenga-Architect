# Jenga Architect

Jenga Architect is a game-based OOP learning app for Python beginners and intermediate learners. It combines physical Jenga blocks, QR codes, solo quizzes, multiplayer rooms, turn-based scoring, and account-based progress into one interactive learning experience.

## Features

- Solo quiz practice by level: Entry, Junior, and Senior.
- Multiplayer rooms with host, join code, participants, current turn, scoring, and elimination.
- QR-code support for physical Jenga blocks.
- Server-side quiz answer checking.
- Google and GitHub authentication with NextAuth.
- PostgreSQL data modeling with Prisma.
- Pro-level access control for premium room levels.
- Stripe subscription API routes.
- Profile image upload through Vercel Blob with file validation.
- Feedback submission and admin-only feedback/user pages.
- 3D Jenga tower UI with React Three Fiber and Three.js.

## Target Users

This product is designed for Python learners who are studying object-oriented programming, especially:

- Beginners who already know basic Python syntax.
- Intermediate learners who want stronger OOP practice.
- Students who learn better through games and group activities.
- Teachers or workshop organizers who want an interactive classroom activity.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma 7
- PostgreSQL
- NextAuth
- Stripe
- Vercel Blob
- Tailwind CSS
- React Three Fiber / Three.js

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

```bash
npm run build
```

The build script runs Prisma client generation before the Next.js build.

## Project Structure

| Path | Purpose |
| --- | --- |
| `src/app` | App Router pages and API routes |
| `src/components` | Reusable UI and game components |
| `src/actions` | Server actions for quiz, score, upload, profile, and feedback |
| `src/lib` | Auth, Prisma, validation, quiz logic, room turns, scoring, Stripe, and subscription helpers |
| `src/hooks` | Client hooks such as room polling |
| `prisma/schema.prisma` | Database schema |
| `public/qrs` | QR images for Jenga blocks |
| `generate_qrs.py` | QR generation helper script |

## Security Highlights

- Admin pages are protected by `src/middleware.ts`.
- NextAuth JWT callbacks refresh `role` and `isPro` from the database so users cannot self-elevate privileges from the client.
- Quiz answers are checked on the server and are not included in public quiz data.
- Multiplayer answer attempts verify login, room status, participant membership, elimination state, and current turn.
- Profile image upload validates authentication, MIME type, and maximum file size.
- Premium room creation checks level access before creating a room.

## Product Report

See [Report.md](./Report.md) for the full product report, including target users, development reason, secure code points, hard parts, improvements, trade-offs, KPIs, and a STAR table.

## Useful Commands

```bash
npm run dev
npm run build
```

## KPI Examples

- Weekly active learners.
- Solo quiz completion rate.
- Multiplayer room creation count.
- Average players per room.
- Correct answer rate by level.
- Pro conversion rate.
- Feedback submission count.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
