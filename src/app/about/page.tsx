'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import Link from 'next/link';
import {
  Award,
  Cpu,
  Terminal,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { AuditHeader } from '@/components/AuditHeader';
import { AuditFooter } from '@/components/AuditFooter';
import { SupportedLang } from '@/types/audit';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Edit the architect pillars, credentials, and verification points here.
const ARCHITECT_CREDENTIALS = {
  name: 'Ahmad Jalhoom · أحمد جلهوم',
  portfolioUrl: 'https://ahmedsaleh.website',
  roleAr: 'مهندس نظم الذكاء الاصطناعي وبنية الويب المتقدمة',
  roleEn: 'Principal AI & Web Distributed Systems Architect',
  versionBadge: 'CRAWLIX PRO',
  establishedYear: '2026',
} as const;

const ARCHITECTURAL_PILLARS = [
  {
    id: 'node24',
    icon: Cpu,
    titleAr: 'محرك Node.js 24 الأصيل',
    titleEn: 'Native Node.js 24 Engine',
    descAr:
      'فحص شبكي متوازي حقيقي بدون أي بيانات وهمية، مع حماية أمنية من هجمات SSRF وتحليل Cheerio عالي السرعة.',
    descEn:
      'True concurrent network inspection with zero simulated fallbacks, sub-second TTFB telemetry, and built-in SSRF guards.',
  },
  {
    id: 'geo',
    icon: Sparkles,
    titleAr: 'هندسة الـ GEO وعصر الـ AI Search',
    titleEn: 'GEO & AI Search Grounding',
    descAr:
      'دعم متكامل لمواصفة llms.txt الجديدة وتحليل عميق لأذونات GPTBot و PerplexityBot ومخططات Schema.org.',
    descEn:
      'Full compliance with the emerging /llms.txt standard, multi-agent bot directives, and Schema.org knowledge graph parsing.',
  },
  {
    id: 'repair',
    icon: ShieldCheck,
    titleAr: 'مُولّد الإصلاح الآلي 100%',
    titleEn: '100% Score AI Master Repair Prompt',
    descAr:
      'توليد برومبت هندسي محدد وحتمي مخصص للنماذج الذكية (Claude 3.7 / ChatGPT-4o / Cursor) لمعالجة كافة العيوب فوراً.',
    descEn:
      'Deterministic instruction payloads engineered for Claude 3.7 and Cursor to patch all detected vulnerabilities in one prompt.',
  },
  {
    id: 'noslop',
    icon: CheckCircle2,
    titleAr: 'تصميم استوديو 100/100 مكافح للـ Slop',
    titleEn: '100% Anti-Slop Studio Discipline',
    descAr:
      'واجهة مستخدم احترافية بنظام أوبسيديان 90/10 وزمرد الليزر، خطوط عربية متصلة منضبطة، وانعدام تام للانزياح البصري (CLS = 0).',
    descEn:
      'Zero tacky AI gradients, 90/10 obsidian physics, tabular typography, and rock-solid CLS = 0 layout stability.',
  },
] as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface PillarCardProps {
  pillar: (typeof ARCHITECTURAL_PILLARS)[number];
  isAr: boolean;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
// (Pure display formatters)

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function PillarCard({ pillar, isAr }: PillarCardProps) {
  const Icon = pillar.icon;
  const title = isAr ? pillar.titleAr : pillar.titleEn;
  const desc = isAr ? pillar.descAr : pillar.descEn;

  return (
    <div className="surface-hud rounded-2xl p-5 space-y-2.5">
      <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <Icon className="size-4.5" />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
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
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            <span>{isAr ? 'العودة لمنصة الفحص' : 'Return to Auditor'}</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-300">
            {isAr ? 'عن المؤسس والمنصة' : 'About Architect & Platform'}
          </span>
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
                  {ARCHITECT_CREDENTIALS.name}
                </h1>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {isAr ? ARCHITECT_CREDENTIALS.roleAr : ARCHITECT_CREDENTIALS.roleEn}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-zinc-300">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{ARCHITECT_CREDENTIALS.versionBadge}</span>
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
            {ARCHITECTURAL_PILLARS.map((pillar) => (
              <PillarCard key={pillar.id} pillar={pillar} isAr={isAr} />
            ))}
          </div>
        </div>

        {/* Portfolio & Direct Attribution Banner */}
        <div className="surface-hud rounded-2xl p-6 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe2 className="size-5 text-emerald-400" />
            <div>
              <span className="text-sm font-bold text-white block">
                {isAr ? 'الملف الشخصي للمهندس أحمد جلهوم' : 'Architect Portfolio & Works'}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {ARCHITECT_CREDENTIALS.portfolioUrl}
              </span>
            </div>
          </div>
          <a
            href={ARCHITECT_CREDENTIALS.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-zinc-200 transition-colors"
          >
            {isAr ? 'زيارة الموقع الشخصي' : 'Visit Portfolio'}
          </a>
        </div>
      </main>

      <AuditFooter lang={lang} />
    </div>
  );
}
