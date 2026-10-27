'use client';

import * as React from 'react';
import { AuditHeader } from '@/components/AuditHeader';
import { AuditFooter } from '@/components/AuditFooter';
import { SupportedLang } from '@/types/audit';
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
          <span className="text-zinc-300">{isAr ? 'سياسة الخصوصية والأمان' : 'Privacy & Security'}</span>
        </div>

        {/* Header Block */}
        <div className="space-y-3 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs">
            <Lock className="size-3.5" />
            <span>{isAr ? 'حماية البيانات وعدم التخزين · معيار 2026' : 'Zero-Storage Privacy Architecture'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isAr ? 'سياسة الخصوصية وأمان البيانات في CRAWLIX' : 'CRAWLIX Data Privacy & Security Policy'}
          </h1>
          <p className="text-sm text-zinc-400 font-mono">
            {isAr
              ? 'تطوير وهندسة: أحمد جلهوم (Ahmad Jalhoom) · التزام تام بالسرية وأمان التصفح'
              : 'Engineered by Ahmad Jalhoom · Dedicated to Zero-Telemetry Confidentiality'}
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-zinc-300 font-sans">
          <section className="surface-hud rounded-2xl p-6 sm:p-7 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span className="text-emerald-400">01.</span>
              <span>{isAr ? 'مبدأ عدم تخزين البيانات (Zero Persistent Storage)' : 'Zero Persistent Storage Principle'}</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'لا تقوم منصة CRAWLIX بتخزين أي قواعد بيانات تحتوي على روابط المواقع المفحوصة أو محتوياتها. تتم جميع عمليات التحليل عبر الذاكرة المؤقتة (In-Memory Processing) الخاصة بخادم Node.js ويتم تحرير الموارد فور إرسال كائن الاستجابة إلى متصفحك.'
                : 'CRAWLIX operates on a strict zero-database, in-memory processing pipeline. Audited HTML trees, header dictionaries, and telemetry metrics are processed ephemerally in RAM and wiped the moment the JSON payload is dispatched.'}
            </p>
          </section>

          <section className="surface-hud rounded-2xl p-6 sm:p-7 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span className="text-emerald-400">02.</span>
              <span>{isAr ? 'الحماية من هجمات SSRF وعزل الشبكات' : 'SSRF Mitigation & Host Isolation'}</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'لحماية البنية التحتية، تحتوي المنصة على طبقة فحص أمني دقيقة تمنع استهداف أو فحص أي عناوين محلية (127.0.0.1، localhost) أو شبكات فرعية خاصة (10.0.0.0/8، 192.168.0.0/16) أو روابط استخراج البيانات السحابية (Cloud Metadata IP 169.254.169.254).'
                : 'To protect cloud networks, the fetcher actively rejects private IPv4 subnets, loopback interfaces, link-local addresses, and AWS/GCP cloud metadata endpoints before dispatching any TCP handshake.'}
            </p>
          </section>

          <section className="surface-hud rounded-2xl p-6 sm:p-7 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span className="text-emerald-400">03.</span>
              <span>{isAr ? 'ملفات تعريف الارتباط وتتبع المستخدم' : 'No Tracking Cookies or Spyware'}</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'المنصة خالية تماماً من أي سكربتات تتبع تجارية، أو ملفات تعريف ارتباط خاصة بالإعلانات (Advertising Cookies). تفضيلات اللغة يتم حفظها محلياً في الجلسة دون أي تسريب لأي جهات خارجية.'
                : 'We do not deploy marketing tracking scripts, pixel beacons, or persistent third-party cookies. Your session settings and audit results remain local to your personal client.'}
            </p>
          </section>

          <section className="surface-hud rounded-2xl p-6 sm:p-7 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span className="text-emerald-400">04.</span>
              <span>{isAr ? 'التواصل والمسؤولية الأمنية' : 'Security Inquiries & Ownership'}</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'لأي استفسارات بخصوص الأمان أو الإبلاغ عن ملاحظات تقنية، يمكنك التواصل مباشرة مع المهندس أحمد جلهوم (Ahmad Jalhoom) صاحب ومطور المنصة.'
                : 'For security inquiries, vulnerability disclosures, or enterprise audits, please contact Ahmad Jalhoom directly through official channels.'}
            </p>
          </section>
        </div>
      </main>

      <AuditFooter lang={lang} />
    </div>
  );
}
