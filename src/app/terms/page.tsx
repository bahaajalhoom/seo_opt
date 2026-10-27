'use client';

import * as React from 'react';
import { AuditHeader } from '@/components/AuditHeader';
import { AuditFooter } from '@/components/AuditFooter';
import { SupportedLang } from '@/types/audit';
import { ShieldCheck, Scale, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
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
          <Link href="/" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            <span>{isAr ? 'العودة لمنصة الفحص' : 'Return to Auditor'}</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{isAr ? 'شروط الاستخدام' : 'Terms of Service'}</span>
        </div>

        {/* Header Block */}
        <div className="space-y-3 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs">
            <Scale className="size-3.5" />
            <span>{isAr ? 'اتفاقية الاستخدام الرسمية · CRAWLIX PRO' : 'Official Service Agreement · CRAWLIX PRO'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isAr ? 'شروط وأحكام استخدام منصة CRAWLIX' : 'CRAWLIX Terms of Service'}
          </h1>
          <p className="text-sm text-zinc-400 font-mono">
            {isAr
              ? 'تاريخ السريان: 27 أكتوبر 2026 · مُطورة بواسطة: أحمد جلهوم (Ahmad Jalhoom)'
              : 'Effective Date: October 27, 2026 · Engineered by Ahmad Jalhoom'}
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-zinc-300 font-sans">
          <section className="surface-hud rounded-2xl p-6 sm:p-7 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span className="text-emerald-400">01.</span>
              <span>{isAr ? 'طبيعة الخدمة والترخيص' : 'Nature of Service & License'}</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'تُعد منصة CRAWLIX أداة هندسية وتدقيقية متطورة تُعنى بتحليل أداء المواقع لمحركات البحث التقليدية (SEO) والذكاء الاصطناعي التوليدي (GEO). تم تصميم وتطوير المنصة بواسطة أحمد جلهوم (Ahmad Jalhoom)، ويُمنح المستخدم ترخيصاً غير حصري للاستفادة من الفحوصات وتوليد برومبتات الإصلاح للأغراض التطويرية والمهنية.'
                : 'CRAWLIX is a high-precision engineering audit platform developed by Ahmad Jalhoom to evaluate web applications for traditional SEO and Generative Engine Optimization (GEO). Users are granted a non-exclusive license to inspect domains and utilize generated remediation prompts for professional development.'}
            </p>
          </section>

          <section className="surface-hud rounded-2xl p-6 sm:p-7 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span className="text-emerald-400">02.</span>
              <span>{isAr ? 'سياسة الفحص والزحف العادل (Fair Crawling Policy)' : 'Fair Crawling & Inspection Policy'}</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'يوافق المستخدم على إدخال عناوين المواقع التي يملكها أو المخول بفحصها. يلتزم محرك الفحص بمهلات زمنية صارمة (15 ثانية) ولا يقوم بأي عمليات هجومية أو إغراق للسيرفرات، ويحظر تماماً استخدام المنصة لمحاولة استهداف الشبكات الداخلية أو اختراق بروتوكولات الأمان (SSRF Protection Enforced).'
                : 'Users agree to submit URLs they own or are authorized to inspect. The engine respects tight 15-second timeouts, issues zero load-stress tests, and enforces strict SSRF protections against internal network scanning.'}
            </p>
          </section>

          <section className="surface-hud rounded-2xl p-6 sm:p-7 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span className="text-emerald-400">03.</span>
              <span>{isAr ? 'الملكية الفكرية وحقوق النشر (Intellectual Property)' : 'Intellectual Property & Copyright'}</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'كافة حقوق التصميم، الأكواد المصدرية، خوارزميات التدقيق، وهوية CRAWLIX البصرية واللوجو مملوكة بالكامل للمطور والمهندس أحمد جلهوم (Ahmad Jalhoom) ومحمية بقوانين الملكية الفكرية الدولية لعام 2026. يحق للمستخدم استخدام ومشاركة نتائج الفحوصات وبرومبتات الإصلاح الناتجة بحرية تامة في مشاريعه.'
                : 'All source code, visual design, custom logos, and algorithmic scoring heuristics are the exclusive intellectual property of Ahmad Jalhoom, protected under international copyright treaties (2026). Users retain full rights to export and execute generated repair prompts in their own projects.'}
            </p>
          </section>

          <section className="surface-hud rounded-2xl p-6 sm:p-7 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span className="text-emerald-400">04.</span>
              <span>{isAr ? 'إخلاء المسؤولية وضمان النتائج' : 'Disclaimer & Remediation Guidance'}</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'يتم توفير نتائج الفحص وبرومبتات الـ 100% "كما هي" كإرشادات هندسية وتوصيات برمجية دقيقة. رغم حرصنا على توفير أعلى درجات الدقة المطابقة لمعايير Schema.org و llmstxt.org، فإن تطبيق التعديلات يبقى مسؤولية المطور أو مالك الموقع.'
                : 'Audit metrics and 100% Master Repair Prompts are provided "as-is" as production-grade architectural guidance. While heuristics strictly track official W3C, Schema.org, and llmstxt.org standards, implementation remains the responsibility of the engineering team.'}
            </p>
          </section>
        </div>
      </main>

      <AuditFooter lang={lang} />
    </div>
  );
}
