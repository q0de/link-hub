# Quick Setup Checklist

Follow these steps to get your Link Hub up and running:

## ✅ Supabase Setup

- [ ] Create a new Supabase project at [supabase.com](https://supabase.com)
- [ ] Go to **SQL Editor** and run the entire `supabase/schema.sql` file
- [ ] Go to **Storage** and create a new bucket:
  - Name: `avatars`
  - Public bucket: ✅ Yes
  - File size limit: 5MB (recommended)
  - Allowed MIME types: `image/*`
- [ ] Go to **Settings > API** and copy:
  - Project URL
  - `anon` `public` key

## ✅ Local Development

- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Create `.env` file in the root directory:
  ```
  VITE_SUPABASE_URL=your_project_url_here
  VITE_SUPABASE_ANON_KEY=your_anon_key_here
  ```
- [ ] Run `npm run dev`
- [ ] Visit `http://localhost:5173`

## ✅ Test the App

- [ ] Sign up for a new account
- [ ] Create a username and profile
- [ ] Add a few links
- [ ] Add a domain listing
- [ ] Customize your theme in Settings
- [ ] View your public profile at `/u/your-username`
- [ ] Check the Analytics tab

## ✅ Optional: Edge Function (Analytics)

- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] Link project: `supabase link --project-ref your-project-ref`
- [ ] Deploy function: `supabase functions deploy track-click`

## ✅ Deploy to Vercel

- [ ] Push code to GitHub
- [ ] Import project in Vercel
- [ ] Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy!

## 🐛 Troubleshooting

**"Storage bucket not found" error:**
- Make sure you created the `avatars` bucket in Supabase Storage
- Ensure it's set to public

**"Profile not found" error:**
- Make sure you ran the SQL schema
- Check that the trigger function `handle_new_user` was created

**Authentication issues:**
- Verify your Supabase URL and anon key are correct
- Check that RLS policies are enabled
- Ensure the `profiles` table exists

**CORS errors:**
- Make sure your Supabase project allows requests from your domain
- Check Supabase project settings

---

Need help? Check the main [README.md](README.md) for more details.

