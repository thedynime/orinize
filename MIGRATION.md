# Migration and deployment notes

## Source import

This repository imports the existing Orinize project. The two GitHub repositories receive the same application files while preserving their independent initial histories. Neither repository is automatically synchronized with the other.

The root source includes the marketing site and the development chat/API preview. The original local `sites/orinize-marketing` directory is a separate generated hosting checkout, not an npm workspace, and is excluded from this repository. Local QA artifacts and deployment archives are excluded too.

## Move to a Next.js host

1. Clone this repository and run `npm ci`.
2. Copy `.env.example` to `.env.local` for local configuration; never commit populated credentials.
3. Run `npm run typecheck` and `npm run build`.
4. Use `npm start` or a hosting provider's supported Next.js integration.
5. Supply `OPENAI_API_KEY` only through server secret configuration if the chat preview needs a live provider.
6. Protect `/api/chat` before enabling a paid provider on a publicly accessible deployment. The preview currently has no user authentication, per-user quotas, or rate limiting.
7. Verify navigation, media, light/dark mode, mobile layout, keyboard focus, reduced motion, and both permission-preview redirect paths.

## Marketing-only static hosting

The existing Sites publication uses a separate sanitized Next.js export with `output: 'export'`, `trailingSlash: true`, and unoptimized static images. It contains marketing routes, `/login`, public assets, and required shared components. It excludes `/api/chat` and `/preview/*`.

Do not enable static export on the full root project without removing the server API from that export. Build the dedicated marketing copy, configure its static directory as `out`, and follow the hosting provider's source/package workflow. Retain Site identity only in the authorized local hosting checkout; do not copy tokens or credentials into GitHub.

## Dynime permission preview

The `/login` route is an illustration, not OAuth or a real authorization flow. Allow displays Accepted, then redirects after three seconds to `https://app.dynime.com/orinize`. Don’t allow displays Rejected, then returns home. Close/Escape return home immediately. No credential fields or permission grants exist here.

A real account connection requires a separately verified Dynime authorization contract, registered callback, validated state/PKCE as applicable, and server-side session/token handling. Do not interpret a client-side Accepted state as authentication.

## Data and compatibility

No database migrations are required. Preview conversations, saved prompts, and preferences are browser-local. Export important conversations before clearing site storage or changing origin; browser-local data does not automatically move between domains.

## Development diagnostics

Browser extensions can inject attributes such as `bis_skin_checked` before React hydration. Reproduce hydration reports with extensions disabled before changing application rendering. Do not globally suppress hydration errors to conceal genuine mismatches.
