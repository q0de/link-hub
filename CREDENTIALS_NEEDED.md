# Credentials You Need to Provide

Since you mentioned you have all credentials, here's exactly where to use them:

## 🔑 Supabase Credentials

### Where to Find Them:
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy the values below

### What You Need:

| Credential | Where to Find | Where to Use |
|------------|---------------|--------------|
| **Project URL** | Settings → API → Project URL | Vercel env var: `VITE_SUPABASE_URL` |
| **anon public key** | Settings → API → Project API keys → `anon` `public` | Vercel env var: `VITE_SUPABASE_ANON_KEY` |
| **Project Reference ID** | Settings → General → Reference ID | For Edge Function: `supabase link --project-ref YOUR_REF` |

### Example Format:
```
VITE_SUPABASE_URL = https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📝 Quick Setup Steps

### 1. Supabase (5 minutes)
- [ ] Run `supabase/schema.sql` in SQL Editor
- [ ] Create `avatars` bucket in Storage (make it public)
- [ ] Copy your Project URL and anon key

### 2. GitHub (2 minutes)
- [ ] Create new repository
- [ ] Push this code:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git push -u origin main
  ```

### 3. Vercel (3 minutes)
- [ ] Import GitHub repo
- [ ] Add environment variables:
  - `VITE_SUPABASE_URL` = [your Supabase URL]
  - `VITE_SUPABASE_ANON_KEY` = [your anon key]
- [ ] Click Deploy

### 4. Done! 🎉
- Your app will be live at `https://your-project.vercel.app`

---

## 🚨 Important Notes

1. **Environment Variables**: Vercel needs these set BEFORE deploying. Add them in the project import screen.

2. **Storage Bucket**: Must be named exactly `avatars` and set to public.

3. **SQL Schema**: Must run the entire `supabase/schema.sql` file - it sets up tables, RLS policies, and triggers.

4. **CORS**: If you get CORS errors, add your Vercel domain to Supabase Settings → API → CORS Configuration.

---

## 📚 Full Guides

- **Detailed Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Step-by-Step Checklist**: See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Local Setup**: See [SETUP.md](SETUP.md)

---

## ❓ Need Help?

If you run into issues:
1. Check the build logs in Vercel
2. Check Supabase logs for errors
3. Verify environment variables are set correctly
4. Make sure the SQL schema ran successfully

