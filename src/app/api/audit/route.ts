import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { runComprehensiveAudit, validateUrlSafety } from '@/lib/audit';
import { mapComprehensiveToAuditResult } from '@/lib/audit/mapper';
import type { ProblemDetails } from '@/types/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function createProblemResponse(
  status: number,
  title: string,
  detail: string,
  instance: string,
  requestId: string,
  invalidParams?: Array<{ name: string; reason: string }>
): NextResponse<ProblemDetails> {
  const problem: ProblemDetails = {
    type: `https://errors.seoopt.dev/${title.toLowerCase().replace(/\s+/g, '-')}`,
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

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const instanceUrl = req.nextUrl.pathname;

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

  // Validate URL syntax
  let parsedUrl: URL;
  try {
    const candidate = url.trim().startsWith('http://') || url.trim().startsWith('https://')
      ? url.trim()
      : `https://${url.trim()}`;
    parsedUrl = new URL(candidate);
  } catch {
    return createProblemResponse(
      400,
      'Invalid URL Format',
      `"${url}" could not be parsed as a valid URL.`,
      instanceUrl,
      requestId,
      [{ name: 'url', reason: 'Must be a valid web address, e.g., https://example.com' }]
    );
  }

  // SSRF and private IP protection
  const safetyCheck = validateUrlSafety(parsedUrl.toString());
  if (!safetyCheck.valid) {
    return createProblemResponse(
      422,
      'Disallowed Target Host',
      safetyCheck.error ?? 'Auditing this target is disallowed for security.',
      instanceUrl,
      requestId,
      [{ name: 'url', reason: safetyCheck.error ?? 'Forbidden IP/host' }]
    );
  }

  try {
    const auditResult = await runComprehensiveAudit(parsedUrl.toString(), {
      timeoutMs: 15_000,
    });
    const frontendAudit = mapComprehensiveToAuditResult(auditResult);

    return NextResponse.json({ ...frontendAudit, comprehensive: auditResult }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Request-Id': requestId,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err) {
    const error = err as Error;

    console.error('Audit Error:', error);
    // Timeout failure
    if (error.message.includes('timeout') || error.name === 'AbortError') {
      return createProblemResponse(
        504,
        'Target Gateway Timeout',
        `The target server at "${parsedUrl.origin}" did not respond within the 15-second timeout window.`,
        instanceUrl,
        requestId
      );
    }

    // Network / DNS unreachable failure
    if (
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('fetch failed')
    ) {
      return createProblemResponse(
        502,
        'Bad Gateway / Host Unreachable',
        `Could not establish a network connection to "${parsedUrl.host}". Verify that the domain exists and is publicly accessible.`,
        instanceUrl,
        requestId
      );
    }

    // Generic internal error
    return createProblemResponse(
      500,
      'Audit Engine Internal Error',
      'An unexpected error occurred while analyzing the target URL. Reference the requestId for logs.',
      instanceUrl,
      requestId
    );
  }
}
