'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import {
  Sparkles,
  Search,
  Bot,
  Zap,
  AlertOctagon,
  ArrowRight,
  RotateCw,
} from 'lucide-react';
import { AuditResult, AuditCategory, SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';
import { AuditHeader } from '@/components/AuditHeader';
import { UrlInputBar } from '@/components/UrlInputBar';
import { ScoreBento } from '@/components/ScoreBento';
import { GeoDeepDive } from '@/components/GeoDeepDive';
import { IssuesList } from '@/components/IssuesList';
import { MasterPromptModal } from '@/components/MasterPromptModal';
import { AuditSkeleton } from '@/components/AuditSkeleton';
import { AuditFooter } from '@/components/AuditFooter';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Edit endpoints, retry fallback domain, and visual features here.
const PAGE_CONFIG = {
  apiEndpoint: '/api/audit',
  defaultRetryDomain: 'https://github.com',
  features: [
    {
      id: 'seo',
      icon: Search,
      titleKey: 'featureSeoTitle' as const,
      descKey: 'featureSeoDesc' as const,
      highlight: false,
    },
    {
      id: 'geo',
      icon: Bot,
      titleKey: 'featureGeoTitle' as const,
      descKey: 'featureGeoDesc' as const,
      highlight: true,
    },
    {
      id: 'speed',
      icon: Zap,
      titleKey: 'featureSpeedTitle' as const,
      descKey: 'featureSpeedDesc' as const,
      highlight: false,
    },
    {
      id: 'fix',
      icon: Sparkles,
      titleKey: 'featureFixTitle' as const,
      descKey: 'featureFixDesc' as const,
      highlight: false,
    },
  ],
} as const;

const PAGE_STYLES = {
  pageContainer:
    'min-h-screen flex flex-col bg-[#06070A] text-zinc-100 bg-grid-precision selection:bg-emerald-500/20 selection:text-emerald-300',
  mainContent: 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8',
} as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface ErrorBannerProps {
  message: string;
  retryText: string;
  errorTitle: string;
  onRetry: () => void;
}

interface MasterPromptBannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onOpen: () => void;
}

interface EmptyHeroProps {
  lang: SupportedLang;
  title: string;
  subtitle: string;
  t: (typeof translations)[SupportedLang];
}

// ============================================================================
// 4. HELPER FUNCTIONS & DATA LOGIC
// ============================================================================
/**
 * Executes the live audit request to the backend with error message localization.
 */
async function fetchAuditData(
  targetUrl: string,
  lang: SupportedLang
): Promise<{ success: true; data: AuditResult } | { success: false; error: string }> {
  try {
    const response = await fetch(PAGE_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      const fallbackMsg =
        lang === 'ar'
          ? 'تعذر الوصول إلى الموقع المستهدف: النطاق غير موجود أو السيرفر لا يستجيب.'
          : 'Target domain unreachable: The domain does not exist or server did not respond.';
      return { success: false, error: data.detail || fallbackMsg };
    }

    return { success: true, data };
  } catch {
    const networkMsg =
      lang === 'ar'
        ? 'خطأ في الاتصال: تعذر إرسال الطلب إلى خادم الفحص أو انقطع الاتصال.'
        : 'Network error: Failed to reach audit server.';
    return { success: false, error: networkMsg };
  }
}

/**
 * Downloads the current audit findings as a clean timestamped JSON payload.
 */
function downloadAuditReportFile(audit: AuditResult): void {
  const jsonContent = JSON.stringify(audit, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const dateStamp = new Date().toISOString().split('T')[0];

  anchor.href = objectUrl;
  anchor.download = `CRAWLIX-Audit-Report-${audit.domain}-${dateStamp}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function ErrorStateBanner({ message, retryText, errorTitle, onRetry }: ErrorBannerProps) {
  return (
    <div className="surface-hud rounded-2xl p-6 border border-rose-500/30 bg-rose-500/[0.04] space-y-3 animate-in fade-in duration-200">
      <div className="flex items-center gap-2.5 text-rose-400">
        <AlertOctagon className="size-5 shrink-0" />
        <h3 className="text-sm font-bold font-mono tracking-wide">{errorTitle}</h3>
      </div>
      <p className="text-xs font-mono text-rose-200/90 leading-relaxed ps-7">{message}</p>
      <div className="ps-7 pt-1">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono transition-colors"
        >
          <RotateCw className="size-3.5" />
          <span>{retryText}</span>
        </button>
      </div>
    </div>
  );
}

function MasterPromptCtaBanner({ title, subtitle, ctaText, onOpen }: MasterPromptBannerProps) {
  return (
    <div className="surface-hud rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-[0_0_32px_rgba(16,185,129,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="size-4.5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
            100% REPAIR
          </span>
        </div>
        <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#06070A] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0 shadow-[0_2px_16px_rgba(16,185,129,0.3)]"
      >
        <span>{ctaText}</span>
        <ArrowRight className="size-4 stroke-[2.5] rtl:-scale-x-100" />
      </button>
    </div>
  );
}

function EmptyHeroSection({ lang, title, subtitle, t }: EmptyHeroProps) {
  const badgeText =
    lang === 'ar'
      ? 'فحص شبكي لحظي عالي الدقة · NEXT.JS 16 & NODE 24'
      : 'REAL-TIME AUDIT TELEMETRY · NEXT.JS 16 & NODE 24';

  return (
    <div className="py-12 sm:py-20 space-y-14">
      {/* Hero Headline */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{badgeText}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          {title}
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed text-pretty max-w-xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PAGE_CONFIG.features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className={`surface-hud-interactive rounded-2xl p-5 space-y-3 ${
                feature.highlight ? 'border-emerald-500/30' : ''
              }`}
            >
              <div
                className={`size-10 rounded-xl flex items-center justify-center ${
                  feature.highlight
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'bg-white/[0.04] border border-white/[0.08] text-zinc-200'
                }`}
              >
                <Icon className="size-5 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-semibold text-white">{t[feature.titleKey]}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{t[feature.descKey]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
export default function AuditDashboardPage() {
  const [lang, setLang] = React.useState<SupportedLang>('ar');
  const [isLoading, setIsLoading] = React.useState(false);
  const [auditData, setAuditData] = React.useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<AuditCategory | 'all'>('all');
  const [isPromptModalOpen, setIsPromptModalOpen] = React.useState(false);

  const t = translations[lang];

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------
  const handleToggleLang = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const handleRunAudit = async (targetUrl: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const result = await fetchAuditData(targetUrl, lang);

    if (result.success) {
      setAuditData(result.data);
      setSelectedCategory('all');
    } else {
      setAuditData(null);
      setErrorMessage(result.error);
    }

    setIsLoading(false);
  };

  const handleExportReport = () => {
    if (auditData) {
      downloadAuditReportFile(auditData);
    }
  };

  const handleRetryDefault = () => {
    handleRunAudit(PAGE_CONFIG.defaultRetryDomain);
  };

  // --------------------------------------------------------------------------
  // RENDER VIEW
  // --------------------------------------------------------------------------
  return (
    <div className={PAGE_STYLES.pageContainer}>
      {/* Precision Header */}
      <AuditHeader
        lang={lang}
        onToggleLang={handleToggleLang}
        onExportReport={handleExportReport}
        hasReport={Boolean(auditData && !isLoading)}
      />

      <main className={PAGE_STYLES.mainContent}>
        {/* Terminal Input Bar */}
        <section className="space-y-4">
          <UrlInputBar lang={lang} isLoading={isLoading} onAudit={handleRunAudit} />
        </section>

        {/* STATE 1: Error Banner */}
        {errorMessage && !isLoading && (
          <ErrorStateBanner
            message={errorMessage}
            errorTitle={t.errorTitle}
            retryText={t.errorRetryBtn}
            onRetry={handleRetryDefault}
          />
        )}

        {/* STATE 2: Loading Shimmer Skeleton (Zero CLS) */}
        {isLoading && <AuditSkeleton />}

        {/* STATE 3: Populated Audit Workspace */}
        {auditData && !isLoading && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Centerpiece: Master AI Repair Prompt CTA Banner */}
            <MasterPromptCtaBanner
              title={t.masterPromptCtaTitle}
              subtitle={t.masterPromptCtaSub}
              ctaText={t.openMasterPromptBtn}
              onOpen={() => setIsPromptModalOpen(true)}
            />

            {/* Tactical Score Bento */}
            <ScoreBento
              audit={auditData}
              lang={lang}
              onSelectCategory={(category) => setSelectedCategory(category)}
            />

            {/* GEO AI Engine Telemetry */}
            <GeoDeepDive geo={auditData.geoDetails} lang={lang} />

            {/* Prioritized Issues & Solutions Worklist */}
            <IssuesList
              issues={auditData.issues}
              lang={lang}
              selectedCategory={selectedCategory}
              onOpenMasterPrompt={() => setIsPromptModalOpen(true)}
            />
          </div>
        )}

        {/* STATE 4: Initial Empty State */}
        {!auditData && !isLoading && !errorMessage && (
          <EmptyHeroSection
            lang={lang}
            title={t.emptyHeroTitle}
            subtitle={t.emptyHeroSub}
            t={t}
          />
        )}
      </main>

      {/* Global Brand & Legal Footer */}
      <AuditFooter lang={lang} />

      {/* 100% Score AI Master Repair Prompt Modal */}
      {auditData && (
        <MasterPromptModal
          audit={auditData}
          lang={lang}
          isOpen={isPromptModalOpen}
          onClose={() => setIsPromptModalOpen(false)}
        />
      )}
    </div>
  );
}
