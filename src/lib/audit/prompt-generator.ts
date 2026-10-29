import type { ComprehensiveAuditResult, AuditIssue, AuditCategory } from '../../types/audit';

export function generateMasterAiPrompt(result: ComprehensiveAuditResult): {
  markdown: string;
  targetFiles: string[];
  fixesSummary: Array<{ category: AuditCategory; targetFile: string; action: string }>;
} {
  const { targetUrl, overallScore, grade, summary, categories } = result;

  // Aggregate all critical and warning issues
  const allIssues: AuditIssue[] = [
    ...categories.seo.issues,
    ...categories.geo.issues,
    ...categories.performance.issues,
    ...categories.accessibility.issues,
    ...categories.security.issues,
  ];

  const criticalIssues = allIssues.filter((i) => i.severity === 'critical');
  const warningIssues = allIssues.filter((i) => i.severity === 'warning');

  // Collect target files and actions
  const targetFilesSet = new Set<string>();
  const fixesSummary: Array<{ category: AuditCategory; targetFile: string; action: string }> = [];

  for (const issue of allIssues) {
    if (issue.targetFile) {
      targetFilesSet.add(issue.targetFile);
      fixesSummary.push({
        category: issue.category,
        targetFile: issue.targetFile,
        action: issue.title ?? issue.titleEn ?? 'Resolve finding',
      });
    }
  }

  // Ensure canonical standard Next.js files are included
  targetFilesSet.add('src/app/layout.tsx');
  targetFilesSet.add('src/app/robots.ts');
  targetFilesSet.add('src/app/sitemap.ts');
  targetFilesSet.add('public/llms.txt');
  targetFilesSet.add('next.config.mjs');

  const targetFiles = Array.from(targetFilesSet);

  // Generate deterministic markdown
  const markdown = `# MASTER REPAIR PROMPT: Complete 100% Production Audit Remediation
> **Target URL**: \`${targetUrl}\`
> **Audit Grade**: **${grade}** (${overallScore}/100)
> **Engine Health**: SEO: ${categories.seo.score}/100 | GEO: ${categories.geo.score}/100 | Perf: ${categories.performance.score}/100 | a11y: ${categories.accessibility.score}/100 | Sec: ${categories.security.score}/100
> **Detected Faults**: ${summary.criticalCount} Critical | ${summary.warningCount} Warnings

---

## Directives for AI Coding Model (Cursor, Claude 3.7, ChatGPT, Antigravity)
You are an expert Principal Full-Stack & Distributed Systems Architect specializing in **Next.js 16, TypeScript, SEO, and Generative Engine Optimization (GEO)**.
Your mission is to resolve **100% of the audit deficiencies** identified below in a single, cohesive, bug-free implementation.

Do not write toy mockups or incomplete stubs. Implement the concrete files below with production rigor.

---

## 1. Executive Issue Diagnostic
${
  criticalIssues.length > 0
    ? `### Critical Blockers (${criticalIssues.length})
${criticalIssues.map((i, idx) => `${idx + 1}. **[${i.category.toUpperCase()}] ${i.title}**: ${i.description}\n   - *Impact*: ${i.impact}\n   - *Recommendation*: ${i.recommendation}`).join('\n')}
`
    : `*No critical severity blockers detected.*`
}

${
  warningIssues.length > 0
    ? `### Warnings & Quality Deficits (${warningIssues.length})
${warningIssues.map((i, idx) => `${idx + 1}. **[${i.category.toUpperCase()}] ${i.title}**: ${i.description}\n   - *Fix*: ${i.recommendation}`).join('\n')}
`
    : `*No warning severity issues detected.*`
}

---

## 2. Production Code Remediation Plans

### File 1: \`src/app/layout.tsx\` (Metadata, OpenGraph, Viewport, Lang & JSON-LD)
Replace or update your root layout to include complete Next.js 16 metadata, viewport scaling, language tags, and structured data injection:

\`\`\`tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { JsonLd } from '@/components/seo/JsonLd';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never disable user zoom (WCAG 1.4.4 compliance)
};

export const metadata: Metadata = {
  metadataBase: new URL('${targetUrl}'),
  title: {
    default: '${categories.seo.metrics.title.value ?? 'Enterprise Platform | Scalable & Fast'}',
    template: '%s | Enterprise Platform',
  },
  description: '${categories.seo.metrics.description.value ?? 'High-performance Next.js application optimized for organic search and AI generative engines.'}',
  alternates: {
    canonical: '${targetUrl}',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '${targetUrl}',
    siteName: 'Enterprise Platform',
    title: '${categories.seo.metrics.title.value ?? 'Enterprise Platform'}',
    description: '${categories.seo.metrics.description.value ?? 'High-performance application optimized for search.'}',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '${categories.seo.metrics.title.value ?? 'Enterprise Platform'}',
    description: '${categories.seo.metrics.description.value ?? 'High-performance application optimized for search.'}',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd url="${targetUrl}" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <header role="banner" className="border-b">
          {/* Include navigation landmarks */}
        </header>
        <main role="main" id="main-content" className="flex-1">
          {children}
        </main>
        <footer role="contentinfo" className="border-t">
          {/* Include About, Contact, Privacy links for E-E-A-T */}
        </footer>
      </body>
    </html>
  );
}
\`\`\`

---

### File 2: \`src/app/robots.ts\` (AI Bot Optimization & Sitemap Discovery)
Ensure verified AI search bots (GPTBot, ClaudeBot, PerplexityBot) can index content for Generative Engine Optimization:

\`\`\`typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = '${targetUrl}';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Explicitly allow AI search crawlers for GEO citations
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Cohere-ai'],
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: \`\${baseUrl}/sitemap.xml\`,
  };
}
\`\`\`

---

### File 3: \`src/app/sitemap.ts\` (Dynamic Next.js 16 XML Sitemap)
> ⚠️ **Mandatory Directive:** Inspect the project codebase (e.g. \`src/app/**/page.tsx\` or navigation links) and populate ALL real discovered routes here under \`${targetUrl}\` so search engines discover all pages with zero 404 errors:

\`\`\`typescript
import { MetadataRoute } from 'next';

const BASE_URL = '${targetUrl}';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Inspect your project and include all real route paths here:
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  return routes.map((r) => ({
    url: \`\${BASE_URL}\${r.path}\`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
\`\`\`

---

### File 4: \`public/llms.txt\` (AI Search Knowledge Graph Manifest)
Create this file directly under \`public/llms.txt\` to enable instant grounding in Perplexity, Claude, and ChatGPT:

\`\`\`markdown
# Platform Overview
> ${categories.seo.metrics.description.value ?? 'High-performance application optimized for search engines and generative AI agents.'}

## Canonical Documentation
- [Homepage](${targetUrl}): Core platform entry point.
- [About Us](${targetUrl}/about): Company credentials, author verification, and engineering background.
- [Security & Privacy](${targetUrl}/privacy): Enterprise trust, compliance, and terms of service.

## Core Services & Capabilities
- **Automated Auditing**: Deep inspection of technical SEO, GEO, Web Vitals, and a11y.
- **Deterministic Fix Generation**: Zero-slop code patches generated for all detected defects.
\`\`\`

---

### File 5: \`src/components/seo/JsonLd.tsx\` (Type-Safe Schema.org Entity Graph)
\`\`\`tsx
import React from 'react';

export function JsonLd({ url }: { url: string }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Enterprise Platform',
    url: url,
    logo: \`\${url}/logo.png\`,
    sameAs: [
      'https://github.com',
      'https://twitter.com',
    ],
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Enterprise Platform',
    url: url,
    potentialAction: {
      '@type': 'SearchAction',
      target: \`\${url}/search?q={search_term_string}\`,
      'query-input': 'required name=search_term_string',
    },
  };

  const schemaArray = [organizationSchema, webSiteSchema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArray) }}
    />
  );
}
\`\`\`

---

### File 6: \`next.config.mjs\` (Production HTTP Security Headers)
\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, // Enables Brotli & Gzip compression
  poweredByHeader: false, // Prevents server fingerprinting
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
        },
      ],
    },
  ],
};

export default nextConfig;
\`\`\`

---

## 3. Verification & Acceptance Checklist
1. **Next.js Typecheck**: Run \`npx tsc --noEmit\` to confirm zero type errors.
2. **Sitemap Verification**: Visit \`/sitemap.xml\` in browser and verify valid XML output.
3. **Robots Verification**: Visit \`/robots.txt\` and verify GPTBot & ClaudeBot directives.
4. **LLMs Manifest**: Visit \`/llms.txt\` and verify raw markdown accessibility.
5. **Security Headers**: Inspect curl output (\`curl -I http://localhost:3000\`) to verify HSTS, CSP, and X-Content-Type-Options.
6. **Re-run Audit**: Trigger a fresh run via \`/api/audit\` to verify a target grade of **A+ (95+)**.
`;

  return {
    markdown,
    targetFiles,
    fixesSummary,
  };
}
