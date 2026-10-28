'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import {
  Search,
  Bot,
  Zap,
  Eye,
  Lock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { AuditResult, AuditCategory, CategoryScore, SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
const GAUGE_CONFIG = {
  radius: 62,
  strokeWidth: 10,
  viewBoxSize: 148,
} as const;

const CATEGORIES_ORDER: AuditCategory[] = [
  'seo',
  'geo',
  'performance',
  'accessibility',
  'security',
];

const CATEGORY_ICONS: Record<AuditCategory, React.ElementType> = {
  seo: Search,
  geo: Bot,
  performance: Zap,
  accessibility: Eye,
  security: Lock,
};

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface ScoreBentoProps {
  audit: AuditResult;
  lang: SupportedLang;
  onSelectCategory?: (cat: AuditCategory) => void;
}

interface RadialTelemetryProps {
  score: number;
  timestamp: string;
  verdictText: string;
  pointsToHundredText: string;
  title: string;
  subtitle: string;
  isAr: boolean;
}

interface CategoryCardProps {
  categoryKey: AuditCategory;
  categoryData: CategoryScore;
  categoryName: string;
  isWide: boolean;
  isGeo: boolean;
  isAr: boolean;
  onSelect?: () => void;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
function getScoreColorClass(score: number): string {
  if (score >= 90) return 'text-emerald-400 stroke-emerald-400';
  if (score >= 70) return 'text-amber-400 stroke-amber-400';
  return 'text-rose-400 stroke-rose-400';
}

function getProgressBarColorClass(score: number): string {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 70) return 'bg-amber-500';
  return 'bg-rose-500';
}

function calculateStrokeOffset(score: number, radius: number): { circumference: number; offset: number } {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return { circumference, offset };
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function RadialScoreTelemetryCard({
  score,
  timestamp,
  verdictText,
  pointsToHundredText,
  title,
  subtitle,
  isAr,
}: RadialTelemetryProps) {
  const { circumference, offset } = calculateStrokeOffset(score, GAUGE_CONFIG.radius);
  const formattedTime = new Date(timestamp).toLocaleTimeString(isAr ? 'ar-SA' : 'en-US');

  return (
    <div className="lg:col-span-5 surface-hud rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-2 font-medium">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isAr ? 'مؤشرات الأداء والتوافق اللحظي' : 'OVERALL HEALTH TELEMETRY'}</span>
          </span>
          <span className="tabular-nums text-xs text-zinc-500 font-mono">{formattedTime}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">{subtitle}</p>
      </div>

      {/* Center Circular Gauge */}
      <div className="my-8 flex items-center justify-center">
        <div className="relative size-44 flex items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 148 148">
            <circle
              cx="74"
              cy="74"
              r={GAUGE_CONFIG.radius}
              className="stroke-white/[0.05]"
              strokeWidth={GAUGE_CONFIG.strokeWidth}
              fill="none"
            />
            <circle
              cx="74"
              cy="74"
              r={GAUGE_CONFIG.radius}
              className={`${getScoreColorClass(score)} transition-all duration-1000 ease-out`}
              strokeWidth={GAUGE_CONFIG.strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-black font-mono tracking-tight text-white tabular-nums">
              {score}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium mt-0.5">
              {isAr ? 'مؤشر التوافق / 100' : 'INDEX / 100'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Verdict Pill */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-zinc-200 leading-normal">
            {verdictText}
          </span>
          <span className="text-[11px] text-emerald-400 tabular-nums font-medium block mt-0.5">
            {pointsToHundredText}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-medium shrink-0">
          <ShieldCheck className="size-3.5" />
          <span className="font-bold">{isAr ? 'مُعتمَد' : 'VERIFIED'}</span>
        </div>
      </div>
    </div>
  );
}

function CategoryScoreBentoCard({
  categoryKey,
  categoryData,
  categoryName,
  isWide,
  isGeo,
  isAr,
  onSelect,
}: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[categoryKey];
  const countLabel = isAr
    ? `${categoryData.passedCount} معيار سليم · ${categoryData.criticalCount} عيوب حرجة`
    : `${categoryData.passedCount} Passed · ${categoryData.criticalCount} Critical`;

  return (
    <button
      type="button"
      onClick={onSelect}
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
                {categoryName}
              </span>
              {isGeo && (
                <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                  {isAr ? 'أولوية AI' : 'AI PRIORITY'}
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-400 font-medium block mt-0.5">{countLabel}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-1 font-mono shrink-0" dir="ltr">
          <span className="text-2xl font-black text-white tabular-nums tracking-tight">
            {categoryData.score}
          </span>
          <span className="text-xs text-zinc-500 font-medium">%</span>
        </div>
      </div>

      {/* Track Progress Bar */}
      <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColorClass(
              categoryData.score
            )}`}
            style={{ width: `${categoryData.score}%` }}
          />
        </div>
        <ArrowUpRight className="size-4 text-zinc-500 group-hover:text-emerald-400 transition-colors shrink-0 rtl:-scale-x-100" />
      </div>
    </button>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
export function ScoreBento({ audit, lang, onSelectCategory }: ScoreBentoProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const verdictText = isAr ? audit.verdictAr : audit.verdictEn;
  const pointsToHundred = `${100 - audit.overallScore} ${t.pointsToHundred}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Hero Radial Telemetry Card (5 Columns) */}
      <RadialScoreTelemetryCard
        score={audit.overallScore}
        timestamp={audit.timestamp}
        verdictText={verdictText}
        pointsToHundredText={pointsToHundred}
        title={t.overallScoreTitle}
        subtitle={t.overallVerdictSub}
        isAr={isAr}
      />

      {/* 5 Architectural Bento Cards (7 Columns) */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {CATEGORIES_ORDER.map((categoryKey, index) => {
          const categoryData =
            audit.categories[categoryKey] ?? {
              score: 0,
              passedCount: 0,
              warningCount: 0,
              criticalCount: 0,
            };

          return (
            <CategoryScoreBentoCard
              key={categoryKey}
              categoryKey={categoryKey}
              categoryData={categoryData}
              categoryName={t.categories[categoryKey]}
              isWide={index === 0}
              isGeo={categoryKey === 'geo'}
              isAr={isAr}
              onSelect={() => onSelectCategory?.(categoryKey)}
            />
          );
        })}
      </div>
    </div>
  );
}
