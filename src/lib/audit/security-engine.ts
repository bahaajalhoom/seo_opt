import type { FetchedAuditContext } from './fetcher';
import type { CategoryResult, SecurityMetrics, AuditIssue } from '../../types/audit';

export function runSecurityAudit(ctx: FetchedAuditContext): CategoryResult<SecurityMetrics> {
  const { $, finalUrl, headers } = ctx;
  const issues: AuditIssue[] = [];
  let scoreDeduction = 0;

  // 1. HTTPS Protocol Validation
  const isHttps = finalUrl.toLowerCase().startsWith('https://');
  if (!isHttps) {
    scoreDeduction += 40;
    const cleanHost = finalUrl.replace(/^https?:\/\//i, '').split('/')[0] || 'yourdomain.com';
    issues.push({
      id: 'sec-insecure-http',
      category: 'security',
      severity: 'critical',
      title: 'Site Not Served Over Secure HTTPS',
      description: `The URL "${finalUrl}" is served over plaintext HTTP.`,
      impact: 'Passwords, cookies, and traffic can be intercepted via man-in-the-middle (MITM) attacks. Chrome marks the site "Not Secure".',
      recommendation: 'Enforce automatic HTTP to HTTPS redirection and obtain an SSL/TLS certificate.',
      targetFile: 'next.config.mjs',
      codeSnippet: `// Force HTTPS redirect at reverse-proxy or edge level\nexport default {\n  async redirects() {\n    return [\n      {\n        source: '/:path*',\n        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],\n        destination: 'https://${cleanHost}/:path*',\n        permanent: true,\n      },\n    ];\n  },\n};`,
    });
  }

  // 2. Strict-Transport-Security (HSTS)
  const hstsHeader = headers['strict-transport-security'] ?? null;
  let hstsMaxAge: number | null = null;
  let hstsIncludesSubDomains = false;
  let hstsPreload = false;

  if (isHttps) {
    if (!hstsHeader) {
      scoreDeduction += 15;
      issues.push({
        id: 'sec-missing-hsts',
        category: 'security',
        severity: 'critical',
        title: 'Missing HTTP Strict Transport Security (HSTS)',
        description: 'The `Strict-Transport-Security` response header is missing.',
        impact: 'Users making initial HTTP requests are vulnerable to SSL-stripping downgrade attacks.',
        recommendation: 'Add HSTS with at least a 1-year max-age (31536000 seconds).',
        targetFile: 'next.config.mjs',
        codeSnippet: `{\n  key: 'Strict-Transport-Security',\n  value: 'max-age=31536000; includeSubDomains; preload',\n}`,
      });
    } else {
      const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/i);
      hstsMaxAge = maxAgeMatch ? parseInt(maxAgeMatch[1] ?? '0', 10) : null;
      hstsIncludesSubDomains = hstsHeader.includes('includeSubDomains');
      hstsPreload = hstsHeader.includes('preload');

      if (hstsMaxAge && hstsMaxAge < 15552000) {
        scoreDeduction += 5;
        issues.push({
          id: 'sec-short-hsts',
          category: 'security',
          severity: 'warning',
          title: 'HSTS max-age is Too Short',
          description: `Current max-age is ${hstsMaxAge} seconds (recommended is 31536000 seconds / 1 year).`,
          impact: 'Short HSTS policies leave users susceptible to downgrade attacks and SSL stripping.',
          recommendation: 'Increase HSTS max-age to 31536000 for production domains.',
          targetFile: 'next.config.mjs',
          codeSnippet: `{\n  key: 'Strict-Transport-Security',\n  value: 'max-age=31536000; includeSubDomains; preload',\n}`,
        });
      }
    }
  }

  // 3. Content Security Policy (CSP)
  const cspHeader = headers['content-security-policy'] ?? null;
  if (!cspHeader) {
    scoreDeduction += 15;
    issues.push({
      id: 'sec-missing-csp',
      category: 'security',
      severity: 'warning',
      title: 'Missing Content Security Policy (CSP)',
      description: 'The `Content-Security-Policy` header is not present.',
      impact: 'Without CSP, the browser has no defense against Cross-Site Scripting (XSS) and rogue script injection.',
      recommendation: 'Define a robust Content Security Policy header.',
      targetFile: 'next.config.mjs',
      codeSnippet: `{\n  key: 'Content-Security-Policy',\n  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:;",\n}`,
    });
  }

  // 4. X-Frame-Options (Clickjacking defense)
  const xfoHeader = headers['x-frame-options'] ?? null;
  const hasCspFrameAncestors = cspHeader ? cspHeader.includes('frame-ancestors') : false;

  if (!xfoHeader && !hasCspFrameAncestors) {
    scoreDeduction += 10;
    issues.push({
      id: 'sec-missing-x-frame-options',
      category: 'security',
      severity: 'warning',
      title: 'Missing X-Frame-Options Header',
      description: 'Neither `X-Frame-Options` nor CSP `frame-ancestors` directive was detected.',
      impact: 'Malicious websites can embed your site in an `<iframe>` and trick users into clicking buttons (Clickjacking).',
      recommendation: 'Add `X-Frame-Options: DENY` or `SAMEORIGIN`.',
      targetFile: 'next.config.mjs',
      codeSnippet: `{\n  key: 'X-Frame-Options',\n  value: 'DENY',\n}`,
    });
  }

  // 5. X-Content-Type-Options (MIME sniffing defense)
  const xctoHeader = headers['x-content-type-options'] ?? null;
  const isNosniff = xctoHeader?.toLowerCase() === 'nosniff';

  if (!isNosniff) {
    scoreDeduction += 10;
    issues.push({
      id: 'sec-missing-nosniff',
      category: 'security',
      severity: 'warning',
      title: 'Missing X-Content-Type-Options: nosniff',
      description: 'The `X-Content-Type-Options: nosniff` header is missing.',
      impact: 'Browsers may attempt to sniff file MIME types, executing non-script assets (e.g. uploaded images) as JavaScript.',
      recommendation: 'Set `X-Content-Type-Options: nosniff`.',
      targetFile: 'next.config.mjs',
      codeSnippet: `{\n  key: 'X-Content-Type-Options',\n  value: 'nosniff',\n}`,
    });
  }

  // 6. Referrer-Policy
  const rpHeader = headers['referrer-policy'] ?? null;
  if (!rpHeader) {
    scoreDeduction += 5;
    issues.push({
      id: 'sec-missing-referrer-policy',
      category: 'security',
      severity: 'warning',
      title: 'Missing Referrer-Policy Header',
      description: 'No `Referrer-Policy` header was declared.',
      impact: 'Sensitive pathnames or query parameters in URLs may leak to external third parties when users click outbound links.',
      recommendation: 'Configure `Referrer-Policy: strict-origin-when-cross-origin`.',
      targetFile: 'next.config.mjs',
      codeSnippet: `{\n  key: 'Referrer-Policy',\n  value: 'strict-origin-when-cross-origin',\n}`,
    });
  }

  // 7. Permissions-Policy
  const ppHeader = headers['permissions-policy'] ?? null;
  if (!ppHeader) {
    scoreDeduction += 3;
    issues.push({
      id: 'sec-missing-permissions-policy',
      category: 'security',
      severity: 'warning',
      title: 'Missing Permissions-Policy Header',
      description: 'No `Permissions-Policy` header found.',
      impact: 'Third-party scripts may attempt unauthorized access to browser APIs (camera, microphone, geolocation).',
      recommendation: 'Add a Permissions-Policy header restricting sensitive hardware access.',
      targetFile: 'next.config.mjs',
      codeSnippet: `{\n  key: 'Permissions-Policy',\n  value: 'camera=(), microphone=(), geolocation=()',\n}`,
    });
  }

  // 8. Safe External Links (Reverse Tabnabbing Protection)
  let totalExternal = 0;
  let safeRelCount = 0;
  let unsafeCount = 0;
  const unsafeSamples: string[] = [];

  $('a[target="_blank"]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    if (!href || href.startsWith('/') || href.startsWith('#')) return;

    totalExternal++;
    const rel = ($(el).attr('rel') ?? '').toLowerCase();
    const isSafe = rel.includes('noopener') || rel.includes('noreferrer');

    if (isSafe) {
      safeRelCount++;
    } else {
      unsafeCount++;
      if (unsafeSamples.length < 5) unsafeSamples.push(href);
    }
  });

  if (unsafeCount > 0) {
    scoreDeduction += Math.min(15, unsafeCount * 5);
    issues.push({
      id: 'sec-unsafe-external-links',
      category: 'security',
      severity: 'warning',
      title: `${unsafeCount} Unsafe External Link(s) (target="_blank" without rel="noopener")`,
      description: `Detected ${unsafeCount} link(s) opening a new tab without \`rel="noopener"\` or \`rel="noreferrer"\`.`,
      impact: 'Vulnerable to "reverse tabnabbing": the opened page can access `window.opener.location` and redirect your users to a phishing replica.',
      recommendation: 'Always append `rel="noopener noreferrer"` to external links opening in `_blank`.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Append rel="noopener noreferrer" to external links -->\n<a href="https://example.com" target="_blank" rel="noopener noreferrer">\n  External Resource\n</a>`,
      evidence: { sampleUnsafeLinks: unsafeSamples },
    });
  }

  const finalScore = Math.max(0, 100 - scoreDeduction);

  const metrics: SecurityMetrics = {
    protocol: isHttps ? 'https' : 'http',
    isHttps,
    headers: {
      contentSecurityPolicy: { present: Boolean(cspHeader), value: cspHeader },
      strictTransportSecurity: {
        present: Boolean(hstsHeader),
        value: hstsHeader,
        maxAge: hstsMaxAge,
        includeSubDomains: hstsIncludesSubDomains,
        preload: hstsPreload,
      },
      xFrameOptions: { present: Boolean(xfoHeader), value: xfoHeader },
      xContentTypeOptions: { present: Boolean(xctoHeader), value: xctoHeader, isNosniff },
      referrerPolicy: { present: Boolean(rpHeader), value: rpHeader },
      permissionsPolicy: { present: Boolean(ppHeader), value: ppHeader },
    },
    externalLinks: {
      totalExternal,
      safeRelCount,
      unsafeCount,
      unsafeSamples,
    },
  };

  return {
    score: finalScore,
    metrics,
    issues,
  };
}
