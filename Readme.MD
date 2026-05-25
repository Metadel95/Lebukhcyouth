# Lebu KHC Youth — Website

Bold, skate-inspired youth ministry site with a live Instagram feed.  
Built to deploy on **GitHub + Vercel** in minutes.

---

## 🚀 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Click **Deploy** — that's it. No build step needed (pure HTML).

---

## 📸 Connecting Instagram (Live Feed)

The site automatically displays your latest Instagram posts. Here's how to set it up:

### Step 1 — Create a Meta Developer App

1. Go to [developers.facebook.com](https://developers.facebook.com) and log in
2. Click **My Apps → Create App**
3. Choose **"Consumer"** as the app type
4. Give it a name (e.g. "Lebu KHC Youth Website")

### Step 2 — Add Instagram Basic Display

1. In your app dashboard, click **Add Product → Instagram Basic Display → Set Up**
2. Scroll down to **Instagram Testers** → Add your Instagram account as a tester
3. Accept the tester invite on Instagram: **Settings → Apps and Websites → Tester Invites**

### Step 3 — Generate a Token

1. In the app dashboard → Instagram Basic Display → **Basic Display**
2. Scroll to **User Token Generator** → click **Generate Token** next to your account
3. Copy the **User Token** shown

### Step 4 — Make it Long-Lived (Important!)

Short-lived tokens expire in 1 hour. Run this in your terminal to get a 60-day token:

```bash
curl -i -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=SHORT_LIVED_TOKEN"
```

Replace `YOUR_APP_SECRET` (found in App Settings → Basic) and `SHORT_LIVED_TOKEN`.  
Copy the `access_token` from the response.

> **Tip:** Long-lived tokens can be refreshed before expiry. You can automate this with a small Vercel cron function, or simply regenerate every 60 days.

### Step 5 — Add the Token

**Option A — Direct (simplest for static sites):**

Open `index.html` and find this line near the bottom:

```js
const IG_TOKEN = ''; // ← Paste your Instagram token here
```

Replace `''` with your token in quotes:

```js
const IG_TOKEN = 'IGQWRPa...your_long_token...here';
```

**Option B — Vercel Environment Variable (recommended):**

1. In Vercel dashboard → Your Project → Settings → Environment Variables
2. Add: `IG_TOKEN` = your token value
3. Then in `index.html`, replace the token line with:

```js
const IG_TOKEN = '%%IG_TOKEN%%'; // Vercel replaces at build time
```

And add a `vercel.json` to inject it:

```json
{
  "build": {
    "env": {
      "IG_TOKEN": "@ig_token"
    }
  }
}
```

---

## ✏️ Customise Your Handles

In `index.html`, search for these placeholders and replace with your real URLs:

| Placeholder | Replace with |
|---|---|
| `YOUR_INSTAGRAM_HANDLE` | e.g. `lebuyouth` |
| `YOUR_TELEGRAM_CHANNEL` | e.g. `lebuyouth` |
| `YOUR_YOUTUBE_HANDLE` | e.g. `@LebuyouthKHC` |
| `YOUR_TIKTOK_HANDLE` | e.g. `lebuyouth` |
| `YOUR_FACEBOOK_PAGE` | e.g. `LebuyouthKHC` |
| `YOUR_TWITTER_HANDLE` | e.g. `lebuyouth` |

---

## 🎨 Colour

The brand colour `#ff6600` is set as a CSS variable at the top of `index.html`:

```css
:root {
  --orange: #ff6600;
}
```

Change it there to update the entire site.

---

## 📁 File Structure

```
/
├── index.html
├── api/
│   └── poster.js   ← new file
└── README.md
```

No build step, no dependencies, no node_modules. Just HTML.