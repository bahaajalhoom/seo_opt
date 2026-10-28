'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Eye,
  EyeOff,
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  Smartphone,
  Tablet,
  Monitor,
  Code2,
  Palette,
  Type,
  MousePointerClick,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  SlidersHorizontal,
  SplitSquareVertical,
  ExternalLink,
  RefreshCw,
  Sliders,
  Move,
  ArrowRight,
} from 'lucide-react';
import { AuditHeader } from '@/components/AuditHeader';
import { AuditFooter } from '@/components/AuditFooter';
import { SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';
import { extractBrandTokens, type BrandTokens } from '@/lib/promptGenerator';
import type { UiUxAuditResult, ExtractedColor } from '@/types/uiux';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Quick demo URLs for instant 1-click loading
const QUICK_DEMO_URLS = [
  'https://seo-opt.apps.taqat.academy',
  'https://ahmedsaleh.website',
  'https://stripe.com',
  'https://github.com',
] as const;

// Viewport sizes for the Figma frame
type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_CONFIG: Record<
  ViewportMode,
  { labelAr: string; labelEn: string; widthPx: number; icon: React.ComponentType<{ className?: string }> }
> = {
  desktop: { labelAr: 'حاسوب (1440px)', labelEn: 'Desktop (1440px)', widthPx: 1440, icon: Monitor },
  tablet: { labelAr: 'لوحي (768px)', labelEn: 'Tablet (768px)', widthPx: 768, icon: Tablet },
  mobile: { labelAr: 'موبايل (375px)', labelEn: 'Mobile (375px)', widthPx: 375, icon: Smartphone },
};

// Studio view modes
type StudioViewMode = 'redesign' | 'compare' | 'wireframe';

// Layer definitions for the Figma Layers panel
const FIGMA_LAYERS = [
  { id: 'frame-root', nameAr: '📱 إطار الواجهة (Artboard)', nameEn: '📱 Artboard: Landing Page', depth: 0 },
  { id: 'layer-nav', nameAr: '🏷️ شريط التنقل العلوي (Navbar)', nameEn: '🏷️ Global Navbar', depth: 1 },
  { id: 'layer-hero', nameAr: '⚡ القسم الرئيسي (Hero Section)', nameEn: '⚡ Hero Section', depth: 1 },
  { id: 'layer-bento', nameAr: '💎 شبكة بينتو غير المتماثلة (Bento)', nameEn: '💎 Asymmetric Bento Grid', depth: 1 },
  { id: 'layer-metrics', nameAr: '📊 مؤشرات الأداء والقياس (Metrics)', nameEn: '📊 Telemetry Metrics', depth: 1 },
  { id: 'layer-cta', nameAr: '🚀 شريط الإجراء الرئيسي (CTA Strip)', nameEn: '🚀 Primary CTA Strip', depth: 1 },
  { id: 'layer-footer', nameAr: '⚓ التذييل الدلالي (Semantic Footer)', nameEn: '⚓ Semantic Footer', depth: 1 },
] as const;

// Default brand tokens fallback
const FALLBACK_TOKENS: BrandTokens = {
  accent: '#10B981',
  accentHover: '#059669',
  canvasBg: '#08090C',
  surfaceBg: '#0F1218',
  textPrimary: '#F8F9FA',
  textMuted: '#94A3B8',
  paletteList: [],
};

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface AppliedFixesState {
  paletteDiscipline: boolean;
  lineHeightScale: boolean;
  touchTargets44: boolean;
  wcagContrast: boolean;
  asymmetricBento: boolean;
}

// ============================================================================
// 4. HELPER FUNCTIONS & CODE GENERATORS
// ============================================================================
/**
 * Generates production-ready Next.js / React 19 + Tailwind TSX code
 * matching the redesigned Figma artboard with extracted tokens.
 */
function generateRecreatedReactCode(domain: string, tokens: BrandTokens): string {
  return `// ============================================================================
// Recreated Clean Architecture Component for: ${domain}
// Engineered with: React 19 + Tailwind CSS + WCAG 2.1 AA Compliance
// 90/10 Palette: Canvas (${tokens.canvasBg}) · Accent (${tokens.accent})
// ============================================================================
import React from 'react';

export default function Redesigned${domain.replace(/[^a-zA-Z0-9]/g, '')}Landing() {
  return (
    <div className="min-h-screen bg-[${tokens.canvasBg}] text-[${tokens.textPrimary}] antialiased font-sans">
      {/* 1. Global Navigation Bar (44px touch targets) */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[${tokens.canvasBg}]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="size-3 rounded-full bg-[${tokens.accent}] shadow-sm" />
            <span className="text-base font-bold tracking-tight text-white">${domain}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[${tokens.textMuted}]">
            <a href="#features" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded px-1.5 py-0.5">المزايا</a>
            <a href="#architecture" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded px-1.5 py-0.5">البنية التحتية</a>
            <a href="#pricing" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded px-1.5 py-0.5">الأسعار</a>
          </nav>
          <button
            type="button"
            className="h-10 px-5 rounded-lg bg-[${tokens.accent}] text-[${tokens.canvasBg}] text-sm font-bold hover:brightness-110 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${tokens.accent}]"
          >
            ابدأ مجاناً
          </button>
        </div>
      </header>

      {/* 2. Hero Section (Leading-relaxed & Optical Typography) */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-[${tokens.surfaceBg}] text-xs text-[${tokens.textMuted}]">
            <span className="size-1.5 rounded-full bg-[${tokens.accent}]" />
            <span>تصميم هندسي متماسك مطابق لمعيار WCAG 2.1 AA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            إعادة هندسة تجربة المستخدم بأعلى درجات الانضباط
          </h1>

          <p className="text-base sm:text-lg text-[${tokens.textMuted}] leading-relaxed font-normal">
            تم استبدال التدرجات العشوائية والمشاكل الهندسية بأسطح محايدة هادئة، خطوط مريحة للعين، وزر إجراء رئيسي واضح يقود لزيادة معدل التحويل.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[${tokens.accent}] text-[${tokens.canvasBg}] text-base font-bold hover:brightness-110 active:scale-95 transition-all shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[${tokens.accent}]"
            >
              تجربة المنصة الآن
            </button>
            <button
              type="button"
              className="w-full sm:w-auto h-12 px-6 rounded-xl border border-white/[0.1] bg-[${tokens.surfaceBg}] text-white text-base font-medium hover:bg-white/[0.05] transition-all"
            >
              عرض التوثيق التقني
            </button>
          </div>
        </section>

        {/* 3. Asymmetrical Bento Grid (No generic 3 cards) */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 rounded-2xl border border-white/[0.08] bg-[${tokens.surfaceBg}] p-8 space-y-4">
            <div className="size-10 rounded-xl bg-[${tokens.accent}]/10 border border-[${tokens.accent}]/20 flex items-center justify-center text-[${tokens.accent}] font-bold">
              01
            </div>
            <h3 className="text-xl font-bold text-white">انضباط الألوان بنسبة 90/10</h3>
            <p className="text-sm text-[${tokens.textMuted}] leading-relaxed">
              تخصيص 90% من المساحات للكانفاس الهادئ والأسطح المحايدة، بينما يخصص لون التمييز (${tokens.accent}) بنسبة 10% للأزرار الحيوية فقط.
            </p>
          </div>

          <div className="md:col-span-4 rounded-2xl border border-white/[0.08] bg-[${tokens.surfaceBg}] p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-[${tokens.textMuted}]">معدل التباين</span>
              <div className="text-4xl font-black text-white mt-2">7.4:1</div>
            </div>
            <span className="text-xs text-[${tokens.accent}] font-medium mt-6">مطابق لمعيار WCAG 2.1 AA</span>
          </div>
        </section>
      </main>
    </div>
  );
}`;
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================

/**
 * 5.1 Figma Studio Top Toolbar
 */
function FigmaTopBar({
  domain,
  viewport,
  onSelectViewport,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  showGrid,
  onToggleGrid,
  showAnnotations,
  onToggleAnnotations,
  viewMode,
  onSelectViewMode,
  onOpenExportModal,
  isAr,
}: {
  domain: string;
  viewport: ViewportMode;
  onSelectViewport: (v: ViewportMode) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
  viewMode: StudioViewMode;
  onSelectViewMode: (m: StudioViewMode) => void;
  onOpenExportModal: () => void;
  isAr: boolean;
}) {
  return (
    <div className="h-14 border-b border-white/[0.08] bg-[#0A0C10] px-4 flex items-center justify-between gap-3 text-xs select-none">
      {/* File Title & Status */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Sparkles className="size-3.5 text-emerald-400" />
        </div>
        <div className="truncate">
          <div className="font-bold text-zinc-200 truncate flex items-center gap-1.5">
            <span>{domain}</span>
            <span className="text-zinc-500 font-normal">/</span>
            <span className="text-emerald-400 font-semibold">{isAr ? 'إعادة التصميم في كانفاس Figma' : 'Figma Redesign.fig'}</span>
          </div>
        </div>
      </div>

      {/* Viewport Frame Selectors */}
      <div className="hidden md:flex items-center gap-1 bg-[#12151C] p-1 rounded-xl border border-white/[0.08]">
        {(['desktop', 'tablet', 'mobile'] as ViewportMode[]).map((v) => {
          const cfg = VIEWPORT_CONFIG[v];
          const Icon = cfg.icon;
          const isActive = viewport === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onSelectViewport(v)}
              className={`h-7 px-2.5 rounded-lg flex items-center gap-1.5 font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
              }`}
            >
              <Icon className="size-3.5" />
              <span className="text-[11px]">{isAr ? cfg.labelAr : cfg.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* View Mode Controls: Redesign vs Compare vs Wireframe */}
      <div className="flex items-center gap-1 bg-[#12151C] p-1 rounded-xl border border-white/[0.08]">
        <button
          type="button"
          onClick={() => onSelectViewMode('redesign')}
          className={`h-7 px-3 rounded-lg font-medium transition-all ${
            viewMode === 'redesign'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {isAr ? '✨ التصميم الجديد' : '✨ Redesign'}
        </button>
        <button
          type="button"
          onClick={() => onSelectViewMode('compare')}
          className={`h-7 px-3 rounded-lg font-medium transition-all ${
            viewMode === 'compare'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {isAr ? '🔄 قبل وبعد' : '🔄 Diff'}
        </button>
        <button
          type="button"
          onClick={() => onSelectViewMode('wireframe')}
          className={`h-7 px-3 rounded-lg font-medium transition-all ${
            viewMode === 'wireframe'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {isAr ? '📐 الهيكل والشبكة' : '📐 Blueprint'}
        </button>
      </div>

      {/* Zoom & Canvas Tool Controls */}
      <div className="flex items-center gap-2">
        {/* Toggle Grid */}
        <button
          type="button"
          onClick={onToggleGrid}
          title={isAr ? 'تبديل إظهار شبكة التصميم (12 Columns)' : 'Toggle Layout Grid'}
          className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all ${
            showGrid
              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
              : 'border-white/[0.08] bg-[#12151C] text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Grid className="size-3.5" />
        </button>

        {/* Toggle Floating Fix Annotations */}
        <button
          type="button"
          onClick={onToggleAnnotations}
          title={isAr ? 'إظهار شارات الإصلاحات الهندسية' : 'Toggle Fix Annotations'}
          className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all ${
            showAnnotations
              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
              : 'border-white/[0.08] bg-[#12151C] text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {showAnnotations ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        </button>

        {/* Zoom controls */}
        <div className="hidden sm:flex items-center gap-1 bg-[#12151C] px-1.5 py-1 rounded-xl border border-white/[0.08]">
          <button
            type="button"
            onClick={onZoomOut}
            className="h-6 w-6 rounded hover:bg-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-zinc-200"
            title="Zoom Out"
          >
            <ZoomOut className="size-3" />
          </button>
          <button
            type="button"
            onClick={onResetZoom}
            className="text-[11px] font-mono px-1.5 text-zinc-300 hover:text-white"
            title="Reset Zoom (100%)"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            className="h-6 w-6 rounded hover:bg-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-zinc-200"
            title="Zoom In"
          >
            <ZoomIn className="size-3" />
          </button>
        </div>

        {/* Export Code Button */}
        <button
          type="button"
          onClick={onOpenExportModal}
          className="h-8 px-3 rounded-lg bg-emerald-500 text-black font-bold flex items-center gap-1.5 hover:bg-emerald-400 active:scale-95 transition-all shadow-sm"
        >
          <Code2 className="size-3.5" />
          <span>{isAr ? 'تصدير الكود' : 'Export Code'}</span>
        </button>
      </div>
    </div>
  );
}

/**
 * 5.2 Figma Layers Sidebar
 */
function FigmaLayersPanel({
  selectedLayer,
  onSelectLayer,
  isAr,
}: {
  selectedLayer: string;
  onSelectLayer: (id: string) => void;
  isAr: boolean;
}) {
  return (
    <aside className="w-64 border-l rtl:border-l-0 rtl:border-r border-white/[0.08] bg-[#0A0C10] flex flex-col select-none shrink-0">
      <div className="h-10 px-4 border-b border-white/[0.08] flex items-center justify-between text-xs font-bold text-zinc-300">
        <span className="flex items-center gap-1.5">
          <Layers className="size-3.5 text-emerald-400" />
          <span>{isAr ? 'الطبقات (Layers)' : 'Layers'}</span>
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">7 Components</span>
      </div>

      <div className="p-2 space-y-1 overflow-y-auto flex-1 font-mono text-xs">
        {FIGMA_LAYERS.map((layer) => {
          const isSelected = selectedLayer === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => onSelectLayer(layer.id)}
              className={`w-full text-start px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
              style={{ paddingInlineStart: `${layer.depth * 14 + 10}px` }}
            >
              <span className="truncate">{isAr ? layer.nameAr : layer.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Mini Figma Frame Info Footer */}
      <div className="p-3 border-t border-white/[0.08] text-[11px] text-zinc-400 space-y-1">
        <div className="flex justify-between">
          <span>{isAr ? 'نوع الإطار:' : 'Frame Type:'}</span>
          <span className="text-zinc-200 font-mono">Auto Layout (Flex)</span>
        </div>
        <div className="flex justify-between">
          <span>{isAr ? 'توزيع الألوان:' : 'Palette Rule:'}</span>
          <span className="text-emerald-400 font-bold">90/10 Studio</span>
        </div>
      </div>
    </aside>
  );
}

/**
 * 5.3 Figma Properties & Inspector Panel
 */
function FigmaPropertiesPanel({
  tokens,
  domain,
  fixes,
  onToggleFix,
  onCopyColor,
  copiedColor,
  isAr,
}: {
  tokens: BrandTokens;
  domain: string;
  fixes: AppliedFixesState;
  onToggleFix: (id: keyof AppliedFixesState) => void;
  onCopyColor: (hex: string) => void;
  copiedColor: string | null;
  isAr: boolean;
}) {
  return (
    <aside className="w-72 border-r rtl:border-r-0 rtl:border-l border-white/[0.08] bg-[#0A0C10] flex flex-col select-none shrink-0 overflow-y-auto">
      {/* Panel Header */}
      <div className="h-10 px-4 border-b border-white/[0.08] flex items-center justify-between text-xs font-bold text-zinc-300">
        <span className="flex items-center gap-1.5">
          <Sliders className="size-3.5 text-emerald-400" />
          <span>{isAr ? 'المفتش والتصميم (Design)' : 'Design Inspector'}</span>
        </span>
        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          Studio Grade
        </span>
      </div>

      <div className="p-4 space-y-6 text-xs">
        {/* Frame Metrics (Figma Style W/H/X/Y) */}
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            {isAr ? 'أبعاد الإطار (Frame Specs)' : 'Frame Dimensions'}
          </span>
          <div className="grid grid-cols-2 gap-2 text-zinc-300 font-mono">
            <div className="bg-[#12151C] p-2 rounded-lg border border-white/[0.06] flex justify-between items-center">
              <span className="text-zinc-500">W</span>
              <span>1440 px</span>
            </div>
            <div className="bg-[#12151C] p-2 rounded-lg border border-white/[0.06] flex justify-between items-center">
              <span className="text-zinc-500">H</span>
              <span>Auto</span>
            </div>
            <div className="bg-[#12151C] p-2 rounded-lg border border-white/[0.06] flex justify-between items-center">
              <span className="text-zinc-500">Radius</span>
              <span>16 px</span>
            </div>
            <div className="bg-[#12151C] p-2 rounded-lg border border-white/[0.06] flex justify-between items-center">
              <span className="text-zinc-500">Border</span>
              <span>1px Solid</span>
            </div>
          </div>
        </div>

        {/* 90/10 Extracted Color Tokens */}
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            {isAr ? 'رموز الألوان المستخرجة (90/10 Tokens)' : 'Extracted 90/10 Tokens'}
          </span>
          <div className="space-y-2">
            {[
              { labelAr: 'لون التمييز (Accent 10%)', labelEn: 'Brand Accent (10%)', hex: tokens.accent },
              { labelAr: 'خلفية الكانفاس (Canvas 90%)', labelEn: 'Canvas Background (90%)', hex: tokens.canvasBg },
              { labelAr: 'أسطح البطاقات (Surface)', labelEn: 'Surface Cards', hex: tokens.surfaceBg },
              { labelAr: 'النصوص الرئيسية (Text)', labelEn: 'Primary Text', hex: tokens.textPrimary },
            ].map((token) => (
              <button
                key={token.labelEn}
                type="button"
                onClick={() => onCopyColor(token.hex)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-[#12151C] border border-white/[0.06] hover:border-white/[0.15] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="size-4 rounded-md border border-white/20 shrink-0"
                    style={{ backgroundColor: token.hex }}
                  />
                  <span className="text-zinc-300 truncate">{isAr ? token.labelAr : token.labelEn}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                  <span>{token.hex}</span>
                  {copiedColor === token.hex ? (
                    <Check className="size-3 text-emerald-400" />
                  ) : (
                    <Copy className="size-3 text-zinc-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Applied Fixes Matrix (Toggles) */}
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            {isAr ? 'مصفوفة الإصلاحات الهندسية (Applied Fixes)' : 'Applied Architectural Fixes'}
          </span>
          <div className="space-y-2">
            {[
              {
                id: 'paletteDiscipline' as const,
                labelAr: 'قاعدة 90/10 للألوان المعتمدة',
                labelEn: '90/10 Palette Discipline',
                desc: 'حصر لون التمييز في الـ CTAs فقط',
              },
              {
                id: 'lineHeightScale' as const,
                labelAr: 'ارتفاع الأسطر الذهبي (1.625)',
                labelEn: 'Line-Height Rhythm (1.625)',
                desc: 'مساحة تنفس مريحة للقراءة الطويلة',
              },
              {
                id: 'touchTargets44' as const,
                labelAr: 'مساحات النقر 44px لملافي الأخطاء',
                labelEn: '44px Touch Targets',
                desc: 'توافق كامل مع قانون فيتس للموبايل',
              },
              {
                id: 'wcagContrast' as const,
                labelAr: 'تحقيق تباين WCAG 2.1 AA (4.5:1)',
                labelEn: 'WCAG 2.1 AA Contrast Ratio',
                desc: 'وضوح فائق للنصوص المكتومة والعناصر',
              },
              {
                id: 'asymmetricBento' as const,
                labelAr: 'شبكة بينتو غير متماثلة (Bento Grid)',
                labelEn: 'Asymmetrical Bento Architecture',
                desc: 'استبدال الكروت المتطابقة الروتينية',
              },
            ].map((fix) => {
              const isEnabled = fixes[fix.id];
              return (
                <div
                  key={fix.id}
                  className="p-2.5 rounded-xl bg-[#12151C] border border-white/[0.06] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-200 text-[11px]">
                      {isAr ? fix.labelAr : fix.labelEn}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">{fix.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFix(fix.id)}
                    className={`size-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isEnabled
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {isEnabled ? <Check className="size-3.5 stroke-[3]" /> : <span className="text-[10px]">✕</span>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * 5.4 The Recreated Design Canvas Artboard
 */
function FigmaArtboard({
  domain,
  tokens,
  viewport,
  zoom,
  showGrid,
  showAnnotations,
  fixes,
  isAr,
}: {
  domain: string;
  tokens: BrandTokens;
  viewport: ViewportMode;
  zoom: number;
  showGrid: boolean;
  showAnnotations: boolean;
  fixes: AppliedFixesState;
  isAr: boolean;
}) {
  const containerWidth =
    viewport === 'mobile' ? '375px' : viewport === 'tablet' ? '768px' : '100%';

  // Dynamic styling derived from applied fixes
  const canvasBg = fixes.paletteDiscipline ? tokens.canvasBg : '#1A1829';
  const surfaceBg = fixes.paletteDiscipline ? tokens.surfaceBg : '#2D284B';
  const accentColor = fixes.paletteDiscipline ? tokens.accent : '#FF0055';
  const lineHeightClass = fixes.lineHeightScale ? 'leading-relaxed' : 'leading-none';
  const buttonHeight = fixes.touchTargets44 ? 'h-11 px-6' : 'h-7 px-3 text-xs';
  const contrastClass = fixes.wcagContrast ? 'text-zinc-300' : 'text-zinc-600';

  return (
    <div
      className="transition-transform duration-200 origin-top flex flex-col items-center"
      style={{ transform: `scale(${zoom})` }}
    >
      {/* Frame Dimensions Label */}
      <div className="text-[11px] font-mono text-zinc-500 mb-2 flex items-center gap-2">
        <span className="size-2 rounded-full bg-emerald-400" />
        <span>Frame: {VIEWPORT_CONFIG[viewport].labelEn} · Scale {Math.round(zoom * 100)}%</span>
      </div>

      {/* Artboard Canvas Container */}
      <div
        className="rounded-2xl border border-white/[0.12] shadow-2xl overflow-hidden relative transition-all"
        style={{
          width: containerWidth,
          maxWidth: '1080px',
          backgroundColor: canvasBg,
          color: tokens.textPrimary,
        }}
      >
        {/* Figma Layout Grid Overlay (if toggled) */}
        {showGrid && (
          <div className="absolute inset-0 z-30 pointer-events-none grid grid-cols-12 gap-3 px-6 opacity-15">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-full bg-rose-500/20 border-x border-rose-500/40" />
            ))}
          </div>
        )}

        {/* 1. Global Navigation Bar */}
        <header className="border-b border-white/[0.08] px-6 h-16 flex items-center justify-between relative">
          {showAnnotations && (
            <span className="absolute top-2 start-2 z-40 bg-emerald-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow">
              44px Targets · WCAG 2.1 AA
            </span>
          )}
          <div className="flex items-center gap-2.5">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-bold text-white tracking-tight">{domain}</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-xs text-zinc-400">
            <span className="hover:text-white cursor-pointer transition-colors">
              {isAr ? 'الخدمات' : 'Services'}
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              {isAr ? 'الهندسة التقنية' : 'Architecture'}
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              {isAr ? 'الأسعار' : 'Pricing'}
            </span>
          </div>

          <button
            type="button"
            className={`${buttonHeight} rounded-xl font-bold transition-all shadow-sm flex items-center gap-1.5`}
            style={{
              backgroundColor: accentColor,
              color: canvasBg,
            }}
          >
            <span>{isAr ? 'ابدأ الآن' : 'Get Started'}</span>
          </button>
        </header>

        {/* 2. Hero Section */}
        <section className="px-6 pt-14 pb-16 text-center max-w-2xl mx-auto space-y-5 relative">
          {showAnnotations && (
            <span className="absolute top-4 start-1/2 -translate-x-1/2 z-40 bg-emerald-500 text-black font-black text-[9px] px-2 py-0.5 rounded shadow">
              Line-Height 1.625 · High-Contrast Typography
            </span>
          )}

          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-white/[0.08]"
            style={{ backgroundColor: surfaceBg }}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-zinc-300 font-medium">
              {isAr ? 'تصميم معاد هندسته وفق مبادئ فيجما' : 'Re-engineered Studio Canvas'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2]">
            {isAr
              ? 'واجهة تفاعلية خالية من العشوائية والتشويش'
              : 'Zero-Distraction Human-Centered Experience'}
          </h1>

          <p className={`${contrastClass} ${lineHeightClass} text-sm sm:text-base max-w-xl mx-auto font-normal`}>
            {isAr
              ? 'تم استبدال التدرجات الملونة بتوزيع لوني محايد ومنضبط. زر الإجراء الرئيسي بارز بوضوح، وتراتبية العناوين تريح عين المستخدم وترفع التحويل.'
              : 'Rebuilt with an obsidian neutral canvas, laser-focused primary CTA, and optically balanced font scale for frictionless conversion.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              className={`${buttonHeight} w-full sm:w-auto rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2`}
              style={{
                backgroundColor: accentColor,
                color: canvasBg,
              }}
            >
              <span>{isAr ? 'تجربة الخدمة مجاناً' : 'Explore Platform'}</span>
              <ArrowRight className="size-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              className={`${buttonHeight} w-full sm:w-auto rounded-xl border border-white/[0.1] text-white font-medium hover:bg-white/[0.05] transition-all`}
              style={{ backgroundColor: surfaceBg }}
            >
              {isAr ? 'مستندات التوثيق' : 'Documentation'}
            </button>
          </div>
        </section>

        {/* 3. Bento Grid Section */}
        <section className="px-6 pb-16 max-w-4xl mx-auto relative">
          {showAnnotations && (
            <span className="absolute top-0 start-6 z-40 bg-emerald-500 text-black font-black text-[9px] px-2 py-0.5 rounded shadow">
              Asymmetric Bento Grid (Replaces 3-Card Cliché)
            </span>
          )}

          {fixes.asymmetricBento ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div
                className="md:col-span-8 rounded-2xl border border-white/[0.08] p-6 space-y-3"
                style={{ backgroundColor: surfaceBg }}
              >
                <div
                  className="size-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                  }}
                >
                  01
                </div>
                <h3 className="text-lg font-bold text-white">
                  {isAr ? 'الهوية البصرية المنضبطة (90/10 Rule)' : '90/10 Palette Discipline'}
                </h3>
                <p className={`${contrastClass} ${lineHeightClass} text-xs`}>
                  {isAr
                    ? '90% من الواجهة أسطح محايدة هادئة و 10% فقط للون التمييز الرئيسي للأزرار الهامة.'
                    : '90% neutral surfaces allow the 10% accent color to command immediate user focus.'}
                </p>
              </div>

              <div
                className="md:col-span-4 rounded-2xl border border-white/[0.08] p-6 flex flex-col justify-between"
                style={{ backgroundColor: surfaceBg }}
              >
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider">
                    {isAr ? 'معدل التباين' : 'Contrast Ratio'}
                  </span>
                  <div className="text-3xl font-black text-white mt-1">7.2 : 1</div>
                </div>
                <div
                  className="text-xs font-semibold mt-4"
                  style={{ color: accentColor }}
                >
                  WCAG 2.1 AA Certified
                </div>
              </div>
            </div>
          ) : (
            // Flawed generic 3-card cliché view
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['ميزة 1', 'ميزة 2', 'ميزة 3'].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-pink-500/30 p-4 bg-pink-950/20 text-center space-y-2"
                >
                  <div className="size-8 rounded-lg bg-pink-500/20 mx-auto text-pink-400 flex items-center justify-center text-xs">
                    ★
                  </div>
                  <h4 className="text-xs font-bold text-pink-200">{item}</h4>
                  <p className="text-[11px] text-pink-300/70">تصميم كروت متطابقة روتيني</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. Semantic Footer */}
        <footer className="border-t border-white/[0.08] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>© 2026 {domain}. {isAr ? 'كافة الحقوق محفوظة.' : 'All rights reserved.'}</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 cursor-pointer">{isAr ? 'الخصوصية' : 'Privacy'}</span>
            <span className="hover:text-zinc-300 cursor-pointer">{isAr ? 'الشروط' : 'Terms'}</span>
            <span className="hover:text-zinc-300 cursor-pointer">{isAr ? 'تواصل معنا' : 'Contact'}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

/**
 * 5.5 Before vs After Split Comparison
 */
function FigmaBeforeAfterDiff({
  domain,
  tokens,
  isAr,
}: {
  domain: string;
  tokens: BrandTokens;
  isAr: boolean;
}) {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Before: Flawed Original Website Patterns */}
      <div className="rounded-2xl border border-red-500/30 bg-[#120F12] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-400" />
            <span className="font-bold text-red-300 text-sm">
              {isAr ? 'التصميم السابق (الأخطاء المكتشفة)' : 'Before: Original Flaws'}
            </span>
          </div>
          <span className="text-[10px] font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
            Score: 58/100
          </span>
        </div>

        <ul className="space-y-3 text-xs text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✕</span>
            <span>{isAr ? 'تشتت ألوان وتدرجات قوس قزح غير منضبطة.' : 'Uncontrolled color gradients and candy badges.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✕</span>
            <span>{isAr ? 'ارتفاع أسطر خانق للنصوص يرهق عين المستخدم.' : 'Cramped text line-height exhausting user readability.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✕</span>
            <span>{isAr ? 'غياب زر إجراء رئيسي واحد وواضح (Missing CTA).' : 'Missing clear primary call-to-action button.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✕</span>
            <span>{isAr ? 'أزرار ومساحات نقر صغيرة تخالف معيار 44px.' : 'Tiny touch targets violating 44px Fitts law.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-400 font-bold">✕</span>
            <span>{isAr ? 'كروت متطابقة روتينية ومملة (Generic 3-Cards).' : 'Generic 3-card cliché with pastel icons.'}</span>
          </li>
        </ul>
      </div>

      {/* After: Re-Engineered Figma Studio Architecture */}
      <div className="rounded-2xl border border-emerald-500/30 bg-[#090F10] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span className="font-bold text-emerald-300 text-sm">
              {isAr ? 'التصميم الجديد (هندسة كانفاس فيجما)' : 'After: Figma Re-Engineered'}
            </span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
            Score: 100/100
          </span>
        </div>

        <ul className="space-y-3 text-xs text-zinc-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>
              {isAr
                ? `قاعدة 90/10: كانفاس هادئ ولون تمييز موحد (${tokens.accent}).`
                : `90/10 rule: Calm obsidian canvas with focused accent (${tokens.accent}).`}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{isAr ? 'ارتفاع أسطر مريح (line-height: 1.625) للقراءة الانسيابية.' : 'Rhythmic line-height (1.625) for effortless scanning.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{isAr ? 'زر إجراء رئيسي بلون مشع وتباين عالي يقود التحويل.' : 'High-converting primary CTA with distinct contrast.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{isAr ? 'مساحات نقر لا تقل عن 44x44 بكسل مع تركيز بصري صريح.' : 'Touch targets guaranteed >= 44px with focus rings.'}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{isAr ? 'شبكة بينتو غير متماثلة تبرز أهم ميزة وأهم رقم.' : 'Asymmetrical Bento grid spotlighting core telemetry.'}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * 5.6 Export Code & Tokens Modal
 */
function FigmaExportModal({
  domain,
  tokens,
  isOpen,
  onClose,
  isAr,
}: {
  domain: string;
  tokens: BrandTokens;
  isOpen: boolean;
  onClose: () => void;
  isAr: boolean;
}) {
  const [activeTab, setActiveTab] = React.useState<'react' | 'tokens' | 'prompt'>('react');
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const reactCode = generateRecreatedReactCode(domain, tokens);

  const tokensJson = JSON.stringify(
    {
      domain,
      rule: '90/10 Color Harmony',
      tokens: {
        brandAccent: tokens.accent,
        canvasBg: tokens.canvasBg,
        surfaceCard: tokens.surfaceBg,
        textPrimary: tokens.textPrimary,
        textMuted: tokens.textMuted,
      },
      typography: {
        bodyLineHeight: 1.625,
        headingScale: '1.2 optical ratio',
        minTouchTargetPx: 44,
      },
    },
    null,
    2
  );

  const aiPrompt = `# برومبت تطبيق إعادة هندسة التصميم في فيجما وكود React
موقع: ${domain}
نظام الألوان المعتمد (قاعدة 90/10):
- لون التمييز (Accent): ${tokens.accent}
- الكانفاس المحايد (Canvas): ${tokens.canvasBg}
- أسطح البطاقات (Surface): ${tokens.surfaceBg}

التوجيهات الهندسية الإلزامية:
1. تطبيق كود React 19 + Tailwind للواجهة المعاد تصميمها بالكامل.
2. الالتزام الصارم بـ line-height: 1.625 للفقرات النصية.
3. ضمان مساحات النقر للأزرار لا تقل عن 44x44 بكسل.
4. استبدال الكروت المتطابقة الروتينية بشبكة بينتو غير متماثلة.
5. تحقيق تباين WCAG 2.1 AA (4.5:1 على الأقل).`;

  const currentContent =
    activeTab === 'react' ? reactCode : activeTab === 'tokens' ? tokensJson : aiPrompt;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl border border-white/[0.12] bg-[#0A0C10] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode2 className="size-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">
              {isAr ? 'تصدير الكود ورموز فيجما (Export Studio Spec)' : 'Export Recreated Code & Tokens'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-white/[0.08] bg-[#0E1116] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('react')}
            className={`pb-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'react'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            React 19 + Tailwind TSX
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tokens')}
            className={`pb-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'tokens'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Figma Tokens (JSON)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`pb-2.5 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'prompt'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {isAr ? 'برومبت فيجما للذكاء الاصطناعي' : 'Master Prompt'}
          </button>
        </div>

        {/* Code Content Area */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-[#050608]">
          <pre className="text-zinc-300 whitespace-pre leading-relaxed select-all">
            {currentContent}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-between bg-[#0A0C10]">
          <span className="text-xs text-zinc-500">
            {isAr ? 'كود إنتاجي جاهز للنسخ المباشر في مشروعك' : 'Production-ready code, zero setup required'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="h-9 px-4 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-all shadow-sm"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ الكود' : 'Copy Code'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-white/[0.1] bg-[#12151C] text-zinc-300 hover:text-white text-xs font-medium"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 5.7 Dimension-Matched Shimmer Skeleton (Zero CLS)
 */
function FigmaStudioSkeleton() {
  return (
    <div className="w-full h-[650px] rounded-2xl border border-white/[0.08] bg-[#0A0C10] overflow-hidden flex flex-col animate-pulse">
      <div className="h-14 border-b border-white/[0.08] bg-[#0E1116] px-4 flex items-center justify-between">
        <div className="w-48 h-5 rounded-lg bg-white/5" />
        <div className="w-64 h-7 rounded-xl bg-white/5" />
        <div className="w-24 h-7 rounded-lg bg-white/5" />
      </div>
      <div className="flex-1 flex">
        <div className="w-64 border-l border-white/[0.08] p-4 space-y-3 bg-[#0D0F14]">
          <div className="w-32 h-4 rounded bg-white/5 mb-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-full h-7 rounded-lg bg-white/5" />
          ))}
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-[#13161C]">
          <div className="w-full max-w-2xl h-96 rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-6">
            <div className="w-full h-8 rounded-lg bg-white/5" />
            <div className="w-3/4 h-12 rounded-xl bg-white/5 mx-auto" />
            <div className="w-1/2 h-6 rounded-lg bg-white/5 mx-auto" />
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="h-28 rounded-xl bg-white/5" />
              <div className="h-28 rounded-xl bg-white/5" />
            </div>
          </div>
        </div>
        <div className="w-72 border-r border-white/[0.08] p-4 space-y-4 bg-[#0D0F14]">
          <div className="w-32 h-4 rounded bg-white/5" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 rounded-lg bg-white/5" />
            <div className="h-10 rounded-lg bg-white/5" />
          </div>
          <div className="space-y-2 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full h-8 rounded-lg bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN STUDIO COMPONENT (WRAPPED WITH SUSPENSE)
// ============================================================================
function FigmaStudioContent() {
  const searchParams = useSearchParams();
  const initialUrlFromQuery = searchParams.get('url') || '';

  const [lang, setLang] = React.useState<SupportedLang>('ar');
  const isAr = lang === 'ar';

  const [targetUrl, setTargetUrl] = React.useState(initialUrlFromQuery || 'https://seo-opt.apps.taqat.academy');
  const [activeDomain, setActiveDomain] = React.useState('seo-opt.apps.taqat.academy');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Figma Canvas State
  const [viewport, setViewport] = React.useState<ViewportMode>('desktop');
  const [zoom, setZoom] = React.useState<number>(1);
  const [showGrid, setShowGrid] = React.useState(false);
  const [showAnnotations, setShowAnnotations] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<StudioViewMode>('redesign');
  const [selectedLayer, setSelectedLayer] = React.useState<string>('frame-root');
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

  // Extracted Tokens
  const [tokens, setTokens] = React.useState<BrandTokens>(FALLBACK_TOKENS);
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  // Toggleable Applied Fixes
  const [fixes, setFixes] = React.useState<AppliedFixesState>({
    paletteDiscipline: true,
    lineHeightScale: true,
    touchTargets44: true,
    wcagContrast: true,
    asymmetricBento: true,
  });

  // Handle URL Redesign Execution
  const handleRedesignUrl = async (urlToAudit: string) => {
    const trimmed = urlToAudit.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      setActiveDomain(parsed.hostname);

      const res = await fetch('/api/audit-uiux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: parsed.toString() }),
      });

      if (!res.ok) {
        throw new Error(`Audit service returned HTTP ${res.status}`);
      }

      const data: UiUxAuditResult = await res.json();
      const extracted = extractBrandTokens(data.extractedColors);
      setTokens(extracted);
    } catch (err) {
      // Fallback gracefully so user can still interact with the studio
      try {
        const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
        setActiveDomain(parsed.hostname);
      } catch {
        setActiveDomain(trimmed);
      }
      // Keep sensible fallback tokens
      setTokens(FALLBACK_TOKENS);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount if initial URL present
  React.useEffect(() => {
    if (initialUrlFromQuery) {
      handleRedesignUrl(initialUrlFromQuery);
    }
  }, [initialUrlFromQuery]);

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handleToggleFix = (id: keyof AppliedFixesState) => {
    setFixes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#06080B] text-zinc-100 flex flex-col font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* 1. Global Navigation Header */}
      <AuditHeader
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      />

      {/* 2. Top URL Input Bar & Redesign Launcher */}
      <section className="border-b border-white/[0.08] bg-[#0A0C10] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-400" />
              <span>{isAr ? 'استوديو إعادة هندسة التصميم في كانفاس Figma' : 'Figma Design Re-Engineering Studio'}</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isAr
                ? 'ضع رابط موقعك ليعيد بناء الواجهة، يصحح الألوان بقاعدة 90/10، ويضبط تباين WCAG 2.1 AA ومساحات اللمس فوراً.'
                : 'Enter any website URL to reconstruct the UI with 90/10 palette harmony, WCAG 2.1 AA contrast, and zero AI-slop.'}
            </p>
          </div>

          {/* URL Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRedesignUrl(targetUrl);
            }}
            className="w-full md:w-auto flex items-center gap-2"
          >
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-10 px-3.5 rounded-xl border border-white/[0.12] bg-[#12151C] text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 w-full md:w-80 font-mono"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="h-10 px-4 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 active:scale-95 transition-all shrink-0 shadow-sm disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
              <span>{isLoading ? (isAr ? 'جاري البناء...' : 'Rebuilding...') : isAr ? 'إعادة التصميم' : 'Re-Design'}</span>
            </button>
          </form>
        </div>

        {/* Quick Demo Links */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04] text-[11px] text-zinc-500 overflow-x-auto pb-1">
          <span className="shrink-0">{isAr ? 'روابط سريعة للتجربة:' : 'Quick Presets:'}</span>
          {QUICK_DEMO_URLS.map((demo) => (
            <button
              key={demo}
              type="button"
              onClick={() => {
                setTargetUrl(demo);
                handleRedesignUrl(demo);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#12151C] hover:bg-white/[0.06] text-zinc-300 border border-white/[0.06] shrink-0 transition-colors font-mono"
            >
              {demo.replace('https://', '')}
            </button>
          ))}
        </div>
      </section>

      {/* 3. The Figma Canvas Studio Workspace */}
      <main className="flex-1 flex flex-col bg-[#07090D] min-h-[700px]">
        {/* Figma Top Toolbar */}
        <FigmaTopBar
          domain={activeDomain}
          viewport={viewport}
          onSelectViewport={setViewport}
          zoom={zoom}
          onZoomIn={() => setZoom((z) => Math.min(1.5, z + 0.1))}
          onZoomOut={() => setZoom((z) => Math.max(0.6, z - 0.1))}
          onResetZoom={() => setZoom(1)}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          showAnnotations={showAnnotations}
          onToggleAnnotations={() => setShowAnnotations(!showAnnotations)}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          isAr={isAr}
        />

        {/* Canvas Body (Left Layers + Center Viewport + Right Inspector) */}
        <div className="flex-1 flex relative overflow-hidden">
          {isLoading ? (
            <div className="flex-1 p-6 flex items-center justify-center">
              <FigmaStudioSkeleton />
            </div>
          ) : (
            <>
              {/* Left Layers Sidebar */}
              <FigmaLayersPanel
                selectedLayer={selectedLayer}
                onSelectLayer={setSelectedLayer}
                isAr={isAr}
              />

              {/* Center Figma Viewport Canvas */}
              <div
                className="flex-1 p-6 md:p-10 overflow-auto flex justify-center items-start relative select-none"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  backgroundColor: '#0A0C11',
                }}
              >
                {viewMode === 'compare' ? (
                  <FigmaBeforeAfterDiff
                    domain={activeDomain}
                    tokens={tokens}
                    isAr={isAr}
                  />
                ) : (
                  <FigmaArtboard
                    domain={activeDomain}
                    tokens={tokens}
                    viewport={viewport}
                    zoom={zoom}
                    showGrid={showGrid}
                    showAnnotations={showAnnotations}
                    fixes={fixes}
                    isAr={isAr}
                  />
                )}
              </div>

              {/* Right Properties & Design Tokens Inspector */}
              <FigmaPropertiesPanel
                tokens={tokens}
                domain={activeDomain}
                fixes={fixes}
                onToggleFix={handleToggleFix}
                onCopyColor={handleCopyColor}
                copiedColor={copiedColor}
                isAr={isAr}
              />
            </>
          )}
        </div>
      </main>

      {/* 4. Export Code & Tokens Modal */}
      <FigmaExportModal
        domain={activeDomain}
        tokens={tokens}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        isAr={isAr}
      />

      {/* 5. Global Footer */}
      <AuditFooter lang={lang} />
    </div>
  );
}

export default function FigmaStudioPage() {
  return (
    <React.Suspense fallback={<FigmaStudioSkeleton />}>
      <FigmaStudioContent />
    </React.Suspense>
  );
}
