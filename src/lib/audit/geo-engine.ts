import * as cheerio from 'cheerio';
import type { FetchedAuditContext } from './fetcher';
import type { CategoryResult, GeoMetrics, AuditIssue, AiBotPermission } from '../../types/audit';

export function runGeoAudit(ctx: FetchedAuditContext): CategoryResult<GeoMetrics> {
  const { $, finalUrl, origin, robotsTxt, llmsTxt, llmsFullTxt, htmlSizeBytes } = ctx;
  const issues: AuditIssue[] = [];
  let scoreDeduction = 0;

  // 1. Detection of llms.txt and llms-full.txt
  const llmsHasContent = Boolean(llmsTxt.content && llmsTxt.content.trim().length > 20);
  const llmsLen = llmsTxt.content ? llmsTxt.content.length : 0;

  if (!llmsTxt.exists || !llmsHasContent) {
    scoreDeduction += 15;
    issues.push({
      id: 'geo-missing-llms-txt',
      category: 'geo',
      severity: 'critical',
      title: 'Missing `/llms.txt` AI Context Manifest',
      description: 'The site does not provide an `/llms.txt` file at the domain root.',
      impact: 'AI search engines (Perplexity, ChatGPT Search, Claude) rely on `llms.txt` as a standard markdown index to discover authoritative content and documentation without crawling noise.',
      recommendation: 'Create a clean, markdown-formatted `public/llms.txt` outlining your service overview, primary docs, and canonical URLs.',
      targetFile: 'public/llms.txt',
      codeSnippet: `# ${origin}\n\n> Summary description of the application and core value.\n\n## Documentation\n- [API Reference](${origin}/api-docs): Complete reference.\n- [Pricing](${origin}/pricing): Plan details.`,
    });
  }

  if (!llmsFullTxt.exists) {
    scoreDeduction += 5;
    issues.push({
      id: 'geo-missing-llms-full-txt',
      category: 'geo',
      severity: 'warning',
      title: 'Missing `/llms-full.txt` Extended Context File',
      description: '`/llms-full.txt` was not found. This companion file provides complete, in-depth text for deep RAG ingestion.',
      impact: 'LLM agents building large context windows cannot fetch your entire knowledge base in a single pass.',
      recommendation: 'Add `public/llms-full.txt` containing full documentation in raw markdown.',
      targetFile: 'public/llms-full.txt',
      codeSnippet: `# ${origin} - Full Architectural & Technical Documentation\n\n> Comprehensive product documentation and architectural references designed for deep RAG ingestion by LLM search agents.\n\n## Overview\nComplete reference architecture, system capabilities, and canonical resources.\n\n## Core Capabilities\n- Autonomous search engine evaluation\n- Generative Engine Optimization (GEO)\n- Real-DOM UI/UX quality scoring\n\n## Canonical Links\n- [Platform Home](${origin}/)\n- [UI/UX Lab](${origin}/ui-ux)\n- [Methodology](${origin}/methodology)`,
    });
  }

  // 2. AI Bot Permissions in robots.txt
  const aiBotNames = [
    'GPTBot',
    'ClaudeBot',
    'PerplexityBot',
    'CCBot',
    'Google-Extended',
    'Cohere',
    'ByteSpider',
  ] as const;

  const botPermissions: Record<(typeof aiBotNames)[number], AiBotPermission> = {
    GPTBot: 'unspecified',
    ClaudeBot: 'unspecified',
    PerplexityBot: 'unspecified',
    CCBot: 'unspecified',
    'Google-Extended': 'unspecified',
    Cohere: 'unspecified',
    ByteSpider: 'unspecified',
  };

  let totalAllowed = 0;
  let totalBlocked = 0;

  if (robotsTxt.content) {
    const lines = robotsTxt.content.split('\n').map((l) => l.trim());
    const agentRules: Record<string, { disallow: string[]; allow: string[] }> = {};
    let currentAgents: string[] = [];
    let parsingDirectives = false;

    for (const line of lines) {
      if (line.startsWith('#') || !line) continue;

      const uaMatch = line.match(/^User-agent:\s*(.+)$/i);
      if (uaMatch) {
        const agent = (uaMatch[1] ?? '').trim();
        // If we were parsing directives for a previous block and encounter a new User-agent,
        // start a brand new agents group
        if (parsingDirectives) {
          currentAgents = [];
          parsingDirectives = false;
        }

        currentAgents.push(agent);
        if (!agentRules[agent]) {
          agentRules[agent] = { disallow: [], allow: [] };
        }
        continue;
      }

      const disallowMatch = line.match(/^Disallow:\s*(.*)$/i);
      if (disallowMatch) {
        parsingDirectives = true;
        const rule = (disallowMatch[1] ?? '').trim();
        for (const agent of currentAgents) {
          agentRules[agent]?.disallow.push(rule);
        }
        continue;
      }

      const allowMatch = line.match(/^Allow:\s*(.*)$/i);
      if (allowMatch) {
        parsingDirectives = true;
        const rule = (allowMatch[1] ?? '').trim();
        for (const agent of currentAgents) {
          agentRules[agent]?.allow.push(rule);
        }
        continue;
      }

      if (line.match(/^Sitemap:/i)) {
        currentAgents = [];
        parsingDirectives = false;
      }
    }

    for (const bot of aiBotNames) {
      const specific = agentRules[bot];
      const wildcard = agentRules['*'];

      const checkRule = (rules?: { disallow: string[]; allow: string[] }): AiBotPermission => {
        if (!rules) return 'unspecified';
        // If explicit Allow: / exists, it is allowed
        if (rules.allow.includes('/') || (rules.disallow.length === 1 && rules.disallow[0] === '')) {
          return 'allowed';
        }
        if (rules.disallow.includes('/') && !rules.allow.includes('/')) {
          return 'disallowed';
        }
        if (rules.disallow.length > 0) {
          return 'partially-disallowed';
        }
        return 'unspecified';
      };

      const result = checkRule(specific);
      botPermissions[bot] = result !== 'unspecified' ? result : checkRule(wildcard);

      if (botPermissions[bot] === 'disallowed') totalBlocked++;
      else totalAllowed++;
    }
  }

  // Flag blocked AI bots
  const criticalAiBots: Array<keyof typeof botPermissions> = ['GPTBot', 'ClaudeBot', 'PerplexityBot'];
  const blockedMajorBots = criticalAiBots.filter((b) => botPermissions[b] === 'disallowed');

  if (blockedMajorBots.length > 0) {
    scoreDeduction += blockedMajorBots.length * 10;
    issues.push({
      id: 'geo-ai-bots-blocked',
      category: 'geo',
      severity: 'critical',
      title: `AI Search Bots Blocked: ${blockedMajorBots.join(', ')}`,
      description: `Your \`robots.txt\` explicitly disallows search crawlers (${blockedMajorBots.join(', ')}).`,
      impact: 'Your site will not be cited or retrieved in ChatGPT Search, Perplexity, or Claude search answers.',
      recommendation: 'Update `src/app/robots.ts` to allow verified AI search crawlers.',
      targetFile: 'src/app/robots.ts',
      codeSnippet: `export default function robots(): MetadataRoute.Robots {\n  return {\n    rules: [\n      { userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot'], allow: '/' },\n    ],\n  };\n}`,
      evidence: { blockedBots: blockedMajorBots },
    });
  }

  // 3. JSON-LD Structured Data Parsing & Validation
  const jsonLdScripts = $('script[type="application/ld+json"]');
  const parsedSchemas: GeoMetrics['jsonLd']['parsedSchemas'] = [];
  const schemaTypes: string[] = [];

  jsonLdScripts.each((_, el) => {
    const rawContent = $(el).html()?.trim();
    if (!rawContent) return;

    try {
      const parsed = JSON.parse(rawContent) as Record<string, unknown>;

      const processNode = (node: unknown) => {
        if (!node || typeof node !== 'object') return;
        const record = node as Record<string, unknown>;

        if (Array.isArray(record['@graph'])) {
          record['@graph'].forEach(processNode);
          return;
        }

        const rawType = record['@type'];
        const typesList = Array.isArray(rawType) ? rawType : [rawType];
        
        for (const t of typesList) {
          if (typeof t === 'string' && t.trim()) {
            schemaTypes.push(t.trim());
          }
        }
        
        const type = schemaTypes[schemaTypes.length - 1] ?? 'Unknown';

        const schemaErrors: string[] = [];
        if (type === 'Organization' && !record['name']) {
          schemaErrors.push('Organization missing "name" field');
        }
        if (type === 'WebSite' && (!record['name'] || !record['url'])) {
          schemaErrors.push('WebSite missing "name" or "url"');
        }
        if (type === 'FAQPage' && !Array.isArray(record['mainEntity'])) {
          schemaErrors.push('FAQPage missing "mainEntity" question-answer array');
        }

        parsedSchemas.push({
          type,
          raw: record,
          valid: schemaErrors.length === 0,
          errors: schemaErrors.length > 0 ? schemaErrors : undefined,
        });
      };

      if (Array.isArray(parsed)) {
        parsed.forEach(processNode);
      } else {
        processNode(parsed);
      }
    } catch {
      issues.push({
        id: 'geo-invalid-jsonld-syntax',
        category: 'geo',
        severity: 'critical',
        title: 'JSON-LD Syntax Parse Error',
        description: 'A `<script type="application/ld+json">` contains invalid JSON.',
        impact: 'Search engines and AI bots will discard corrupted structured data.',
        recommendation: 'Fix JSON syntax errors in your structured data component.',
      });
      scoreDeduction += 10;
    }
  });

  const hasOrg = schemaTypes.some((t) => typeof t === 'string' && t.toLowerCase() === 'organization');
  const hasWeb = schemaTypes.some((t) => typeof t === 'string' && t.toLowerCase() === 'website');
  const hasFaq = schemaTypes.some((t) => typeof t === 'string' && t.toLowerCase() === 'faqpage');
  const hasArticle = schemaTypes.some((t) => typeof t === 'string' && ['article', 'blogposting', 'newsarticle'].includes(t.toLowerCase()));
  const hasBreadcrumb = schemaTypes.some((t) => typeof t === 'string' && t.toLowerCase() === 'breadcrumblist');
  const hasProduct = schemaTypes.some((t) => typeof t === 'string' && t.toLowerCase() === 'product');
  const hasAuthor = schemaTypes.some((t) => typeof t === 'string' && ['person', 'author'].includes(t.toLowerCase()));

  if (parsedSchemas.length === 0) {
    scoreDeduction += 20;
    issues.push({
      id: 'geo-missing-jsonld',
      category: 'geo',
      severity: 'critical',
      title: 'Zero JSON-LD Structured Data Found',
      description: 'The page has no schema.org JSON-LD structured data tags.',
      impact: 'AI models rely heavily on JSON-LD entity graphs to extract facts, organization details, and product specs without ambiguity.',
      recommendation: 'Add Organization, WebSite, and FAQPage JSON-LD schemas.',
      targetFile: 'src/components/seo/JsonLd.tsx',
      codeSnippet: `const jsonLd = {\n  '@context': 'https://schema.org',\n  '@type': 'Organization',\n  name: 'Your Company',\n  url: '${finalUrl}',\n};\n<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />`,
    });
  } else {
    if (!hasOrg) {
      scoreDeduction += 6;
      issues.push({
        id: 'geo-missing-org-schema',
        category: 'geo',
        severity: 'warning',
        title: 'Missing Organization Schema',
        description: 'No `Organization` schema.org entity was detected in JSON-LD.',
        impact: 'AI engines will struggle to identify your brand entity, official logo, and social handles.',
        recommendation: 'Embed an Organization schema with name, url, logo, and sameAs links.',
        targetFile: 'src/components/seo/JsonLd.tsx',
        codeSnippet: `<script\n  type="application/ld+json"\n  dangerouslySetInnerHTML={{\n    __html: JSON.stringify({\n      '@context': 'https://schema.org',\n      '@type': 'Organization',\n      name: 'Your Organization',\n      url: '${origin}',\n      logo: '${origin}/logo.png',\n      sameAs: ['https://twitter.com/yourhandle', 'https://github.com/yourhandle'],\n    }),\n  }}\n/>`,
      });
    }
    if (!hasWeb) {
      scoreDeduction += 4;
      issues.push({
        id: 'geo-missing-website-schema',
        category: 'geo',
        severity: 'warning',
        title: 'Missing WebSite Schema',
        description: 'No `WebSite` schema found defining the site name and search action.',
        impact: 'Prevents Google from generating sitelinks search boxes and AI knowledge graph associations.',
        recommendation: 'Add a WebSite schema in `src/app/layout.tsx`.',
        targetFile: 'src/app/layout.tsx',
        codeSnippet: `<script\n  type="application/ld+json"\n  dangerouslySetInnerHTML={{\n    __html: JSON.stringify({\n      '@context': 'https://schema.org',\n      '@type': 'WebSite',\n      name: 'Your Brand Name',\n      url: '${origin}',\n    }),\n  }}\n/>`,
      });
    }
  }

  // 4. Content Information Density & Direct Answers
  // Extract clean text (strip script, style, noscript, svg, hidden)
  const $clone = cheerio.load($.html());
  $clone('script, style, noscript, svg, iframe, [aria-hidden="true"]').remove();
  const cleanText = $clone('body').text().replace(/\s+/g, ' ').trim();

  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const readingTimeMin = Math.max(1, Math.round(wordCount / 200));

  let paragraphCount = 0;
  $('p').each((_, el) => {
    if ($(el).text().trim().length > 20) paragraphCount++;
  });

  const sentences = cleanText.split(/[.!?]+/).filter((s: string) => s.trim().length > 5);
  const avgSentenceLength = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;

  // Direct answer patterns: concise explanatory definitions, Q&A blocks, tables, definitions
  let directAnswerPassages = 0;
  $('dl, table, ol, ul').each(() => {
    directAnswerPassages++;
  });
  $('p').each((_, el) => {
    const text = $(el).text().trim();
    if (
      /^(what is|how to|why|defined as|is a|are a|refers to)/i.test(text) &&
      text.length >= 40 &&
      text.length <= 300
    ) {
      directAnswerPassages++;
    }
  });

  const textToHtmlRatio = htmlSizeBytes > 0 ? Math.min(100, (cleanText.length / htmlSizeBytes) * 100) : 0;

  if (wordCount < 200) {
    scoreDeduction += 15;
    issues.push({
      id: 'geo-thin-content',
      category: 'geo',
      severity: 'critical',
      title: 'Thin Content Detected',
      description: `Page body contains only ${wordCount} words of readable text.`,
      impact: 'Generative AI search models rank and cite content based on factual completeness and semantic depth.',
      recommendation: 'Expand page copy with informative sections, product features, and comprehensive answers.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Expand page body copy with descriptive topics and comprehensive answers -->\n<section className="py-8 space-y-4 max-w-4xl">\n  <h2 className="text-2xl font-bold text-white">Platform Capabilities & Core Features</h2>\n  <p className="text-sm text-zinc-300 leading-relaxed">\n    Provide in-depth architectural details, key benefits, and direct factual answers to primary domain inquiries.\n  </p>\n</section>`,
      evidence: { wordCount },
    });
  }

  if (textToHtmlRatio < 6 && htmlSizeBytes > 50_000) {
    scoreDeduction += 8;
    issues.push({
      id: 'geo-low-text-ratio',
      category: 'geo',
      severity: 'warning',
      title: 'Low Text-to-HTML Ratio',
      description: `Text comprises only ${textToHtmlRatio.toFixed(1)}% of total HTML page weight.`,
      impact: 'Heavy markup boilerplate dilutes search crawler token density.',
      recommendation: 'Remove redundant wrapper divs, inline styles, or oversized SVG paths in markup.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Streamline markup: eliminate superfluous wrapper divs and inline SVGs -->\n<article className="max-w-4xl mx-auto space-y-6">\n  <h1 className="text-3xl font-bold">{pageTitle}</h1>\n  <p className="text-base text-zinc-300">{highDensityContent}</p>\n</article>`,
      evidence: { textToHtmlRatio: `${textToHtmlRatio.toFixed(1)}%` },
    });
  }

  // 5. E-E-A-T Signals (Experience, Expertise, Authoritativeness, Trustworthiness)
  const metaAuthor = $('meta[name="author"]').attr('content') ?? null;
  const domAuthor = $('[rel="author"], .author, .byline, [itemprop="author"]').first().text().trim() || null;
  const authorDetected = Boolean(metaAuthor || domAuthor || hasAuthor);
  const authorName = metaAuthor || domAuthor || (hasAuthor ? 'Identified in JSON-LD' : null);

  let hasAbout = false;
  let hasContact = false;
  let hasPrivacy = false;
  let hasTerms = false;
  let citationCount = 0;

  $('a[href]').each((_, el) => {
    const href = ($(el).attr('href') ?? '').toLowerCase();
    const text = $(el).text().toLowerCase();

    if (href.includes('/about') || text.includes('about us') || text.includes('company')) hasAbout = true;
    if (href.includes('/contact') || text.includes('contact') || href.startsWith('mailto:')) hasContact = true;
    if (href.includes('/privacy') || text.includes('privacy')) hasPrivacy = true;
    if (href.includes('/terms') || text.includes('terms') || text.includes('tos')) hasTerms = true;

    // Authoritative citations (external links to .edu, .gov, .org, scientific, or Wikipedia)
    if (
      href.startsWith('http') &&
      (!href.includes(origin)) &&
      (/\.(edu|gov|org)(\/|$)/.test(href) || href.includes('wikipedia.org') || href.includes('doi.org'))
    ) {
      citationCount++;
    }
  });

  const publishedDate = $('meta[property="article:published_time"]').attr('content') ?? null;
  const modifiedDate = $('meta[property="article:modified_time"]').attr('content') ?? null;

  let eeatScore = 100;
  if (!hasAbout) {
    eeatScore -= 15;
    scoreDeduction += 5;
    issues.push({
      id: 'geo-missing-about-link',
      category: 'geo',
      severity: 'warning',
      title: 'Missing "About Us" Verification Link',
      description: 'No navigational link to an About or Team page was found.',
      impact: 'E-E-A-T algorithms require identifiable corporate or editorial entities to grant citation authority.',
      recommendation: 'Add a clear link to `/about` in the header navigation or footer.',
      targetFile: 'src/components/AuditHeader.tsx',
      codeSnippet: `<!-- Add explicit About link to Header or Footer -->\n<Link href="/about" className="text-xs text-zinc-400 hover:text-white transition-colors">\n  About Us\n</Link>`,
    });
  }
  if (!hasPrivacy) {
    eeatScore -= 15;
    scoreDeduction += 4;
    issues.push({
      id: 'geo-missing-privacy-link',
      category: 'geo',
      severity: 'warning',
      title: 'Missing Privacy Policy Link',
      description: 'No link to a Privacy Policy page was found.',
      impact: 'Basic trust signal required by both Google quality raters and AI safety filters.',
      recommendation: 'Add a `/privacy` policy link in your footer.',
      targetFile: 'src/components/AuditFooter.tsx',
      codeSnippet: `<!-- Add explicit Privacy Policy link to Footer -->\n<Link href="/privacy" className="text-xs text-zinc-400 hover:text-white transition-colors">\n  Privacy Policy\n</Link>`,
    });
  }

  // 6. Semantic Structure & Key Topics
  const semanticTags = $('article, section, aside, nav, header, footer, main, figure');
  const semanticTagCount = semanticTags.length;
  const usesSemanticStructure = semanticTagCount >= 3;

  if (!usesSemanticStructure) {
    scoreDeduction += 6;
    issues.push({
      id: 'geo-lacks-semantic-html',
      category: 'geo',
      severity: 'warning',
      title: 'Lacks Modern Semantic HTML5 Tags',
      description: 'The document relies predominantly on generic `<div>` containers instead of `<main>`, `<article>`, and `<section>`.',
      impact: 'LLM tokenizers rely on semantic elements to distinguish primary article copy from sidebars and boilerplate.',
      recommendation: 'Wrap content in semantic `<main>`, `<article>`, and `<section>` tags.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Use semantic layout containers instead of generic nested divs -->\n<header>\n  <nav>{/* navigation items */}</nav>\n</header>\n<main>\n  <article>\n    <section>{/* structured content */}</section>\n  </article>\n</main>\n<footer>{/* footer content */}</footer>`,
    });
  }

  // Extract key topics (from H2, H3 headings)
  const detectedKeyTopics: string[] = [];
  $('h2, h3').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 5 && text.length < 70 && detectedKeyTopics.length < 8) {
      detectedKeyTopics.push(text);
    }
  });

  const finalScore = Math.max(0, 100 - scoreDeduction);

  const metrics: GeoMetrics = {
    llmsTxt: {
      exists: llmsTxt.exists,
      url: llmsTxt.url,
      fullExists: llmsFullTxt.exists,
      fullUrl: llmsFullTxt.url,
      length: llmsLen,
      hasContent: llmsHasContent,
    },
    aiBotPermissions: {
      bots: botPermissions,
      totalAiBotsAllowed: totalAllowed,
      totalAiBotsBlocked: totalBlocked,
    },
    jsonLd: {
      hasJsonLd: parsedSchemas.length > 0,
      rawCount: parsedSchemas.length,
      schemaTypes,
      parsedSchemas,
      hasOrganization: hasOrg,
      hasWebsite: hasWeb,
      hasFaqPage: hasFaq,
      hasArticleOrBlog: hasArticle,
      hasBreadcrumb: hasBreadcrumb,
      hasProduct: hasProduct,
      hasAuthorOrPerson: hasAuthor,
    },
    contentDensity: {
      totalWords: wordCount,
      readingTimeMinutes: readingTimeMin,
      paragraphCount,
      avgSentenceLengthWords: avgSentenceLength,
      directAnswerPassages,
      informationDensityScore: Math.min(100, Math.round((wordCount / 500) * 40 + directAnswerPassages * 10)),
      textToHtmlRatio: Number(textToHtmlRatio.toFixed(1)),
    },
    eeatSignals: {
      authorDetected,
      authorName,
      hasAboutPageLink: hasAbout,
      hasContactPageLink: hasContact,
      hasPrivacyPolicyLink: hasPrivacy,
      hasTermsLink: hasTerms,
      publishedDate,
      modifiedDate,
      citationCount,
      score: Math.max(0, eeatScore),
    },
    semanticHeadingsAndEntities: {
      semanticTagCount,
      usesSemanticStructure,
      detectedKeyTopics,
    },
  };

  return {
    score: finalScore,
    metrics,
    issues,
  };
}
