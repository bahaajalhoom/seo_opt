'use client';

import * as React from 'react';
import {
  Search,
  Bot,
  Zap,
  Eye,
  Lock,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { AuditResult, AuditCategory, SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';

interface ScoreBentoProps {
  audit: AuditResult;
  lang: SupportedLang;
  onSelectCategory?: (cat: AuditCategory) => void;
}

const CATEGORY_ICONS: Record<AuditCategory, React.ElementType> = {
  seo: Search,
  geo: Bot,
  performance: Zap,
  accessibility: Eye,
  security: Lock,
};

export function ScoreBento({ audit, lang, onSelectCategory }: ScoreBentoProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (audit.overallScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 stroke-emerald-400';
    if (score >= 70) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const categoriesOrder: AuditCategory[] = ['seo', 'geo', 'performance', 'accessibility', 'security'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Hero Radial Telemetry Card (5 Columns) */}
      <div className="lg:col-span-5 surface-hud rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Top Telemetry Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-2 font-medium">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isAr ? 'مؤشرات الأداء والتوافق اللحظي' : 'OVERALL HEALTH TELEMETRY'}</span>
            </span>
            <span className="tabular-nums text-xs text-zinc-500 font-mono">
              {new Date(audit.timestamp).toLocaleTimeString(isAr ? 'ar-SA' : 'en-US')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {t.overallScoreTitle}
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {t.overallVerdictSub}
          </p>
        </div>

        {/* Tactical Center Radial Gauge */}
        <div className="my-8 flex items-center justify-center">
          <div className="relative size-44 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 148 148">
              {/* Radial tick ring */}
              <circle
                cx="74"
                cy="74"
                r={radius}
                className="stroke-white/[0.05]"
                strokeWidth="10"
                fill="none"
              />
              {/* Live progress arc */}
              <circle
                cx="74"
                cy="74"
                r={radius}
                className={`${getScoreColor(audit.overallScore)} transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black font-mono tracking-tight text-white tabular-nums">
                {audit.overallScore}
              </span>
              <span className="text-[11px] text-zinc-400 font-medium mt-0.5">
                {isAr ? 'مؤشر التوافق / 100' : 'INDEX / 100'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Verdict Pill & Benchmark */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-zinc-200 leading-normal">
              {isAr ? audit.verdictAr : audit.verdictEn}
            </span>
            <span className="text-[11px] text-emerald-400 tabular-nums font-medium block mt-0.5">
              {100 - audit.overallScore} {t.pointsToHundred}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-medium shrink-0">
            <ShieldCheck className="size-3.5" />
            <span className="font-bold">{isAr ? 'مُعتمَد' : 'VERIFIED'}</span>
          </div>
        </div>
      </div>

      {/* 5 Architectural Bento Cards (7 Columns) */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {categoriesOrder.map((catKey, index) => {
          const cat = audit.categories[catKey] || { score: 0, passedCount: 0, warningCount: 0, criticalCount: 0 };
          const Icon = CATEGORY_ICONS[catKey];
          const isGeo = catKey === 'geo';
          const isWide = index === 0; // Top card spans full width for asymmetrical balance

          return (
            <button
              key={catKey}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(catKey)}
              className={`surface-hud-interactive rounded-2xl p-5 text-start relative group flex flex-col justify-between ${
                isWide ? 'sm:col-span-2' : ''
              } ${isGeo ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.06)]' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isGeo
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                        : 'bg-white/[0.04] border border-white/[0.08] text-zinc-300'
                    }`}
                  >
                    <Icon className="size-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white tracking-tight">
                        {t.categories[catKey]}
                      </span>
                      {isGeo && (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                          {isAr ? 'أولوية AI' : 'AI PRIORITY'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 font-medium block mt-0.5">
                      {isAr
                        ? `${cat.passedCount} معيار سليم · ${cat.criticalCount} عيوب حرجة`
                        : `${cat.passedCount} Passed · ${cat.criticalCount} Critical`}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 font-mono shrink-0" dir="ltr">
                  <span className="text-2xl font-black text-white tabular-nums tracking-tight">
                    {cat.score}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">%</span>
                </div>
              </div>

              {/* Minimal Track Progress Bar */}
              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cat.score >= 90 ? 'bg-emerald-500' : cat.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <ArrowUpRight className="size-4 text-zinc-500 group-hover:text-emerald-400 transition-colors shrink-0 rtl:-scale-x-100" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
