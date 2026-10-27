'use client';

import * as React from 'react';
import { AuditHeader } from '@/components/AuditHeader';
import { AuditFooter } from '@/components/AuditFooter';
import { SupportedLang } from '@/types/audit';
import {
  Award,
  Cpu,
  Terminal,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Globe2,
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            <span>{isAr ? 'العودة لمنصة الفحص' : 'Return to Auditor'}</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{isAr ? 'عن المؤسس والمنصة' : 'About Architect & Platform'}</span>
        </div>

        {/* Hero Section: Creator Spotlight */}
        <div className="surface-hud rounded-3xl p-6 sm:p-10 border border-emerald-500/30 relative overflow-hidden space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.2)]">
                <Award className="size-8 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                  {isAr ? 'المطور والمهندس المؤسس' : 'Principal Engineer & Creator'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Ahmad Jalhoom · أحمد جلهوم
                </h1>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {isAr
                    ? 'مهندس نظم الذكاء الاصطناعي وبنية الويب المتقدمة'
                    : 'Principal AI & Web Distributed Systems Architect'}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-zinc-300">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CRAWLIX PRO</span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-sans">
            <p>
              {isAr
                ? 'تم ابتكار وتصميم وبناء منصة **CRAWLIX** بالكامل بواسطة المهندس **أحمد جلهوم (Ahmad Jalhoom)** لتمثل الجيل الجديد من منصات فحص الويب، وسد الفجوة بين معايير السيو الكلاسيكية ومتطلبات محركات الذكاء الاصطناعي التوليدي (GEO) مثل ChatGPT Search و Perplexity و Claude و Google Gemini.'
                : '**CRAWLIX** was conceived, architected, and engineered from the ground up by **Ahmad Jalhoom**, establishing a new benchmark in web verification that bridges traditional technical SEO with Generative Engine Optimization (GEO) standards required by ChatGPT, Perplexity, Claude, and Gemini.'}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'تعتمد رؤية أحمد جلهوم على القضاء على أدوات الفحص النظرية غير الدقيقة، واستبدالها بمحرك Node.js 24 حقيقي يقوم بتحليل مباشر للأكواد والترويسات، واستخراج المشاكل التقنية مع توليد كود إصلاح فوري بنسبة 100% جاهز للنسخ والتنفيذ عبر نماذج الذكاء الاصطناعي.'
                : 'Ahmad Jalhoom’s vision eliminates abstract, non-deterministic audit checklists in favor of a real-time Node.js 24 parsing engine that extracts factual DOM structures and generates 100% copyable, production-ready AI remediation prompts.'}
            </p>
          </div>
        </div>

        {/* 4 Architectural Pillars */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Terminal className="size-4 text-emerald-400" />
            <span>{isAr ? 'الركائز الهندسية للمنصة' : 'Architectural Pillars'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="surface-hud rounded-2xl p-5 space-y-2.5">
              <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Cpu className="size-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'محرك Node.js 24 الأصيل' : 'Native Node.js 24 Engine'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'فحص شبكي متوازي حقيقي بدون أي بيانات وهمية، مع حماية أمنية من هجمات SSRF وتحليل Cheerio عالي السرعة.'
                  : 'True concurrent network inspection with zero simulated fallbacks, sub-second TTFB telemetry, and built-in SSRF guards.'}
              </p>
            </div>

            <div className="surface-hud rounded-2xl p-5 space-y-2.5">
              <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="size-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'هندسة الـ GEO وعصر الـ AI Search' : 'GEO & AI Search Grounding'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'دعم متكامل لمواصفة llms.txt الجديدة وتحليل عميق لأذونات GPTBot و PerplexityBot ومخططات Schema.org.'
                  : 'Comprehensive support for the /llms.txt standard, stacked robots.txt AI directives, and rich Schema.org validation.'}
              </p>
            </div>

            <div className="surface-hud rounded-2xl p-5 space-y-2.5">
              <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Code2 className="size-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'برومبت الإصلاح الشامل 100%' : '100% Score Master AI Prompt'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'توليد تلقائي لبرومبت هندسي منظم يوجه نماذج Claude و Cursor و ChatGPT لسد جميع الثغرات في خطوة واحدة.'
                  : 'Deterministic, ready-to-run prompt generator that outputs full code patches and configs to achieve perfect 100% scores.'}
              </p>
            </div>

            <div className="surface-hud rounded-2xl p-5 space-y-2.5">
              <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Globe2 className="size-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'عمارة خالية من الابتذال (Anti-Slop)' : 'Studio-Grade Industrial Craft'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {isAr
                  ? 'واجهة تفاعلية مصممة بدقة استوديوهات التصميم العالمية بنسبة ألوان 90/10 وانعدام تام للاهتزاز (CLS = 0).'
                  : 'Strict adherence to /using-frontend-noslop: zero gradient text, high-density HUD telemetry, and zero layout shift.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <AuditFooter lang={lang} />
    </div>
  );
}
