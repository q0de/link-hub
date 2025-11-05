# Vercel Environment Variables

Copy these exact values when setting up your Vercel deployment:

## Environment Variables to Add in Vercel

When importing your project in Vercel, add these environment variables:

### 1. VITE_SUPABASE_URL
```
https://iclianaejvngdozwodfg.supabase.co
```

### 2. VITE_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbGlhbmFlanZuZ2RvendvZGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjAwNTQsImV4cCI6MjA3NzkzNjA1NH0.aVpD_71DdwWgHJ5Y3j8D4pWhEBS-BHTjDApEjX6EsVo
```

## Instructions

1. Go to Vercel → Import Project
2. Select your GitHub repository
3. Before clicking "Deploy", click **"Environment Variables"**
4. Add both variables above
5. Make sure they're enabled for:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
6. Click "Deploy"

## Supabase Project Reference ID

Your project reference ID (for Edge Functions):
```
iclianaejvngdozwodfg
```

Use this if you want to deploy the Edge Function:
```bash
supabase link --project-ref iclianaejvngdozwodfg
```

