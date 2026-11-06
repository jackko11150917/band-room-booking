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
2. Add a Vercel Postgres/Neon integration. Its `POSTGRES_URL` variable is used automatically.
3. Create a Google OAuth web application. Set the authorised redirect URI to `https://YOUR-DOMAIN/api/auth/callback/google`.
4. Add these Vercel environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (a long random value)
   - `NEXTAUTH_URL` (your production URL)
   - `ADMIN_EMAILS` (comma-separated Google email addresses allowed into `/admin`)
5. Redeploy after saving the variables.

6. Create a Stripe webhook for `https://YOUR-DOMAIN/api/stripe/webhook`, listen for `checkout.session.completed`, and save its signing secret as `STRIPE_WEBHOOK_SECRET`.
7. Add `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, and `EMAIL_FROM`.

The first request/login automatically creates the `app_users` and `bookings` tables. A booking is only marked `CONFIRMED` after Stripe payment succeeds; Resend then emails the customer.

## Product defaults

- Rooms A, B and C with hourly pricing.
- Sessions from 10:00 to 00:00.
- Booking duration from 1–4 hours.
- Hong Kong dollars (HKD).
- Admin dashboard at `/admin`.
