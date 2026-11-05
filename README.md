# ROOM 404 — Band Room Booking

Next.js booking frontend for a rehearsal / band room business.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The booking form validates date, time and email and shows a confirmation state. `/admin` contains the admin dashboard UI.

## Deploy on Vercel

1. Import the GitHub repository into Vercel.
2. Set `ADMIN_PASSWORD` in Vercel project environment variables.
3. Add a Postgres provider (Vercel Postgres, Neon or Supabase) and set `DATABASE_URL`.
4. Add a Resend API key as `RESEND_API_KEY` to send real confirmation emails.

The current UI is dependency-light and deployable immediately. The form submission and admin records are the next integration point for a production database and payment provider.

## Product defaults

- Rooms A, B and C with hourly pricing.
- Sessions from 10:00 to 00:00.
- Booking duration from 1–4 hours.
- Hong Kong dollars (HKD).
- Admin dashboard at `/admin`.
