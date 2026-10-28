'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import Link from 'next/link';
import {
  Palette,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Sliders,
  Code2,
} from 'lucide-react';
import { SupportedLang } from '@/types/audit';
import type { ExtractedColor } from '@/types/uiux';
import { translations } from '@/lib/translations';
import { extractBrandTokens } from '@/lib/promptGenerator';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
const PALETTE_SECTION_CONFIG = {
  maxVisibleColors: 18,
  copyToastDurationMs: 2000,
} as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface BrandPaletteSectionProps {
  colors?: ExtractedColor[];
  lang: SupportedLang;
  targetDomain?: string;
}

interface ColorSwatchTileProps {
  color: ExtractedColor;
  isCopied: boolean;
  onCopyHex: (hex: string) => void;
  isAr: boolean;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
/**
 * Generates ready-to-paste :root CSS variables stylesheet from extracted brand tokens.
 */
function buildCssVariablesSnippet(
  tokens: ReturnType<typeof extractBrandTokens>,
  domain?: string
): string {
  const domainComment = domain ? `/* Brand: ${domain} */\n` : '';
  return `${domainComment}:root {
  --brand-accent: ${tokens.accent};
  --bg-canvas: ${tokens.canvasBg};
  --bg-surface: ${tokens.surfaceBg};
  --text-primary: ${tokens.textPrimary};
  --text-muted: ${tokens.textMuted};
  --border-subtle: rgba(255, 255, 255, 0.08);
}`;
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================

/**
 * 90/10 Core Brand Tokens Summary Strip
 */
function TokensSummaryStrip({
  tokens,
  isAr,
  t,
}: {
  tokens: ReturnType<typeof extractBrandTokens>;
  isAr: boolean;
  t: (typeof translations)[SupportedLang];
}) {
  const tokenItems = [
    { label: t.paletteAccentLabel, hex: tokens.accent, isPrimaryAccent: true },
    { label: t.paletteCanvasLabel, hex: tokens.canvasBg, isPrimaryAccent: false },
    { label: t.paletteSurfaceLabel, hex: tokens.surfaceBg, isPrimaryAccent: false },
    { label: t.paletteTextLabel, hex: tokens.textPrimary, isPrimaryAccent: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#080A0F] border border-white/[0.06] rounded-2xl mb-6">
      {tokenItems.map((item) => (
        <div
          key={item.label}
          className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
            item.isPrimaryAccent
              ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
              : 'bg-white/[0.02] border-white/[0.06]'
          }`}
        >
          <div
            className="size-8 rounded-lg border border-white/20 shrink-0 shadow-sm"
            style={{ backgroundColor: item.hex }}
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-mono font-semibold text-zinc-400 block truncate">
              {item.label}
            </span>
            <span className="text-xs font-mono font-bold text-zinc-100 flex items-center gap-1">
              <span>{item.hex}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Individual Interactive Swatch Tile
 */
function ColorSwatchTile({
  color,
  isCopied,
  onCopyHex,
  isAr,
}: ColorSwatchTileProps) {
  return (
    <button
      type="button"
      onClick={() => onCopyHex(color.hex)}
      className="p-3 bg-[#0A0D14] hover:bg-[#101420] border border-white/[0.08] hover:border-emerald-500/40 rounded-xl flex items-center gap-3 text-start transition-all group relative active:scale-[0.98]"
      title={isAr ? `اضغط لنسخ ${color.hex}` : `Click to copy ${color.hex}`}
    >
      <div
        className="size-8 rounded-lg border border-white/20 shrink-0 shadow-sm"
        style={{ backgroundColor: color.hex }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-xs font-mono font-bold text-zinc-200 group-hover:text-emerald-400 flex items-center justify-between">
          <span>{color.hex}</span>
          {isCopied ? (
            <Check className="size-3.5 text-emerald-400 shrink-0" />
          ) : (
            <Copy className="size-3 opacity-0 group-hover:opacity-100 text-zinc-400 shrink-0 transition-opacity" />
          )}
        </div>
        <div className="text-[10px] text-zinc-400 font-mono capitalize truncate mt-0.5">
          <span>{color.role}</span>
          <span className="mx-1 text-zinc-600">·</span>
          <span>{color.frequency}x</span>
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// 6. MAIN COMPONENT (EXPORT DEFAULT & NAMED)
// ============================================================================
export function BrandPaletteSection({
  colors = [],
  lang,
  targetDomain,
}: BrandPaletteSectionProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);
  const [copiedCss, setCopiedCss] = React.useState(false);

  const brandTokens = React.useMemo(() => extractBrandTokens(colors), [colors]);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), PALETTE_SECTION_CONFIG.copyToastDurationMs);
  };

  const handleCopyCssVariables = () => {
    const css = buildCssVariablesSnippet(brandTokens, targetDomain);
    navigator.clipboard.writeText(css);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), PALETTE_SECTION_CONFIG.copyToastDurationMs);
  };

  if (!colors || colors.length === 0) {
    return (
      <div className="surface-hud rounded-3xl p-6 sm:p-7 text-center space-y-2">
        <Palette className="size-8 text-zinc-600 mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">{t.paletteEmpty}</p>
      </div>
    );
  }

  const visibleColors = colors.slice(0, PALETTE_SECTION_CONFIG.maxVisibleColors);

  return (
    <section className="surface-hud rounded-3xl p-6 sm:p-7 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Palette className="size-5 text-emerald-400" />
              <span>{t.paletteSectionTitle}</span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed ps-4">
            {t.paletteSectionSub}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleCopyCssVariables}
            className="h-9 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] hover:border-emerald-500/40 text-zinc-300 hover:text-white font-medium text-xs flex items-center gap-1.5 transition-all"
          >
            {copiedCss ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">{t.paletteCssCopied}</span>
              </>
            ) : (
              <>
                <Code2 className="size-3.5 text-zinc-400" />
                <span>{t.paletteCopyAllCss}</span>
              </>
            )}
          </button>

          <Link
            href="/ui-ux"
            className="h-9 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="size-3.5" />
            <span>{isAr ? 'مختبر UI/UX المتكامل' : 'Open UI/UX Lab'}</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>

      {/* 90/10 Tokens Quick Strip */}
      <TokensSummaryStrip tokens={brandTokens} isAr={isAr} t={t} />

      {/* Extracted Swatches Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-3 px-1">
          <span className="font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="size-3 text-emerald-400" />
            <span>{t.paletteDetectedCount} ({colors.length})</span>
          </span>
          <span className="text-[11px] text-zinc-400">
            {isAr ? 'انقر على أي لون لنسخ الـ HEX' : 'Click any swatch to copy HEX'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {visibleColors.map((color) => (
            <ColorSwatchTile
              key={color.hex}
              color={color}
              isCopied={copiedHex === color.hex}
              onCopyHex={handleCopyHex}
              isAr={isAr}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 7. HUMAN EDIT GUIDE & MAINTENANCE NOTES
// ============================================================================
/**
 * HOW TO MAINTAIN THIS COMPONENT:
 *
 * 1. Adjust Visible Swatch Limit:
 *    Modify PALETTE_SECTION_CONFIG.maxVisibleColors in Zone 2.
 *
 * 2. Change CSS Variable Tokens:
 *    Edit buildCssVariablesSnippet in Zone 4.
 */
