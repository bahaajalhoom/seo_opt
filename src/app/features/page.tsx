'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Search,
  Check,
  Copy,
  RefreshCw,
  ExternalLink,
  Layers,
  Zap,
  TrendingUp,
  Cpu,
  Shield,
  Compass,
  FileCode2,
  Code2,
  SlidersHorizontal,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  Wand2,
} from 'lucide-react';
import { AuditHeader } from '@/components/AuditHeader';
import { AuditFooter } from '@/components/AuditFooter';
import { SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';
import type {
  FeaturesAuditResult,
  ProposedFeature,
  FeaturePillar,
  FeaturePriority,
  DetectedCapability,
} from '@/types/features';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
const QUICK_TEST_URLS = [
  'https://ahmedsaleh.website',
  'https://seo-opt.apps.taqat.academy',
  'https://stripe.com',
  'https://github.com',
] as const;

const PILLAR_CONFIG: Record<
  FeaturePillar,
  {
    icon: React.ComponentType<{ className?: string }>;
    labelAr: string;
    labelEn: string;
    badgeClass: string;
  }
> = {
  growth: {
    icon: TrendingUp,
    labelAr: 'النمو والتحويل (Growth & CRO)',
    labelEn: 'Growth & Conversion Loops',
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  ai: {
    icon: Cpu,
    labelAr: 'الذكاء الاصطناعي (AI & Automation)',
    labelEn: 'AI & Smart Automation',
    badgeClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  ux: {
    icon: Zap,
    labelAr: 'تجربة الاستخدام (UX & Speed)',
    labelEn: 'UX & Micro-Interactions',
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  enterprise: {
    icon: Shield,
    labelAr: 'الأنظمة المؤسسية (Enterprise & Scale)',
    labelEn: 'Enterprise & Security Hub',
    badgeClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  seo_content: {
    icon: Compass,
    labelAr: 'السيو والمحتوى (SEO & Reach)',
    labelEn: 'Programmatic SEO & Content',
    badgeClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
};

const PRIORITY_BADGES: Record<
  FeaturePriority,
  { labelAr: string; labelEn: string; badgeClass: string }
> = {
  critical: {
    labelAr: 'أولوية حاسمة',
    labelEn: 'Critical Priority',
    badgeClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  high: {
    labelAr: 'أثر مرتفع',
    labelEn: 'High Impact',
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  medium: {
    labelAr: 'تحسين تدريجي',
    labelEn: 'Incremental Win',
    badgeClass: 'text-zinc-300 bg-white/[0.04] border-white/[0.08]',
  },
};

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
type PillarFilter = 'all' | FeaturePillar;

// ============================================================================
// 4. HELPER FUNCTIONS & CUSTOM HOOKS
// ============================================================================
function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return Promise.resolve(false);
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================

/**
 * 5.1 Shimmer Skeleton for Zero-CLS Loading State
 */
function FeaturesLoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading feature analysis">
      {/* Top Banner Skeleton */}
      <div className="h-44 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-4 w-48 rounded bg-white/[0.05]" />
          <div className="h-8 w-80 rounded bg-white/[0.08]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-10 rounded bg-white/[0.04]" />
          <div className="h-10 rounded bg-white/[0.04]" />
          <div className="h-10 rounded bg-white/[0.04]" />
          <div className="h-10 rounded bg-white/[0.04]" />
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/[0.06] bg-[#0c0e14] p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-28 rounded bg-white/[0.05]" />
              <div className="h-5 w-20 rounded bg-white/[0.05]" />
            </div>
            <div className="h-6 w-3/4 rounded bg-white/[0.08]" />
            <div className="h-16 w-full rounded bg-white/[0.03]" />
            <div className="h-10 w-full rounded bg-white/[0.05]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 5.2 Initial Empty State: Overview & Architecture Guide
 */
function EmptyFeaturesState({
  onSelectQuickUrl,
}: {
  onSelectQuickUrl: (url: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-8 sm:p-12 text-center space-y-8">
      <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <Wand2 className="size-7" />
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          مختبر وهندسة ميزات المنصة
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          ضع رابط أي موقع لتحليله بالكامل: يكتشف المحرك نوع المنصة (SaaS, متجر، وكالة، أدوات)،
          ويفحص الميزات المتوفرة والغائبة، ويقترح عليك ميزات برمجية ونمو استثنائية مع كود وبرومبت
          تنفيذي كامل لنماذج الذكاء الاصطناعي.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-right">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Compass className="size-4" />
            <span>قراءة عميقة للبنية الكاملة</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            استخراج الروابط الداخلية، والصفحات الأساسية (الأسعار، الحسابات، النماذج، الوثائق)،
            وتحديد حزمة التقنيات المستخدمة.
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <TrendingUp className="size-4" />
            <span>ميزات نمو ومضاعفة التحويل</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            اقتراح حاسبات أسعار تفاعلية، ولوحات أوامر ⌘K، ومسارات حجز العملاء، ومولدات بطاقات
            التواصل الديناميكية.
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <FileCode2 className="size-4" />
            <span>برومبتات جاهزة للذكاء الاصطناعي</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            توليد برومبت معتمد لكل ميزة، أو نسخ المخطط الشامل (Master Blueprint) لتنفيذه مباشرة عبر
            Cursor أو Claude أو ChatGPT.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <p className="text-xs text-zinc-500 mb-3">أو جرّب مباشرة على أحد النماذج المعتمدة:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_TEST_URLS.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => onSelectQuickUrl(u)}
              className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            >
              <span>{u.replace('https://', '')}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 5.3 Error State Card with Retry Trigger
 */
function FeaturesErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 text-center space-y-4">
      <div className="inline-flex size-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
        <AlertCircle className="size-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white font-mono">تعذر إكمال فحص وقراءة الموقع</h3>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs transition-colors inline-flex items-center gap-2"
      >
        <RefreshCw className="size-3.5" />
        <span>إعادة المحاولة الآن</span>
      </button>
    </div>
  );
}

/**
 * 5.4 Feature Card with Expandable AI Prompt
 */
function FeatureCard({
  feature,
  onViewPrompt,
}: {
  feature: ProposedFeature;
  onViewPrompt: (feature: ProposedFeature) => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const pillar = PILLAR_CONFIG[feature.pillar];
  const priority = PRIORITY_BADGES[feature.priority];
  const PillarIcon = pillar.icon;

  const handleCopyPrompt = async () => {
    const ok = await copyTextToClipboard(feature.aiImplementationPrompt);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all group">
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${pillar.badgeClass}`}
            >
              <PillarIcon className="size-3.5" />
              <span>{pillar.labelAr}</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-medium border ${priority.badgeClass}`}
            >
              {priority.labelAr}
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-md">
            {feature.impactMetricAr}
          </span>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
            {feature.titleAr}
          </h3>
          <p className="text-xs font-mono text-zinc-400">{feature.titleEn}</p>
          <p className="text-xs text-zinc-300 font-medium pt-1">{feature.taglineAr}</p>
        </div>

        {/* Technical Rationale */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-1 text-xs">
          <div className="text-zinc-400 font-semibold flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span>لماذا يحتاجها هذا الموقع بالذات:</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">{feature.rationaleAr}</p>
        </div>

        {/* Architecture Plan & Tech Stack */}
        <div className="space-y-2 text-xs">
          <div className="text-zinc-400 font-semibold">حزمة التقنيات المقترحة:</div>
          <div className="flex flex-wrap gap-1.5">
            {feature.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyPrompt}
          className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400">تم نسخ برومبت الميزة!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5 text-zinc-400" />
              <span>نسخ برومبت الميزة للـ AI</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onViewPrompt(feature)}
          className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          title="معاينة كود وبرومبت الميزة بالتفصيل"
        >
          <Code2 className="size-3.5" />
          <span>معاينة البرومبت</span>
        </button>
      </div>
    </article>
  );
}

/**
 * 5.5 Modal for Inspecting Single Feature AI Prompt
 */
function SingleFeatureModal({
  feature,
  onClose,
}: {
  feature: ProposedFeature | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  if (!feature) return null;

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(feature.aiImplementationPrompt);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl border border-white/[0.12] bg-[#0B0D12] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Code2 className="size-4 text-emerald-400" />
              <span>{feature.titleAr}</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono">{feature.titleEn}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="rounded-xl border border-white/[0.08] bg-[#07080B] p-4 text-zinc-300 whitespace-pre-wrap leading-relaxed select-all">
            {feature.aiImplementationPrompt}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#08090C] flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">
            جاهز للصق في Cursor / Claude / ChatGPT لبناء الميزة مباشرة
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] text-xs font-semibold"
            >
              إغلاق
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  <span>تم النسخ بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>نسخ البرومبت الكامل</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 5.6 Master Blueprint Modal for Copying ALL Proposed Features at Once
 */
function MasterBlueprintModal({
  masterPrompt,
  domain,
  isOpen,
  onClose,
}: {
  masterPrompt: string;
  domain: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(masterPrompt);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-emerald-500/30 bg-[#090C11] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-emerald-950/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-base font-bold text-white font-mono">
                المخطط المعماري الشامل لبناء ميزات المنصة (Master Features Blueprint)
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              خارطة طريق تنفيذية متكاملة لـ ({domain}) تتضمن كافة الميزات المقترحة وأكوادها
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#050608] p-5 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed select-all">
            {masterPrompt}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-[#07090D] flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            يتضمن هذا البرومبت الأكواد والخطط المعمارية لكافة الميزات المقترحة دفعة واحدة.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] text-xs font-semibold"
            >
              إغلاق
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  <span>تم نسخ المخطط الشامل!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>نسخ المخطط الشامل كاملاً (Master Blueprint)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT (FEATURES PAGE)
// ============================================================================
function FeaturesPageContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url');

  const [lang, setLang] = React.useState<SupportedLang>('ar');
  const [targetUrl, setTargetUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<FeaturesAuditResult | null>(null);
  const [pillarFilter, setPillarFilter] = React.useState<PillarFilter>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFeature, setSelectedFeature] = React.useState<ProposedFeature | null>(null);
  const [masterModalOpen, setMasterModalOpen] = React.useState(false);

  const isAr = lang === 'ar';

  // Toggle Language Handler
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Run Features Audit
  const handleRunAudit = React.useCallback(
    async (overrideUrl?: string) => {
      const urlToTest = (overrideUrl || targetUrl).trim();
      if (!urlToTest) {
        setError(isAr ? 'يرجى إدخال رابط الموقع المستهدف أولاً.' : 'Please enter a target URL first.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/audit-features', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToTest }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(
            errorData?.detail ||
              (isAr
                ? 'حدث خطأ أثناء قراءة وفحص الموقع المستهدف.'
                : 'Failed to inspect target site.')
          );
        }

        const data: FeaturesAuditResult = await res.json();
        setResult(data);
        if (overrideUrl) setTargetUrl(overrideUrl);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown network failure';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [targetUrl, isAr]
  );

  // Auto-run if urlParam is provided via query
  React.useEffect(() => {
    if (urlParam && !result && !loading) {
      setTargetUrl(urlParam);
      handleRunAudit(urlParam);
    }
  }, [urlParam, result, loading, handleRunAudit]);

  // Derived filtered features list
  const filteredFeatures = React.useMemo(() => {
    if (!result) return [];
    return result.proposedFeatures.filter((feat) => {
      const matchesPillar = pillarFilter === 'all' || feat.pillar === pillarFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        feat.titleAr.toLowerCase().includes(query) ||
        feat.titleEn.toLowerCase().includes(query) ||
        feat.taglineAr.toLowerCase().includes(query) ||
        feat.techStack.some((t) => t.toLowerCase().includes(query));

      return matchesPillar && matchesQuery;
    });
  }, [result, pillarFilter, searchQuery]);

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#08090C] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300"
    >
      {/* 6.1 Top Sticky Navigation Header */}
      <AuditHeader
        lang={lang}
        onToggleLang={handleToggleLang}
        hasReport={!!result}
        onExportReport={() => setMasterModalOpen(true)}
      />

      {/* 6.2 Page Hero & URL Submission Bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
                <Wand2 className="size-3.5" />
                <span>CRAWLIX ARCHITECTURE & PRODUCT GROWTH ENGINE</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                مقترح ميزات المنصة والنمو الاستراتيجي
              </h1>
              <p className="text-sm text-zinc-400">
                قراءة شاملة لكافة صفحات ومكونات موقعك لاقتراح ميزات تقنية وهندسية تضاعف معدل التحويل
                والاحتفاظ
              </p>
            </div>

            {result && (
              <button
                type="button"
                onClick={() => setMasterModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10"
              >
                <FileCode2 className="size-4" />
                <span>عرض ونسخ المخطط الشامل (Master Blueprint)</span>
              </button>
            )}
          </div>

          {/* Interactive URL Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunAudit();
            }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="أدخل رابط موقعك مثلاً: https://example.com"
                className="w-full h-12 px-4 rounded-xl border border-white/[0.1] bg-[#0c0e14] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
            >
              {loading ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  <span>جارٍ قراءة وفحص الموقع كاملاً...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>تحليل واقتراح الميزات</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* 6.3 State Handler: Loading */}
        {loading && <FeaturesLoadingSkeleton />}

        {/* 6.4 State Handler: Error */}
        {!loading && error && (
          <FeaturesErrorCard message={error} onRetry={() => handleRunAudit()} />
        )}

        {/* 6.5 State Handler: Empty Initial */}
        {!loading && !error && !result && (
          <EmptyFeaturesState onSelectQuickUrl={(u) => handleRunAudit(u)} />
        )}

        {/* 6.6 State Handler: Populated Results */}
        {!loading && !error && result && (
          <section className="space-y-8 animate-in fade-in duration-300">
            {/* Top Bento: Archetype & Maturity Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Site Archetype */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-6 space-y-2">
                <div className="text-xs font-mono text-zinc-400">طبيعة المنصة المكتشفة</div>
                <div className="text-xl font-bold text-white font-mono">
                  {result.metrics.archetypeLabelAr}
                </div>
                <div className="text-xs text-emerald-400 font-mono">
                  تم رصد {result.metrics.totalInternalLinksFound} رابطاً داخلياً في البنية
                </div>
              </div>

              {/* Card 2: Feature Maturity Score */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-6 space-y-2">
                <div className="text-xs font-mono text-zinc-400">مؤشر نضوج الميزات الحالية</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                    {result.metrics.featureMaturityScore}
                  </span>
                  <span className="text-sm text-zinc-500">/ 100</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${result.metrics.featureMaturityScore}%` }}
                  />
                </div>
              </div>

              {/* Card 3: Detected Technologies */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-6 space-y-2">
                <div className="text-xs font-mono text-zinc-400">التقنيات والمكتبات المكتشفة</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {result.metrics.detectedTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Capability Inventory Section: Present vs Missing */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    <Layers className="size-4 text-emerald-400" />
                    <span>سجل فحص القدرات والفرص الضائعة (Capabilities Inventory)</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    جرد كامل للميزات الحيوية الموجودة في كود وتصميم الموقع والفرص الغائبة
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="size-3.5" />
                    <span>{result.metrics.presentCapabilitiesCount} متوفر</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-zinc-400">
                    <XCircle className="size-3.5 text-zinc-500" />
                    <span>{result.metrics.missingOpportunitiesCount} فرصة غائبة</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {result.capabilitiesInventory.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-4 space-y-2 transition-all ${
                      item.status === 'present'
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : item.status === 'partial'
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-white/[0.02] border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {item.nameAr.split('(')[0]}
                      </span>
                      {item.status === 'present' ? (
                        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                      ) : item.status === 'partial' ? (
                        <HelpCircle className="size-4 text-amber-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.06]">
                          غائب
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Pillar Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPillarFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      pillarFilter === 'all'
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    كافة الميزات ({result.proposedFeatures.length})
                  </button>
                  {(Object.keys(PILLAR_CONFIG) as FeaturePillar[]).map((pill) => {
                    const cfg = PILLAR_CONFIG[pill];
                    const count = result.proposedFeatures.filter((f) => f.pillar === pill).length;
                    return (
                      <button
                        key={pill}
                        type="button"
                        onClick={() => setPillarFilter(pill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          pillarFilter === pill
                            ? 'bg-emerald-500 text-zinc-950 font-bold'
                            : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        <span>{cfg.labelAr.split('(')[0]}</span>
                        <span className="text-[10px] opacity-70">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search in Features */}
                <div className="relative w-full sm:w-64">
                  <Search className="size-3.5 absolute right-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث في الميزات أو التقنيات..."
                    className="w-full h-9 pr-9 pl-3 rounded-lg border border-white/[0.08] bg-[#0c0e14] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Proposed Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFeatures.map((feat) => (
                  <FeatureCard
                    key={feat.id}
                    feature={feat}
                    onViewPrompt={(f) => setSelectedFeature(f)}
                  />
                ))}
              </div>

              {filteredFeatures.length === 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-[#0A0C10] p-12 text-center text-zinc-400 text-xs">
                  لا توجد ميزات تطابق معايير البحث أو الفلتر المحدد.
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* 6.7 Modals */}
      <SingleFeatureModal
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />

      {result && (
        <MasterBlueprintModal
          masterPrompt={result.masterAiPrompt}
          domain={result.domain}
          isOpen={masterModalOpen}
          onClose={() => setMasterModalOpen(false)}
        />
      )}

      {/* 6.8 Audit Footer */}
      <AuditFooter lang={lang} />
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <React.Suspense fallback={<FeaturesLoadingSkeleton />}>
      <FeaturesPageContent />
    </React.Suspense>
  );
}
