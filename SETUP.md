# Course2Learn Setup Guide

## 1. Get a Gemini API Key (Free)

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **Create API key**
4. Copy the key — it looks like `AIzaSy...`

The **free tier** gives 1,500 requests/day with Gemini 2.0 Flash, which is more than enough (we make 1 call every 3 days).

---

## 2. Push to GitHub

Create a GitHub repo for this project and push all files:

```bash
cd course2learn
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/course2learn
git push -u origin main
```

---

## 3. Add GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 4 secrets:

| Secret Name | Value |
|---|---|
| `GEMINI_API_KEY` | Your Gemini API key from Step 1 |
| `FTP_HOST` | Your Bluehost FTP hostname (e.g. `ftp.course2learn.in`) |
| `FTP_USER` | Your Bluehost FTP username |
| `FTP_PASS` | Your Bluehost FTP password |
| `FTP_REMOTE_DIR` | Remote path on server (e.g. `/public_html/`) |

---

## 4. How It Works

- **GitHub Actions** runs the crawler automatically every 3 days (2 AM UTC)
- Each run crawls **one category** (the one that was crawled longest ago)
- Gemini 2.0 Flash + Google Search finds real courses from Udemy, Coursera, YouTube, etc.
- New courses are added to `data/courses.json`
- **Featured courses (`isFeatured: true`) are NEVER removed**
- Updated JSON is committed back to Git and deployed to Bluehost via FTP

---

## 5. Manual Crawl (Optional)

To crawl a specific category right now:

```bash
# Install deps
pip install -r crawl/requirements.txt

# Set your API key
export GEMINI_API_KEY="your-key-here"

# Crawl a specific category
python crawl/crawler.py --category seo

# Crawl the next due category
python crawl/crawler.py --next

# Crawl all 55 categories at once (takes ~10 min)
python crawl/crawler.py --all
```

You can also trigger it from GitHub: **Actions** tab → **Course Crawler** → **Run workflow** → optionally enter a category slug.

---

## 6. Bluehost FTP Credentials

Find these in your Bluehost cPanel:
- Login to Bluehost → **cPanel** → **FTP Accounts**
- Or use: host = `ftp.course2learn.in`, user = your cPanel username, pass = your cPanel password

---

## 7. Add Featured Courses (Partner Links)

Edit `data/featured.json` to add your partner/affiliate course cards:

```json
[
  {
    "title": "Complete SEO Course 2024",
    "provider": "Udemy",
    "instructor": "Ahrefs Team",
    "category": "seo",
    "isFree": false,
    "hasCertificate": true,
    "price": "₹499",
    "url": "https://www.udemy.com/course/your-affiliate-link"
  }
]
```

These will appear in the **Featured** section on the homepage. They are never auto-removed by the crawler.
