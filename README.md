# Entertainment Platform

A full-stack digital media storefront for browsing movies, purchasing titles with Stripe, and managing an admin catalog.

## Tech stack

**Frontend**

- React 19
- Vite
- TypeScript
- React Router
- Tailwind CSS
- Stripe.js

**Backend**

- Node.js
- Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- Stripe
- JWT authentication (httpOnly cookies)

## Project structure

```text
project-root/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── backend/
│   ├── src/
│   ├── migration/        # Drizzle SQL migrations (tracked in git)
│   │   └── meta/
│   ├── seed/
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database (local or hosted, e.g. Neon)
- Stripe account (test keys are enough for local development)

## Environment variables

### Backend

Copy the example file:

```bash
cp backend/.env.example backend/.env
```

Fill in:

| Variable                | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string                            |
| `STRIPE_SECRET_KEY`     | Stripe secret key                                       |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret                           |
| `JWT_SECRET`            | Secret used to sign auth tokens                         |
| `FRONTEND_URL`          | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `PORT`                  | API port (default: `3000`)                              |

### Frontend

Copy the example file:

```bash
cp frontend/.env.example frontend/.env
```

Fill in:

| Variable                      | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| `VITE_API_URL`                | Backend API URL (e.g. `http://localhost:3000`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                         |

Never commit real `.env` files. Only `.env.example` belongs in git.

## Backend setup

```bash
cd backend
npm install
npm run db:migrate
npm run dev
```

The API runs on `http://localhost:3000` by default.

### Useful backend scripts

| Command                    | Description                                  |
| -------------------------- | -------------------------------------------- |
| `npm run dev`              | Start API in watch mode                      |
| `npm run build`            | Compile TypeScript                           |
| `npm run db:migrate`       | Apply Drizzle migrations                     |
| `npm run db:generate`      | Generate a new migration from schema changes |
| `npm run db:seed`          | Seed movies data                             |
| `npm run db:link-products` | Create Stripe products and link movies       |

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Database migrations

Migrations live in `backend/migration/` and must stay in version control.

Apply migrations:

```bash
cd backend
npm run db:migrate
```

Generate a new migration after schema changes:

```bash
cd backend
npm run db:generate
npm run db:migrate
```

## Run locally

1. Start PostgreSQL and create a database.
2. Configure `backend/.env` and `frontend/.env`.
3. Run backend migrations.
4. Start backend and frontend in separate terminals.

```bash
# terminal 1
cd backend
npm install
npm run db:migrate
npm run dev

# terminal 2
cd frontend
npm install
npm run dev
```

## Stripe notes

- Use Stripe test card `4242 4242 4242 4242` for local payments.
- Webhooks require `STRIPE_WEBHOOK_SECRET` if you test payment status updates.
- For local webhook testing, use the Stripe CLI to forward events to `/api/stripe/webhook`.

## Security

Do not commit:

- `.env` files
- database credentials
- Stripe secret keys
- JWT secrets
- `backup.sql`

Use `.env.example` files as templates only.
