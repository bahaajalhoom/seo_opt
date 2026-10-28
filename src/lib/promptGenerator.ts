// ============================================================================
// 1. IMPORTS
// ============================================================================
import { AuditResult, SupportedLang } from '@/types/audit';
import type { ExtractedColor } from '@/types/uiux';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
const DEFAULT_BRAND_FALLBACKS = {
  accent: '#10B981',
  accentHover: '#059669',
  canvasBg: '#050608',
  surfaceBg: '#090C12',
  textPrimary: '#F8F9FA',
  textMuted: '#94A3B8',
} as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
export interface BrandTokens {
  accent: string;
  accentHover: string;
  canvasBg: string;
  surfaceBg: string;
  textPrimary: string;
  textMuted: string;
  paletteList: Array<{ hex: string; role: string; freq: number }>;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
/**
 * Analyzes extracted DOM colors to determine the primary brand accent,
 * canvas background, surface cards, and high-contrast text tokens.
 */
export function extractBrandTokens(colors?: ExtractedColor[]): BrandTokens {
  if (!colors || colors.length === 0) {
    return {
      ...DEFAULT_BRAND_FALLBACKS,
      paletteList: [],
    };
  }

  // 1. Accent: Find the most frequent non-black/non-white color with vibrant luminance
  const accentCandidates = colors.filter(
    (c) =>
      c.hex !== '#FFFFFF' &&
      c.hex !== '#000000' &&
      c.hex !== '#050608' &&
      c.luminance > 0.1 &&
      c.luminance < 0.85
  );
  const accent = accentCandidates[0]?.hex || colors[0]?.hex || DEFAULT_BRAND_FALLBACKS.accent;

  // 2. Canvas Background: find the most frequent background/dark canvas color
  const darkBgs = colors.filter((c) => c.role === 'background' || c.luminance < 0.08);
  const canvasBg = darkBgs[0]?.hex || DEFAULT_BRAND_FALLBACKS.canvasBg;
  const surfaceBg = darkBgs[1]?.hex || (darkBgs[0]?.hex ? darkBgs[0].hex : DEFAULT_BRAND_FALLBACKS.surfaceBg);

  // 3. Text primary: high contrast against canvasBg
  const isLightBg = canvasBg.toLowerCase() === '#ffffff';
  const textPrimary = isLightBg ? '#0F172A' : '#F8F9FA';
  const textMuted = isLightBg ? '#64748B' : '#94A3B8';

  const paletteList = colors.slice(0, 8).map((c) => ({
    hex: c.hex,
    role: c.role,
    freq: c.frequency,
  }));

  return {
    accent,
    accentHover: accent,
    canvasBg,
    surfaceBg,
    textPrimary,
    textMuted,
    paletteList,
  };
}

/**
 * Builds a dedicated Brand Palette and CSS/Tailwind tokens markdown section
 * using the site's authentic extracted colors.
 */
function buildBrandSection(tokens: BrandTokens, isAr: boolean): string {
  const paletteBullets =
    tokens.paletteList.length > 0
      ? tokens.paletteList.map((p) => `- \`${p.hex}\` (${p.role} · frequency: ${p.freq})`).join('\n')
      : `- \`${tokens.accent}\` (Primary Accent)\n- \`${tokens.canvasBg}\` (Canvas)`;

  if (isAr) {
    return `## 🎨 1. الهوية البصرية ونظام الألوان المعتمد للموقع (90/10 Brand Tokens):
تم استخراج الألوان الحقيقية لموقعك مباشرة من كود الصفحة لمنع الذكاء الاصطناعي من تغيير الهوية أو اختراع ألوان عشوائية:
- **لون التمييز والبراند الرئيسي (Brand Accent):** \`${tokens.accent}\` (مخصص للأزرار الرئيسية CTAs والروابط النشطة)
- **ألوان الخلفيات والكانفاس (Canvas Background):** \`${tokens.canvasBg}\` (يشكل 90% من مساحة الواجهة بهدوء)
- **أسطح البطاقات والحاويات (Surface Cards):** \`${tokens.surfaceBg}\`
- **لون النصوص الأساسية (Primary Text):** \`${tokens.textPrimary}\`
- **لون النصوص الثانوية المتزنة (Muted Text):** \`${tokens.textMuted}\` (مع ضمان نسبة التباين WCAG 2.1 AA $\\ge 4.5:1$)

### درجات الألوان المكتشفة في الواجهة:
${paletteBullets}

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
1. التزم بالألوان المستخرجة أعلاه في كافة التعديلات والتصحيحات. لا تخترع ألواناً عشوائية جديدة.
2. طبّق قاعدة 90/10 للألوان: 90% أسطح محايدة هادئة و 10% لون تمييز موحد للـ CTAs.
3. اضبط تباين كافة النصوص الثانوية والرمادية لتحقيق معايير WCAG 2.1 AA دون المساس بهوية العلامة التجارية.`;
  }

  return `## 🎨 1. Authentic Brand Palette & 90/10 Design System Tokens:
Extracted directly from the site DOM so that AI refactorings preserve your exact branding without hallucinations:
- **Primary Brand Accent:** \`${tokens.accent}\` (Dedicated anchor for primary CTAs and active states)
- **Canvas Background:** \`${tokens.canvasBg}\` (Enforces 90% neutral baseline per 90/10 discipline)
- **Surface Cards & Modals:** \`${tokens.surfaceBg}\`
- **Primary Typography:** \`${tokens.textPrimary}\`
- **Muted Typography:** \`${tokens.textMuted}\` (Calibrated for WCAG 2.1 AA $\\ge 4.5:1$ contrast)

### Detected DOM Palette Roster:
${paletteBullets}

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
1. Anchor all design and layout fixes around these extracted tokens. Do NOT introduce uncoordinated colors.
2. Enforce the 90/10 color rule: 90% neutral canvas, 10% high-energy brand accent.
3. Ensure every text element meets WCAG 2.1 AA contrast ratio against its parent background.`;
}

// ============================================================================
// 5. MAIN PROMPT GENERATOR
// ============================================================================
export function generateMasterRepairPrompt(audit: AuditResult, lang: SupportedLang): string {
  const isAr = lang === 'ar';
  const criticals = audit.issues.filter((i) => i.severity === 'critical');
  const warnings = audit.issues.filter((i) => i.severity === 'warning');
  const brandTokens = extractBrandTokens(audit.extractedColors);

  const header = isAr
    ? `# 🛠️ برومبت الإصلاح الشامل المخصص لموقع ${audit.domain} (الدرجة الكاملة 100/100)
**الهدف:** تصحيح كافة مشاكل السيو (SEO)، محركات الذكاء الاصطناعي (GEO)، الأداء، وتجربة المستخدم (UI/UX) مع الحفاظ على الهوية البصرية والألوان المستخرجة للموقع، لرفع النتيجة الحالية من (${audit.overallScore}/100) إلى (100/100) متطابقة مع المعايير الرسمية.`
    : `# 🛠️ TAILORED MASTER REPAIR PROMPT: Elevate ${audit.domain} to 100/100 Perfect Score
**Objective:** Resolve all technical SEO, Generative Engine (GEO), Performance, and UI/UX findings while preserving the site's authentic extracted brand palette, elevating score from (${audit.overallScore}/100) to verified (100/100) standard.`;

  const metaTelemetry = isAr
    ? `## 📊 ملخص الفحص الحالي للموقع:
- **النطاق المستهدف:** \`${audit.url}\`
- **الدرجة الإجمالية الحالية:** \`${audit.overallScore}/100\`
- **السيو التقليدي (SEO):** \`${audit.categories.seo.score}/100\`
- **محركات الذكاء الاصطناعي (GEO):** \`${audit.categories.geo.score}/100\`
- **الأداء والسرعة (Performance):** \`${audit.categories.performance.score}/100\`
- **إمكانية الوصول (Accessibility):** \`${audit.categories.accessibility.score}/100\`
- **الأمان والبيانات (Security):** \`${audit.categories.security.score}/100\`
- **عدد المشاكل الحرجة:** ${criticals.length}
- **عدد التحذيرات:** ${warnings.length}`
    : `## 📊 Current Audit Telemetry:
- **Target URL:** \`${audit.url}\`
- **Current Overall Score:** \`${audit.overallScore}/100\`
- **Traditional SEO:** \`${audit.categories.seo.score}/100\`
- **Generative Engine (GEO):** \`${audit.categories.geo.score}/100\`
- **Performance & Speed:** \`${audit.categories.performance.score}/100\`
- **Accessibility:** \`${audit.categories.accessibility.score}/100\`
- **Security:** \`${audit.categories.security.score}/100\`
- **Critical Findings:** ${criticals.length}
- **Warnings:** ${warnings.length}`;

  const roleDirectives = isAr
    ? `## 🎯 دور الذكاء الاصطناعي وقواعد التنفيذ:
أنت مهندس برمجيات وتصميم رئيسي (Principal Full-Stack & UI/UX Architect). مهمتك تطبيق التعديلات البرمجية التالية بدقة واحترافية:
1. **كتابة كود إنتاجي جاهز للنسخ:** لا تكتفِ بالنصائح النظرية؛ اكتب الأكواد المحدثة كاملة لكل ملف محدد.
2. **الالتزام بألوان وهوية الموقع:** استخدم الألوان المستخرجة في قسم الهوية البصرية أدناه.
3. **توافقية Next.js / HTML5:** تطبيق المعايير الدلالية الحديثة والتأكد من عدم وجود أخطاء في الـ Hydration أو Render-blocking resources.
4. **التجهيز الكامل لمحركات الذكاء الاصطناعي (GEO):** إنشاء ملف \`public/llms.txt\`، وتحديث \`public/robots.txt\`، وإضافة مخططات \`JSON-LD Schema\` الغنية لتمكين محركات Perplexity, ChatGPT, و Gemini من اقتباس الموقع.`
    : `## 🎯 AI Role & Execution Directives:
You are a Principal Full-Stack & UI/UX Architect. Your task is to implement the following precise engineering changes:
1. **Production-Ready Code:** Do not provide abstract advice. Output complete, drop-in replacement files and code snippets.
2. **Brand & Color Integrity:** Adhere strictly to the authentic extracted color tokens detailed below.
3. **Modern Next.js / Web Standards:** Enforce strict semantic HTML5, zero hydration issues, and eliminate render-blocking assets.
4. **Full Generative Engine Optimization (GEO):** Scaffold \`public/llms.txt\`, configure \`public/robots.txt\`, and inject rich \`JSON-LD Schema\` to maximize AI citations across Perplexity, ChatGPT, Claude, and Gemini.`;

  const brandSection = buildBrandSection(brandTokens, isAr);

  const criticalSection = isAr
    ? `## 🚨 2. المشاكل الحرجة التي يجب حلها فوراً (${criticals.length} مشاكل):`
    : `## 🚨 2. Critical Deficiencies Requiring Immediate Action (${criticals.length} items):`;

  const criticalItems = criticals
    .map((issue, idx) => {
      const title = isAr ? issue.titleAr : issue.titleEn;
      const desc = isAr ? issue.descriptionAr : issue.descriptionEn;
      const impact = isAr ? issue.impactAr : issue.impactEn;
      const solution = isAr ? issue.fixRecommendationAr : issue.fixRecommendationEn;
      const targetFile = issue.targetFile ? `\n- **${isAr ? 'الملف المستهدف' : 'Target File'}:** \`${issue.targetFile}\`` : '';
      const snippet = issue.codeSnippet ? `\n\`\`\`html\n${issue.codeSnippet}\n\`\`\`` : '';
      return `### ${idx + 1}. [${issue.category.toUpperCase()}] ${title} (${issue.severity.toUpperCase()})${targetFile}
- **${isAr ? 'الوصف' : 'Description'}:** ${desc}
- **${isAr ? 'الأثر' : 'Impact'}:** ${impact}
- **${isAr ? 'الحل المقترح' : 'Fix Recommendation'}:** ${solution}${snippet}`;
    })
    .join('\n\n');

  const warningSection = isAr
    ? `## ⚠️ 3. التحذيرات والتحسينات الموصى بها (${warnings.length} عناصر):`
    : `## ⚠️ 3. Warnings & Secondary Improvements (${warnings.length} items):`;

  const warningItems = warnings
    .map((issue, idx) => {
      const title = isAr ? issue.titleAr : issue.titleEn;
      const desc = isAr ? issue.descriptionAr : issue.descriptionEn;
      const solution = isAr ? issue.fixRecommendationAr : issue.fixRecommendationEn;
      const targetFile = issue.targetFile ? `\n- **${isAr ? 'الملف المستهدف' : 'Target File'}:** \`${issue.targetFile}\`` : '';
      const snippet = issue.codeSnippet ? `\n\`\`\`html\n${issue.codeSnippet}\n\`\`\`` : '';
      return `### ${idx + 1}. [${issue.category.toUpperCase()}] ${title}${targetFile}
- **${isAr ? 'الملاحظة' : 'Finding'}:** ${desc}
- **${isAr ? 'طريقة الحل' : 'Implementation'}:** ${solution}${snippet}`;
    })
    .join('\n\n');

  const geoBoilerplate = isAr
    ? `## 🤖 4. مواصفات ملفات الذكاء الاصطناعي الإلزامية:

### 1. إنشاء ملف \`public/llms.txt\`:
\`\`\`markdown
# ${audit.domain}
> الموقع الرسمي: ${audit.url}

## About
${audit.domain} provides high-performance services, verified data, and structured documentation.

## Core Services & APIs
- [/docs](${audit.url}/docs): Developer APIs and comprehensive technical references.
- [/pricing](${audit.url}/pricing): Transparent tier pricing and enterprise SLAs.
\`\`\`

### 2. تحديث ملف \`public/robots.txt\` للسماح بروبوتات الذكاء الاصطناعي:
\`\`\`txt
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${audit.url}/sitemap.xml
\`\`\`

### 3. إدراج المخطط الهيكلي JSON-LD في \`<head>\`:
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${audit.domain}",
  "url": "${audit.url}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "${audit.url}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
\`\`\``
    : `## 🤖 4. Mandatory Generative AI Specifications:

### 1. Scaffold \`public/llms.txt\`:
\`\`\`markdown
# ${audit.domain}
> Official website: ${audit.url}

## About
${audit.domain} delivers high-reliability services, verified data, and structured documentation.

## Core Endpoints & References
- [/docs](${audit.url}/docs): Developer guides, API endpoints, and schemas.
- [/pricing](${audit.url}/pricing): Transparent tiers and enterprise specifications.
\`\`\`

### 2. Update \`public/robots.txt\` with explicit AI Crawler permissions:
\`\`\`txt
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${audit.url}/sitemap.xml
\`\`\`

### 3. Inject Primary JSON-LD Structured Data in \`<head>\`:
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${audit.domain}",
  "url": "${audit.url}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "${audit.url}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
\`\`\``;

  const closing = isAr
    ? `## ✅ معايير القبول والتحقق:
بعد تنفيذ الأكواد أعلاه، يرجى تقديم تقرير موجز يوضح الملفات التي تم تعديلها، مع التأكيد على وصول النتيجة إلى 100/100، والتوافق مع قاعدة 90/10 للألوان، وخلو الموقع من أي أخطاء برمجية أو تحذيرات أمنية.`
    : `## ✅ Acceptance & Verification Criteria:
Upon implementing these fixes, confirm that all modified files maintain strict zero-regression standards, Core Web Vitals remain in the green band, 90/10 color discipline is strictly preserved using the provided tokens, and verification confirms a 100/100 score.`;

  return [header, metaTelemetry, roleDirectives, brandSection, criticalSection, criticalItems, warningSection, warningItems, geoBoilerplate, closing].join('\n\n');
}

// ============================================================================
// 6. HUMAN EDIT GUIDE & MAINTENANCE NOTES
// ============================================================================
/**
 * HOW TO MAINTAIN THE MASTER PROMPT GENERATOR:
 *
 * 1. Modify Fallback Palette:
 *    Update DEFAULT_BRAND_FALLBACKS in Zone 2.
 *
 * 2. Add New Prompt Sections:
 *    Append new markdown blocks in Zone 5 before the closing array join.
 */
