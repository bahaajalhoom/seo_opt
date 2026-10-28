// ============================================================================
// 1. IMPORTS
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { fetchAuditContext, validateUrlSafety } from '@/lib/audit/fetcher';
import { runUiUxAudit } from '@/lib/audit/uiux-engine';
import type { ProblemDetails } from '@/types/audit';
import type { UiUxAuditResult } from '@/types/uiux';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UIUX_API_CONFIG = {
  timeoutMs: 15_000,
  errorTypePrefix: 'https://errors.crawlix.dev/',
} as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface InvalidParam {
  name: string;
  reason: string;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
/**
 * Factory for RFC 9457 compliant problem responses with structured telemetry.
 */
function createProblemResponse(
  status: number,
  title: string,
  detail: string,
  instance: string,
  requestId: string,
  invalidParams?: InvalidParam[]
): NextResponse<ProblemDetails> {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const problem: ProblemDetails = {
    type: `${UIUX_API_CONFIG.errorTypePrefix}${slug}`,
    title,
    status,
    detail,
    instance,
    requestId,
    invalidParams,
  };

  return NextResponse.json(problem, {
    status,
    headers: {
      'Content-Type': 'application/problem+json',
      'X-Request-Id': requestId,
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

/**
 * Normalizes input URL string into a valid absolute URL instance.
 */
function parseTargetUrlCandidate(inputUrl: string): URL | null {
  const trimmed = inputUrl.trim();
  const candidate =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    return parsed.hostname && parsed.hostname.includes('.') ? parsed : null;
  } catch {
    return null;
  }
}

// ============================================================================
// 5. POST ROUTE HANDLER
// ============================================================================
export async function POST(req: NextRequest): Promise<NextResponse<UiUxAuditResult | ProblemDetails>> {
  const requestId = crypto.randomUUID();
  const instanceUrl = req.nextUrl.pathname;

  // 1. Parse JSON body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return createProblemResponse(
      400,
      'Invalid JSON Payload',
      'Request body must be a valid JSON object.',
      instanceUrl,
      requestId
    );
  }

  // 2. Validate object shape
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return createProblemResponse(
      400,
      'Malformed Body',
      'Request body must be a JSON object containing a "url" property.',
      instanceUrl,
      requestId
    );
  }

  const { url } = body as { url?: unknown };

  // 3. Validate url presence
  if (typeof url !== 'string' || !url.trim()) {
    return createProblemResponse(
      400,
      'Missing Required Parameter',
      'The "url" field is required and must be a non-empty string.',
      instanceUrl,
      requestId,
      [{ name: 'url', reason: 'Field is required' }]
    );
  }

  // 4. Validate URL syntax
  const parsedUrl = parseTargetUrlCandidate(url);
  if (!parsedUrl) {
    return createProblemResponse(
      400,
      'Invalid URL Format',
      `"${url}" could not be parsed as a valid web address.`,
      instanceUrl,
      requestId,
      [{ name: 'url', reason: 'Must be a valid web address, e.g., https://example.com' }]
    );
  }

  // 5. Enforce SSRF & Private Network Guards
  const safetyCheck = validateUrlSafety(parsedUrl.toString());
  if (!safetyCheck.valid) {
    return createProblemResponse(
      422,
      'Disallowed Target Host',
      safetyCheck.error ?? 'Auditing this target host is disallowed for network security.',
      instanceUrl,
      requestId,
      [{ name: 'url', reason: safetyCheck.error ?? 'Forbidden IP/host' }]
    );
  }

  // 6. Execute UI/UX Audit
  try {
    const fetchedContext = await fetchAuditContext(parsedUrl.toString(), {
      timeoutMs: UIUX_API_CONFIG.timeoutMs,
    });

    const uiuxResult = runUiUxAudit(fetchedContext);

    return NextResponse.json(uiuxResult, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Request-Id': requestId,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err) {
    const error = err as Error;

    // Timeout failure
    if (error.message?.includes('timeout') || error.name === 'AbortError') {
      return createProblemResponse(
        504,
        'Target Gateway Timeout',
        `The target server at "${parsedUrl.origin}" did not respond within the ${
          UIUX_API_CONFIG.timeoutMs / 1000
        }-second window.`,
        instanceUrl,
        requestId
      );
    }

    // Network / DNS unreachable failure
    if (
      error.message?.includes('ENOTFOUND') ||
      error.message?.includes('ECONNREFUSED') ||
      error.message?.includes('fetch failed')
    ) {
      return createProblemResponse(
        502,
        'Bad Gateway / Host Unreachable',
        `Could not establish a network connection to "${parsedUrl.host}". Verify that the domain exists and is publicly accessible.`,
        instanceUrl,
        requestId
      );
    }

    // Generic internal fallback error
    return createProblemResponse(
      500,
      'Audit Engine Internal Error',
      'An unexpected error occurred while analyzing the target URL. Reference the requestId for server logs.',
      instanceUrl,
      requestId
    );
  }
}

// ============================================================================
// 6. HUMAN EDIT GUIDE & MAINTENANCE NOTES
// ============================================================================
/**
 * HOW TO MAINTAIN THIS ENDPOINT:
 *
 * 1. Adjust Timeout:
 *    Modify UIUX_API_CONFIG.timeoutMs in Zone 2 if scraping heavier client SPAs.
 *
 * 2. Add New Prescriptions:
 *    Modify src/lib/audit/uiux-engine.ts. No changes needed in this route handler
 *    as it seamlessly passes the resulting UiUxAuditResult contract.
 */
