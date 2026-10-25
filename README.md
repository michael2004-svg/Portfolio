# michaelmusyoka.com

One Next.js app serving two sites, an admin dashboard and a client portal:

| Where | What |
| --- | --- |
| `michaelmusyoka.com` | Portfolio — proof of work, case studies, track record, approved reviews |
| `booking.michaelmusyoka.com` | Booking site — conversion-focused, lead form + Calendly, approved reviews |
| `/admin` | Analytics (visitors, clicks, conversion rate), leads, clients & projects, review moderation |
| `/portal` | Client portal — progress, milestone approvals, updates, contracts & deliverables, review request |

The booking domain is routed by `middleware.ts`: any host starting with `BOOKING_HOST_PREFIX` (`booking.`) is served `app/book`.

## Deploy (VPS)

```bash
git clone https://github.com/michael2004-svg/Portfolio.git /opt/deploy/applications/portfolio
cd /opt/deploy/applications/portfolio
bash scripts/setup.sh
```

`setup.sh` generates secrets, creates the database in the shared PostgreSQL (or starts a private one), asks for the admin email and SMTP once, backs up, migrates, builds, starts, health-checks, and adds both domains to Caddy. Run it again any time to redeploy — and always after a commit that changes `prisma/schema.prisma`.

Pushes to `main` deploy automatically through `.github/workflows/deploy.yml` (the shared `infrastructure` reusable workflow: exact-SHA build, health check, automatic rollback).

## How things flow

- **Leads**: booking forms on both sites → `POST /api/leads` → saved, counted as a conversion, emailed to `NOTIFY_EMAIL`. In `/admin/leads`, “Make client” creates a portal account + project and emails the invite.
- **Analytics**: `components/analytics/Tracker.tsx` records page views and clicks on any element with `data-track="<id>"`; Calendly bookings count as conversions.
- **Projects**: set milestones to “awaiting approval” and the client approves them in the portal. Setting the project to “Ready for sign-off” lets the client approve the whole project, which opens a review request.
- **Reviews**: submitted reviews wait in `/admin/reviews`; approved ones appear on the portfolio and/or booking site (per-review toggles). Past clients can be asked by email from the same page.

## Local development

```bash
docker run -d --name portfolio-dev-db -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=portfolio -e POSTGRES_DB=portfolio -p 5433:5432 postgres:16-alpine
cp .env.example .env   # set DATABASE_URL to localhost:5433, SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npx prisma migrate dev
npm run dev
```

Without SMTP settings, emails (invites, review requests, lead alerts) are printed to the server console.
