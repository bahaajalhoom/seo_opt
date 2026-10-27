'use client';

import * as React from 'react';
import {
  Sparkles,
  Search,
  Bot,
  Zap,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  RotateCw,
  Terminal,
  Activity,
  Layers,
  Code2,
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

export default function AuditDashboardPage() {
  const [lang, setLang] = React.useState<SupportedLang>('ar');
  const [isLoading, setIsLoading] = React.useState(false);
  const [auditData, setAuditData] = React.useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<AuditCategory | 'all'>('all');
  const [isPromptModalOpen, setIsPromptModalOpen] = React.useState(false);

  const t = translations[lang];

  const handleToggleLang = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const handleRunAudit = async (url: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuditData(data);
        setSelectedCategory('all');
      } else {
        setAuditData(null);
        setErrorMessage(
          data.detail ||
            (lang === 'ar'
              ? 'تعذر الوصول إلى الموقع المستهدف: النطاق غير موجود أو السيرفر لا يستجيب.'
              : 'Target domain unreachable: The domain does not exist or server did not respond.')
        );
      }
    } catch {
      setAuditData(null);
      setErrorMessage(
        lang === 'ar'
          ? 'خطأ في الاتصال: تعذر إرسال الطلب إلى خادم الفحص أو انقطع الاتصال.'
          : 'Network error: Failed to reach audit server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!auditData) return;
    const jsonStr = JSON.stringify(auditData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Audit-Report-${auditData.domain}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06070A] text-zinc-100 bg-grid-precision selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Precision Header */}
      <AuditHeader
        lang={lang}
        onToggleLang={handleToggleLang}
        onExportReport={handleExportReport}
        hasReport={!!auditData && !isLoading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Terminal Input Bar */}
        <section className="space-y-4">
          <UrlInputBar lang={lang} isLoading={isLoading} onAudit={handleRunAudit} />
        </section>

        {/* STATE 1: Real Server Error (RFC 9457) */}
        {errorMessage && !isLoading && (
          <div className="surface-hud rounded-2xl p-6 border border-rose-500/30 bg-rose-500/[0.04] space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertOctagon className="size-5 shrink-0" />
              <h3 className="text-sm font-bold font-mono tracking-wide">{t.errorTitle}</h3>
            </div>
            <p className="text-xs font-mono text-rose-200/90 leading-relaxed ps-7">{errorMessage}</p>
            <div className="ps-7 pt-1">
              <button
                type="button"
                onClick={() => handleRunAudit('https://github.com')}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono transition-colors"
              >
                <RotateCw className="size-3.5" />
                <span>{t.errorRetryBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE 2: Loading Skeleton (Zero CLS) */}
        {isLoading && <AuditSkeleton />}

        {/* STATE 3: Populated Audit Workspace */}
        {auditData && !isLoading && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Centerpiece: Master AI Repair Prompt CTA Banner */}
            <div className="surface-hud rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-[0_0_32px_rgba(16,185,129,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Sparkles className="size-4.5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {t.masterPromptCtaTitle}
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    100% REPAIR
                  </span>
                </div>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  {t.masterPromptCtaSub}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPromptModalOpen(true)}
                className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#06070A] text-xs font-bold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0 shadow-[0_2px_16px_rgba(16,185,129,0.3)]"
              >
                <span>{t.openMasterPromptBtn}</span>
                <ArrowRight className="size-4 stroke-[2.5] rtl:-scale-x-100" />
              </button>
            </div>

            {/* Tactical Score Bento */}
            <ScoreBento
              audit={auditData}
              lang={lang}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* GEO AI Engine Telemetry */}
            <GeoDeepDive geo={auditData.geoDetails} lang={lang} />

            {/* Prioritized Issues & Solutions Worklist */}
            <IssuesList
              issues={auditData.issues}
              lang={lang}
              selectedCategory={selectedCategory}
            />
          </div>
        )}

        {/* STATE 4: Initial Empty State */}
        {!auditData && !isLoading && !errorMessage && (
          <div className="py-12 sm:py-20 space-y-14">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{lang === 'ar' ? 'فحص شبكي لحظي عالي الدقة · NEXT.JS 16 & NODE 24' : 'REAL-TIME AUDIT TELEMETRY · NEXT.JS 16 & NODE 24'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t.emptyHeroTitle}
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed text-pretty max-w-xl mx-auto">
                {t.emptyHeroSub}
              </p>
            </div>

            {/* 4 Precision Feature Bento Cells */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="surface-hud-interactive rounded-2xl p-5 space-y-3">
                <div className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-200">
                  <Search className="size-5 stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-semibold text-white">{t.featureSeoTitle}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{t.featureSeoDesc}</p>
              </div>

              <div className="surface-hud-interactive rounded-2xl p-5 space-y-3 border-emerald-500/30">
                <div className="size-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bot className="size-5 stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-semibold text-white">{t.featureGeoTitle}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{t.featureGeoDesc}</p>
              </div>

              <div className="surface-hud-interactive rounded-2xl p-5 space-y-3">
                <div className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-200">
                  <Zap className="size-5 stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-semibold text-white">{t.featureSpeedTitle}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{t.featureSpeedDesc}</p>
              </div>

              <div className="surface-hud-interactive rounded-2xl p-5 space-y-3">
                <div className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-200">
                  <Sparkles className="size-5 stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-semibold text-white">{t.featureFixTitle}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{t.featureFixDesc}</p>
              </div>
            </div>
          </div>
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
