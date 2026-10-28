import type { FetchedAuditContext } from './fetcher';
import type { CategoryResult, PerformanceMetrics, AuditIssue } from '../../types/audit';

export function runPerformanceAudit(ctx: FetchedAuditContext): CategoryResult<PerformanceMetrics> {
  const { $, ttfbMs, htmlSizeBytes, compression, headers } = ctx;
  const issues: AuditIssue[] = [];
  let scoreDeduction = 0;

  // 1. TTFB (Time to First Byte)
  if (ttfbMs > 800) {
    scoreDeduction += 25;
    issues.push({
      id: 'perf-slow-ttfb',
      category: 'performance',
      severity: 'critical',
      title: 'High Server Response Time (TTFB > 800ms)',
      description: `TTFB was measured at ${ttfbMs}ms. Google Core Web Vitals targets under 200ms.`,
      impact: 'High TTFB stalls initial page rendering and degrades ranking on Google mobile indexes.',
      recommendation: 'Enable edge caching (Cloudflare / Vercel ISR) or optimize backend server response pipelines.',
      targetFile: 'next.config.mjs',
      codeSnippet: `// Enable stale-while-revalidate edge caching\nexport default {\n  headers: async () => [\n    {\n      source: '/:path*',\n      headers: [\n        { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },\n      ],\n    },\n  ],\n};`,
      evidence: { ttfbMs },
    });
  } else if (ttfbMs > 400) {
    scoreDeduction += 10;
    issues.push({
      id: 'perf-moderate-ttfb',
      category: 'performance',
      severity: 'warning',
      title: 'Server Response Time Could Be Faster (TTFB > 400ms)',
      description: `TTFB was measured at ${ttfbMs}ms (optimal is < 200ms).`,
      impact: 'Every 100ms delay in TTFB increases user bounce rates.',
      recommendation: 'Leverage stale-while-revalidate headers or route-level caching.',
      targetFile: 'next.config.mjs',
      codeSnippet: `// Configure aggressive CDN / Edge Cache headers\nexport default {\n  headers: async () => [\n    {\n      source: '/:path*',\n      headers: [\n        { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },\n      ],\n    },\n  ],\n};`,
      evidence: { ttfbMs },
    });
  }

  // 2. HTTP Compression
  if (!compression.enabled) {
    scoreDeduction += 20;
    issues.push({
      id: 'perf-uncompressed-response',
      category: 'performance',
      severity: 'critical',
      title: 'Text Compression Not Enabled',
      description: 'The server did not respond with gzip, Brotli (br), or zstd compression.',
      impact: 'Uncompressed HTML and assets transfer up to 70-80% more bytes over the network.',
      recommendation: 'Enable Brotli or Gzip compression on your reverse proxy or CDN.',
      targetFile: 'next.config.mjs',
      codeSnippet: `const nextConfig = {\n  compress: true,\n};`,
    });
  }

  // 3. HTML Payload Size
  const sizeKb = Math.round(htmlSizeBytes / 1024);
  if (sizeKb > 150) {
    scoreDeduction += 15;
    issues.push({
      id: 'perf-oversized-html',
      category: 'performance',
      severity: 'critical',
      title: 'Oversized HTML Document Payload',
      description: `Initial HTML is ${sizeKb} KB (recommended max is 100 KB).`,
      impact: 'Large HTML payloads delay the First Contentful Paint (FCP) and consume mobile bandwidth.',
      recommendation: 'Avoid inlining huge JSON state blobs or giant inline SVGs inside initial HTML.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `// Defer non-critical client heavy components\nimport dynamic from 'next/dynamic';\n\nconst HeavySection = dynamic(() => import('@/components/HeavySection'), {\n  ssr: false,\n  loading: () => <div className="h-48 bg-white/5 rounded-xl animate-pulse" />,\n});`,
      evidence: { sizeKb },
    });
  } else if (sizeKb > 100) {
    scoreDeduction += 5;
    issues.push({
      id: 'perf-heavy-html',
      category: 'performance',
      severity: 'warning',
      title: 'HTML Document Weight is Borderline',
      description: `Initial HTML document is ${sizeKb} KB. Target under 100 KB for optimal speed.`,
      impact: 'Increases initial parser time and time-to-interactive.',
      recommendation: 'Code-split large components and streamline DOM depth.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `// Code-split dynamic client sub-components\nimport dynamic from 'next/dynamic';\nconst ClientModal = dynamic(() => import('@/components/ClientModal'), { ssr: false });`,
      evidence: { sizeKb },
    });
  }

  // 4. DOM Complexity & Depth
  const allElements = $('*');
  const totalElements = allElements.length;

  let maxDepth = 0;
  function calculateDepth(element: any, currentDepth: number) {
    if (currentDepth > maxDepth) maxDepth = currentDepth;
    const children = $(element).children();
    children.each((_, child) => {
      calculateDepth(child, currentDepth + 1);
    });
  }

  const rootHtml = $('html').get(0);
  if (rootHtml) {
    calculateDepth(rootHtml, 1);
  }

  const isDomBloated = totalElements > 800 || maxDepth > 32;
  if (totalElements > 1400) {
    scoreDeduction += 15;
    issues.push({
      id: 'perf-excessive-dom-nodes',
      category: 'performance',
      severity: 'critical',
      title: 'Excessive DOM Node Count (> 1400 nodes)',
      description: `Document has ${totalElements} DOM nodes. Lighthouse marks > 1400 as failing.`,
      impact: 'Excessive DOM nodes exhaust mobile device memory and trigger layout thrashing.',
      recommendation: 'Flatten component hierarchies and virtualize long lists.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Flatten deeply nested wrapper divs into flat CSS grid -->\n<div className="grid grid-cols-1 md:grid-cols-3 gap-4">\n  {items.map((item) => <Card key={item.id} {...item} />)}\n</div>`,
      evidence: { totalElements, maxDepth },
    });
  } else if (totalElements > 800) {
    scoreDeduction += 5;
    issues.push({
      id: 'perf-high-dom-nodes',
      category: 'performance',
      severity: 'warning',
      title: 'High DOM Node Count (> 800 nodes)',
      description: `Document has ${totalElements} DOM elements (target under 800).`,
      impact: 'Increases style calculation times and layout computation latency.',
      recommendation: 'Remove redundant wrapper elements.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Eliminate redundant wrapper divs -->\n<section className="space-y-6">\n  {children}\n</section>`,
      evidence: { totalElements },
    });
  }

  if (maxDepth > 32) {
    scoreDeduction += 5;
    issues.push({
      id: 'perf-deep-dom-nesting',
      category: 'performance',
      severity: 'warning',
      title: 'Deeply Nested DOM Tree (> 32 levels)',
      description: `Maximum DOM tree depth is ${maxDepth} levels.`,
      impact: 'Deep nesting creates excessive recalculate style calculation overhead.',
      recommendation: 'Refactor nested component containers into cleaner flex/grid structures.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Refactor multi-nested layers into direct flex parent -->\n<div className="flex flex-col sm:flex-row items-center gap-4">\n  <div>{primaryContent}</div>\n  <div>{secondaryAction}</div>\n</div>`,
      evidence: { maxDepth },
    });
  }

  // 5. Render-Blocking Resources in <head>
  const headScripts = $('head script[src]');
  const blockingScripts: PerformanceMetrics['renderBlocking']['blockingScripts'] = [];

  headScripts.each((_, el) => {
    const src = $(el).attr('src') ?? null;
    const isAsync = $(el).attr('async') !== undefined;
    const isDefer = $(el).attr('defer') !== undefined;
    const isModule = $(el).attr('type') === 'module';

    if (!isAsync && !isDefer && !isModule) {
      blockingScripts.push({ src, isAsyncOrDefer: false });
    }
  });

  const stylesInHead = $('head link[rel="stylesheet"]').length;

  if (blockingScripts.length > 0) {
    scoreDeduction += Math.min(20, blockingScripts.length * 8);
    issues.push({
      id: 'perf-render-blocking-scripts',
      category: 'performance',
      severity: 'critical',
      title: `${blockingScripts.length} Render-Blocking Script(s) in <head>`,
      description: 'Found synchronous external scripts in `<head>` lacking `defer`, `async`, or `type="module"`.',
      impact: 'Browsers halt HTML parsing and rendering completely while downloading and executing synchronous scripts.',
      recommendation: 'Add `defer` or `async` to scripts, or load third-party tags using Next.js `<Script strategy="afterInteractive" />`.',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `// Use Next.js Script with afterInteractive or lazyOnload\nimport Script from 'next/script';\n\n<Script\n  src="/vendor/analytics.js"\n  strategy="afterInteractive"\n/>`,
      evidence: { blockingScripts: blockingScripts.map((s) => s.src) },
    });
  }

  // 6. Modern Image Formats & CLS Prevention
  let totalImages = 0;
  let modernFormats = 0;
  let legacyFormats = 0;
  const unoptimizedSample: string[] = [];
  let imagesMissingDimensions = 0;

  $('img').each((_, el) => {
    totalImages++;
    const src = ($(el).attr('src') ?? '').toLowerCase();
    const width = $(el).attr('width');
    const height = $(el).attr('height');

    if (!width || !height) {
      imagesMissingDimensions++;
    }

    if (src.endsWith('.webp') || src.endsWith('.avif') || src.endsWith('.svg')) {
      modernFormats++;
    } else if (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.gif')) {
      legacyFormats++;
      if (unoptimizedSample.length < 5) unoptimizedSample.push(src);
    }
  });

  if (legacyFormats > 0 && totalImages > 0) {
    const legacyRatio = (legacyFormats / totalImages) * 100;
    if (legacyRatio > 50) {
      scoreDeduction += 10;
      issues.push({
        id: 'perf-legacy-image-formats',
        category: 'performance',
        severity: 'warning',
        title: 'Legacy Image Formats Detected (PNG/JPG)',
        description: `${legacyFormats} of ${totalImages} image(s) use legacy uncompressed formats instead of WebP or AVIF.`,
        impact: 'Modern WebP/AVIF images are 30-50% smaller at identical perceptual quality, cutting bandwidth.',
        recommendation: 'Use Next.js `<Image />` component which automatically serves modern WebP/AVIF formats.',
        targetFile: 'src/app/page.tsx',
        codeSnippet: `// Replace legacy <img> tags with optimized next/image\nimport Image from 'next/image';\n\n<Image\n  src="/showcase.webp"\n  alt="Product Showcase"\n  width={800}\n  height={500}\n  priority={false}\n/>`,
        evidence: { samples: unoptimizedSample },
      });
    }
  }

  if (imagesMissingDimensions > 0) {
    scoreDeduction += 5;
    issues.push({
      id: 'perf-missing-image-dimensions',
      category: 'performance',
      severity: 'warning',
      title: 'Images Missing Explicit Width/Height Attributes',
      description: `${imagesMissingDimensions} image(s) lack width or height attributes.`,
      impact: 'Causes layout shift (Cumulative Layout Shift - CLS) as images load, damaging user experience.',
      recommendation: 'Specify explicit width and height or use `next/image` with layout styling.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Set explicit width & height attributes to eliminate CLS layout shift -->\n<Image\n  src="/hero-banner.webp"\n  alt="Hero Feature Preview"\n  width={1200}\n  height={630}\n  className="w-full h-auto"\n/>`,
    });
  }

  const finalScore = Math.max(0, 100 - scoreDeduction);

  const metrics: PerformanceMetrics = {
    ttfbMs,
    totalPageWeightBytes: htmlSizeBytes,
    htmlSizeBytes,
    compression: {
      enabled: compression.enabled,
      encoding: compression.encoding,
    },
    domStats: {
      totalElements,
      maxDepth,
      isDomBloated,
    },
    renderBlocking: {
      scriptsInHead: headScripts.length,
      blockingScripts,
      stylesInHead,
    },
    imageOptimization: {
      totalImages,
      modernFormatsCount: modernFormats,
      legacyFormatsCount: legacyFormats,
      unoptimizedSample,
    },
  };

  return {
    score: finalScore,
    metrics,
    issues,
  };
}
