# Runceipt

A "Receiptify for Strava" web app. Connect your Strava account and get a thermal receipt-style summary of your last 30 days of running — shareable as a PNG.

![Runceipt preview](public/next.svg)

## Features

- Strava OAuth login
- Lists every run as a line item (date, name, distance)
- Totals: distance, time, elevation
- Highlights: longest run, fastest pace
- Download as PNG via html2canvas-pro
- CODE128 barcode encoding your total mileage

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [html2canvas-pro](https://github.com/niklasvh/html2canvas) — PNG export with CSS Color Level 4 support
- [JsBarcode](https://github.com/lindell/JsBarcode) — barcode generation
- TypeScript

## Getting Started

### 1. Create a Strava API app

Go to [strava.com/settings/api](https://www.strava.com/settings/api) and create an app. Set the **Authorization Callback Domain** to `localhost`.

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
STRAVA_CLIENT_ID=         # from strava.com/settings/api
STRAVA_CLIENT_SECRET=     # from strava.com/settings/api
NEXT_PUBLIC_STRAVA_CLIENT_ID=    # same as STRAVA_CLIENT_ID
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect with Strava, and your receipt will be generated automatically.

## Notes

- Strava API responses are cached in `.cache/activities.json` for 1 hour during development. Delete the file to force a fresh fetch.
- Rate limits: 100 requests / 15 min, 1000 / day — the cache prevents hitting these during normal dev use.
