# Orinize

**Intelligence for Everything You Do.**

Orinize is a product of **Dynime**: a responsive AI product website with a separate development chat workspace. Built with Next.js, React, and TypeScript, it introduces conversations for writing, learning, coding, and everyday thinking.

## What is included

- Marketing homepage, feature guides, learning resources, and informational policy pages.
- Self-hosted Inter typography, official Orinize/Dynime branding, light and dark themes.
- Bento layouts, swipeable workflow examples, keyboard navigation, and reduced-motion support.
- A compact Dynime permission **preview** with Accepted/Rejected confirmation and a three-second redirect.
- A development chat workspace with Markdown, streaming, local history, saved prompts, and settings.

App-launch buttons lead to `/login`. Allow continues to **https://app.dynime.com/orinize**; rejection returns home. This preview does not authenticate users, request account permissions, or bind accounts. Real authentication belongs to the separate Dynime application.

## Local development

Use a Node.js version supported by the installed Next.js release and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. No API key is required for the marketing site or labeled chat demo.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run typecheck` | TypeScript validation |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npx playwright test` | Browser tests; requires configured browser tooling |

## Routes and architecture

| Path / file | Purpose |
| --- | --- |
| `/`, `/overview` | Marketing homepage |
| `/login` | Illustrative Dynime permission flow |
| `/features/*`, `/use-cases/*`, `/resources/*` | Generated guides and resources |
| `/preview/chat` | Development chat workspace |
| `/preview/discover` | Prompt templates and bookmarks |
| `/preview/library` | Browser-local history and saved prompts |
| `/preview/settings` | Appearance, export, and local history controls |
| `app/site-content.ts` | Marketing content and route registry |
| `app/landing.tsx`, `app/landing.css` | Shared marketing layouts and design |
| `app/explore-sections.tsx`, `app/page-sections.tsx` | Bento, slider, and supporting content |
| `app/brand.tsx` | Shared animated Orinize branding |
| `app/api/chat/route.ts` | Server-side AI streaming and labeled demo fallback |
| `public/` | Local fonts, brand assets, and illustrations |
| `tests/` | Browser regression specifications |

## Optional AI configuration

Set these in `.env.local` or the hosting provider's secret configuration:

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Keys stay on the server. Without a key, the chat preview streams clearly labeled demo text. Conversations and preferences are stored in the current browser, with no cloud synchronization. Do not expose the keyed preview API publicly without authentication, authorization, quotas, and rate limiting.

## Deployment and migration

The root project is the full Next.js application. Deploy it to a compatible Node.js/Next.js host; configure secrets on the server. A static marketing-only export must omit the server API and development preview routes. See [MIGRATION.md](MIGRATION.md) for the existing Sites export workflow, account-flow boundaries, and production checklist.

Do not commit `.env` files, build output, local Site credentials, screenshots, or deployment archives. The repository intentionally excludes the separate local Sites checkout and generated QA artifacts.

## Repository description

> Orinize by Dynime — an AI product website and chat preview, built with Next.js, React, and TypeScript. Proprietary; all rights reserved.

Repositories: [jitksaha/orinize](https://github.com/jitksaha/orinize) · [thedynime/orinize](https://github.com/thedynime/orinize)

## License and ownership

Copyright © 2026 Dynime. All rights reserved.

This project is **proprietary**, not open source. Use, modification, deployment, or redistribution requires prior written permission from Dynime, except where applicable law or platform terms provide otherwise. See [LICENSE](LICENSE). Third-party components retain their own licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
