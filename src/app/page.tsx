'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Bot,
  Zap,
  AlertOctagon,
  ArrowRight,
  RotateCw,
  Wand2,
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
  const isAr = lang === 'ar';
  const badgeText = isAr
    ? 'فحص شبكي لحظي عالي الدقة · NEXT.JS 16 & NODE 24'
    : 'REAL-TIME AUDIT TELEMETRY · NEXT.JS 16 & NODE 24';

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Headline */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{badgeText}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed text-pretty max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Primary Vectors Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {isAr ? 'المحاور الأساسية لتدقيق المنصات والمواقع' : 'Core Platform Optimization Vectors'}
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl mx-auto">
            {isAr
              ? 'تحليل فوري يغطي 44 معياراً تقنياً عبر محركات البحث، زواحف الذكاء الاصطناعي، ومقاييس الأداء العالمية.'
              : 'Real-time analysis spanning 44 technical heuristics across search crawlers, AI models, and performance benchmarks.'}
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
                <h3 className="text-sm font-semibold text-white">{t[feature.titleKey]}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{t[feature.descKey]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Deep Content Architecture (Zero Thin Content, Rich Semantic Information) */}
      <section className="surface-hud rounded-2xl p-6 sm:p-8 border border-white/[0.08] bg-[#08090C] space-y-6">
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>
              {isAr
                ? 'كيف يعمل محرك CRAWLIX PRO وما هي المعايير التقنية المفحوصة؟'
                : 'How CRAWLIX PRO Evaluates Your Web Architecture'}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {isAr
              ? 'صُمم هذا المحرك لتقديم قراءة لحظية دقيقة 100% لبنية الكود، والترويسات الشبكية، ومخططات البيانات الدلالية، دون الاعتماد على بيانات تقريبية.'
              : 'Engineered to provide 100% deterministic telemetry across DOM structure, network headers, and semantic schemas.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-zinc-300">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <span>🔍</span>
              <span>{isAr ? 'السيو ومحركات البحث (SEO)' : 'Search Engine Optimization'}</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              {isAr
                ? 'يفحص دقة طول وسوم العناوين (50-60 حرفاً)، والأوصاف التعريفية (120-160 حرفاً)، ووجود الروابط القانونية Canonical لتفادي عقوبات المحتوى المكرر، وتسلسل العناوين الهرمية H1-H6، وبطاقات OpenGraph و Twitter Cards.'
                : 'Validates title tags, meta descriptions, self-referencing canonical links, sequential heading hierarchy, and social sharing metadata.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <span>🤖</span>
              <span>{isAr ? 'محركات الذكاء الاصطناعي (GEO)' : 'Generative Engine Optimization'}</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              {isAr
                ? 'يتحقق من وجود ملفات llms.txt و llms-full.txt الرسمية، وسلامة أذونات روبوتات الذكاء الاصطناعي (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) في robots.txt، وكثافة الإجابات المباشرة E-E-A-T ومخططات Schema.org JSON-LD.'
                : 'Verifies /llms.txt and /llms-full.txt manifests, AI crawler directives in robots.txt, direct answer passage density, and rich Schema.org entities.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <span>⚡</span>
              <span>{isAr ? 'السرعة والأمان وسهولة الوصول' : 'Speed, Security & Accessibility'}</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed">
              {isAr
                ? 'يقيس زمن استجابة السيرفر الأول (TTFB)، وضغط البيانات (Gzip/Brotli)، وتعقيد شجرة عناصر DOM، وترويسات الأمان (HSTS, CSP, nosniff, Referrer-Policy)، وتوافقية الوصول WCAG 2.1 AA مع تمكين تكبير الشاشة.'
                : 'Audits TTFB, Brotli/Gzip compression, DOM tree depth, hardened security headers (HSTS, CSP, nosniff), and WCAG 2.1 accessibility criteria.'}
            </p>
          </div>
        </div>
      </section>
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

            {/* Direct Cross-Link: Feature Architect & Growth Proposals */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-semibold">
                  <Wand2 className="size-3.5" />
                  <span>مختبر وهندسة ميزات المنصة (Feature Architect)</span>
                </div>
                <h3 className="text-base font-bold text-white font-mono">
                  {lang === 'ar'
                    ? `تريد اقتراح ميزات ونمو حقيقية لموقع ${auditData.domain}؟`
                    : `Want tailored feature and growth proposals for ${auditData.domain}?`}
                </h3>
                <p className="text-xs text-zinc-400">
                  {lang === 'ar'
                    ? 'يقوم المحرك بقراءة كافة صفحات ومكونات موقعك واقتراح ميزات برمجية تضاعف التحويل مع برومبتات AI كاملة.'
                    : 'Deeply analyzes your site archetype, pages and tech stack to propose high-converting features.'}
                </p>
              </div>
              <Link
                href={`/features?url=${encodeURIComponent(auditData.url)}`}
                className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-emerald-500 hover:text-zinc-950 border border-white/[0.08] hover:border-emerald-400 text-xs font-bold text-white transition-all flex items-center gap-2 shrink-0 shadow-lg"
              >
                <span>{lang === 'ar' ? 'فحص واقتراح الميزات الآن' : 'Explore Features Now'}</span>
                <ArrowRight className="size-3.5 rtl:rotate-180" />
              </Link>
            </div>

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
