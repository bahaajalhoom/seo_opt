import type { FetchedAuditContext } from './fetcher';
import type { CategoryResult, SeoMetrics, AuditIssue } from '../../types/audit';

export function runSeoAudit(ctx: FetchedAuditContext): CategoryResult<SeoMetrics> {
  const { $, finalUrl, robotsTxt, sitemap } = ctx;
  const issues: AuditIssue[] = [];
  let scoreDeduction = 0;

  // 1. Title Analysis
  const titleEl = $('title').first();
  const rawTitle = titleEl.text().trim();
  const titleVal = rawTitle.length > 0 ? rawTitle : null;
  const titleLen = titleVal ? titleVal.length : 0;

  let titleStatus: SeoMetrics['title']['status'] = 'optimal';
  if (!titleVal) {
    titleStatus = 'missing';
    scoreDeduction += 20;
    issues.push({
      id: 'seo-missing-title',
      category: 'seo',
      severity: 'critical',
      title: 'Missing Page Title Tag',
      description: 'The document does not have a `<title>` tag in the `<head>` section.',
      impact: 'Search engines use the title tag as the primary anchor in search results. Without it, click-through rates collapse.',
      recommendation: 'Add a concise, keyword-rich title between 50 and 60 characters in `src/app/layout.tsx`.',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `export const metadata: Metadata = {\n  title: 'Your Brand | Core Value Proposition',\n};`,
    });
  } else if (titleLen < 30) {
    titleStatus = 'too-short';
    scoreDeduction += 5;
    issues.push({
      id: 'seo-short-title',
      category: 'seo',
      severity: 'warning',
      title: 'Page Title is Too Short',
      description: `Title tag is only ${titleLen} characters. Target length is 50-60 characters.`,
      impact: 'Short titles underutilize SERP real estate and miss high-intent keyword opportunities.',
      recommendation: 'Expand the title to 50-60 characters incorporating primary value proposition and brand.',
      targetFile: 'src/app/layout.tsx',
      evidence: { currentTitle: titleVal, length: titleLen },
    });
  } else if (titleLen > 65) {
    titleStatus = 'too-long';
    scoreDeduction += 5;
    issues.push({
      id: 'seo-long-title',
      category: 'seo',
      severity: 'warning',
      title: 'Page Title May Be Truncated',
      description: `Title tag is ${titleLen} characters, exceeding the 60 character Google desktop threshold.`,
      impact: 'Search engines will truncate the title with an ellipsis (...), hiding key brand or benefit words.',
      recommendation: 'Keep primary keywords in the first 50 characters and trim total length under 60 characters.',
      targetFile: 'src/app/layout.tsx',
      evidence: { currentTitle: titleVal, length: titleLen },
    });
  }

  // 2. Meta Description Analysis
  const metaDescEl = $('meta[name="description"]').first().attr('content') ??
    $('meta[property="og:description"]').first().attr('content');
  const descVal = metaDescEl ? metaDescEl.trim() : null;
  const descLen = descVal ? descVal.length : 0;

  let descStatus: SeoMetrics['description']['status'] = 'optimal';
  if (!descVal) {
    descStatus = 'missing';
    scoreDeduction += 15;
    issues.push({
      id: 'seo-missing-meta-description',
      category: 'seo',
      severity: 'critical',
      title: 'Missing Meta Description',
      description: 'No `<meta name="description">` tag found.',
      impact: 'Google will auto-generate arbitrary snippet text from your page, often selecting irrelevant UI copy.',
      recommendation: 'Add a compelling 140-160 character meta description with a clear call-to-action.',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `export const metadata: Metadata = {\n  description: 'Learn how to optimize your application with automated audits, instant SEO fixes, and AI search readiness.',\n};`,
    });
  } else if (descLen < 70) {
    descStatus = 'too-short';
    scoreDeduction += 5;
    issues.push({
      id: 'seo-short-meta-description',
      category: 'seo',
      severity: 'warning',
      title: 'Meta Description is Too Short',
      description: `Meta description is only ${descLen} characters. Target is 120-160 characters.`,
      impact: 'Short descriptions miss opportunities to provide rich context to searchers.',
      recommendation: 'Expand description to 120-160 characters.',
      evidence: { currentDescription: descVal, length: descLen },
    });
  } else if (descLen > 165) {
    descStatus = 'too-long';
    scoreDeduction += 4;
    issues.push({
      id: 'seo-long-meta-description',
      category: 'seo',
      severity: 'warning',
      title: 'Meta Description May Be Truncated',
      description: `Meta description is ${descLen} characters (target max 160 characters).`,
      impact: 'Trailing copy will be cut off on desktop and mobile SERPs.',
      recommendation: 'Trim description to between 140 and 160 characters.',
      evidence: { currentDescription: descVal, length: descLen },
    });
  }

  // 3. Canonical Tag Analysis
  const canonicalHref = $('link[rel="canonical"]').first().attr('href')?.trim() ?? null;
  let isCanonicalValid = false;
  let isSelfReferencing = false;

  if (!canonicalHref) {
    scoreDeduction += 10;
    issues.push({
      id: 'seo-missing-canonical',
      category: 'seo',
      severity: 'critical',
      title: 'Missing Canonical Link Tag',
      description: 'The page lacks a `<link rel="canonical">` tag.',
      impact: 'Without a canonical tag, URL parameters, UTM tags, and protocol duplicates can cause severe duplicate content penalties.',
      recommendation: 'Add a self-referencing canonical URL in Next.js metadata.',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `export const metadata: Metadata = {\n  alternates: {\n    canonical: '${finalUrl}',\n  },\n};`,
    });
  } else {
    try {
      const parsedCanonical = new URL(canonicalHref, finalUrl);
      isCanonicalValid = true;
      const parsedFinal = new URL(finalUrl);
      isSelfReferencing =
        parsedCanonical.origin === parsedFinal.origin &&
        parsedCanonical.pathname === parsedFinal.pathname;
    } catch {
      isCanonicalValid = false;
      scoreDeduction += 8;
      issues.push({
        id: 'seo-invalid-canonical',
        category: 'seo',
        severity: 'critical',
        title: 'Malformed Canonical URL',
        description: `The canonical URL "${canonicalHref}" is not a valid absolute URL.`,
        impact: 'Invalid canonical tags are ignored by search engines.',
        recommendation: 'Ensure canonical URL is a fully qualified absolute HTTPS URL.',
      });
    }
  }

  // 4. Robots Meta Tag Analysis
  const robotsMetaRaw = $('meta[name="robots"]').first().attr('content')?.toLowerCase() ?? null;
  const directives = robotsMetaRaw ? robotsMetaRaw.split(',').map((d) => d.trim()) : [];
  const isNoindex = directives.includes('noindex');
  const isNofollow = directives.includes('nofollow');

  if (isNoindex) {
    scoreDeduction += 35;
    issues.push({
      id: 'seo-noindex-detected',
      category: 'seo',
      severity: 'critical',
      title: 'Page Has "noindex" Directive',
      description: 'Robots meta tag explicitly instructs search engines NOT to index this page.',
      impact: 'This page is completely excluded from Google and Bing search indices.',
      recommendation: 'Remove "noindex" from production pages unless this is an intentional private dashboard.',
      targetFile: 'src/app/layout.tsx',
      evidence: { robotsMeta: robotsMetaRaw },
    });
  }

  // 5. Heading Structure Analysis
  const h1Elements: string[] = [];
  $('h1').each((_, el) => {
    const text = $(el).text().trim();
    if (text) h1Elements.push(text);
  });

  const h2Count = $('h2').length;
  const h3Count = $('h3').length;
  const h4Count = $('h4').length;
  const h5Count = $('h5').length;
  const h6Count = $('h6').length;

  const hasSingleH1 = h1Elements.length === 1;
  const missingLevels: string[] = [];

  if (h1Elements.length === 0) {
    scoreDeduction += 15;
    issues.push({
      id: 'seo-missing-h1',
      category: 'seo',
      severity: 'critical',
      title: 'Missing Primary <h1> Heading',
      description: 'The page has no `<h1>` heading element.',
      impact: 'The `<h1>` heading defines the primary topic of the page for search engines and assistive technology.',
      recommendation: 'Add exactly one high-impact `<h1>` heading to the main content section.',
      targetFile: 'src/app/page.tsx',
    });
  } else if (h1Elements.length > 1) {
    scoreDeduction += 6;
    issues.push({
      id: 'seo-multiple-h1',
      category: 'seo',
      severity: 'warning',
      title: 'Multiple <h1> Headings Detected',
      description: `Found ${h1Elements.length} <h1> tags. Best practice is exactly one <h1> per page.`,
      impact: 'Multiple H1s dilute topic authority and confuse screen readers.',
      recommendation: 'Demote secondary H1 tags to <h2> and reserve a single <h1> for the page title.',
      evidence: { h1Headings: h1Elements },
    });
  }

  // Check hierarchy skips (e.g. H1 followed by H3 without H2)
  if (h1Elements.length > 0 && h3Count > 0 && h2Count === 0) {
    missingLevels.push('h2');
    scoreDeduction += 5;
    issues.push({
      id: 'seo-heading-skip',
      category: 'seo',
      severity: 'warning',
      title: 'Skipped Heading Level (H1 -> H3)',
      description: 'Page uses <h3> headings but contains zero <h2> headings.',
      impact: 'Breaking heading hierarchy confuses document outline parsing by crawlers and screen readers.',
      recommendation: 'Introduce an <h2> level before nesting <h3> elements.',
    });
  }

  // 6. OpenGraph Analysis
  const ogTitle = $('meta[property="og:title"]').first().attr('content')?.trim() ?? null;
  const ogDesc = $('meta[property="og:description"]').first().attr('content')?.trim() ?? null;
  const ogImage = $('meta[property="og:image"]').first().attr('content')?.trim() ?? null;
  const ogUrl = $('meta[property="og:url"]').first().attr('content')?.trim() ?? null;
  const ogType = $('meta[property="og:type"]').first().attr('content')?.trim() ?? null;
  const ogSiteName = $('meta[property="og:site_name"]').first().attr('content')?.trim() ?? null;

  const isOgComplete = Boolean(ogTitle && ogDesc && ogImage);
  if (!isOgComplete) {
    scoreDeduction += 10;
    issues.push({
      id: 'seo-incomplete-opengraph',
      category: 'seo',
      severity: 'warning',
      title: 'Incomplete OpenGraph Social Tags',
      description: 'Missing required OpenGraph tags (og:title, og:description, or og:image).',
      impact: 'Links shared on LinkedIn, Slack, Facebook, and iMessage will lack previews, depressing social CTR.',
      recommendation: 'Add full OpenGraph metadata in `src/app/layout.tsx`.',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `openGraph: {\n  title: 'Your Page Title',\n  description: 'Your Page Description',\n  url: '${finalUrl}',\n  siteName: 'Your Site',\n  images: [{ url: '/og.png', width: 1200, height: 630 }],\n  type: 'website',\n}`,
    });
  }

  // 7. Twitter Card Analysis
  const twitterCard = $('meta[name="twitter:card"]').first().attr('content')?.trim() ?? null;
  const twitterTitle = $('meta[name="twitter:title"]').first().attr('content')?.trim() ?? null;
  const twitterDesc = $('meta[name="twitter:description"]').first().attr('content')?.trim() ?? null;
  const twitterImage = $('meta[name="twitter:image"]').first().attr('content')?.trim() ?? null;
  const twitterSite = $('meta[name="twitter:site"]').first().attr('content')?.trim() ?? null;
  const twitterCreator = $('meta[name="twitter:creator"]').first().attr('content')?.trim() ?? null;

  const isTwitterComplete = Boolean(twitterCard && (twitterTitle || ogTitle) && (twitterImage || ogImage));
  if (!twitterCard) {
    scoreDeduction += 5;
    issues.push({
      id: 'seo-missing-twitter-card',
      category: 'seo',
      severity: 'warning',
      title: 'Missing Twitter Card Metadata',
      description: 'The `<meta name="twitter:card">` tag is missing.',
      impact: 'Shared links on X (Twitter) will render as plain text links instead of rich visual cards.',
      recommendation: 'Configure Twitter card metadata with `summary_large_image`.',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `twitter: {\n  card: 'summary_large_image',\n  title: 'Your Page Title',\n  description: 'Your Page Description',\n  images: ['/og.png'],\n}`,
    });
  }

  // 8. Image Alt Tags
  let totalImages = 0;
  let withAlt = 0;
  let missingAlt = 0;
  let emptyAlt = 0;
  const sampleMissingAlt: string[] = [];

  $('img').each((_, el) => {
    totalImages++;
    const alt = $(el).attr('alt');
    const src = $(el).attr('src') ?? $(el).attr('data-src') ?? 'unknown-src';
    if (alt === undefined) {
      missingAlt++;
      if (sampleMissingAlt.length < 5) sampleMissingAlt.push(src);
    } else if (alt.trim() === '') {
      emptyAlt++;
    } else {
      withAlt++;
    }
  });

  if (missingAlt > 0) {
    const deduction = Math.min(15, missingAlt * 3);
    scoreDeduction += deduction;
    issues.push({
      id: 'seo-missing-image-alts',
      category: 'seo',
      severity: missingAlt > 3 ? 'critical' : 'warning',
      title: `${missingAlt} Image(s) Missing alt Attribute`,
      description: `Detected ${missingAlt} out of ${totalImages} image(s) lacking an alt attribute.`,
      impact: 'Search engines use image alt text for image search ranking and understanding page context.',
      recommendation: 'Add descriptive alt text to all informational images or alt="" for decorative graphics.',
      evidence: { missingCount: missingAlt, samples: sampleMissingAlt },
    });
  }

  // 9. Link Analysis
  let internalCount = 0;
  let externalCount = 0;
  let brokenSchemeCount = 0;
  let nofollowCount = 0;

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    if (!href) return;

    if (href.startsWith('javascript:') || href === '#') {
      brokenSchemeCount++;
      return;
    }

    const rel = $(el).attr('rel') ?? '';
    if (rel.includes('nofollow')) nofollowCount++;

    if (href.startsWith('http://') || href.startsWith('https://')) {
      try {
        const urlObj = new URL(href);
        const finalObj = new URL(finalUrl);
        if (urlObj.hostname === finalObj.hostname) {
          internalCount++;
        } else {
          externalCount++;
        }
      } catch {
        brokenSchemeCount++;
      }
    } else if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
      internalCount++;
    }
  });

  // 10. Sitemap & Robots.txt Discovery
  if (!robotsTxt.exists) {
    scoreDeduction += 10;
    issues.push({
      id: 'seo-missing-robots-txt',
      category: 'seo',
      severity: 'warning',
      title: 'Missing robots.txt File',
      description: 'Could not fetch a valid `/robots.txt` file (received 404 or connection error).',
      impact: 'Without robots.txt, crawlers cannot discover crawl directives or sitemap locations.',
      recommendation: 'Add a dynamic `src/app/robots.ts` route in Next.js.',
      targetFile: 'src/app/robots.ts',
      codeSnippet: `import { MetadataRoute } from 'next';\n\nexport default function robots(): MetadataRoute.Robots {\n  return {\n    rules: { userAgent: '*', allow: '/' },\n    sitemap: '${finalUrl}/sitemap.xml',\n  };\n}`,
    });
  }

  if (!sitemap.discovered) {
    scoreDeduction += 10;
    issues.push({
      id: 'seo-missing-sitemap',
      category: 'seo',
      severity: 'warning',
      title: 'No XML Sitemap Discovered',
      description: 'Could not find a sitemap at `/sitemap.xml` or referenced in `robots.txt`.',
      impact: 'Search engine bots take longer to discover new, updated, and deep pages.',
      recommendation: 'Implement a dynamic `src/app/sitemap.ts` in Next.js.',
      targetFile: 'src/app/sitemap.ts',
      codeSnippet: `import { MetadataRoute } from 'next';\n\nexport default function sitemap(): MetadataRoute.Sitemap {\n  return [\n    {\n      url: '${finalUrl}',\n      lastModified: new Date(),\n      changeFrequency: 'daily',\n      priority: 1,\n    },\n  ];\n}`,
    });
  }

  const finalScore = Math.max(0, 100 - scoreDeduction);

  const metrics: SeoMetrics = {
    title: {
      value: titleVal,
      length: titleLen,
      status: titleStatus,
    },
    description: {
      value: descVal,
      length: descLen,
      status: descStatus,
    },
    canonical: {
      value: canonicalHref,
      isSelfReferencing,
      isValid: isCanonicalValid,
    },
    robotsMeta: {
      indexable: !isNoindex,
      followable: !isNofollow,
      raw: robotsMetaRaw,
      directives,
    },
    headings: {
      h1: h1Elements,
      h2Count,
      h3Count,
      h4Count,
      h5Count,
      h6Count,
      hasSingleH1,
      hierarchyValid: missingLevels.length === 0,
      missingLevels,
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      image: ogImage,
      url: ogUrl,
      type: ogType,
      siteName: ogSiteName,
      isComplete: isOgComplete,
    },
    twitterCard: {
      card: twitterCard,
      site: twitterSite,
      creator: twitterCreator,
      title: twitterTitle,
      description: twitterDesc,
      image: twitterImage,
      isComplete: isTwitterComplete,
    },
    images: {
      total: totalImages,
      withAlt,
      missingAlt,
      emptyAlt,
      sampleMissingAlt,
    },
    links: {
      internalCount,
      externalCount,
      brokenSchemeCount,
      nofollowCount,
    },
    sitemap: {
      discovered: sitemap.discovered,
      url: sitemap.url,
      status: sitemap.statusCode,
    },
    robotsTxt: {
      exists: robotsTxt.exists,
      url: robotsTxt.url,
      hasSitemapRef: robotsTxt.sitemaps.length > 0,
      contentSample: robotsTxt.content ? robotsTxt.content.slice(0, 300) : null,
    },
  };

  return {
    score: finalScore,
    metrics,
    issues,
  };
}
