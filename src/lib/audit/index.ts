import { fetchAuditContext, validateUrlSafety } from './fetcher';
import { runSeoAudit } from './seo-engine';
import { runGeoAudit } from './geo-engine';
import { runPerformanceAudit } from './performance-engine';
import { runAccessibilityAudit } from './accessibility-engine';
import { runSecurityAudit } from './security-engine';
import { runUiUxAudit, extractDomColors } from './uiux-engine';
import { generateMasterAiPrompt } from './prompt-generator';
import type { ComprehensiveAuditResult, AuditGrade } from '../../types/audit';

export interface AuditOptions {
  timeoutMs?: number;
  userAgent?: string;
}

/**
 * Normalizes input URL ensuring protocol and validity.
 */
export function normalizeUrl(rawUrl: string): string {
  let trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  const parsed = new URL(trimmed);
  return parsed.toString();
}

/**
 * Calculates letter grade from 0-100 score.
 */
export function computeGrade(score: number): AuditGrade {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Executes the complete audit pipeline across SEO, GEO, Performance, A11y, and Security.
 */
export async function runComprehensiveAudit(
  rawUrl: string,
  options: AuditOptions = {}
): Promise<ComprehensiveAuditResult> {
  const startTime = performance.now();
  const normalizedUrl = normalizeUrl(rawUrl);

  const safety = validateUrlSafety(normalizedUrl);
  if (!safety.valid) {
    throw new Error(`SSRF Validation Failed: ${safety.error}`);
  }

  // 1. Fetch main page and discover robots.txt, sitemaps, llms.txt in parallel
  const context = await fetchAuditContext(normalizedUrl, options);

  // 2. Execute all 5 audit engines concurrently
  const [seoResult, geoResult, perfResult, a11yResult, secResult] = await Promise.all([
    Promise.resolve(runSeoAudit(context)),
    Promise.resolve(runGeoAudit(context)),
    Promise.resolve(runPerformanceAudit(context)),
    Promise.resolve(runAccessibilityAudit(context)),
    Promise.resolve(runSecurityAudit(context)),
  ]);

  // 3. Compute weighted overall score
  // Weights: SEO 25%, GEO 25%, Performance 20%, Accessibility 15%, Security 15%
  const weightedScore = Math.round(
    seoResult.score * 0.25 +
    geoResult.score * 0.25 +
    perfResult.score * 0.20 +
    a11yResult.score * 0.15 +
    secResult.score * 0.15
  );

  const overallScore = Math.min(100, Math.max(0, weightedScore));
  const grade = computeGrade(overallScore);

  // 4. Issue counters
  const allIssues = [
    ...seoResult.issues,
    ...geoResult.issues,
    ...perfResult.issues,
    ...a11yResult.issues,
    ...secResult.issues,
  ];

  const criticalCount = allIssues.filter((i) => i.severity === 'critical').length;
  const warningCount = allIssues.filter((i) => i.severity === 'warning').length;
  const passedCount = allIssues.filter((i) => i.severity === 'good' || i.severity === 'passed').length;

  const executionTimeMs = Math.round(performance.now() - startTime);
  const extractedColors = extractDomColors(context.html || '');

  const baseResult: Omit<ComprehensiveAuditResult, 'repairPrompt'> = {
    targetUrl: normalizedUrl,
    finalUrl: context.finalUrl,
    canonicalUrl: seoResult.metrics.canonical.value,
    overallScore,
    grade,
    extractedColors,
    summary: {
      totalIssues: allIssues.length,
      criticalCount,
      warningCount,
      passedCount,
      executionTimeMs,
      timestamp: new Date().toISOString(),
    },
    categories: {
      seo: seoResult,
      geo: geoResult,
      performance: perfResult,
      accessibility: a11yResult,
      security: secResult,
    },
  };

  // 5. Generate Master AI Repair Prompt
  const repairPrompt = generateMasterAiPrompt(baseResult as ComprehensiveAuditResult);

  return {
    ...baseResult,
    repairPrompt,
  };
}

export * from '../../types/audit';
export * from './fetcher';
export * from './seo-engine';
export * from './geo-engine';
export * from './performance-engine';
export * from './accessibility-engine';
export * from './security-engine';
export * from './prompt-generator';
