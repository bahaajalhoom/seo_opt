'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import {
  Bot,
  CheckCircle2,
  XCircle,
  FileText,
  Code2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { GeoAuditDetails, SupportedLang, AiBotStatus } from '@/types/audit';
import { translations } from '@/lib/translations';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
const LLMS_SPEC_URL = 'https://llmstxt.org';

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface GeoDeepDiveProps {
  geo: GeoAuditDetails;
  lang: SupportedLang;
}

interface LlmsTxtCardProps {
  isDetected: boolean;
  title: string;
  foundText: string;
  missingText: string;
}

interface AiBotMatrixProps {
  bots: AiBotStatus[];
  title: string;
  isAr: boolean;
}

interface JsonLdGridProps {
  schemas: string[];
  title: string;
  emptyText: string;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
// (Pure display and formatting functions if needed)

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function LlmsTxtCard({ isDetected, title, foundText, missingText }: LlmsTxtCardProps) {
  return (
    <div className="md:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-5 flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
            <FileText className="size-4 text-emerald-400" />
            <span>/llms.txt</span>
          </span>
          <a
            href={LLMS_SPEC_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500"
          >
            <span>SPEC</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
        <p className="text-xs font-medium text-zinc-300 leading-relaxed">{title}</p>
      </div>

      <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
        {isDetected ? (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl w-full">
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="text-xs font-mono font-medium">{foundText}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-full">
            <XCircle className="size-4 shrink-0 text-amber-400" />
            <span className="text-xs font-mono font-medium">{missingText}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AiBotMatrix({ bots, title, isAr }: AiBotMatrixProps) {
  return (
    <div className="md:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-5 space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
        <span className="font-semibold text-zinc-300">{title}</span>
        <span className="text-[10px] text-zinc-500 font-mono">robots.txt directives</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        {bots.map((bot) => (
          <div
            key={bot.bot}
            className="flex items-center justify-between p-2.5 rounded-xl border border-white/[0.05] bg-[#0D0F14]"
          >
            <div className="min-w-0 pe-2">
              <span className="block font-mono text-xs font-bold text-zinc-200 truncate">
                {bot.bot}
              </span>
              <span className="block text-[10px] text-zinc-500 truncate font-mono">
                {bot.operator}
              </span>
            </div>
            {bot.allowed ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg shrink-0 font-semibold">
                <CheckCircle2 className="size-3" />
                <span>{isAr ? 'مسموح' : 'ALLOWED'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg shrink-0 font-semibold">
                <XCircle className="size-3" />
                <span>{isAr ? 'محظور' : 'BLOCKED'}</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function JsonLdGrid({ schemas, title, emptyText }: JsonLdGridProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C10] p-5 space-y-2.5">
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-emerald-400" />
          <span className="font-semibold text-zinc-300">{title}</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">JSON-LD ENGINES</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {schemas.length > 0 ? (
          schemas.map((schema) => (
            <span
              key={schema}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.08] text-xs font-mono text-emerald-300"
            >
              <Sparkles className="size-3 text-emerald-400" />
              <span>{schema}</span>
            </span>
          ))
        ) : (
          <p className="text-xs font-mono text-zinc-500 italic py-1">{emptyText}</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
export function GeoDeepDive({ geo, lang }: GeoDeepDiveProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';

  return (
    <div className="surface-hud rounded-3xl p-6 sm:p-7 space-y-6">
      {/* HUD Header & Indices */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="size-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.3)]">
            <Bot className="size-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {t.geoDeepDiveTitle}
              </h3>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                GPT-4o · Perplexity · Claude · Gemini
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">{t.geoDeepDiveSub}</p>
          </div>
        </div>

        {/* Index Metrics */}
        <div className="flex items-center gap-5 font-mono">
          <div className="bg-[#0D0F14] border border-white/[0.08] px-3 py-1.5 rounded-xl">
            <span className="block text-[10px] uppercase text-zinc-500 tracking-wider">
              {t.citationReadinessTitle}
            </span>
            <span className="text-base font-bold text-emerald-400 tabular-nums">
              {geo.citationReadinessScore}%
            </span>
          </div>
          <div className="bg-[#0D0F14] border border-white/[0.08] px-3 py-1.5 rounded-xl">
            <span className="block text-[10px] uppercase text-zinc-500 tracking-wider">
              {t.markdownClarityTitle}
            </span>
            <span className="text-base font-bold text-zinc-200 tabular-nums">
              {geo.markdownClarityScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid: llms.txt & AI Crawlers */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* /llms.txt Block */}
        <LlmsTxtCard
          isDetected={geo.llmsTxtDetected}
          title={t.llmsTxtTitle}
          foundText={t.llmsTxtFound}
          missingText={t.llmsTxtMissing}
        />

        {/* AI Bots Access Matrix */}
        <AiBotMatrix bots={geo.aiBots} title={t.aiBotsTitle} isAr={isAr} />
      </div>

      {/* Structured Schema.org Tags */}
      <JsonLdGrid
        schemas={geo.jsonLdSchemas}
        title={t.jsonLdTitle}
        emptyText={t.noJsonLdFound}
      />
    </div>
  );
}
