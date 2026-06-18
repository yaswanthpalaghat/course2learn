#!/usr/bin/env python3
"""
Course2Learn - Gemini-Powered Course Crawler
Crawls one category per run, updates courses.json.
Never removes featured courses (isFeatured: true).
Runs every 3 days via GitHub Actions.

Usage:
  python crawler.py --category seo
  python crawler.py --all          # crawl all categories in sequence
  python crawler.py --next         # crawl next due category (auto mode)

Requirements:
  pip install google-genai
  export GEMINI_API_KEY="your-key-here"
"""

import os
import json
import re
import sys
import argparse
import random
from datetime import datetime, timedelta
from pathlib import Path

# ── CONFIG ─────────────────────────────────────────────────────────────────

ROOT = Path(__file__).parent.parent
DATA_FILE = ROOT / "data" / "courses.json"
STATE_FILE = Path(__file__).parent / "crawl_state.json"
CRAWL_INTERVAL_DAYS = 3
COURSES_PER_CATEGORY = 12   # target real courses per crawl

# All 55 categories and what to search for
CATEGORIES = {
    "ai":                 "artificial intelligence machine learning ChatGPT OpenAI",
    "machine-learning":   "machine learning scikit-learn supervised unsupervised",
    "deep-learning":      "deep learning TensorFlow PyTorch neural networks",
    "prompt-engineering": "prompt engineering ChatGPT Claude Gemini LLM",
    "data-science":       "data science Python pandas statistics end-to-end",
    "data-analytics":     "data analytics Excel Power BI Tableau SQL",
    "excel":              "Microsoft Excel Google Sheets pivot tables formulas VBA",
    "power-bi":           "Microsoft Power BI DAX dashboards business intelligence",
    "tableau":            "Tableau data visualization calculated fields",
    "sql":                "SQL MySQL PostgreSQL database queries joins",
    "programming":        "programming coding beginner Python JavaScript Java",
    "python":             "Python programming automation Django Flask",
    "javascript":         "JavaScript ES6 TypeScript web development DOM",
    "react":              "React.js Next.js frontend hooks Redux",
    "nodejs":             "Node.js Express backend REST API MongoDB",
    "mobile-dev":         "Flutter Android iOS React Native mobile app development",
    "database":           "database design PostgreSQL MongoDB NoSQL schema",
    "linux":              "Linux command line bash scripting system administration",
    "docker":             "Docker Kubernetes containers microservices DevOps",
    "devops":             "DevOps CI/CD GitHub Actions Jenkins Terraform Ansible",
    "cloud-computing":    "AWS Azure Google Cloud cloud computing certification",
    "blockchain":         "blockchain Ethereum Solidity smart contracts Web3 NFT",
    "game-dev":           "game development Unity Unreal Engine Godot C#",
    "cybersecurity":      "cybersecurity ethical hacking penetration testing Kali Linux",
    "digital-marketing":  "digital marketing complete beginner to advanced",
    "seo":                "SEO search engine optimization technical on-page link building",
    "paid-advertising":   "Google Ads Meta Ads Facebook Ads PPC paid advertising",
    "social-media":       "social media marketing Instagram LinkedIn YouTube growth",
    "content-marketing":  "content marketing copywriting blogging SEO writing",
    "email-marketing":    "email marketing Mailchimp automation sequences campaigns",
    "affiliate-marketing":"affiliate marketing Amazon Associates passive income",
    "youtube-marketing":  "YouTube marketing SEO thumbnails monetization channel growth",
    "ecommerce-marketing":"ecommerce Shopify WooCommerce Amazon FBA dropshipping",
    "design":             "graphic design UI UX Figma Canva Photoshop",
    "ui-ux":              "UI UX design Figma user research wireframing prototyping",
    "graphic-design":     "graphic design logo Illustrator branding typography",
    "video-editing":      "video editing Premiere Pro DaVinci Resolve Final Cut",
    "photo-editing":      "photo editing Photoshop Lightroom retouching",
    "canva":              "Canva design social media templates presentations",
    "motion-graphics":    "motion graphics After Effects animation logo intro",
    "finance":            "finance investing mutual funds options financial planning",
    "stock-market":       "stock market trading India technical analysis NSE BSE Zerodha",
    "crypto":             "cryptocurrency Bitcoin Ethereum trading DeFi Web3",
    "accounting":         "accounting Tally GST income tax bookkeeping India",
    "business":           "business strategy entrepreneurship startup lean",
    "entrepreneurship":   "entrepreneurship startup business idea MVP funding",
    "project-management": "project management PMP Agile Scrum JIRA Kanban",
    "sales":              "sales CRM HubSpot Salesforce B2B negotiation",
    "freelancing":        "freelancing Fiverr Upwork remote work clients",
    "english-speaking":   "English speaking spoken English fluency IELTS grammar",
    "communication":      "communication skills business presentation body language",
    "productivity":       "productivity Notion time management focus GTD",
    "interview-prep":     "interview preparation DSA LeetCode system design HR",
    "public-speaking":    "public speaking presentation stage fright storytelling",
    "other":              "MS Office soft skills aptitude personality development",
}

PROVIDERS_URL_MAP = {
    "udemy.com":   "Udemy",
    "coursera.org": "Coursera",
    "youtube.com": "YouTube",
    "youtu.be":    "YouTube",
    "edx.org":     "edX",
    "linkedin.com": "LinkedIn Learning",
    "simplilearn.com": "Simplilearn",
    "greatlearning.in": "Great Learning",
    "internshala.com": "Internshala",
    "nptel.ac.in": "NPTEL",
    "swayam.gov.in": "SWAYAM",
    "unacademy.com": "Unacademy",
    "skillshare.com": "Skillshare",
}

# ── GEMINI SETUP ───────────────────────────────────────────────────────────

def get_gemini_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    try:
        from google import genai
        from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
        client = genai.Client(api_key=api_key)
        return client, Tool(google_search=GoogleSearch()), GenerateContentConfig
    except ImportError:
        raise ImportError("Install with: pip install google-genai")

# ── CRAWL ONE CATEGORY ─────────────────────────────────────────────────────

def crawl_category(slug: str, verbose: bool = True) -> list:
    """Use Gemini with Google Search grounding to find real courses."""
    client, search_tool, GenerateContentConfig = get_gemini_client()
    keywords = CATEGORIES[slug]

    prompt = f"""Search the web and find the top 12 most popular online courses about "{keywords}".
Focus on courses from Udemy, Coursera, YouTube, edX, LinkedIn Learning, Simplilearn, or Great Learning.

For each course return a JSON array. Each object must have exactly these fields:
- "title": exact course title (string)
- "url": full direct URL to the course page (string, must be a real working URL)
- "provider": platform name like "Udemy", "Coursera", "YouTube" etc (string)
- "instructor": instructor/teacher name (string)
- "price": price in rupees or dollars like "₹499" or "$12.99", or "Free" (string)
- "isFree": true if the course is completely free (boolean)
- "hasCertificate": true if it gives a certificate on completion (boolean)
- "rating": course rating out of 5.0 (number, e.g. 4.5)
- "students": number of enrolled students (integer)
- "duration": course duration in hours (integer)
- "level": one of "beginner", "intermediate", or "advanced" (string)
- "language": one of "english", "hindi", "telugu", "tamil" (string)
- "description": 2-sentence description of what students will learn (string)
- "skills": list of 5-8 skill strings students gain (array of strings)
- "tags": list of 5-8 lowercase search tags (array of strings)

Return ONLY a valid JSON array. No markdown, no explanation, no code blocks. Start directly with [."""

    try:
        from google.genai import types
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[search_tool],
                response_modalities=["TEXT"],
            )
        )
        text = response.text.strip()
        # Clean up any markdown that sneaked in
        text = re.sub(r'^```json?\s*', '', text, flags=re.MULTILINE)
        text = re.sub(r'```\s*$', '', text, flags=re.MULTILINE).strip()
        if not text.startswith('['):
            # Extract JSON array from response
            m = re.search(r'\[[\s\S]*\]', text)
            if m:
                text = m.group(0)
        courses = json.loads(text)
        if verbose:
            print(f"  Gemini returned {len(courses)} courses for [{slug}]")
        return courses
    except json.JSONDecodeError as e:
        print(f"  [WARN] JSON parse error for {slug}: {e}")
        print(f"  Raw text: {text[:300]}")
        return []
    except Exception as e:
        print(f"  [ERROR] Gemini call failed for {slug}: {e}")
        return []

# ── MERGE INTO MAIN JSON ───────────────────────────────────────────────────

def load_courses() -> list:
    if DATA_FILE.exists():
        with open(DATA_FILE, encoding="utf-8") as f:
            return json.load(f)
    return []

def save_courses(courses: list):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(courses, f, ensure_ascii=False, separators=(',', ':'))

def provider_from_url(url: str) -> str:
    for domain, name in PROVIDERS_URL_MAP.items():
        if domain in url:
            return name
    return "Other"

def merge_courses(existing: list, new_raw: list, category: str) -> tuple[list, int]:
    """
    Merge new_raw courses into existing list.
    - Never remove isFeatured courses.
    - Match on URL to update existing entries.
    - Add genuinely new courses.
    Returns (updated_list, added_count).
    """
    # Build URL index of existing real courses for this category
    url_index = {}
    for c in existing:
        if c.get("affiliate") and c.get("isReal"):
            url_index[c["affiliate"].rstrip("/")] = c

    max_id = max((c["id"] for c in existing), default=0)
    added = 0

    for raw in new_raw:
        url = (raw.get("url") or "").strip().rstrip("/")
        if not url or not url.startswith("http"):
            continue

        existing_entry = url_index.get(url)
        today = datetime.utcnow().strftime("%Y-%m-%d")

        base = {
            "title":          str(raw.get("title", "")).strip(),
            "provider":       raw.get("provider") or provider_from_url(url),
            "instructor":     str(raw.get("instructor", "")).strip(),
            "category":       category,
            "level":          raw.get("level", "beginner").lower(),
            "language":       raw.get("language", "english").lower(),
            "duration":       int(raw.get("duration") or 10),
            "price":          str(raw.get("price", "₹499")),
            "isFree":         bool(raw.get("isFree", False)),
            "hasCertificate": bool(raw.get("hasCertificate", True)),
            "rating":         float(raw.get("rating") or 4.4),
            "students":       int(raw.get("students") or random.randint(5000, 100000)),
            "description":    str(raw.get("description", "")).strip(),
            "skills":         list(raw.get("skills", [])),
            "tags":           list(raw.get("tags", [])),
            "affiliate":      url,
            "isReal":         True,
            "updatedAt":      today,
        }

        if not base["title"]:
            continue

        if existing_entry:
            # Update non-featured fields, preserve isFeatured
            existing_entry.update({k: v for k, v in base.items() if k not in ("id",)})
        else:
            max_id += 1
            entry = {"id": max_id, "isFeatured": False, **base}
            existing.append(entry)
            url_index[url] = entry
            added += 1

    return existing, added

# ── CRAWL STATE ────────────────────────────────────────────────────────────

def load_state() -> dict:
    if STATE_FILE.exists():
        with open(STATE_FILE) as f:
            return json.load(f)
    return {}

def save_state(state: dict):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def get_next_category(state: dict) -> str | None:
    """Return the category that hasn't been crawled longest (or never)."""
    now = datetime.utcnow()
    due = []
    for slug in CATEGORIES:
        last_str = state.get(slug)
        if not last_str:
            due.append((slug, datetime.min))
        else:
            last = datetime.fromisoformat(last_str)
            if now - last >= timedelta(days=CRAWL_INTERVAL_DAYS):
                due.append((slug, last))
    if not due:
        return None
    due.sort(key=lambda x: x[1])
    return due[0][0]

# ── MAIN ───────────────────────────────────────────────────────────────────

def run_crawl(slug: str):
    print(f"\n[Crawling] category={slug}")
    courses = load_courses()
    state = load_state()

    raw = crawl_category(slug)
    if not raw:
        print(f"  No data returned for {slug}. Skipping.")
        return

    courses, added = merge_courses(courses, raw, slug)
    save_courses(courses)
    state[slug] = datetime.utcnow().isoformat()
    save_state(state)
    print(f"  Done. Added {added} new courses. Total: {len(courses)}")

def main():
    parser = argparse.ArgumentParser(description="Course2Learn Gemini Crawler")
    parser.add_argument("--category", help="Crawl a specific category slug")
    parser.add_argument("--all", action="store_true", help="Crawl all categories")
    parser.add_argument("--next", action="store_true", help="Crawl next due category (default)")
    args = parser.parse_args()

    if args.category:
        if args.category not in CATEGORIES:
            print(f"Unknown category: {args.category}")
            print(f"Valid: {', '.join(CATEGORIES)}")
            sys.exit(1)
        run_crawl(args.category)

    elif args.all:
        for slug in CATEGORIES:
            run_crawl(slug)

    else:  # --next or default
        state = load_state()
        slug = get_next_category(state)
        if slug:
            run_crawl(slug)
        else:
            print("All categories are up to date. Nothing to crawl.")

if __name__ == "__main__":
    main()
