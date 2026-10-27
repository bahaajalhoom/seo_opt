# CRAWLIX PRO — Autonomous Search & Generative AI Audit Engine

<p align="center">
  <strong>Enterprise-Grade Search Engine (SEO) & Generative Engine (GEO) Audit Platform</strong><br>
  <em>Architected and Engineered by Ahmad Jalhoom (أحمد جلهوم)</em>
</p>

---

## ⚡ Overview

**CRAWLIX PRO** is an engineering-grade web application audit platform built on **Next.js 16 (App Router + Turbopack)**, **React 19**, **Node.js 24**, and **Tailwind CSS v4**.

It bridges classical search heuristics with modern AI search engine requirements (ChatGPT Search, Perplexity, Claude, Google Gemini), providing real-time multi-vector diagnostics, copyable code fixes, and a **1-click Master AI Repair Prompt Generator (100% Score)**.

---

## 🚀 Key Architectural Features

- **5-Vector Real-Time Auditing**:
  - **Traditional SEO (25%)**: Title & meta descriptions, canonical integrity, H1-H6 heading hierarchy, OpenGraph, Twitter Cards, sitemap.xml, robots.txt.
  - **Generative Engine Optimization / GEO (25%)**: `/llms.txt` and `/llms-full.txt` context discovery, AI crawler directives (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`), Schema.org JSON-LD entities, and E-E-A-T signals.
  - **Core Web Performance & Speed (20%)**: Microsecond TTFB telemetry, initial HTML document weight, gzip/brotli compression, DOM element count, and tree depth.
  - **Accessibility / a11y (15%)**: WCAG 2.1 AA compliance, HTML lang attributes, heading continuity, and form label associations.
  - **Security & Integrity (15%)**: HTTPS enforcement, HSTS policy, Content-Security-Policy (CSP), `X-Content-Type-Options: nosniff`, and safe external links.
- **1-Click Master AI Repair Prompt**:
  - Automatically synthesizes a deterministic, 13,000+ character remediation prompt formatted specifically for Claude 3.7, ChatGPT-4o, Cursor, or Antigravity to fix 100% of detected defects in one pass.
- **Enterprise Network Security**:
  - Built-in **SSRF Protection** blocking private IPv4 ranges (`10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`), loopback (`127.0.0.1`), and cloud metadata IP (`169.254.169.254`).
  - **RFC 9457 Problem Details** error boundary specification.
- **100% Anti-Slop Studio Craft**:
  - 90/10 Obsidian surface palette (`#050608`), Precision Emerald accent (`#10B981`), tabular numeric typography (`tabular-nums`), zero layout shift (`CLS = 0`), and complete bilingual (Arabic / English) RTL/LTR support with Cairo and IBM Plex Sans Arabic.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack) + React 19
- **Runtime**: Node.js 24
- **Styling**: Tailwind CSS v4 + Studio Anti-Slop Design Tokens
- **Parsing**: Cheerio + Native Fetcher
- **Type Safety**: TypeScript 5.8 Strict Mode

---

## 💻 Local Setup & Development

```bash
# Clone the repository
git clone https://github.com/bahaajalhoom/seo_opt.git
cd seo_opt

# Install dependencies
npm install

# Run the development server
npm run dev

# Or build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ⚖️ License & Attribution

Designed, architected, and engineered by **Ahmad Jalhoom (أحمد جلهوم)**.  
Copyright © 2026 Ahmad Jalhoom · CRAWLIX Systems. All rights reserved.
