'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Search,
  Bot,
  Zap,
  Eye,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { AuditHeader } from '@/components/AuditHeader';
import { AuditFooter } from '@/components/AuditFooter';
import { SupportedLang } from '@/types/audit';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Adjust audit category weights and scoring criteria here.
const METHODOLOGY_CONFIG = {
  versionBadge: 'CRAWLIX PRO',
  formulaText:
    'Overall Score = (0.25 × SEO) + (0.25 × GEO) + (0.20 × Speed) + (0.15 × A11y) + (0.15 × Security)',
} as const;

const METHODOLOGY_WEIGHTS = [
  {
    id: 'seo',
    icon: Search,
    weight: '25%',
    categoryAr: 'السيو التقليدي (SEO)',
    categoryEn: 'Traditional SEO',
    criteriaAr:
      'طول العناوين (30-65 حرفاً)، الوصف التعريفي (120-160 حرفاً)، الروابط القانونية المطلقة، سلامة التدرج الهرمي H1-H6، وسوم OpenGraph و Twitter Cards، وجود خريطة الموقع sitemap.xml ونصوص alt للصور.',
    criteriaEn:
      'Title tag length (30-65 chars), Meta descriptions (120-160 chars), absolute canonical links, H1-H6 hierarchy, OpenGraph & Twitter Cards, sitemap.xml, and image alt completeness.',
  },
  {
    id: 'geo',
    icon: Bot,
    weight: '25%',
    categoryAr: 'محركات الذكاء الاصطناعي (GEO)',
    categoryEn: 'Generative Engine (GEO)',
    criteriaAr:
      'توفر مواصفة /llms.txt و /llms-full.txt، أذونات روبوتات الذكاء الاصطناعي (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot)، صحة مخططات Schema.org JSON-LD، وكثافة فقرات الإجابات المباشرة E-E-A-T.',
    criteriaEn:
      'Presence of /llms.txt manifest, unblocked AI search crawlers in robots.txt (GPTBot, ClaudeBot, PerplexityBot), valid Schema.org JSON-LD entities, and direct answer density.',
  },
  {
    id: 'speed',
    icon: Zap,
    weight: '20%',
    categoryAr: 'الأداء والسرعة (Speed)',
    categoryEn: 'Performance & Speed',
    criteriaAr:
      'زمن أول بايت (TTFB < 200ms)، وزن وثيقة الـ HTML الأولي (< 100KB)، تفعيل ضغط السيرفر (Brotli / Gzip)، عدد عقد الـ DOM (< 800 عقدة)، وعمق التداخل (< 32 مستوى).',
    criteriaEn:
      'Time to First Byte (TTFB < 200ms), HTML payload weight (< 100KB), compression headers (gzip/brotli), DOM element density (< 800 nodes), and maximum DOM tree depth.',
  },
  {
    id: 'a11y',
    icon: Eye,
    weight: '15%',
    categoryAr: 'إمكانية الوصول (A11y)',
    categoryEn: 'Accessibility (A11y)',
    criteriaAr:
      'مطابقة معايير WCAG 2.1 AA، سمة اللغة lang في وسم html، سلامة تسلسل العناوين بدون فجوات، تسميات النماذج والأزرار المقروءة، وتجنب تقييد تكبير الشاشة في viewport.',
    criteriaEn:
      'WCAG 2.1 AA compliance, valid html lang attribute, uninterrupted heading outlines, accessible input labels, and unrestricted viewport zoom permissions.',
  },
  {
    id: 'security',
    icon: Lock,
    weight: '15%',
    categoryAr: 'الأمان والبيانات (Security)',
    categoryEn: 'Security & Trust',
    criteriaAr:
      'بروتوكول HTTPS المشفر، ترويسات HSTS مع max-age كافٍ، ترويسة أمان المحتوى CSP، ترويسة X-Content-Type-Options: nosniff، وحماية الروابط الخارجية rel="noopener noreferrer".',
    criteriaEn:
      'Strict HTTPS enforcement, HSTS policy (max-age >= 15552000), Content-Security-Policy (CSP), nosniff headers, and safe external link attributes.',
  },
] as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface WeightCardProps {
  item: (typeof METHODOLOGY_WEIGHTS)[number];
  isAr: boolean;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
// (Pure display utilities)

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function FormulaBanner({ isAr }: { isAr: boolean }) {
  return (
    <div className="surface-hud rounded-2xl p-6 border border-emerald-500/30 space-y-3">
      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
        {isAr ? 'المعادلة الرياضية للنسبة الإجمالية' : 'Master Score Mathematical Formula'}
      </span>
      <div
        className="p-4 rounded-xl bg-[#07080C] border border-white/[0.06] font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto text-start"
        dir="ltr"
      >
        {METHODOLOGY_CONFIG.formulaText}
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
        {isAr
          ? 'تعتمد المعادلة أوزاناً دقيقة توازن بين الظهور العضوي في محركات البحث التقليدية وجاهزية الاقتباس في نماذج الذكاء الاصطناعي مع ضمان تجربة مستخدم سريعة وآمنة.'
          : 'The weighted matrix balances classical organic discoverability with generative citation grounding, backed by Core Web Vitals performance and strict security standards.'}
      </p>
    </div>
  );
}

function WeightCategoryCard({ item, isAr }: WeightCardProps) {
  const Icon = item.icon;
  const categoryName = isAr ? item.categoryAr : item.categoryEn;
  const criteriaText = isAr ? item.criteriaAr : item.criteriaEn;

  return (
    <div className="surface-hud rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Icon className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{categoryName}</span>
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">{criteriaText}</p>
        </div>
      </div>

      <div className="shrink-0 font-mono text-end bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-xl">
        <span className="text-xs text-zinc-500 block uppercase">
          {isAr ? 'الوزن' : 'Weight'}
        </span>
        <span className="text-lg font-black text-emerald-400 tabular-nums">{item.weight}</span>
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
export default function MethodologyPage() {
  const [lang, setLang] = React.useState<SupportedLang>('ar');
  const isAr = lang === 'ar';

  const handleToggleLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050608] text-zinc-100 bg-grid-precision selection:bg-emerald-500/20 selection:text-emerald-300">
      <AuditHeader lang={lang} onToggleLang={handleToggleLang} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            <span>{isAr ? 'العودة لمنصة الفحص' : 'Return to Auditor'}</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-300">
            {isAr ? 'منهجية الفحص والتقييم' : 'Audit Methodology'}
          </span>
        </div>

        {/* Header Block */}
        <div className="space-y-3 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs">
            <TrendingUp className="size-3.5" />
            <span>
              {isAr
                ? `خوارزمية الفحص الموزون · ${METHODOLOGY_CONFIG.versionBadge}`
                : `Weighted Scoring Formula · ${METHODOLOGY_CONFIG.versionBadge}`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isAr ? 'منهجية القياس وحساب النسب المئوية (%)' : 'CRAWLIX Scoring Methodology'}
          </h1>
          <p className="text-sm text-zinc-400 font-mono">
            {isAr
              ? 'تصميم وهندسة: أحمد جلهوم (Ahmad Jalhoom) · 44 معياراً دقيقاً وموثقاً'
              : 'Engineered by Ahmad Jalhoom · 44 Precision Algorithmic Heuristics'}
          </p>
        </div>

        {/* Mathematical Formula Banner */}
        <FormulaBanner isAr={isAr} />

        {/* Category Breakdown Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>{isAr ? 'أوزان الفئات والمعايير التفصيلية' : 'Detailed Vector Weights'}</span>
          </h2>

          <div className="space-y-3">
            {METHODOLOGY_WEIGHTS.map((item) => (
              <WeightCategoryCard key={item.id} item={item} isAr={isAr} />
            ))}
          </div>
        </div>
      </main>

      <AuditFooter lang={lang} />
    </div>
  );
}
