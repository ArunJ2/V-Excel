# Deploying V-Excel Portal to Vercel

## ⚠️ CRITICAL: Database Change Required
Vercel **cannot use SQLite**. You must use a cloud PostgreSQL database.

**Get a free Postgres database from [Neon](https://neon.tech/) or [Supabase](https://supabase.com/).**

---

## Step 1: Update Prisma Schema for PostgreSQL

Before deploying, update `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Step 2: Push Code to GitHub
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

---

## Step 3: Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. **Import** your GitHub repository
3. **Configure Project**:
   - **Framework Preset**: `Other`
   - **Root Directory**: Click **Edit** → type `backend`
4. **Environment Variables** (Click "Add"):
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Your Postgres connection string from Neon/Supabase |
   | `JWT_SECRET` | Any random string (e.g., `mySecretKey123`) |
   | `NODE_ENV` | `production` |
5. Click **Deploy**
6. **Copy the deployed URL** (e.g., `https://vexcel-backend.vercel.app`)

---

## Step 4: Push Database Schema

After backend deploys, run locally:
```bash
cd backend
DATABASE_URL="your-postgres-url" npx prisma db push
DATABASE_URL="your-postgres-url" npx prisma db seed
```

---

## Step 5: Deploy Frontend to Vercel

1. Go to Vercel → **Add New** → **Project**
2. **Import** the **same repository again**
3. **Configure Project**:
   - **Framework Preset**: `Next.js` (auto-detected)
   - **Root Directory**: Leave as root (or the folder containing `package.json` for Next.js)
4. **Environment Variables**:
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend.vercel.app/api` |
5. Click **Deploy**

---

## What is "Framework Preset"?
- Tells Vercel how to build your app
- **Next.js**: For frontend
- **Other**: For custom Express backend

## What is "Root Directory"?
- Which folder in your repo contains the code
- **Backend**: `backend`
- **Frontend**: Root folder (where Next.js `package.json` is)

---

## Troubleshooting

### "Vercel expects API routes, not a running server"
✅ **Fixed**: We added `api/index.ts` which exports Express as a Vercel serverless function.

### Database errors
Make sure you:
1. Changed `schema.prisma` to use `postgresql`
2. Set `DATABASE_URL` in Vercel environment variables
3. Ran `npx prisma db push` to create tables
