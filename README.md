# 🚢 Voyage Photos

A playful family photo dashboard for sharing cruise memories in real-time. Clean, minimal design with a nautical touch.

## ✨ Features

- **Family accounts** - Each family member creates their own account
- **Drag & drop uploads** - Easy photo sharing from any device
- **Real-time updates** - Photos appear instantly for everyone
- **Captions** - Add context to your memories
- **Responsive** - Works great on phones, tablets, and desktops
- **Lightbox view** - Click any photo to see it full-size

## 🛠️ Setup Guide

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click "New Project"
3. Give it a name like "voyage-photos"
4. Set a database password (save it somewhere!)
5. Choose a region close to your family
6. Click "Create new project" and wait ~2 minutes

### Step 2: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy everything from `supabase-setup.sql` and paste it in
4. Click "Run" (or Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

### Step 3: Create the Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click "New bucket"
3. Name it exactly: `photos`
4. Toggle ON "Public bucket"
5. Click "Create bucket"
6. Click on the `photos` bucket, then go to **Policies**
7. Click "New Policy" → "For full customization"
8. Set:
   - Policy name: `Allow authenticated uploads`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - Policy definition: `true`
9. Click "Review" then "Save policy"

### Step 4: Get Your API Keys

1. Go to **Settings** → **API** (left sidebar)
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 5: Configure the App

1. In the project folder, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and paste your values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

### Step 6: Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 and you're ready!

## 🚀 Deploy to Vercel

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New" → "Project"
4. Import your GitHub repo
5. Add your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

Share the Vercel URL with your family!

## 📱 How to Use

### For You (Brandon)
Just open the deployed URL and watch photos roll in!

### For Your Family
1. Open the URL you share with them
2. Click "Create account"
3. Enter their name, email, and a password
4. Start uploading photos!

They can upload via:
- **Drag & drop** on desktop/laptop
- **Tap the upload area** on mobile to open camera roll

## 🎨 Customization Ideas

- Change colors in `src/App.css` (look for `:root` variables)
- Update the title in `Gallery.jsx` and `Login.jsx`
- Add more emoji flair throughout the components

## 🔒 Security Notes

- All uploads are tied to authenticated users
- Row Level Security ensures users can only delete their own photos
- The `anon` key is safe to use client-side (it only has limited access)

---

Made with ❤️ for family memories
