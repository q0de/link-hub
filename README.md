# Link Hub - Your Link in Bio Platform

A modern, full-featured link-in-bio tool built with React, TailwindCSS, and Supabase. Create beautiful profile pages with links and a dedicated section for domains you're selling.

## 🚀 Features

- **User Authentication** - Secure signup/login with Supabase Auth
- **Link Management** - Add, edit, delete, and reorder links with drag-and-drop
- **Domain Marketplace** - Showcase domains you own or are selling
- **Customizable Themes** - Customize colors, button styles, and branding
- **Analytics Dashboard** - Track clicks on links and domains with visual charts
- **Public Profiles** - Beautiful, responsive public pages at `/u/username`
- **Avatar Upload** - Upload and manage your profile picture
- **Mobile-First Design** - Responsive design that works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Inter Font
- **Animations**: Framer Motion
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Hosting**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up here](https://supabase.com))
- Git

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd linktree-seed
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Go to **Storage** and create a bucket named `avatars` with public access
4. Copy your project URL and anon key from **Settings > API**

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Supabase Edge Function (Optional)

For enhanced analytics tracking, deploy the Edge Function:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy track-click
```

### 5. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 📁 Project Structure

```
linktree-seed/
├── src/
│   ├── components/
│   │   ├── dashboard/      # Dashboard components (Links, Domains, Settings, Analytics)
│   │   └── public/         # Public profile components
│   ├── pages/              # Main pages (Auth, Dashboard, PublicProfile)
│   ├── lib/                # Supabase client configuration
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # React entry point
│   └── style.css           # Global styles and Tailwind imports
├── supabase/
│   ├── schema.sql          # Database schema
│   └── functions/
│       └── track-click/    # Edge function for analytics
├── public/                 # Static assets
└── README.md
```

## 🗄️ Database Schema

The application uses four main tables:

- **profiles** - User profile information and theme settings
- **links** - User links with ordering
- **domains** - Domain listings for sale
- **click_events** - Analytics tracking data

See `supabase/schema.sql` for the complete schema with RLS policies.

## 🎨 Customization

### Theme Colors

Users can customize their profile theme in the Settings tab:
- Background color
- Text color
- Accent color
- Button style (solid, outline, rounded)

### Default Theme

The default theme uses:
- Background: `#0f0f0f` (dark)
- Text: `#ffffff` (white)
- Accent: `#ff7e29` (orange)

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 📊 Analytics

The analytics dashboard shows:
- Total clicks across all links and domains
- Individual link click statistics (bar chart)
- Domain click distribution (pie chart)
- Real-time tracking via Supabase

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Users can only edit their own profiles, links, and domains
- Public profiles are viewable by everyone
- Click events are anonymized (IP hashing)

## 🎯 Roadmap / Future Enhancements

- [ ] Search and filter domains by keyword or price
- [ ] "Sold" status with strikethrough and badge
- [ ] Inquiry form for domains without buy links
- [ ] Custom domains (CNAME) for user pages
- [ ] Email notifications for domain clicks
- [ ] Public marketplace view aggregating all domains
- [ ] Social media link previews
- [ ] QR code generation for profiles

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React, Supabase, and TailwindCSS

