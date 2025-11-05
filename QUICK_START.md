# Quick Start Guide

## Step 1: Supabase Setup (5 minutes)

### A. Run SQL Schema
1. Go to: https://iclianaejvngdozwodfg.supabase.co
2. Click **SQL Editor** → **New Query**
3. Open `supabase/schema.sql` from this project
4. Copy ALL contents and paste into SQL Editor
5. Click **Run** (or press F5)
6. You should see "Success" message

### B. Create Storage Bucket
1. In Supabase, click **Storage**
2. Click **New bucket**
3. Name: `avatars`
4. **Public bucket**: Toggle ON ✅
5. Click **Create bucket**

## Step 2: Test Locally (Optional)

```bash
npm run dev
```

Then visit: `http://localhost:5173`

**Test it:**
- Sign up with email/password
- Create a username
- Add a link
- View your profile at `/u/your-username`

## Step 3: Deploy to GitHub

```bash
# If you haven't initialized git yet
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Link Hub"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. **IMPORTANT**: Before deploying, click **Environment Variables**
5. Add these two:
   - `VITE_SUPABASE_URL` = `https://iclianaejvngdozwodfg.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbGlhbmFlanZuZ2RvendvZGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjAwNTQsImV4cCI6MjA3NzkzNjA1NH0.aVpD_71DdwWgHJ5Y3j8D4pWhEBS-BHTjDApEjX6EsVo`
6. Make sure both are enabled for: Production, Preview, Development
7. Click **Deploy**

## ✅ Done!

Your app will be live at: `https://your-project.vercel.app`

---

## 🐛 Troubleshooting

**"Storage bucket not found"**
- Make sure you created the `avatars` bucket and it's public

**"Profile not found after signup"**
- Make sure you ran the SQL schema completely

**Build fails on Vercel**
- Check that environment variables are set correctly
- Check build logs in Vercel dashboard

