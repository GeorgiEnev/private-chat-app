# private chat app

This folder contains the deployable Next.js application for Private Chat App.

## requirements

- Node.js
- npm
- PostgreSQL database, such as Supabase Postgres

## environment variables

Create a `.env` file in this folder:

```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secure-secret"
BETTER_AUTH_URL="http://localhost:3000"
CRON_SECRET="your-secure-cron-secret"
```

For local development, `BETTER_AUTH_URL` should usually be:

```env
BETTER_AUTH_URL="http://localhost:3000"
```

## install and run

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate deploy
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## checks

Run linting:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

## deployment

When deploying this folder on Vercel, use:

```text
framework preset: next.js
root directory: next-chat-app
install command: npm install
build command: npx prisma generate && npm run build
output directory: leave empty/default
```

For Vercel, use the Supabase transaction pooler connection string for `DATABASE_URL`.
