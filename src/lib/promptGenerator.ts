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

  // 1. Canvas Background: find the most frequent background/dark canvas color
  const darkBgs = colors.filter((c) => c.role === 'background' || c.luminance < 0.08);
  const canvasBg = darkBgs[0]?.hex || DEFAULT_BRAND_FALLBACKS.canvasBg;
  const surfaceBg = darkBgs[1]?.hex || (darkBgs[0]?.hex ? darkBgs[0].hex : DEFAULT_BRAND_FALLBACKS.surfaceBg);

  // 2. Accent: Must have high visual energy and distinct contrast from canvasBg
  const accentCandidates = colors.filter(
    (c) =>
      c.hex !== '#FFFFFF' &&
      c.hex !== '#000000' &&
      c.hex.toUpperCase() !== canvasBg.toUpperCase() &&
      c.hex.toUpperCase() !== surfaceBg.toUpperCase() &&
      c.luminance >= 0.12 &&
      c.luminance <= 0.85
  );
  const accent = accentCandidates[0]?.hex || DEFAULT_BRAND_FALLBACKS.accent;

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
  const cleanUrl = audit.url.replace(/\/+$/, '');
  const criticals = audit.issues.filter((i) => i.severity === 'critical');
  const warnings = audit.issues.filter((i) => i.severity === 'warning');

  const header = isAr
    ? `# 🛠️ برومبت الإصلاح الشامل للموقع: ${audit.domain} (الدرجة الكاملة 100/100)
**الهدف:** تصحيح كافة مشاكل السيو (SEO)، محركات الذكاء الاصطناعي (GEO)، الأداء والسرعة، إمكانية الوصول، والأمان، لرفع النتيجة الحالية من (${audit.overallScore}/100) إلى (100/100) وفق أعلى المعايير الهندسية الرسمية.`
    : `# 🛠️ TAILORED MASTER REPAIR PROMPT: Elevate ${audit.domain} to 100/100 Perfect Score
**Objective:** Resolve all technical SEO, Generative Engine (GEO), Performance, Accessibility, and Security findings, elevating score from (${audit.overallScore}/100) to verified (100/100) standard.`;

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
أنت مهندس برمجيات رئيسي وخبير سيو ومحركات ذكاء اصطناعي (Principal Full-Stack, SEO & GEO Architect). مهمتك تطبيق التعديلات البرمجية التالية بدقة واحترافية:
1. **كتابة كود إنتاجي جاهز للنسخ:** لا تكتفِ بالنصائح النظرية؛ اكتب الأكواد المحدثة كاملة لكل ملف محدد دون اختصارات.
2. **فحص صفحات المشروع وإنشاء خريطة موقع حقيقية:** قم بفحص مسارات المشروع (مثل \`src/app/**/page.tsx\` أو روابط التنقل) وأنشئ خريطة موقع حقيقية تضم كافة صفحات الموقع التابعة للنطاق المستهدف (\`${cleanUrl}\`) بدقة، وتجنب تماماً وضع روابط وهمية قد تُرجع خطأ 404.
3. **توليد ملف \`robots.txt\` متصل بالدومين:** أنشئ ملف \`robots.txt\` يوجه الزواحف إلى رابط خريطة الموقع الصحيحة لنطاقك (\`${cleanUrl}/sitemap.xml\`) مع السماح الكامل لمحركات البحث وروبوتات الذكاء الاصطناعي.
4. **حماية الكلمات المفتاحية وأسماء البراند في العنوان (Strict SEO Protection):**
   ⚠️ **تحذير حاسم:** إذا كان الموقع يحتوي على اسم المؤسس، أو اسم العلامة التجارية، أو كلمات مفتاحية يتصدر بها حالياً في جوجل داخل وسم \`<title>\` أو \`<meta name="description">\`، **يُمنع منعاً باتاً حذفها أو شطبها** بهدف تقصير العنوان. حافظ على الكلمات المفتاحية الرابحة كاملة!
5. **مخططات البيانات المنظمة (Schema.org JSON-LD):** إضافة مخططات Schema.org بصيغة JSON-LD الغنية لتمكين محركات البحث والذكاء الاصطناعي من فهم الكيان والخدمات.
6. **الأداء وسرعة التحميل (Core Web Vitals):** تحسين استجابة الخادم وترويسات التخزين المؤقت، وضغط البيانات، وإزالة حجب الرندرة.
7. **إمكانية الوصول والأمان (A11y & Security):** اعتماد وسوم HTML5 الدلالية، وأوصاف الصور alt، وترويسات الأمان الصارمة.`
    : `## 🎯 AI Role & Execution Directives:
You are a Principal Full-Stack, SEO & GEO Architect. Your task is to implement the following precise engineering changes:
1. **Production-Ready Code:** Do not provide abstract advice. Output complete, drop-in replacement files and code snippets.
2. **Inspect Project Routes & Build Real Sitemap:** Scan the codebase (e.g. \`src/app/**/page.tsx\` or navigation links) and generate a 100% functional, real sitemap for the target domain (\`${cleanUrl}\`). NEVER leave broken or fake sitemap links that return 404!
3. **Deploy Target-Bound Robots.txt:** Create \`public/robots.txt\` pointing to \`${cleanUrl}/sitemap.xml\` with full permissions for search crawlers and AI bots.
4. **Keyword & Brand Identity Protection (Zero SEO Regression):**
   ⚠️ **CRITICAL MANDATE:** Never strip the founder name, brand title, or existing ranking keywords from \`<title>\` or \`<meta name="description">\` just to satisfy arbitrary length checkers. Preserve ranking keywords!
5. **Structured Data:** Embed rich Schema.org JSON-LD entities to establish brand authority and knowledge graph citations.
6. **Core Web Vitals & Speed:** Optimize caching headers, compression, bundle size, and eliminate render-blocking scripts.
7. **Accessibility & Security:** Enforce semantic HTML5 landmarks, image alt attributes, and hardened security response headers.`;

  const criticalSection = isAr
    ? `## 🚨 1. المشاكل الحرجة التي يجب حلها فوراً (${criticals.length} مشاكل):`
    : `## 🚨 1. Critical Deficiencies Requiring Immediate Action (${criticals.length} items):`;

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
    ? `## ⚠️ 2. التحذيرات والتحسينات الموصى بها (${warnings.length} عناصر):`
    : `## ⚠️ 2. Warnings & Secondary Improvements (${warnings.length} items):`;

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
    ? `## 🗺️ 3. إنشاء وتفعيل خريطة الموقع (Sitemap) وملف الروبوت (Robots.txt):

### 1. فحص مسارات المشروع وإنشاء خريطة الموقع الحقيقية (\`src/app/sitemap.ts\` أو \`public/sitemap.xml\`):
> ⚠️ **أمر تنفيذي حاسم للذكاء الاصطناعي:**
> لا تضع خريطة موقع صماء أو رابطاً وهمياً يُرجع خطأ 404! 
> قم بفحص بنية مجلدات المشروع واكتشاف كافة مسارات الصفحات الفعلية الموجودة في الكود (مثل \`src/app/**/page.tsx\` أو روابط التنقل في الهيدر والفوتر).
> أنشئ خريطة الموقع الحقيقية كاملة تغطي كافة المسارات التابعة للنطاق المستهدف (\`${cleanUrl}\`) بدقة مع تاريخ التعديل والأولويات:

**إذا كان المشروع Next.js App Router (الخيار الموصى به):** أنشئ ملف \`src/app/sitemap.ts\`:
\`\`\`typescript
import { MetadataRoute } from 'next';

const BASE_URL = '${cleanUrl}';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // قم بفحص المشروع وأضف كافة مسارات الصفحات الحقيقية المكتشفة هنا
  const projectRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  return projectRoutes.map((route) => ({
    url: \`\${BASE_URL}\${route.path}\`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
\`\`\`

**إذا كان المشروع يعتمد ملفاً ثابتاً:** أنشئ ملف \`public/sitemap.xml\`:
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${cleanUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- أضف كافة صفحات مشروعك الحقيقية هنا لنفس الدومين -->
</urlset>
\`\`\`

---

### 2. إنشاء وتحديث ملف \`public/robots.txt\` متصلاً بنطاقك:
\`\`\`txt
User-agent: *
Allow: /

# روبوتات الذكاء الاصطناعي (GEO AI Crawlers)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

# رابط خريطة الموقع الرسمي الحقيقي
Sitemap: ${cleanUrl}/sitemap.xml
\`\`\`

---

## 🤖 4. مواصفات ملفات الذكاء الاصطناعي والمخطط المنظم (GEO & Schema):

### 1. إنشاء ملف \`public/llms.txt\`:
\`\`\`markdown
# ${audit.domain}
> الموقع الرسمي: ${cleanUrl}/

## About
${audit.domain} provides high-performance services, verified data, and structured documentation.

## Core Endpoints & References
- [/docs](${cleanUrl}/docs): Developer APIs and comprehensive technical references.
- [/pricing](${cleanUrl}/pricing): Transparent tier pricing and enterprise SLAs.
\`\`\`

### 2. إنشاء ملف \`public/llms-full.txt\` للسياق الشامل (Deep RAG):
\`\`\`markdown
# ${audit.domain} — Full Architectural Context

> Comprehensive reference documentation and technical architecture for LLM context ingestion.

## Overview
Detailed system specifications, capabilities, and canonical resources for ${audit.domain}.
\`\`\`

### 3. إدراج المخطط الهيكلي JSON-LD في \`<head>\`:
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${audit.domain}",
  "url": "${cleanUrl}/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "${cleanUrl}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
\`\`\``
    : `## 🗺️ 3. Deploy Functional Sitemap & Target-Bound Robots.txt:

### 1. Scan Project Routes & Generate Functional Sitemap (\`src/app/sitemap.ts\` or \`public/sitemap.xml\`):
> ⚠️ **MANDATORY AI DIRECTIVE:**
> Do NOT create a stub or dummy link that returns 404!
> Inspect the project repository to discover all actual route files (e.g. \`src/app/**/page.tsx\` or navigation links).
> Generate a 100% real, functional sitemap containing all existing pages under the audited domain (\`${cleanUrl}\`):

**For Next.js App Router (Recommended):** Create \`src/app/sitemap.ts\`:
\`\`\`typescript
import { MetadataRoute } from 'next';

const BASE_URL = '${cleanUrl}';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Inspect project structure and populate all real discovered routes here
  const projectRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  return projectRoutes.map((route) => ({
    url: \`\${BASE_URL}\${route.path}\`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
\`\`\`

**For Static or Non-Next.js Projects:** Create \`public/sitemap.xml\`:
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${cleanUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Include all your real discovered pages here -->
</urlset>
\`\`\`

---

### 2. Create or Update \`public/robots.txt\` Bound to Your Target Domain:
\`\`\`txt
User-agent: *
Allow: /

# Generative AI Crawlers (GEO)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

# Canonical Sitemap Discovery
Sitemap: ${cleanUrl}/sitemap.xml
\`\`\`

---

## 🤖 4. Mandatory Generative AI Specifications & Schema.org:

### 1. Scaffold \`public/llms.txt\`:
\`\`\`markdown
# ${audit.domain}
> Official website: ${cleanUrl}/

## About
${audit.domain} delivers high-reliability services, verified data, and structured documentation.

## Core Endpoints & References
- [/docs](${cleanUrl}/docs): Developer guides, API endpoints, and schemas.
- [/pricing](${cleanUrl}/pricing): Transparent tiers and enterprise specifications.
\`\`\`

### 2. Scaffold \`public/llms-full.txt\` for Deep RAG Context:
\`\`\`markdown
# ${audit.domain} — Full Architectural Context

> Comprehensive reference documentation and technical architecture for deep RAG ingestion.

## Overview
Detailed system specifications, capabilities, and canonical resources for ${audit.domain}.
\`\`\`

### 3. Inject Primary JSON-LD Structured Data in \`<head>\`:
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${audit.domain}",
  "url": "${cleanUrl}/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "${cleanUrl}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
\`\`\``;

  const closing = isAr
    ? `## ✅ معايير القبول والتحقق:
بعد تطبيق كافة الأكواد والملفات المحددة أعلاه، يرجى تقديم تقرير موجز يوضح الملفات التي تم تعديلها أو إنشاؤها، مع التأكيد على خلو الموقع من أي أخطاء برمجية، وتفعيل أذونات الزواحف، ووصول نتائج الفحص إلى 100/100.`
    : `## ✅ Acceptance & Verification Criteria:
Upon implementing these fixes, confirm that all modified files maintain strict zero-regression standards, Core Web Vitals remain in the green band, search engine bots have full crawl permissions, and verification confirms a 100/100 score.`;

  return [header, metaTelemetry, roleDirectives, criticalSection, criticalItems, warningSection, warningItems, geoBoilerplate, closing].join('\n\n');
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
