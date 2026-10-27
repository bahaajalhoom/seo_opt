import { AuditResult, SupportedLang } from '@/types/audit';

export function generateMasterRepairPrompt(audit: AuditResult, lang: SupportedLang): string {
  const isAr = lang === 'ar';
  const criticals = audit.issues.filter((i) => i.severity === 'critical');
  const warnings = audit.issues.filter((i) => i.severity === 'warning');

  const header = isAr
    ? `# 🛠️ برومبت الإصلاح الشامل: ترقية موقع ${audit.domain} للدرجة الكاملة 100/100
**الهدف:** تصحيح كافة مشاكل السيو (SEO)، محركات الذكاء الاصطناعي (GEO)، الأداء، وإمكانية الوصول لرفع النتيجة الحالية من (${audit.overallScore}/100) إلى (100/100) متطابقة مع المعايير الرسمية.`
    : `# 🛠️ MASTER REPAIR PROMPT: Elevate ${audit.domain} to 100/100 Perfect Score
**Objective:** Resolve all technical SEO, Generative Engine (GEO), Performance, and Accessibility findings to elevate current score from (${audit.overallScore}/100) to a verified (100/100) standard.`;

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
أنت مهندس برمجيات رئيسي (Principal Full-Stack & Technical SEO/GEO Architect). مهمتك تطبيق التعديلات البرمجية التالية بدقة واحترافية:
1. **كتابة كود إنتاجي جاهز للنسخ:** لا تكتفِ بالنصائح النظرية؛ اكتب الأكواد المحدثة كاملة لكل ملف محدد.
2. **توافقية Next.js / HTML5:** تطبيق المعايير الدلالية الحديثة والتأكد من عدم وجود أخطاء في الـ Hydration أو Render-blocking resources.
3. **التجهيز الكامل لمحركات الذكاء الاصطناعي (GEO):** إنشاء ملف \`public/llms.txt\`، وتحديث \`public/robots.txt\`، وإضافة مخططات \`JSON-LD Schema\` الغنية لتمكين محركات Perplexity, ChatGPT, و Gemini من اقتباس الموقع.`
    : `## 🎯 AI Role & Execution Directives:
You are a Principal Full-Stack & Technical SEO/GEO Architect. Your task is to implement the following precise engineering changes:
1. **Production-Ready Code:** Do not provide abstract advice. Output complete, drop-in replacement files and code snippets.
2. **Modern Next.js / Web Standards:** Enforce strict semantic HTML5, zero hydration issues, and eliminate render-blocking assets.
3. **Full Generative Engine Optimization (GEO):** Scaffold \`public/llms.txt\`, configure \`public/robots.txt\`, and inject rich \`JSON-LD Schema\` to maximize AI citations across Perplexity, ChatGPT, Claude, and Gemini.`;

  const criticalSection = isAr
    ? `## 🚨 المشاكل الحرجة التي يجب حلها فوراً (${criticals.length} مشاكل):`
    : `## 🚨 Critical Deficiencies Requiring Immediate Action (${criticals.length} items):`;

  const criticalItems = criticals
    .map((issue, idx) => {
      const title = isAr ? issue.titleAr : issue.titleEn;
      const desc = isAr ? issue.descriptionAr : issue.descriptionEn;
      const impact = isAr ? issue.impactAr : issue.impactEn;
      const solution = isAr ? issue.fixRecommendationAr : issue.fixRecommendationEn;
      const snippet = issue.codeSnippet ? `\n\`\`\`html\n${issue.codeSnippet}\n\`\`\`` : '';
      return `### ${idx + 1}. [${issue.category.toUpperCase()}] ${title}
- **${isAr ? 'الوصف' : 'Description'}:** ${desc}
- **${isAr ? 'الأثر' : 'Impact'}:** ${impact}
- **${isAr ? 'الحل المقترح' : 'Fix Recommendation'}:** ${solution}${snippet}`;
    })
    .join('\n\n');

  const warningSection = isAr
    ? `## ⚠️ التحذيرات والتحسينات الموصى بها (${warnings.length} عناصر):`
    : `## ⚠️ Warnings & Secondary Improvements (${warnings.length} items):`;

  const warningItems = warnings
    .map((issue, idx) => {
      const title = isAr ? issue.titleAr : issue.titleEn;
      const desc = isAr ? issue.descriptionAr : issue.descriptionEn;
      const solution = isAr ? issue.fixRecommendationAr : issue.fixRecommendationEn;
      const snippet = issue.codeSnippet ? `\n\`\`\`html\n${issue.codeSnippet}\n\`\`\`` : '';
      return `### ${idx + 1}. [${issue.category.toUpperCase()}] ${title}
- **${isAr ? 'الملاحظة' : 'Finding'}:** ${desc}
- **${isAr ? 'طريقة الحل' : 'Implementation'}:** ${solution}${snippet}`;
    })
    .join('\n\n');

  const geoBoilerplate = isAr
    ? `## 🤖 مواصفات ملفات الذكاء الاصطناعي الإلزامية:

### 1. إنشاء ملف \`public/llms.txt\`:
\`\`\`markdown
# ${audit.domain}
> الموقع الرسمي: ${audit.url}

## About
${audit.domain} provides high-performance services and authoritative documentation.

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
    : `## 🤖 Mandatory Generative AI Specifications:

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
بعد تنفيذ الأكواد أعلاه، يرجى تقديم تقرير موجز يوضح الملفات التي تم تعديلها، مع التأكيد على وصول النتيجة إلى 100/100 وخلو الموقع من أي أخطاء برمجية أو تحذيرات أمنية.`
    : `## ✅ Acceptance & Verification Criteria:
Upon implementing these fixes, confirm that all modified files maintain strict zero-regression standards, Core Web Vitals remain in the green band, and structured verification confirms a 100/100 score.`;

  return [header, metaTelemetry, roleDirectives, criticalSection, criticalItems, warningSection, warningItems, geoBoilerplate, closing].join('\n\n');
}
