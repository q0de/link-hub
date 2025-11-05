# Deployment Guide: GitHub → Vercel → Supabase

This guide walks you through deploying Link Hub to production.

## 📋 Prerequisites

You mentioned you have all credentials. Here's what you'll need:

### Supabase Credentials
- ✅ Supabase Project URL
- ✅ Supabase Anon Key (public key)
- ✅ Supabase Project Reference ID (for Edge Functions)

### GitHub
- ✅ GitHub account
- ✅ A new repository (or existing one)

### Vercel
- ✅ Vercel account (free tier works fine)

---

## 🗄️ Step 1: Supabase Setup

### 1.1 Create Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the `supabase/schema.sql` file from this project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** to execute the schema

**What this does:**
- Creates `profiles`, `links`, `domains`, and `click_events` tables
- Sets up Row Level Security (RLS) policies
- Creates a trigger to auto-create profiles on user signup

### 1.2 Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Enable (toggle ON)
   - **File size limit**: 5 MB (optional)
   - **Allowed MIME types**: `image/*` (optional)
4. Click **Create bucket**

### 1.3 Get Your Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 1.4 (Optional) Deploy Edge Function

If you want enhanced analytics tracking:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login:
   ```bash
   supabase login
   ```

3. Link to your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Supabase Settings → General → Reference ID)

4. Deploy the function:
   ```bash
   supabase functions deploy track-click
   ```

---

## 🐙 Step 2: GitHub Setup

### 2.1 Push Your Code

1. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Link Hub app"
   ```

2. **Create a new repository on GitHub**:
   - Go to github.com
   - Click **New repository**
   - Name it (e.g., `link-hub`)
   - Don't initialize with README (we already have one)
   - Click **Create repository**

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## 🚀 Step 3: Vercel Deployment

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project

### 3.2 Configure Environment Variables

**Before deploying**, add these environment variables in Vercel:

1. In the project import screen, click **Environment Variables**
2. Add these two variables:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL (from Step 1.3) |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key (from Step 1.3) |

3. Make sure they're set for:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**

### 3.3 Deploy

1. Click **Deploy**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-project.vercel.app`

### 3.4 Update Supabase CORS (if needed)

If you get CORS errors:

1. Go to Supabase → **Settings** → **API**
2. Under **CORS Configuration**, add your Vercel domain:
   - `https://your-project.vercel.app`
   - `https://your-project-*.vercel.app` (for preview deployments)

---

## ✅ Step 4: Verify Everything Works

1. **Visit your deployed site**: `https://your-project.vercel.app`
2. **Sign up** for a new account
3. **Create a profile** with a username
4. **Add a link** in the dashboard
5. **Add a domain** listing
6. **View your public profile**: `https://your-project.vercel.app/u/your-username`
7. **Check analytics** in the dashboard

---

## 🔧 Post-Deployment Configuration

### Update Public Profile URL

After deployment, update the dashboard to show the correct public URL:

The code already uses `window.location.origin`, so it should automatically show the correct URL. But if you want to customize it, edit `src/pages/Dashboard.tsx` around line 40.

### Custom Domain (Optional)

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update Supabase CORS settings with your custom domain

---

## 📝 Quick Reference: Required Values

Fill in these values when setting up:

```
Vercel Environment Variables:
├─ VITE_SUPABASE_URL = https://xxxxx.supabase.co
└─ VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Supabase Setup:
├─ SQL Schema: Run supabase/schema.sql
├─ Storage Bucket: Create "avatars" bucket (public)
└─ (Optional) Edge Function: track-click
```

---

## 🐛 Troubleshooting

### Build Fails on Vercel
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel should auto-detect)
- Check build logs in Vercel dashboard

### "Storage bucket not found" Error
- Make sure you created the `avatars` bucket in Supabase
- Verify it's set to **public**

### Authentication Not Working
- Double-check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel
- Verify they match your Supabase project
- Check Supabase RLS policies are enabled

### CORS Errors
- Add your Vercel domain to Supabase CORS settings
- Check that environment variables are set correctly

### Profile Not Found After Signup
- Verify the SQL schema was run successfully
- Check that the `handle_new_user` trigger function exists
- Look at Supabase logs for errors

---

## 🎉 You're Done!

Your Link Hub is now live! Share your profile URL with others:
```
https://your-project.vercel.app/u/your-username
```

Need help? Check the main [README.md](README.md) or [SETUP.md](SETUP.md) for more details.

