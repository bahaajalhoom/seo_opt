'use client';

import * as React from 'react';
import { AuditHeader } from '@/components/AuditHeader';
import { AuditFooter } from '@/components/AuditFooter';
import { SupportedLang } from '@/types/audit';
import {
  TrendingUp,
  Search,
  Bot,
  Zap,
  Eye,
  Lock,
  ArrowLeft,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import Link from 'next/link';

export default function MethodologyPage() {
  const [lang, setLang] = React.useState<SupportedLang>('ar');
  const isAr = lang === 'ar';

  const handleToggleLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };

  const weights = [
    {
      category: isAr ? 'السيو التقليدي (SEO)' : 'Traditional SEO',
      weight: '25%',
      icon: Search,
      criteria: isAr
        ? 'طول العناوين (30-65 حرفاً)، الوصف التعريفي (120-160 حرفاً)، الروابط القانونية المطلقة، سلامة التدرج الهرمي H1-H6، وسوم OpenGraph و Twitter Cards، وجود خريطة الموقع sitemap.xml ونصوص alt للصور.'
        : 'Title tag length (30-65 chars), Meta descriptions (120-160 chars), absolute canonical links, H1-H6 hierarchy, OpenGraph & Twitter Cards, sitemap.xml, and image alt completeness.',
    },
    {
      category: isAr ? 'محركات الذكاء الاصطناعي (GEO)' : 'Generative Engine (GEO)',
      weight: '25%',
      icon: Bot,
      criteria: isAr
        ? 'توفر مواصفة /llms.txt و /llms-full.txt، أذونات روبوتات الذكاء الاصطناعي (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot)، صحة مخططات Schema.org JSON-LD، وكثافة فقرات الإجابات المباشرة E-E-A-T.'
        : 'Presence of /llms.txt manifest, unblocked AI search crawlers in robots.txt (GPTBot, ClaudeBot, PerplexityBot), valid Schema.org JSON-LD entities, and direct answer density.',
    },
    {
      category: isAr ? 'الأداء والسرعة (Speed)' : 'Performance & Speed',
      weight: '20%',
      icon: Zap,
      criteria: isAr
        ? 'زمن أول بايت (TTFB < 200ms)، وزن وثيقة الـ HTML الأولي (< 100KB)، تفعيل ضغط السيرفر (Brotli / Gzip)، عدد عقد الـ DOM (< 800 عقدة)، وعمق التداخل (< 32 مستوى).'
        : 'Time to First Byte (TTFB < 200ms), HTML payload weight (< 100KB), compression headers (gzip/brotli), DOM element density (< 800 nodes), and maximum DOM tree depth.',
    },
    {
      category: isAr ? 'إمكانية الوصول (A11y)' : 'Accessibility (A11y)',
      weight: '15%',
      icon: Eye,
      criteria: isAr
        ? 'مطابقة معايير WCAG 2.1 AA، سمة اللغة lang في وسم html، سلامة تسلسل العناوين بدون فجوات، تسميات النماذج والأزرار المقروءة، وتجنب تقييد تكبير الشاشة في viewport.'
        : 'WCAG 2.1 AA compliance, valid html lang attribute, uninterrupted heading outlines, accessible input labels, and unrestricted viewport zoom permissions.',
    },
    {
      category: isAr ? 'الأمان والبيانات (Security)' : 'Security & Trust',
      weight: '15%',
      icon: Lock,
      criteria: isAr
        ? 'بروتوكول HTTPS المشفر، ترويسات HSTS مع max-age كافٍ، ترويسة أمان المحتوى CSP، ترويسة X-Content-Type-Options: nosniff، وحماية الروابط الخارجية rel="noopener noreferrer".'
        : 'Strict HTTPS enforcement, HSTS policy (max-age >= 15552000), Content-Security-Policy (CSP), nosniff headers, and safe external link attributes.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050608] text-zinc-100 bg-grid-precision selection:bg-emerald-500/20 selection:text-emerald-300">
      <AuditHeader lang={lang} onToggleLang={handleToggleLang} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            <span>{isAr ? 'العودة لمنصة الفحص' : 'Return to Auditor'}</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{isAr ? 'منهجية الفحص والتقييم' : 'Audit Methodology'}</span>
        </div>

        {/* Header Block */}
        <div className="space-y-3 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs">
            <TrendingUp className="size-3.5" />
            <span>{isAr ? 'خوارزمية الفحص الموزون · CRAWLIX PRO' : 'Weighted Scoring Formula · CRAWLIX PRO'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isAr ? 'منهجية القياس وحساب النسب المئوية (%)' : 'CRAWLIX Scoring Methodology'}
          </h1>
          <p className="text-sm text-zinc-400 font-mono">
            {isAr
              ? 'تصميم وهندسة: أحمد جلهوم (Ahmad Jalhoom) · 48 معياراً دقيقاً وموثقاً'
              : 'Engineered by Ahmad Jalhoom · 48 Precision Algorithmic Heuristics'}
          </p>
        </div>

        {/* Mathematical Formula Banner */}
        <div className="surface-hud rounded-2xl p-6 border border-emerald-500/30 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold block">
            {isAr ? 'المعادلة الرياضية للنسبة الإجمالية' : 'Master Score Mathematical Formula'}
          </span>
          <div className="p-4 rounded-xl bg-[#07080C] border border-white/[0.06] font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto text-start" dir="ltr">
            Overall Score = (0.25 × SEO) + (0.25 × GEO) + (0.20 × Speed) + (0.15 × A11y) + (0.15 × Security)
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            {isAr
              ? 'تعتمد المعادلة أوزاناً دقيقة توازن بين الظهور العضوي في محركات البحث التقليدية وجاهزية الاقتباس في نماذج الذكاء الاصطناعي مع ضمان تجربة مستخدم سريعة وآمنة.'
              : 'The weighted matrix balances classical organic discoverability with generative citation grounding, backed by Core Web Vitals performance and strict security standards.'}
          </p>
        </div>

        {/* Category Breakdown Table */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <FileCode className="size-4 text-emerald-400" />
            <span>{isAr ? 'تفصيل الأوزان ومعايير الفحص' : 'Category Weights & Audit Breakdown'}</span>
          </h2>

          <div className="grid grid-cols-1 gap-3.5">
            {weights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.category} className="surface-hud rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                        <Icon className="size-4" />
                      </div>
                      <span className="text-sm font-bold text-white font-mono">{item.category}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                      {item.weight}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans ps-10">{item.criteria}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <AuditFooter lang={lang} />
    </div>
  );
}
