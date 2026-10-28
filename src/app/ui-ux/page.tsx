'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import Link from 'next/link';
import {
  Palette,
  Type,
  MousePointerClick,
  LayoutGrid,
  CheckSquare,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  SlidersHorizontal,
  Code2,
  FileCode2,
  Download,
  FileText,
} from 'lucide-react';
import { AuditHeader } from '@/components/AuditHeader';
import { AuditFooter } from '@/components/AuditFooter';
import { SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';
import { extractBrandTokens } from '@/lib/promptGenerator';
import type {
  UiUxAuditResult,
  UiUxPrescription,
  UiUxCategory,
  PrescriptionSeverity,
  ExtractedColor,
} from '@/types/uiux';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Default quick URLs for instant testing
const QUICK_TEST_URLS = [
  'https://ahmedsaleh.website',
  'https://stripe.com',
  'https://github.com',
  'https://news.ycombinator.com',
] as const;

// Five vector configuration for score visualizer
const VECTOR_CONFIG: Record<
  UiUxCategory,
  {
    icon: React.ComponentType<{ className?: string }>;
    labelAr: string;
    labelEn: string;
    descriptionAr: string;
    descriptionEn: string;
  }
> = {
  colors: {
    icon: Palette,
    labelAr: 'الألوان والتباين',
    labelEn: 'Colors & Contrast',
    descriptionAr: 'معيار WCAG 2.1 AA ونظرية 90/10 لانضباط اللوحة',
    descriptionEn: 'WCAG 2.1 AA ratio & 90/10 palette discipline',
  },
  typography: {
    icon: Type,
    labelAr: 'الخطوط والمقروئية',
    labelEn: 'Typography & Scale',
    descriptionAr: 'ارتفاع السطر الذهبي (1.5-1.75) وتناسق العائلات',
    descriptionEn: 'Golden line-height ratio (1.5-1.75) & font count',
  },
  buttons: {
    icon: MousePointerClick,
    labelAr: 'الأزرار وبيئة اللمس',
    labelEn: 'Buttons & Touch Fitts',
    descriptionAr: 'قانون فيتس (Fitts) ومساحة النقر (44px) والـ CTA',
    descriptionEn: "Fitts's Law, 44px touch targets & primary CTA",
  },
  hierarchy: {
    icon: LayoutGrid,
    labelAr: 'الهيكل والتسلسل البصري',
    labelEn: 'Visual Hierarchy',
    descriptionAr: 'قانون ميلر (7±2) وعلامات التجاوب والتنقل',
    descriptionEn: "Miller's Law (7±2 chunks) & responsive viewport",
  },
  forms: {
    icon: CheckSquare,
    labelAr: 'النماذج وتجربة الإدخال',
    labelEn: 'Forms & Accessibility',
    descriptionAr: 'معايير Nielsen Norman للعناوين الصريحة والبدائل',
    descriptionEn: 'NNG explicit labels & placeholder ergonomics',
  },
};

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
type SeverityFilter = 'all' | PrescriptionSeverity;
type CategoryFilter = 'all' | UiUxCategory;

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
function getScoreColorClass(score: number): string {
  if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
  if (score >= 75) return 'text-sky-400 border-sky-500/40 bg-sky-950/20';
  if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
  return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
}

function getSeverityBadgeStyle(sev: PrescriptionSeverity): {
  badgeClass: string;
  dotClass: string;
  icon: React.ComponentType<{ className?: string }>;
} {
  switch (sev) {
    case 'critical':
      return {
        badgeClass: 'bg-rose-950/40 text-rose-300 border-rose-500/30',
        dotClass: 'bg-rose-500',
        icon: AlertCircle,
      };
    case 'warning':
      return {
        badgeClass: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
        dotClass: 'bg-amber-500',
        icon: AlertTriangle,
      };
    case 'optimal':
      return {
        badgeClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
        dotClass: 'bg-emerald-500',
        icon: CheckCircle2,
      };
  }
}

/**
 * Synthesizes all actionable prescriptions into an AI-ready master refactoring prompt,
 * tailored directly to the site's authentic extracted brand palette and detected issues.
 */
function buildPrescriptionsAiPrompt(
  result: UiUxAuditResult,
  prescriptions: UiUxPrescription[],
  isAr: boolean
): string {
  const tokens = extractBrandTokens(result.extractedColors);

  const items = prescriptions
    .map((p, idx) => {
      const title = isAr ? p.titleAr : p.titleEn;
      const diag = isAr ? p.diagnosisAr : p.diagnosisEn;
      const action = isAr ? p.actionRuleAr : p.actionRuleEn;
      const snippet = p.cssFixSnippet ? `\n\`\`\`css\n${p.cssFixSnippet}\n\`\`\`` : '';
      const vals =
        p.currentValue || p.suggestedValue
          ? `\n- ${isAr ? 'القيمة الحالية' : 'Current'}: ${p.currentValue ?? 'N/A'} | ${
              isAr ? 'المطلوبة' : 'Suggested'
            }: ${p.suggestedValue ?? 'N/A'}`
          : '';

      return `### ${idx + 1}. [${p.category.toUpperCase()}] ${title} (${p.severity.toUpperCase()})
- **${isAr ? 'التشخيص الهندسي' : 'Diagnosis'}:** ${diag}
- **${isAr ? 'التوجيه التنفيذي (اعمل هيك وسوي هيك)' : 'Action Directive'}:** ${action}
- **${isAr ? 'القاعدة التصميمية' : 'Design Rule'}:** ${p.designPrinciple}${vals}${snippet}`;
    })
    .join('\n\n');

  const header = isAr
    ? `# 🎨 برومبت الإصلاح الشامل لتجربة وواجهة المستخدم (UI/UX) - مخصص لموقع: ${result.domain}
النتيجة الحالية: ${result.overallScore}/100 (${result.verdictAr})

أنت مهندس تصميم وواجهات رئيسي (Principal UI/UX & Frontend Architect).
مهمتك تطبيق الحلول والتوجيهات التصميمية التالية بدقة واحترافية:
1. تطبيق قاعدة 90/10 للألوان المعتمدة أدناه.
2. ضمان تحقيق نسبة التباين WCAG 2.1 AA (4.5:1 على الأقل لكافة النصوص).
3. ضبط مساحات النقر للأزرار (Touch Targets لا تقل عن 44x44 بكسل).
4. ضبط ارتفاع الأسطر للفقرات (line-height: 1.625) لتسهيل القراءة.`
    : `# 🎨 TAILORED UI/UX REFACTORING PROMPT - Target: ${result.domain}
Current Score: ${result.overallScore}/100 (${result.verdictEn})

You are a Principal UI/UX & Frontend Architect.
Your task is to implement all of the following design directives with zero slop:
1. Enforce the 90/10 color rule using the authentic brand tokens below.
2. Ensure WCAG 2.1 AA contrast ratio (at least 4.5:1 on all text).
3. Ensure Fitts's Law compliance with minimum 44x44px touch targets.
4. Set paragraph line-height to 1.625 for optimal reading rhythm.`;

  const brandSection = isAr
    ? `## 🎨 1. الهوية البصرية ونظام الألوان المعتمد لموقعك (90/10 Brand Tokens):
تم استخراج هذه الألوان الحقيقية مباشرة من كود الصفحة لضمان احتفاظ موقعك بهويته البصرية دون ألوان عشوائية:
- **لون التمييز الرئيسي (Brand Accent):** \`${tokens.accent}\` (للأزرار الرئيسية CTAs والروابط النشطة)
- **لون الخلفية والكانفاس الأساسي (Canvas Background):** \`${tokens.canvasBg}\` (يشكل 90% من المساحة)
- **أسطح البطاقات والحاويات (Surface Cards):** \`${tokens.surfaceBg}\`
- **لون النصوص الأساسية (Primary Text):** \`${tokens.textPrimary}\`
- **لون النصوص المكتومة (Muted Text):** \`${tokens.textMuted}\` (بنسبة تباين WCAG 2.1 AA $\\ge 4.5:1$)

### كود متغيرات الثيم وتوكنز Tailwind / CSS Variables المبني على ألوانك:
\`\`\`css
:root {
  --brand-accent: ${tokens.accent};
  --bg-canvas: ${tokens.canvasBg};
  --bg-surface: ${tokens.surfaceBg};
  --text-primary: ${tokens.textPrimary};
  --text-muted: ${tokens.textMuted};
  --border-subtle: rgba(255, 255, 255, 0.08);
}
\`\`\`

**تعليمات صارمة للذكاء الاصطناعي:**
- التزم حصرياً بالألوان المستخرجة أعلاه في كافة الحلول والتنسيقات ولا تبتكر ألواناً عشوائية.
- طبّق قاعدة 90/10 للألوان: 90% أسطح محايدة هادئة و 10% لون تمييز موحد للـ CTAs.`
    : `## 🎨 1. Authentic Brand Palette & 90/10 Design System Tokens:
Extracted directly from the site DOM to guarantee brand preservation without hallucinations:
- **Primary Brand Accent:** \`${tokens.accent}\` (Dedicated anchor for primary CTAs and active states)
- **Canvas Background:** \`${tokens.canvasBg}\` (Enforces 90% neutral baseline per 90/10 discipline)
- **Surface Cards & Modals:** \`${tokens.surfaceBg}\`
- **Primary Typography:** \`${tokens.textPrimary}\`
- **Muted Typography:** \`${tokens.textMuted}\` (Calibrated for WCAG 2.1 AA $\\ge 4.5:1$ contrast)

### Tailored Design Tokens (CSS Variables & Tailwind theme):
\`\`\`css
:root {
  --brand-accent: ${tokens.accent};
  --bg-canvas: ${tokens.canvasBg};
  --bg-surface: ${tokens.surfaceBg};
  --text-primary: ${tokens.textPrimary};
  --text-muted: ${tokens.textMuted};
  --border-subtle: rgba(255, 255, 255, 0.08);
}
\`\`\`

**Strict AI Mandates:**
- Anchor all design and layout fixes around these extracted tokens. Do NOT introduce uncoordinated colors.
- Enforce the 90/10 color rule: 90% neutral canvas, 10% high-energy brand accent.`;

  return `${header}\n\n${brandSection}\n\n## 🛠️ 2. ${
    isAr ? 'سجل المشاكل المحددة والتوجيهات التنفيذية (اعمل هيك وسوي هيك)' : 'Actionable Prescriptions'
  }:\n\n${items}`;
}

/**
 * Extracts and combines all CSS / Tailwind recipes from prescriptions into one unified stylesheet.
 */
function buildUnifiedCssFixes(prescriptions: UiUxPrescription[]): string {
  const snippets = prescriptions
    .filter((p) => Boolean(p.cssFixSnippet))
    .map((p, idx) => {
      return `/* ============================================================================
 * ${idx + 1}. [${p.category.toUpperCase()}] ${p.titleEn} (${p.severity.toUpperCase()})
 * Rule: ${p.designPrinciple}
 * ============================================================================ */
${p.cssFixSnippet}`;
    })
    .join('\n\n');

  return snippets || '/* No CSS snippets needed for current items. */';
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================

/**
 * Tactical URL Input Bar with live state and quick-action buttons
 */
function TacticalUrlInput({
  inputUrl,
  onChangeUrl,
  onSubmit,
  isLoading,
  errorMsg,
  isAr,
  t,
}: {
  inputUrl: string;
  onChangeUrl: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  errorMsg: string | null;
  isAr: boolean;
  t: (typeof translations)[SupportedLang];
}) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      <form onSubmit={onSubmit} className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => onChangeUrl(e.target.value)}
            placeholder={t.uiuxInputPlaceholder}
            disabled={isLoading}
            className="w-full h-13 px-4 bg-[#090C12] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all font-mono"
            dir="ltr"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !inputUrl.trim()}
          className="h-13 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.25)] shrink-0"
        >
          {isLoading ? (
            <>
              <RefreshCw className="size-4 animate-spin text-zinc-950" />
              <span>{t.uiuxAuditingButton}</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4 text-zinc-950" />
              <span>{t.uiuxAuditButton}</span>
            </>
          )}
        </button>
      </form>

      {errorMsg && (
        <div className="mt-3 p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="size-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Test Domains */}
      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
        <span className="font-medium text-zinc-400">{t.quickTestLabel}</span>
        {QUICK_TEST_URLS.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => {
              onChangeUrl(url);
            }}
            className="px-2.5 py-1 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg transition-colors font-mono text-[11px]"
          >
            {url.replace('https://', '')}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Five Vector Score Bento Card
 */
function FiveVectorBento({
  scores,
  overallScore,
  isAr,
}: {
  scores: UiUxAuditResult['scores'];
  overallScore: number;
  isAr: boolean;
}) {
  const overallStyle = getScoreColorClass(overallScore);

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
      {/* Overall Score Master Tile */}
      <div className={`col-span-2 md:col-span-1 p-4 rounded-xl border flex flex-col justify-between ${overallStyle}`}>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          {isAr ? 'النتيجة الكلية' : 'Overall UI/UX'}
        </div>
        <div className="my-2">
          <span className="text-4xl font-extrabold font-mono tracking-tight">{overallScore}</span>
          <span className="text-xs font-mono text-zinc-400">/100</span>
        </div>
        <div className="text-[11px] text-zinc-400">
          {overallScore >= 90
            ? isAr
              ? 'تصميم عالمي متميز'
              : 'Studio-Grade'
            : overallScore >= 75
            ? isAr
              ? 'واجهة جيدة'
              : 'Solid Architecture'
            : isAr
            ? 'تتطلب تصحيحاً'
            : 'Needs Refactoring'}
        </div>
      </div>

      {/* 5 Vectors */}
      {(Object.keys(VECTOR_CONFIG) as UiUxCategory[]).map((cat) => {
        const item = VECTOR_CONFIG[cat];
        const score = scores[cat];
        const scoreColor = getScoreColorClass(score);
        const Icon = item.icon;

        return (
          <div
            key={cat}
            className="p-3.5 bg-[#090C12] border border-zinc-800/80 rounded-xl flex flex-col justify-between hover:border-zinc-700/80 transition-colors"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Icon className="size-3.5 text-emerald-400" />
              </div>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md border ${scoreColor}`}>
                {score}%
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-200 leading-snug">
                {isAr ? item.labelAr : item.labelEn}
              </div>
              <div className="text-[10px] text-zinc-400 mt-1 line-clamp-1">
                {isAr ? item.descriptionAr : item.descriptionEn}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Color Swatch Card
 */
function ColorPaletteSection({
  colors,
  isAr,
  t,
}: {
  colors: ExtractedColor[];
  isAr: boolean;
  t: (typeof translations)[SupportedLang];
}) {
  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  if (!colors || colors.length === 0) return null;

  return (
    <div className="p-5 bg-[#090C12] border border-zinc-800/80 rounded-2xl mb-8">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Palette className="size-4 text-emerald-400" />
            <span>{t.uiuxPaletteTitle}</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">{t.uiuxPaletteSub}</p>
        </div>
        <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
          {colors.length} {isAr ? 'ألوان مكتشفة' : 'colors detected'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {colors.slice(0, 18).map((color) => {
          const isCopied = copiedHex === color.hex;

          return (
            <button
              key={color.hex}
              onClick={() => copyHex(color.hex)}
              className="p-2.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2.5 text-start transition-all group relative"
              title={isAr ? 'اضغط لنسخ كود اللون' : 'Click to copy HEX code'}
            >
              <div
                className="size-7 rounded-lg border border-white/20 shrink-0 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-mono font-semibold text-zinc-200 group-hover:text-emerald-400 flex items-center justify-between">
                  <span>{color.hex}</span>
                  {isCopied ? (
                    <Check className="size-3 text-emerald-400 shrink-0" />
                  ) : (
                    <Copy className="size-3 opacity-0 group-hover:opacity-100 text-zinc-400 shrink-0 transition-opacity" />
                  )}
                </div>
                <div className="text-[10px] text-zinc-400 capitalize truncate">
                  {color.role} · {color.luminance > 0.5 ? 'Light' : 'Dark'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Individual Actionable Prescription Card ("اعمل هيك وسوي هيك" + "زبط اللون هذا")
 */
function PrescriptionCard({
  prescription,
  isAr,
  t,
}: {
  prescription: UiUxPrescription;
  isAr: boolean;
  t: (typeof translations)[SupportedLang];
}) {
  const [copied, setCopied] = React.useState(false);
  const severityStyle = getSeverityBadgeStyle(prescription.severity);
  const SeverityIcon = severityStyle.icon;

  const handleCopy = () => {
    if (!prescription.cssFixSnippet) return;
    navigator.clipboard.writeText(prescription.cssFixSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const title = isAr ? prescription.titleAr : prescription.titleEn;
  const diagnosis = isAr ? prescription.diagnosisAr : prescription.diagnosisEn;
  const actionRule = isAr ? prescription.actionRuleAr : prescription.actionRuleEn;

  return (
    <div className="p-5 bg-[#090C12] border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl transition-all duration-200 flex flex-col gap-3">
      {/* Top Header: Category & Severity Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${severityStyle.badgeClass}`}
          >
            <SeverityIcon className="size-3.5" />
            <span>
              {prescription.severity === 'critical'
                ? isAr
                  ? 'خلل حرج'
                  : 'Critical Defect'
                : prescription.severity === 'warning'
                ? isAr
                  ? 'تحذير تصميمي'
                  : 'Design Warning'
                : isAr
                ? 'معيار ممتاز'
                : 'Optimal Standard'}
            </span>
          </span>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
            {VECTOR_CONFIG[prescription.category]?.[isAr ? 'labelAr' : 'labelEn'] ?? prescription.category}
          </span>
        </div>

        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800/60">
          {prescription.designPrinciple}
        </span>
      </div>

      {/* Main Title */}
      <h4 className="text-sm font-bold text-zinc-100 leading-snug">{title}</h4>

      {/* Diagnosis Finding */}
      <div className="p-3 bg-zinc-950/80 border border-zinc-800/70 rounded-xl text-xs text-zinc-300">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
          <AlertCircle className="size-3 text-amber-400" />
          <span>{t.uiuxDiagnosisLabel}</span>
        </div>
        <p className="leading-relaxed">{diagnosis}</p>
      </div>

      {/* Actionable Command: "اعمل هيك وسوي هيك" / "زبط اللون هذا" */}
      <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-200">
        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-emerald-400" />
          <span>{t.uiuxActionLabel}</span>
        </div>
        <p className="font-medium leading-relaxed">{actionRule}</p>
      </div>

      {/* Values Comparison: Current vs Suggested */}
      {(prescription.currentValue || prescription.suggestedValue) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
          {prescription.currentValue && (
            <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">{isAr ? 'القيمة الحالية:' : 'Current:'}</span>
              <span className="text-rose-300 font-semibold">{prescription.currentValue}</span>
            </div>
          )}
          {prescription.suggestedValue && (
            <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">{isAr ? 'القيمة المطلوبة:' : 'Suggested Fix:'}</span>
              <span className="text-emerald-300 font-semibold">{prescription.suggestedValue}</span>
            </div>
          )}
        </div>
      )}

      {/* Actionable Code Snippet */}
      {prescription.cssFixSnippet && (
        <div className="mt-1">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="font-mono text-[11px] flex items-center gap-1">
              <Code2 className="size-3 text-emerald-400" />
              <span>CSS / Tailwind Recipe</span>
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-emerald-400 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-400">{t.uiuxSnippetCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>{t.uiuxCopySnippet}</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-[#050608] border border-zinc-800/80 rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto" dir="ltr">
            <code>{prescription.cssFixSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Interactive Studio Card for the Tailored Prompt (Colors + Issues)
 */
function TailoredPromptStudioCard({
  auditResult,
  prescriptions,
  promptText,
  cssText,
  onCopyPrompt,
  onCopyCss,
  copiedPrompt,
  copiedCss,
  isAr,
}: {
  auditResult: UiUxAuditResult;
  prescriptions: UiUxPrescription[];
  promptText: string;
  cssText: string;
  onCopyPrompt: () => void;
  onCopyCss: () => void;
  copiedPrompt: boolean;
  copiedCss: boolean;
  isAr: boolean;
}) {
  const [activeTab, setActiveTab] = React.useState<'prompt' | 'css'>('prompt');
  const tokens = React.useMemo(() => extractBrandTokens(auditResult.extractedColors), [auditResult.extractedColors]);

  const handleDownload = () => {
    const textToDownload = activeTab === 'prompt' ? promptText : cssText;
    const filename =
      activeTab === 'prompt'
        ? `UIUX-Prompt-${auditResult.domain}.md`
        : `Theme-Tokens-${auditResult.domain}.css`;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 sm:p-6 bg-[#090C12] border border-emerald-500/30 rounded-2xl mb-8 shadow-[0_0_30px_rgba(16,185,129,0.06)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
            <Sparkles className="size-3.5" />
            <span>{isAr ? 'برومبت ذكي مخصص حسب ألوانك ومشاكلك' : 'Tailored Brand & Issues AI Prompt'}</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            {isAr
              ? 'مُولّد برومبت الإصلاح الشامل المرتكز على هويتك البصرية'
              : 'Autonomous Brand & Heuristic Repair Prompt Studio'}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
            {isAr
              ? 'تم توليد هذا البرومبت بالاعتماد الدقيق على ألوان موقعك المستخرجة لتطبيق كافة التوجيهات الهندسية («اعمل هيك وسوي هيك» و«زبط اللون هذا») دون الإخلال بهويتك.'
              : 'Engineered directly from your extracted DOM colors and detected defects. Paste into Claude, ChatGPT, or Cursor to resolve everything in one pass.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={activeTab === 'prompt' ? onCopyPrompt : onCopyCss}
            className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-[0.98]"
          >
            {(activeTab === 'prompt' ? copiedPrompt : copiedCss) ? (
              <>
                <Check className="size-4 text-zinc-950" />
                <span>{isAr ? 'تم النسخ بنجاح!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="size-4 text-zinc-950" />
                <span>
                  {activeTab === 'prompt'
                    ? isAr
                      ? 'نسخ البرومبت بالكامل'
                      : 'Copy Full AI Prompt'
                    : isAr
                    ? 'نسخ كود الـ CSS'
                    : 'Copy CSS Tokens'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="h-9 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors font-mono"
            title={isAr ? 'تحميل الملف' : 'Download File'}
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">.md / .css</span>
          </button>
        </div>
      </div>

      {/* Extracted Brand Tokens Strip */}
      <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1.5">
          <Palette className="size-3.5 text-emerald-400" />
          <span>{isAr ? 'توكنز الألوان المعتمدة في البرومبت:' : 'Extracted Brand Tokens:'}</span>
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
            <span className="size-2.5 rounded-full border border-white/20" style={{ backgroundColor: tokens.accent }} />
            <span>Accent: {tokens.accent}</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
            <span className="size-2.5 rounded-full border border-white/20" style={{ backgroundColor: tokens.canvasBg }} />
            <span>Canvas: {tokens.canvasBg}</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
            <span className="size-2.5 rounded-full border border-white/20" style={{ backgroundColor: tokens.surfaceBg }} />
            <span>Surface: {tokens.surfaceBg}</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]">
            <span className="size-2.5 rounded-full border border-white/20" style={{ backgroundColor: tokens.textPrimary }} />
            <span>Text: {tokens.textPrimary}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-2 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('prompt')}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            activeTab === 'prompt'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-emerald-400" />
            <span>{isAr ? 'برومبت الذكاء الاصطناعي الشامل' : 'Full AI Prompt Payload'}</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('css')}
          className={`px-3 py-1.5 rounded-xl border transition-all ${
            activeTab === 'css'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Code2 className="size-3.5 text-emerald-400" />
            <span>{isAr ? 'كود الـ CSS وتوكنز الثيم المجمّعة' : 'Unified CSS & Theme Tokens'}</span>
          </span>
        </button>
      </div>

      {/* Viewport */}
      <div className="relative rounded-xl border border-zinc-800 bg-[#050608] overflow-hidden">
        <pre
          className="p-4 max-h-72 overflow-y-auto text-xs font-mono text-zinc-300 leading-relaxed select-all"
          dir="ltr"
        >
          <code>{activeTab === 'prompt' ? promptText : cssText}</code>
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT (EXPORT DEFAULT)
// ============================================================================
export default function UiUxAuditPage() {
  const [lang, setLang] = React.useState<SupportedLang>('ar');
  const [inputUrl, setInputUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [auditResult, setAuditResult] = React.useState<UiUxAuditResult | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>('all');
  const [severityFilter, setSeverityFilter] = React.useState<SeverityFilter>('all');
  const [promptCopied, setPromptCopied] = React.useState(false);
  const [allCssCopied, setAllCssCopied] = React.useState(false);

  const t = translations[lang];
  const isAr = lang === 'ar';

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setErrorMsg(t.urlEmptyError);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/audit-uiux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.title || t.errorTitle);
      }

      setAuditResult(data as UiUxAuditResult);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || t.errorTitle);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered Prescriptions
  const filteredPrescriptions = React.useMemo(() => {
    if (!auditResult) return [];
    return auditResult.prescriptions.filter((p) => {
      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesSev = severityFilter === 'all' || p.severity === severityFilter;
      return matchesCat && matchesSev;
    });
  }, [auditResult, categoryFilter, severityFilter]);

  // Tailored AI Prompt Text (Ground truth based on exact brand colors & issues)
  const tailoredPromptText = React.useMemo(() => {
    if (!auditResult) return '';
    const targetPrescriptions =
      filteredPrescriptions.length > 0 ? filteredPrescriptions : auditResult.prescriptions;
    return buildPrescriptionsAiPrompt(auditResult, targetPrescriptions, isAr);
  }, [auditResult, filteredPrescriptions, isAr]);

  // Unified CSS Fixes Text
  const tailoredCssText = React.useMemo(() => {
    if (!auditResult) return '';
    const targetPrescriptions =
      filteredPrescriptions.length > 0 ? filteredPrescriptions : auditResult.prescriptions;
    return buildUnifiedCssFixes(targetPrescriptions);
  }, [auditResult, filteredPrescriptions]);

  // Master Prompt Generation
  const handleCopyMasterPrompt = () => {
    if (!auditResult) return;
    navigator.clipboard.writeText(tailoredPromptText);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2500);
  };

  // Unified CSS Fixes Generation
  const handleCopyAllCss = () => {
    if (!auditResult) return;
    navigator.clipboard.writeText(tailoredCssText);
    setAllCssCopied(true);
    setTimeout(() => setAllCssCopied(false), 2500);
  };

  return (
    <div
      className="min-h-screen bg-[#050608] text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Navigation Header */}
      <AuditHeader lang={lang} onToggleLang={handleToggleLang} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="size-3.5" />
            <span>{isAr ? 'مختبر هندسة التصميم الفعلي' : 'Real-DOM UI/UX Engine'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-100 mb-3">
            {t.uiuxHeroTitle}
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            {t.uiuxHeroSub}
          </p>
        </div>

        {/* Input Bar */}
        <TacticalUrlInput
          inputUrl={inputUrl}
          onChangeUrl={setInputUrl}
          onSubmit={handleAuditSubmit}
          isLoading={isLoading}
          errorMsg={errorMsg}
          isAr={isAr}
          t={t}
        />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-28 bg-[#090C12] border border-zinc-800 rounded-2xl" />
            <div className="h-44 bg-[#090C12] border border-zinc-800 rounded-2xl" />
            <div className="h-64 bg-[#090C12] border border-zinc-800 rounded-2xl" />
          </div>
        )}

        {/* Audit Results Dashboard */}
        {auditResult && !isLoading && (
          <div className="space-y-6">
            {/* Verdict Banner with Master Prompt Action */}
            <div className="p-5 bg-[#090C12] border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                  <span>{auditResult.domain}</span>
                  <span>·</span>
                  <span>{new Date(auditResult.timestamp).toLocaleTimeString()}</span>
                </div>
                <h2 className="text-base font-bold text-zinc-100">
                  {isAr ? auditResult.verdictAr : auditResult.verdictEn}
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <Link
                  href={`/figma-studio?url=${encodeURIComponent(auditResult.url)}`}
                  className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Sparkles className="size-3.5" />
                  <span>{isAr ? 'فتح في استوديو Figma' : 'Open in Figma Studio'}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleCopyMasterPrompt}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-[0.98]"
                >
                  {promptCopied ? (
                    <>
                      <Check className="size-4 text-zinc-950" />
                      <span>{t.uiuxAllPromptCopied}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 text-zinc-950" />
                      <span>{t.uiuxCopyAllPrompt}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyAllCss}
                  className="px-3.5 py-2 bg-[#0E121A] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-zinc-300 hover:text-white font-medium text-xs rounded-xl flex items-center gap-2 transition-all"
                >
                  {allCssCopied ? (
                    <>
                      <Check className="size-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{t.uiuxAllCssCopied}</span>
                    </>
                  ) : (
                    <>
                      <FileCode2 className="size-3.5 text-zinc-400" />
                      <span>{t.uiuxCopyAllCss}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Five Vector Score Bento */}
            <FiveVectorBento
              scores={auditResult.scores}
              overallScore={auditResult.overallScore}
              isAr={isAr}
            />

            {/* Color Palette Inspector */}
            <ColorPaletteSection
              colors={auditResult.extractedColors}
              isAr={isAr}
              t={t}
            />

            {/* Tailored Brand & Heuristic AI Prompt Studio */}
            <TailoredPromptStudioCard
              auditResult={auditResult}
              prescriptions={filteredPrescriptions.length > 0 ? filteredPrescriptions : auditResult.prescriptions}
              promptText={tailoredPromptText}
              cssText={tailoredCssText}
              onCopyPrompt={handleCopyMasterPrompt}
              onCopyCss={handleCopyAllCss}
              copiedPrompt={promptCopied}
              copiedCss={allCssCopied}
              isAr={isAr}
            />

            {/* Prescriptions Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[#090C12] border border-zinc-800/80 rounded-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mr-1">
                  <SlidersHorizontal className="size-3.5 text-emerald-400" />
                  <span>{isAr ? 'التصنيف:' : 'Category:'}</span>
                </span>
                {(['all', 'colors', 'typography', 'buttons', 'hierarchy', 'forms'] as CategoryFilter[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {cat === 'all'
                      ? t.filterAll
                      : VECTOR_CONFIG[cat]?.[isAr ? 'labelAr' : 'labelEn'] ?? cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {(['all', 'critical', 'warning', 'optimal'] as SeverityFilter[]).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      severityFilter === sev
                        ? 'bg-zinc-200 text-zinc-950 font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {sev === 'all'
                      ? isAr
                        ? 'الكل'
                        : 'All'
                      : sev === 'critical'
                      ? isAr
                        ? 'حرج'
                        : 'Critical'
                      : sev === 'warning'
                      ? isAr
                        ? 'تحذير'
                        : 'Warning'
                      : isAr
                      ? 'مثالي'
                      : 'Optimal'}
                  </button>
                ))}
              </div>
            </div>

            {/* Actionable Prescriptions Ledger */}
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="size-4 text-emerald-400" />
                  <span>{t.uiuxPrescriptionsTitle}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">{t.uiuxPrescriptionsSub}</p>
              </div>

              {/* 1-Click Complete UI/UX Issue Resolution Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/30 via-[#0B0E14] to-[#0A0C11] border border-white/[0.08] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <Sparkles className="size-4 text-emerald-400" />
                      <span>{isAr ? 'حل كافة مشاكل الـ UI/UX بنقرة واحدة بالذكاء الاصطناعي' : '1-Click Complete UI/UX Issue Resolution'}</span>
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed ps-4">
                    {isAr
                      ? 'بدلاً من تطبيق كل ملاحظة على حدة، انسخ البرومبت الكامل لكل التوجيهات الهندسية («اعمل هيك وسوي هيك» و«زبط اللون هذا») أو انسخ كود الـ CSS الموحّد.'
                      : 'Copy all actionable directives and contrast fixes into Claude or ChatGPT in one pass, or grab the unified CSS stylesheet directly.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyMasterPrompt}
                    className="flex-1 md:flex-initial h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-[0.98]"
                  >
                    {promptCopied ? (
                      <>
                        <Check className="size-4 text-zinc-950" />
                        <span>{t.uiuxAllPromptCopied}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4 text-zinc-950" />
                        <span>{t.uiuxCopyAllPrompt}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyAllCss}
                    className="h-10 px-3.5 rounded-xl bg-[#0E121A] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-zinc-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    {allCssCopied ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{t.uiuxAllCssCopied}</span>
                      </>
                    ) : (
                      <>
                        <FileCode2 className="size-3.5 text-zinc-400" />
                        <span>{t.uiuxCopyAllCss}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {filteredPrescriptions.length === 0 ? (
                <div className="p-8 text-center bg-[#090C12] border border-zinc-800 rounded-2xl text-zinc-400 text-sm">
                  {isAr ? 'لا توجد ملاحظات تطابق الفلتر المحدد.' : 'No prescriptions match the selected filter.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPrescriptions.map((prescription) => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                      isAr={isAr}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <AuditFooter lang={lang} />
    </div>
  );
}

// ============================================================================
// 7. HUMAN EDIT GUIDE & MAINTENANCE NOTES
// ============================================================================
/**
 * HOW TO MAINTAIN THIS UI/UX STUDIO PAGE:
 *
 * 1. Modify Quick Test Domains:
 *    Update QUICK_TEST_URLS in Zone 2.
 *
 * 2. Update Vector Categories or Icons:
 *    Update VECTOR_CONFIG in Zone 2.
 *
 * 3. Color Contrast and Heuristic Rules:
 *    Calculations are performed by the backend engine in `src/lib/audit/uiux-engine.ts`.
 *    This page renders the results following strict `/using-frontend-noslop` rules
 *    (Obsidian #050608 theme, #10B981 emerald accent, zero CLS).
 */
