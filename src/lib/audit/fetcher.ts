import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';

export interface FetchedAuditContext {
  targetUrl: string;
  finalUrl: string;
  origin: string;
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  html: string;
  $: CheerioAPI;
  ttfbMs: number;
  downloadTimeMs: number;
  htmlSizeBytes: number;
  compression: {
    enabled: boolean;
    encoding: string;
  };
  robotsTxt: {
    exists: boolean;
    url: string;
    content: string | null;
    sitemaps: string[];
  };
  sitemap: {
    discovered: boolean;
    url: string | null;
    statusCode: number | null;
    isXml: boolean;
  };
  llmsTxt: {
    exists: boolean;
    url: string;
    content: string | null;
  };
  llmsFullTxt: {
    exists: boolean;
    url: string;
    content: string | null;
  };
}

export interface FetcherOptions {
  timeoutMs?: number;
  userAgent?: string;
}

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 (compatible; SEOOptAuditBot/1.0; +https://seoopt.dev/bot)';

/**
 * Validates against SSRF (Server-Side Request Forgery) attacks.
 * Blocks private IP ranges, loopback addresses, link-local, and cloud metadata endpoints.
 */
export function validateUrlSafety(inputUrl: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(inputUrl);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Protocol must be http: or https:' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check loopback / localhost
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0'
    ) {
      return { valid: false, error: 'Access to loopback/local hosts is prohibited.' };
    }

    // Check IPv4 private and link-local ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    if (match) {
      const octet1 = Number(match[1]);
      const octet2 = Number(match[2]);

      // 10.0.0.0/8
      if (octet1 === 10) return { valid: false, error: 'Access to private 10.0.0.0/8 network is prohibited.' };
      // 172.16.0.0/12 (172.16.0.0 to 172.31.255.255)
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
        return { valid: false, error: 'Access to private 172.16.0.0/12 network is prohibited.' };
      }
      // 192.168.0.0/16
      if (octet1 === 192 && octet2 === 168) {
        return { valid: false, error: 'Access to private 192.168.0.0/16 network is prohibited.' };
      }
      // 169.254.0.0/16 (AWS / Cloud Metadata)
      if (octet1 === 169 && octet2 === 254) {
        return { valid: false, error: 'Access to cloud metadata IP 169.254.x.x is prohibited.' };
      }
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: (err as Error).message };
  }
}

/**
 * Fetches the root HTML page and concurrently discovers robots.txt, sitemap.xml, llms.txt, llms-full.txt
 */
export async function fetchAuditContext(
  targetUrl: string,
  options: FetcherOptions = {}
): Promise<FetchedAuditContext> {
  const timeoutMs = options.timeoutMs ?? 15_000;
  const userAgent = options.userAgent ?? DEFAULT_USER_AGENT;

  const safety = validateUrlSafety(targetUrl);
  if (!safety.valid) {
    throw new Error(`SSRF Security Validation Failed: ${safety.error}`);
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  const startTtfb = performance.now();
  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
      },
      signal: abortController.signal,
      redirect: 'follow',
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if ((err as Error).name === 'AbortError') {
      throw new Error(`Network timeout: request exceeded ${timeoutMs}ms deadline.`);
    }
    throw err;
  }

  const ttfbMs = Math.round(performance.now() - startTtfb);

  const finalUrl = response.url || targetUrl;
  const parsedFinalUrl = new URL(finalUrl);
  const origin = parsedFinalUrl.origin;

  const rawHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    rawHeaders[key.toLowerCase()] = value;
  });

  const contentEncoding = rawHeaders['content-encoding'] ?? 'none';
  const isCompressed = ['gzip', 'br', 'deflate', 'zstd'].includes(contentEncoding.toLowerCase());

  const startDownload = performance.now();
  const htmlBuffer = await response.arrayBuffer();
  const downloadTimeMs = Math.round(performance.now() - startDownload);
  const htmlSizeBytes = htmlBuffer.byteLength;

  clearTimeout(timeoutId);

  const decoder = new TextDecoder('utf-8', { fatal: false });
  const html = decoder.decode(htmlBuffer);

  // Initialize Cheerio
  const $ = cheerio.load(html, {
    xml: false,
  });

  // Concurrently discover robots.txt, sitemaps, and llms.txt with individual short timeouts
  const [robotsResult, defaultSitemapResult, llmsResult, llmsFullResult] = await Promise.allSettled([
    fetchTextResource(`${origin}/robots.txt`, userAgent, 5_000),
    fetchTextResource(`${origin}/sitemap.xml`, userAgent, 5_000),
    fetchTextResource(`${origin}/llms.txt`, userAgent, 5_000),
    fetchTextResource(`${origin}/llms-full.txt`, userAgent, 5_000),
  ]);

  // Parse robots.txt
  const robotsTxtExists = robotsResult.status === 'fulfilled' && robotsResult.value.status === 200;
  const robotsTxtContent = robotsTxtExists ? robotsResult.value.content : null;

  const discoveredSitemaps: string[] = [];
  if (robotsTxtContent) {
    const sitemapLines = robotsTxtContent.match(/^Sitemap:\s*(.+)$/gim) ?? [];
    for (const line of sitemapLines) {
      const match = line.replace(/^Sitemap:\s*/i, '').trim();
      if (match.startsWith('http')) {
        discoveredSitemaps.push(match);
      }
    }
  }

  // Parse sitemap
  let sitemapDiscovered = false;
  let sitemapUrl: string | null = null;
  let sitemapStatus: number | null = null;
  let sitemapIsXml = false;

  if (defaultSitemapResult.status === 'fulfilled' && defaultSitemapResult.value.status === 200) {
    sitemapDiscovered = true;
    sitemapUrl = `${origin}/sitemap.xml`;
    sitemapStatus = 200;
    sitemapIsXml = (defaultSitemapResult.value.contentType ?? '').includes('xml');
  } else if (discoveredSitemaps.length > 0) {
    sitemapDiscovered = true;
    sitemapUrl = discoveredSitemaps[0] ?? null;
    sitemapStatus = 200; // Found via robots.txt declaration
    sitemapIsXml = true;
  }

  // Parse llms.txt & llms-full.txt
  const llmsExists = llmsResult.status === 'fulfilled' && llmsResult.value.status === 200;
  const llmsFullExists = llmsFullResult.status === 'fulfilled' && llmsFullResult.value.status === 200;

  return {
    targetUrl,
    finalUrl,
    origin,
    statusCode: response.status,
    statusText: response.statusText,
    headers: rawHeaders,
    html,
    $,
    ttfbMs,
    downloadTimeMs,
    htmlSizeBytes,
    compression: {
      enabled: isCompressed,
      encoding: contentEncoding,
    },
    robotsTxt: {
      exists: robotsTxtExists,
      url: `${origin}/robots.txt`,
      content: robotsTxtContent,
      sitemaps: discoveredSitemaps,
    },
    sitemap: {
      discovered: sitemapDiscovered,
      url: sitemapUrl,
      statusCode: sitemapStatus,
      isXml: sitemapIsXml,
    },
    llmsTxt: {
      exists: llmsExists,
      url: `${origin}/llms.txt`,
      content: llmsExists ? llmsResult.value.content : null,
    },
    llmsFullTxt: {
      exists: llmsFullExists,
      url: `${origin}/llms-full.txt`,
      content: llmsFullExists ? llmsFullResult.value.content : null,
    },
  };
}

async function fetchTextResource(
  url: string,
  userAgent: string,
  timeoutMs: number
): Promise<{ status: number; content: string | null; contentType: string | null }> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/markdown,text/plain,application/xml,text/xml,*/*',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status === 200) {
      const text = await res.text();
      return {
        status: 200,
        content: text,
        contentType: res.headers.get('content-type'),
      };
    }
    return { status: res.status, content: null, contentType: res.headers.get('content-type') };
  } catch {
    return { status: 0, content: null, contentType: null };
  }
}
