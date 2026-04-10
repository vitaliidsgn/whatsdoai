# WhatsDo Partner Onboarding

Standalone frontend for the partner onboarding flow. Built with Vite + React + TypeScript, deployed on Vercel.

## Prerequisites

- Node.js 18+
- npm 9+

## Local Development

```bash
git clone https://github.com/What-s-Do/whatsdo-onboarding.git
cd whatsdo-onboarding
npm install
cp .env.example .env
```

Edit `.env` and set `BACKEND_URL` to your local API gateway:

```
BACKEND_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:5173/onboarding

### How the dev proxy works

In development, Vite proxies `/api/*` requests to `BACKEND_URL`. The proxy strips the `/api` prefix — so `fetch("/api/partners/register")` in the browser hits `http://localhost:8000/partners/register` on the backend.

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `BACKEND_URL` | `https://ironbccllm.tail0cc1d4.ts.net` | Yes | Backend API gateway URL |

## Deploying to Vercel

### First-time setup

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `What-s-Do/whatsdo-onboarding` repository
3. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `/`
4. Add environment variable:
   - `BACKEND_URL` = your backend API gateway URL (e.g. `https://ironbccllm.tail0cc1d4.ts.net`)
5. Click **Deploy**

### How it works

- The React SPA handles all `/onboarding/*` routes client-side
- A Vercel serverless function at `api/[...path].ts` proxies `/api/*` requests to `BACKEND_URL`
- `vercel.json` configures SPA fallback rewrites so direct URL access works

### Custom domain (optional)

1. In Vercel dashboard → your project → Settings → Domains
2. Add your domain (e.g. `onboarding.whatsdo.com`)
3. Update DNS records as instructed by Vercel

## API Proxy

All API calls from the frontend use relative paths (e.g. `/api/partners/register`). These are proxied:

- **Development:** Vite's built-in proxy (`vite.config.ts` → `server.proxy`)
- **Production:** Vercel serverless function (`api/[...path].ts`)

Both strip the `/api` prefix before forwarding to the backend.

## Square OAuth

The Square OAuth flow involves browser redirects:

1. Frontend redirects user to `{BACKEND_URL}/api/square/authorize?partner_id=...&return_url=...`
2. The `return_url` is set to the Vercel app's URL (e.g. `https://your-app.vercel.app/onboarding/{id}`)
3. After OAuth, the backend redirects the browser back to `return_url`

This means the backend's OAuth callback automatically sends the user back to the Vercel app.

## Project Structure

```
├── api/[...path].ts          # Vercel serverless API proxy
├── public/onboarding/        # Static assets (images, SVGs)
├── src/
│   ├── api/client.ts         # Typed API client
│   ├── types.ts              # TypeScript types
│   ├── components/           # Shared UI components
│   ├── pages/
│   │   ├── Landing.tsx       # Marketing landing page
│   │   ├── OnboardingRouter.tsx # Step router
│   │   ├── SetupProfile.tsx  # Step 1
│   │   ├── ConnectProvider.tsx # Step 2
│   │   └── Complete.tsx      # Step 3
│   ├── App.tsx               # React Router config
│   └── main.tsx              # Entry point
├── vercel.json               # SPA rewrites
└── vite.config.ts            # Dev server + proxy
```
