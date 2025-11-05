# Deployment Checklist

Use this checklist to track your deployment progress.

## ✅ Supabase Setup

- [ ] Opened Supabase project dashboard
- [ ] Ran `supabase/schema.sql` in SQL Editor
- [ ] Created `avatars` storage bucket (public)
- [ ] Copied Project URL: `_________________________________`
- [ ] Copied anon key: `_________________________________`
- [ ] (Optional) Deployed Edge Function `track-click`

## ✅ GitHub Setup

- [ ] Created new repository on GitHub: `_________________________________`
- [ ] Initialized git: `git init`
- [ ] Committed all files: `git add . && git commit -m "Initial commit"`
- [ ] Added remote: `git remote add origin https://github.com/...`
- [ ] Pushed to GitHub: `git push -u origin main`

## ✅ Vercel Setup

- [ ] Logged into Vercel
- [ ] Imported GitHub repository
- [ ] Added environment variable: `VITE_SUPABASE_URL` = `_________________________________`
- [ ] Added environment variable: `VITE_SUPABASE_ANON_KEY` = `_________________________________`
- [ ] Verified env vars are set for Production, Preview, and Development
- [ ] Clicked Deploy
- [ ] Deployment completed successfully
- [ ] Live URL: `https://_________________________________.vercel.app`

## ✅ Verification

- [ ] Visited deployed site
- [ ] Created test account
- [ ] Created profile with username
- [ ] Added a test link
- [ ] Added a test domain listing
- [ ] Viewed public profile at `/u/username`
- [ ] Tested click tracking
- [ ] Checked analytics dashboard

## ✅ Post-Deployment (Optional)

- [ ] Added custom domain in Vercel
- [ ] Updated Supabase CORS with custom domain
- [ ] Updated Supabase CORS with Vercel preview URLs

---

**Your Live URLs:**
- Production: `https://_________________________________.vercel.app`
- Public Profile Example: `https://_________________________________.vercel.app/u/your-username`

**Your Credentials:**
- Supabase URL: `https://_________________________________.supabase.co`
- Supabase Project Ref: `_________________________________`

