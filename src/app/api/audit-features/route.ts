// ============================================================================
// 1. IMPORTS
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { fetchAuditContext, validateUrlSafety } from '@/lib/audit/fetcher';
import { runFeaturesAudit } from '@/lib/audit/features-engine';
import type { ProblemDetails } from '@/types/audit';
import type { FeaturesAuditResult } from '@/types/features';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FEATURES_API_CONFIG = {
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
    type: `${FEATURES_API_CONFIG.errorTypePrefix}${slug}`,
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
export async function POST(
  req: NextRequest
): Promise<NextResponse<FeaturesAuditResult | ProblemDetails>> {
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

  // 6. Execute Deep Website Feature Audit
  try {
    const fetchedContext = await fetchAuditContext(parsedUrl.toString(), {
      timeoutMs: FEATURES_API_CONFIG.timeoutMs,
    });

    const result = runFeaturesAudit(fetchedContext);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': requestId,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'An unexpected engine error occurred.';

    return createProblemResponse(
      502,
      'Target Fetch Failed',
      `Could not retrieve or analyze target URL: ${errorMessage}`,
      instanceUrl,
      requestId
    );
  }
}
