// ============================================================================
// 1. TYPES & INTERFACES: FEATURE RECOMMENDATIONS ENGINE
// ============================================================================

export type FeaturePillar =
  | 'growth'         // Conversion & Growth Loops
  | 'ai'             // AI & Automation
  | 'ux'             // UX, Speed & Retention
  | 'enterprise'     // Architecture, Security & Scale
  | 'seo_content';   // Organic Reach & Programmatic Content

export type FeaturePriority = 'critical' | 'high' | 'medium';

export type FeatureDifficulty = 'quick-win' | 'medium' | 'advanced';

export type SiteArchetype =
  | 'saas'
  | 'ecommerce'
  | 'devtools'
  | 'agency_b2b'
  | 'edtech'
  | 'publishing'
  | 'fintech'
  | 'general_web';

export interface DetectedCapability {
  id: string;
  nameAr: string;
  nameEn: string;
  status: 'present' | 'partial' | 'missing';
  evidence: string;
}

export interface ProposedFeature {
  id: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  pillar: FeaturePillar;
  priority: FeaturePriority;
  difficulty: FeatureDifficulty;
  impactMetricAr: string;
  impactMetricEn: string;
  rationaleAr: string;
  rationaleEn: string;
  architecturePlanAr: string;
  architecturePlanEn: string;
  techStack: string[];
  keySteps: string[];
  aiImplementationPrompt: string;
}

export interface FeaturesAuditMetrics {
  siteArchetype: SiteArchetype;
  archetypeLabelAr: string;
  archetypeLabelEn: string;
  totalInternalLinksFound: number;
  discoveredKeyPages: {
    hasPricing: boolean;
    hasAuthOrPortal: boolean;
    hasBlogOrArticles: boolean;
    hasDocsOrHelp: boolean;
    hasContactOrBooking: boolean;
    hasSearchEngine: boolean;
    hasCheckoutOrCart: boolean;
  };
  detectedTechnologies: string[];
  featureMaturityScore: number; // 0-100
  presentCapabilitiesCount: number;
  missingOpportunitiesCount: number;
}

export interface FeaturesAuditResult {
  url: string;
  domain: string;
  timestamp: string;
  metrics: FeaturesAuditMetrics;
  capabilitiesInventory: DetectedCapability[];
  proposedFeatures: ProposedFeature[];
  masterAiPrompt: string;
}
