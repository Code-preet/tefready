# 🇫🇷 TEFReady.ca

AI-powered French learning platform for Canadian immigrants. Designed for TEF Canada CLB 7+ preparation.

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1 — Upload to GitHub

1. Go to **github.com** → click the **+** button → **New repository**
2. Name it `tefready` → click **Create repository**
3. Upload all these files using the **"uploading an existing file"** link on GitHub
4. Or if you have Git: run `git init`, `git add .`, `git commit -m "initial"`, `git push`

### Step 2 — Connect Vercel

1. Go to **vercel.com** → click **Add New Project**
2. Connect your GitHub account if not already
3. Find and import your `tefready` repository
4. Click **Deploy** — Vercel will build it automatically

### Step 3 — Add Your Anthropic API Key

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from console.anthropic.com
3. Click **Save**, then go to **Deployments → Redeploy**

### Step 4 — Connect tefready.ca Domain

1. In Vercel project → **Settings → Domains**
2. Click **Add Domain** → type `tefready.ca`
3. Vercel will give you DNS records (usually two: an A record and CNAME)
4. Go to **Namecheap** (or wherever you bought the domain) → DNS settings
5. Add the records Vercel shows you
6. Wait 5–30 minutes → your site will be live at tefready.ca ✅

---

## 📁 Project Structure

```
tefready/
├── app/
│   ├── layout.js          — Root layout, fonts, metadata
│   ├── globals.css        — Global styles
│   ├── page.js            — Home page (dashboard)
│   ├── learn/             — Module browser + lesson pages
│   ├── daily/             — AI daily lesson
│   ├── tef/               — TEF exam prep
│   ├── profile/           — User profile + stats
│   └── api/
│       ├── generate/      — AI lesson generation endpoint
│       └── feedback/      — AI writing feedback endpoint
├── components/
│   ├── AppProvider.js     — Global state (XP, streak, progress)
│   ├── Nav.js             — Navigation
│   └── ProgressBar.js     — Progress bar component
└── lib/
    ├── data.js            — All lesson content (A1–A2 complete)
    └── i18n.js            — UI translations (EN, PA, ES, HI, AR)
```

---

## ✨ Features

- **6 complete lessons** (A1 greetings, numbers, colors, family + A2 verbs, time)
- **TTS pronunciation** — hear every French word with Web Speech API
- **AI daily lessons** — personalized by Claude AI for your level
- **TEF reading practice** — with scoring
- **TEF writing practice** — with AI feedback from Claude
- **5 UI languages** — English, ਪੰਜਾਬੀ, Español, हिन्दी, العربية
- **XP + Streak system** — Duolingo-style motivation
- **Mobile-first design** — works perfectly on phones

---

## 🗄️ Phase 2: Add Supabase Database

After launch, add user accounts and sync progress across devices:

1. Go to **supabase.com** → create free project
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
3. Replace `localStorage` in `AppProvider.js` with Supabase calls

---

## 🛠️ Local Development

```bash
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
# Open http://localhost:3000
```

---

Built with Next.js 14, Tailwind CSS, and Claude AI 🍁
