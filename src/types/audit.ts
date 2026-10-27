export type IssueSeverity = 'critical' | 'warning' | 'passed';
export type AuditSeverity = 'critical' | 'warning' | 'info' | 'good' | 'passed';

export type AuditCategory = 'seo' | 'geo' | 'performance' | 'accessibility' | 'security';
export type AuditGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface AuditIssue {
  id: string;
  category: AuditCategory;
  severity: IssueSeverity | 'info' | 'good';
  title?: string;
  description?: string;
  impact?: string;
  recommendation?: string;
  titleEn?: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  impactEn?: string;
  impactAr?: string;
  fixRecommendationEn?: string;
  fixRecommendationAr?: string;
  targetFile?: string;
  codeSnippet?: string;
  learnMoreUrl?: string;
  evidence?: string | number | boolean | Record<string, unknown> | null;
}

export interface CategoryResult<TMetrics> {
  score: number; // 0 - 100
  metrics: TMetrics;
  issues: AuditIssue[];
}

// -----------------------------------------------------------------------------
// SEO Types
// -----------------------------------------------------------------------------
export interface SeoMetrics {
  title: {
    value: string | null;
    length: number;
    status: 'optimal' | 'too-short' | 'too-long' | 'missing';
  };
  description: {
    value: string | null;
    length: number;
    status: 'optimal' | 'too-short' | 'too-long' | 'missing';
  };
  canonical: {
    value: string | null;
    isSelfReferencing: boolean;
    isValid: boolean;
  };
  robotsMeta: {
    indexable: boolean;
    followable: boolean;
    raw: string | null;
    directives: string[];
  };
  headings: {
    h1: string[];
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
    hasSingleH1: boolean;
    hierarchyValid: boolean;
    missingLevels: string[];
  };
  openGraph: {
    title: string | null;
    description: string | null;
    image: string | null;
    url: string | null;
    type: string | null;
    siteName: string | null;
    isComplete: boolean;
  };
  twitterCard: {
    card: string | null;
    site: string | null;
    creator: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
    isComplete: boolean;
  };
  images: {
    total: number;
    withAlt: number;
    missingAlt: number;
    emptyAlt: number;
    sampleMissingAlt: string[];
  };
  links: {
    internalCount: number;
    externalCount: number;
    brokenSchemeCount: number;
    nofollowCount: number;
  };
  sitemap: {
    discovered: boolean;
    url: string | null;
    status: number | null;
  };
  robotsTxt: {
    exists: boolean;
    url: string;
    hasSitemapRef: boolean;
    contentSample: string | null;
  };
}

// -----------------------------------------------------------------------------
// GEO (Generative Engine Optimization) Types
// -----------------------------------------------------------------------------
export type AiBotPermission = 'allowed' | 'disallowed' | 'partially-disallowed' | 'unspecified';

export interface GeoMetrics {
  llmsTxt: {
    exists: boolean;
    url: string;
    fullExists: boolean;
    fullUrl: string;
    length: number;
    hasContent: boolean;
  };
  aiBotPermissions: {
    bots: {
      GPTBot: AiBotPermission;
      ClaudeBot: AiBotPermission;
      PerplexityBot: AiBotPermission;
      CCBot: AiBotPermission;
      'Google-Extended': AiBotPermission;
      Cohere: AiBotPermission;
      ByteSpider: AiBotPermission;
    };
    totalAiBotsAllowed: number;
    totalAiBotsBlocked: number;
  };
  jsonLd: {
    hasJsonLd: boolean;
    rawCount: number;
    schemaTypes: string[];
    parsedSchemas: Array<{
      type: string;
      raw: Record<string, unknown>;
      valid: boolean;
      errors?: string[];
    }>;
    hasOrganization: boolean;
    hasWebsite: boolean;
    hasFaqPage: boolean;
    hasArticleOrBlog: boolean;
    hasBreadcrumb: boolean;
    hasProduct: boolean;
    hasAuthorOrPerson: boolean;
  };
  contentDensity: {
    totalWords: number;
    readingTimeMinutes: number;
    paragraphCount: number;
    avgSentenceLengthWords: number;
    directAnswerPassages: number;
    informationDensityScore: number;
    textToHtmlRatio: number;
  };
  eeatSignals: {
    authorDetected: boolean;
    authorName: string | null;
    hasAboutPageLink: boolean;
    hasContactPageLink: boolean;
    hasPrivacyPolicyLink: boolean;
    hasTermsLink: boolean;
    publishedDate: string | null;
    modifiedDate: string | null;
    citationCount: number;
    score: number;
  };
  semanticHeadingsAndEntities: {
    semanticTagCount: number;
    usesSemanticStructure: boolean;
    detectedKeyTopics: string[];
  };
}

// -----------------------------------------------------------------------------
// Performance Types
// -----------------------------------------------------------------------------
export interface PerformanceMetrics {
  ttfbMs: number;
  totalPageWeightBytes: number;
  htmlSizeBytes: number;
  compression: {
    enabled: boolean;
    encoding: string;
  };
  domStats: {
    totalElements: number;
    maxDepth: number;
    isDomBloated: boolean;
  };
  renderBlocking: {
    scriptsInHead: number;
    blockingScripts: Array<{
      src: string | null;
      isAsyncOrDefer: boolean;
    }>;
    stylesInHead: number;
  };
  imageOptimization: {
    totalImages: number;
    modernFormatsCount: number;
    legacyFormatsCount: number;
    unoptimizedSample: string[];
  };
}

// -----------------------------------------------------------------------------
// Accessibility Types
// -----------------------------------------------------------------------------
export interface AccessibilityMetrics {
  htmlLang: {
    present: boolean;
    value: string | null;
    isValidFormat: boolean;
  };
  headingSequence: {
    valid: boolean;
    skips: string[];
  };
  imageAlts: {
    missingCount: number;
    decorativeCount: number;
    validCount: number;
  };
  formControls: {
    totalInputs: number;
    labeledInputs: number;
    unlabeledInputs: number;
    sampleUnlabeled: string[];
  };
  buttons: {
    totalButtons: number;
    withAriaOrText: number;
    emptyButtons: number;
  };
  viewportZoom: {
    scalable: boolean;
    maximumScaleRestricted: boolean;
  };
  landmarks: {
    hasMain: boolean;
    hasNav: boolean;
    hasHeader: boolean;
    hasFooter: boolean;
    missingLandmarks: string[];
  };
}

// -----------------------------------------------------------------------------
// Security Types
// -----------------------------------------------------------------------------
export interface SecurityMetrics {
  protocol: 'https' | 'http';
  isHttps: boolean;
  headers: {
    contentSecurityPolicy: { present: boolean; value: string | null };
    strictTransportSecurity: {
      present: boolean;
      value: string | null;
      maxAge: number | null;
      includeSubDomains: boolean;
      preload: boolean;
    };
    xFrameOptions: { present: boolean; value: string | null };
    xContentTypeOptions: { present: boolean; value: string | null; isNosniff: boolean };
    referrerPolicy: { present: boolean; value: string | null };
    permissionsPolicy: { present: boolean; value: string | null };
  };
  externalLinks: {
    totalExternal: number;
    safeRelCount: number;
    unsafeCount: number;
    unsafeSamples: string[];
  };
}

// -----------------------------------------------------------------------------
// Master Prompt & Overall Audit Result
// -----------------------------------------------------------------------------
export interface RepairPromptResult {
  markdown: string;
  targetFiles: string[];
  fixesSummary: Array<{
    category: AuditCategory;
    targetFile: string;
    action: string;
  }>;
}

export interface ComprehensiveAuditResult {
  targetUrl: string;
  finalUrl: string;
  canonicalUrl: string | null;
  overallScore: number;
  grade: AuditGrade;
  summary: {
    totalIssues: number;
    criticalCount: number;
    warningCount: number;
    passedCount: number;
    executionTimeMs: number;
    timestamp: string;
  };
  categories: {
    seo: CategoryResult<SeoMetrics>;
    geo: CategoryResult<GeoMetrics>;
    performance: CategoryResult<PerformanceMetrics>;
    accessibility: CategoryResult<AccessibilityMetrics>;
    security: CategoryResult<SecurityMetrics>;
  };
  repairPrompt: RepairPromptResult;
}

// -----------------------------------------------------------------------------
// Problem Details (RFC 9457)
// -----------------------------------------------------------------------------
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  requestId?: string;
  invalidParams?: Array<{
    name: string;
    reason: string;
  }>;
}

// -----------------------------------------------------------------------------
// Frontend Specific Types
// -----------------------------------------------------------------------------
export interface CategoryScore {
  score: number;
  labelEn: string;
  labelAr: string;
  passedCount: number;
  warningCount: number;
  criticalCount: number;
}

export interface AiBotStatus {
  bot: string;
  operator: string;
  allowed: boolean;
  directive: string;
}

export interface GeoAuditDetails {
  llmsTxtDetected: boolean;
  llmsTxtUrl?: string;
  llmsFullTxtDetected: boolean;
  aiBots: AiBotStatus[];
  jsonLdSchemas: string[];
  citationReadinessScore: number;
  markdownClarityScore: number;
  factualDensityScore: number;
}

export interface AuditMetrics {
  loadTimeMs: number;
  fcpMs: number;
  lcpMs: number;
  clsScore: number;
  domNodes: number;
  pageSizeKb: number;
  ttfbMs: number;
}

export interface AuditResult {
  url: string;
  domain: string;
  timestamp: string;
  overallScore: number;
  verdictEn: string;
  verdictAr: string;
  categories: Record<AuditCategory, CategoryScore>;
  geoDetails: GeoAuditDetails;
  issues: AuditIssue[];
  metrics: AuditMetrics;
}

export type SupportedLang = 'ar' | 'en';
