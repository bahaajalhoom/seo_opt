import { AuditCategory, IssueSeverity, SupportedLang } from '@/types/audit';

export interface TranslationDictionary {
  brandTitle: string;
  brandTagline: string;
  officialBadge: string;
  engineOnline: string;
  langToggle: string;
  creatorBadge: string;
  creatorCredit: string;
  creatorRole: string;
  navAudit: string;
  navUiUx: string;
  navMethodology: string;
  navAbout: string;
  navTerms: string;
  navPrivacy: string;
  footerCopyright: string;
  footerTagline: string;
  systemStatus: string;
  exportReport: string;
  copiedToast: string;
  exportSuccessToast: string;
  inputPlaceholder: string;
  auditButton: string;
  auditingButton: string;
  quickTestLabel: string;
  urlInvalidError: string;
  urlEmptyError: string;
  overallScoreTitle: string;
  overallVerdictSub: string;
  pointsToHundred: string;
  masterPromptCtaTitle: string;
  masterPromptCtaSub: string;
  openMasterPromptBtn: string;
  geoDeepDiveTitle: string;
  geoDeepDiveSub: string;
  llmsTxtTitle: string;
  llmsTxtFound: string;
  llmsTxtMissing: string;
  aiBotsTitle: string;
  aiBotsAllowed: string;
  aiBotsBlocked: string;
  jsonLdTitle: string;
  noJsonLdFound: string;
  citationReadinessTitle: string;
  markdownClarityTitle: string;
  paletteSectionTitle: string;
  paletteSectionSub: string;
  paletteCopyAllCss: string;
  paletteCssCopied: string;
  paletteEmpty: string;
  paletteDetectedCount: string;
  paletteAccentLabel: string;
  paletteCanvasLabel: string;
  paletteSurfaceLabel: string;
  paletteTextLabel: string;
  issuesListTitle: string;
  issuesListSub: string;
  filterAll: string;
  filterCritical: string;
  filterWarning: string;
  filterPassed: string;
  searchIssuesPlaceholder: string;
  noMatchingIssuesTitle: string;
  noMatchingIssuesSub: string;
  resetFiltersBtn: string;
  copyFixSnippet: string;
  codeSnippetCopied: string;
  copyAllIssuesPrompt: string;
  allIssuesPromptCopied: string;
  copyAllCodeSnippets: string;
  allCodeSnippetsCopied: string;
  batchFixBannerTitle: string;
  batchFixBannerSub: string;
  learnMoreLink: string;
  problemLabel: string;
  impactLabel: string;
  solutionLabel: string;
  modalTitle: string;
  modalSub: string;
  copyPromptBtn: string;
  promptCopiedToast: string;
  downloadPromptBtn: string;
  targetModelLabel: string;
  closeBtn: string;
  errorTitle: string;
  errorRetryBtn: string;
  categories: Record<AuditCategory, string>;
  severities: Record<IssueSeverity, string>;
  emptyHeroTitle: string;
  emptyHeroSub: string;
  featureSeoTitle: string;
  featureSeoDesc: string;
  featureGeoTitle: string;
  featureGeoDesc: string;
  featureSpeedTitle: string;
  featureSpeedDesc: string;
  featureFixTitle: string;
  featureFixDesc: string;
  uiuxHeroTitle: string;
  uiuxHeroSub: string;
  uiuxInputPlaceholder: string;
  uiuxAuditButton: string;
  uiuxAuditingButton: string;
  uiuxPaletteTitle: string;
  uiuxPaletteSub: string;
  uiuxPrescriptionsTitle: string;
  uiuxPrescriptionsSub: string;
  uiuxActionLabel: string;
  uiuxDiagnosisLabel: string;
  uiuxPrincipleLabel: string;
  uiuxCopySnippet: string;
  uiuxSnippetCopied: string;
  uiuxCopyAllCss: string;
  uiuxAllCssCopied: string;
  uiuxCopyAllPrompt: string;
  uiuxAllPromptCopied: string;
  uiuxVectorsTitle: string;
  uiuxColorsCategory: string;
  uiuxTypographyCategory: string;
  uiuxButtonsCategory: string;
  uiuxHierarchyCategory: string;
  uiuxFormsCategory: string;
}

export const translations: Record<SupportedLang, TranslationDictionary> = {
  ar: {
    brandTitle: 'CRAWLIX',
    brandTagline: 'محرك التدقيق المستقل لمحركات البحث وأنظمة الذكاء الاصطناعي',
    officialBadge: 'إصدار رسمي معتمد · CRAWLIX PRO',
    engineOnline: 'محرك Node 24 يعمل بكفاءة',
    langToggle: 'English',
    creatorBadge: 'المهندس: أحمد جلهوم',
    creatorCredit: 'تم تصميم وتطوير منصة CRAWLIX بالكامل بواسطة المهندس أحمد جلهوم (Ahmad Jalhoom)',
    creatorRole: 'مهندس برمجيات رئيسي ومصمم نظم الذكاء الاصطناعي المتقدمة',
    navAudit: 'منصة الفحص',
    navUiUx: 'فحص UI/UX',
    navMethodology: 'المنهجية',
    navAbout: 'عن المؤسس',
    navTerms: 'شروط الاستخدام',
    navPrivacy: 'سياسة الخصوصية',
    footerCopyright: 'كافة الحقوق محفوظة © 2026 أحمد جلهوم (Ahmad Jalhoom) · CRAWLIX Systems.',
    footerTagline: 'محرك تدقيق مستقل فائق الدقة، صُمم لتمكين المواقع من تصدر نتائج البحث التقليدية وعصر محركات الذكاء الاصطناعي التوليدي بأعلى المعايير الهندسية.',
    systemStatus: 'حالة الخادم: متصل ومؤمن 100%',
    exportReport: 'تصدير التقرير',
    copiedToast: 'تم النسخ إلى الحافظة بنجاح',
    exportSuccessToast: 'تم تحميل ملف التقرير بنجاح',
    inputPlaceholder: 'أدخل رابط الموقع للتدقيق (مثال: https://example.com)...',
    auditButton: 'بدء التدقيق الشامل',
    auditingButton: 'جاري الفحص والتحليل...',
    quickTestLabel: 'مواقع للاختبار السريع:',
    urlInvalidError: 'رابط غير صالح: يجب إدخال رابط يبدأ بـ http:// أو https:// مع نطاق صحيح.',
    urlEmptyError: 'الرجاء إدخال عنوان URL للبدء في الفحص.',
    overallScoreTitle: 'النتيجة الإجمالية للأداء والتوافق',
    overallVerdictSub: 'مبني على 44 معياراً دقيقاً في السيو، الذكاء الاصطناعي، السرعة، وسهولة الوصول.',
    pointsToHundred: 'نقطة للوصول للدرجة الكاملة 100/100',
    masterPromptCtaTitle: 'مُولّد برومبت الإصلاح الشامل 100%',
    masterPromptCtaSub: 'برومبت هندسي فوري ومباشر لنماذج الذكاء الاصطناعي (Claude / ChatGPT / Cursor) لحل كافة المشاكل دفعة واحدة.',
    openMasterPromptBtn: 'عرض ونسخ برومبت الإصلاح',
    geoDeepDiveTitle: 'تدقيق محركات الذكاء الاصطناعي (GEO)',
    geoDeepDiveSub: 'فحص جاهزية موقعك للاقتباس والفهم عبر نماذج ChatGPT, Perplexity, Claude, و Gemini.',
    llmsTxtTitle: 'ملف معايير الذكاء الاصطناعي (llms.txt)',
    llmsTxtFound: 'تم العثور عليه وجاهز للاقتباس',
    llmsTxtMissing: 'غير متوفر (موصى به لمحركات الذكاء الاصطناعي)',
    aiBotsTitle: 'أذونات زواحف الذكاء الاصطناعي في robots.txt',
    aiBotsAllowed: 'مسموح بالزحف والفهرسة',
    aiBotsBlocked: 'محظور من الزحف',
    jsonLdTitle: 'المخططات الهيكلية المكتشفة (JSON-LD)',
    noJsonLdFound: 'لم يتم اكتشاف مخططات هيكلية Schema.org',
    citationReadinessTitle: 'معامل قابلية الاقتباس الفوري',
    markdownClarityTitle: 'وضوح البنية الدلالية للنصوص',
    paletteSectionTitle: 'الألوان المستخدمة في الموقع وهويتك البصرية',
    paletteSectionSub: 'استخراج حقيقي لكافة درجات الألوان (HEX)، ونسب الإضاءة والتكرار في كود صفحتك مع توكنز قاعدة 90/10.',
    paletteCopyAllCss: 'نسخ متغيرات الألوان (:root CSS)',
    paletteCssCopied: 'تم نسخ متغيرات الـ CSS بنجاح!',
    paletteEmpty: 'لم يتم العثور على ألوان صريحة أو أنماط HEX في الصفحة المستهدفة.',
    paletteDetectedCount: 'ألوان مكتشفة في الكود',
    paletteAccentLabel: 'لون التمييز (Accent)',
    paletteCanvasLabel: 'الخلفية (Canvas)',
    paletteSurfaceLabel: 'البطاقات (Surface)',
    paletteTextLabel: 'النصوص (Text)',
    issuesListTitle: 'سجل الملاحظات والإصلاحات التقنية',
    issuesListSub: 'قائمة بالمشاكل المكتشفة مصنفة حسب الأهمية مع الأثر البرمجي وحلول الأكواد الجاهزة.',
    filterAll: 'جميع المعايير',
    filterCritical: 'حرج',
    filterWarning: 'تحذير',
    filterPassed: 'سليم',
    searchIssuesPlaceholder: 'بحث في المشاكل أو الأكواد المكتشفة (اضغط / للتركيز)...',
    noMatchingIssuesTitle: 'لا توجد نتائج تطابق بحثك',
    noMatchingIssuesSub: 'جرب تعديل مصطلح البحث أو إزالة مرشحات الفئة.',
    resetFiltersBtn: 'إعادة ضبط الفلاتر',
    copyFixSnippet: 'نسخ الكود',
    codeSnippetCopied: 'تم نسخ الكود!',
    copyAllIssuesPrompt: 'نسخ كل المشاكل وأكواد الحلول (حل دفعة واحدة بالذكاء الاصطناعي)',
    allIssuesPromptCopied: 'تم نسخ كافة المشاكل وأكواد الحلول بنجاح!',
    copyAllCodeSnippets: 'نسخ كل الأكواد مجمعة',
    allCodeSnippetsCopied: 'تم نسخ الأكواد المجمعة بنجاح!',
    batchFixBannerTitle: 'حل كافة المشاكل بنقرة واحدة بواسطة الذكاء الاصطناعي',
    batchFixBannerSub: 'بدلاً من نسخ كل كود بمفرده، انسخ ملف الإصلاح الشامل لكافة المشاكل المكتشفة والصقه مباشرة في ChatGPT أو Claude 3.7 أو Cursor ليحلها فوراً.',
    learnMoreLink: 'دليل التوثيق الرسمي',
    problemLabel: 'المشكلة المكتشفة:',
    impactLabel: 'الأثر على الترتيب والذكاء الاصطناعي:',
    solutionLabel: 'طريقة الإصلاح البرمجي:',
    modalTitle: 'برومبت الإصلاح الشامل للذكاء الاصطناعي (100% Score)',
    modalSub: 'انسخ هذا البرومبت بالكامل وضعه مباشرة في ChatGPT أو Claude 3.7 أو محرر Cursor / Antigravity لتطبيق كافة الحلول البرمجية فوراً.',
    copyPromptBtn: 'نسخ البرومبت بالكامل',
    promptCopiedToast: 'تم نسخ برومبت الإصلاح بنجاح! جاهز للصق في الذكاء الاصطناعي.',
    downloadPromptBtn: 'تحميل كملف Markdown',
    targetModelLabel: 'النموذج المستهدف:',
    closeBtn: 'إغلاق (Esc)',
    errorTitle: 'تعذر استكمال عملية التدقيق',
    errorRetryBtn: 'إعادة المحاولة',
    categories: {
      seo: 'السيو ومحركات البحث (SEO)',
      geo: 'محركات الذكاء الاصطناعي (GEO)',
      performance: 'السرعة ومقاييس الأداء (Speed)',
      accessibility: 'إمكانية الوصول والشمول (A11y)',
      security: 'الأمان والبيانات (Security)',
    },
    severities: {
      critical: 'حرج',
      warning: 'تحذير',
      passed: 'سليم',
    },
    emptyHeroTitle: 'التدقيق المعياري للمواقع: SEO وذكاء اصطناعي GEO',
    emptyHeroSub: 'حلل أداء موقعك، وتأكد من جاهزية صفحاتك للظهور في محركات البحث التقليدية وروبوتات الذكاء الاصطناعي (Perplexity, ChatGPT Search, Gemini)، واستخرج برومبت الإصلاح الشامل بنقرة واحدة.',
    featureSeoTitle: 'تحسين السيو الشامل',
    featureSeoDesc: 'فحص العناوين، الأوصاف، الروابط الدائمة، وعلامات OpenGraph.',
    featureGeoTitle: 'فحص محركات الذكاء الاصطناعي',
    featureGeoDesc: 'التحقق من ملفات llms.txt، أذونات GPTBot، ومخططات JSON-LD.',
    featureSpeedTitle: 'مقاييس الويب الأساسية Core Web Vitals',
    featureSpeedDesc: 'قياس أزمنة LCP، CLS، وسرعة الاستجابة بدقة بالغة.',
    featureFixTitle: 'مُولّد الإصلاح الآلي 100%',
    featureFixDesc: 'توليد كود وإرشادات جاهزة للذكاء الاصطناعي لسد كل الثغرات فورياً.',
    uiuxHeroTitle: 'مختبر التدقيق الهندسي لتجربة وواجهة المستخدم (UI/UX Lab)',
    uiuxHeroSub: 'فحص حقيقي للـ DOM والألوان والخطوط والأزرار والتسلسل البصري. يعطيك توجيهات حاسمة ومباشرة: اعمل هيك وسوي هيك، وزبط اللون هذا، مع أكواد CSS وTailwind جاهزة للتطبيق.',
    uiuxInputPlaceholder: 'أدخل رابط أي موقع لفحص الـ UI/UX وتباين الألوان (مثال: https://example.com)...',
    uiuxAuditButton: 'بدء فحص UI/UX الحقيقي',
    uiuxAuditingButton: 'جاري استخراج الألوان وتدقيق الواجهة...',
    uiuxPaletteTitle: 'لوحة الألوان المستخرجة وانضباط الباليت (90/10 Rule)',
    uiuxPaletteSub: 'استخراج دقيق لكافة درجات HEX ونسب الإضاءة (Luminance) وفحص التشتت اللوني.',
    uiuxPrescriptionsTitle: 'سجل التوجيهات الهندسية (اعمل هيك وسوي هيك)',
    uiuxPrescriptionsSub: 'حلول تصميمية مباشرة وقواعد صارمة لعلاج تباين الألوان ومناطق اللمس والأزرار العائمة.',
    uiuxActionLabel: 'التوجيه المباشر (اعمل هيك):',
    uiuxDiagnosisLabel: 'التشخيص الهندسي الدقيق:',
    uiuxPrincipleLabel: 'القاعدة التصميمية المعتمدة:',
    uiuxCopySnippet: 'نسخ الكود التصحيحي',
    uiuxSnippetCopied: 'تم نسخ الكود!',
    uiuxCopyAllCss: 'نسخ كود CSS المجمّع لكافة الإصلاحات',
    uiuxAllCssCopied: 'تم نسخ كود الـ CSS المجمّع بنجاح!',
    uiuxCopyAllPrompt: 'نسخ كافة توجيهات الـ UI/UX للذكاء الاصطناعي',
    uiuxAllPromptCopied: 'تم نسخ برومبت الـ UI/UX الشامل!',
    uiuxVectorsTitle: 'المحاور الخمسة لجودة الواجهة',
    uiuxColorsCategory: 'الألوان والتباين',
    uiuxTypographyCategory: 'الخطوط والمقروئية',
    uiuxButtonsCategory: 'الأزرار وبيئة اللمس',
    uiuxHierarchyCategory: 'الهيكل والتسلسل البصري',
    uiuxFormsCategory: 'النماذج وحقول الإدخال',
  },
  en: {
    brandTitle: 'CRAWLIX',
    brandTagline: 'Engineering-Grade Search & Generative AI Audit Platform',
    officialBadge: 'Official Certified Release · CRAWLIX PRO',
    engineOnline: 'Node 24 Runtime Online',
    langToggle: 'العربية',
    creatorBadge: 'Architect: Ahmad Jalhoom',
    creatorCredit: 'Crafted and engineered end-to-end by Ahmad Jalhoom (أحمد جلهوم)',
    creatorRole: 'Lead Software Architect & AI Systems Engineer',
    navAudit: 'Auditor',
    navUiUx: 'UI/UX Lab',
    navMethodology: 'Methodology',
    navAbout: 'About Architect',
    navTerms: 'Terms of Service',
    navPrivacy: 'Privacy Policy',
    footerCopyright: '© 2026 Ahmad Jalhoom (أحمد جلهوم) · CRAWLIX Systems. All rights reserved.',
    footerTagline: 'High-precision autonomous audit engine engineered to benchmark web applications for classic search indexing and generative AI citation vectors.',
    systemStatus: 'Audit Core: Online & 100% Guarded',
    exportReport: 'Export Report',
    copiedToast: 'Copied to clipboard successfully',
    exportSuccessToast: 'Audit report downloaded successfully',
    inputPlaceholder: 'Enter target domain or URL (e.g. https://example.com)...',
    auditButton: 'Run Full Audit',
    auditingButton: 'Auditing Platform...',
    quickTestLabel: 'Quick test domains:',
    urlInvalidError: 'Invalid URL: Please input a valid http:// or https:// URL with a valid hostname.',
    urlEmptyError: 'Please provide a valid URL to analyze.',
    overallScoreTitle: 'Overall Platform Optimization Score',
    overallVerdictSub: 'Calculated across 44 precision heuristics spanning SEO, Generative AI, Performance, and a11y.',
    pointsToHundred: 'points to reach 100% full standing',
    masterPromptCtaTitle: '100% Score AI Master Repair Prompt',
    masterPromptCtaSub: 'One-click deterministic repair prompt engineered for Claude, ChatGPT, and Cursor to resolve all findings.',
    openMasterPromptBtn: 'View & Copy Master Prompt',
    geoDeepDiveTitle: 'Generative Engine Optimization (GEO)',
    geoDeepDiveSub: 'Deep inspection into AI search crawler readiness across ChatGPT, Perplexity, Claude, and Gemini.',
    llmsTxtTitle: 'AI Context Standard (/llms.txt)',
    llmsTxtFound: 'Discovered & optimized for AI citations',
    llmsTxtMissing: 'Missing (Recommended for AI engines)',
    aiBotsTitle: 'AI Bot Permissions in robots.txt',
    aiBotsAllowed: 'Permitted to Crawl & Index',
    aiBotsBlocked: 'Blocked by robots.txt',
    jsonLdTitle: 'Structured Schema Entities (JSON-LD)',
    noJsonLdFound: 'No JSON-LD schemas discovered',
    citationReadinessTitle: 'AI Citation Readiness Index',
    markdownClarityTitle: 'Semantic Text Density',
    paletteSectionTitle: 'Extracted Brand Palette & Visual Identity',
    paletteSectionSub: 'Real DOM extraction of HEX codes, relative luminance, and frequency with 90/10 design tokens.',
    paletteCopyAllCss: 'Copy CSS Variables (:root)',
    paletteCssCopied: 'CSS Variables Copied!',
    paletteEmpty: 'No explicit HEX color codes discovered in target DOM styles.',
    paletteDetectedCount: 'Colors detected in DOM',
    paletteAccentLabel: 'Brand Accent',
    paletteCanvasLabel: 'Canvas Background',
    paletteSurfaceLabel: 'Surface Cards',
    paletteTextLabel: 'Primary Text',
    issuesListTitle: 'Diagnostic Defect & Code Fix Ledger',
    issuesListSub: 'Prioritized issue roster with technical impacts, target source files, and copyable production fixes.',
    filterAll: 'All Heuristics',
    filterCritical: 'Critical',
    filterWarning: 'Warning',
    filterPassed: 'Passed',
    searchIssuesPlaceholder: 'Search issues or code solutions (Press / to focus)...',
    noMatchingIssuesTitle: 'No Matching Issues Found',
    noMatchingIssuesSub: 'Try broadening your search term or selecting a different category filter.',
    resetFiltersBtn: 'Reset Filters',
    copyFixSnippet: 'Copy Code',
    codeSnippetCopied: 'Copied!',
    copyAllIssuesPrompt: 'Copy All Issues & Solutions (1-Click AI Fix)',
    allIssuesPromptCopied: 'All issues & fixes copied to clipboard!',
    copyAllCodeSnippets: 'Copy All Code Fixes',
    allCodeSnippetsCopied: 'All code fixes copied!',
    batchFixBannerTitle: '1-Click Complete Issue Resolution with AI',
    batchFixBannerSub: 'Instead of copying each snippet individually, copy this comprehensive multi-file payload into Claude, ChatGPT, or Cursor to fix everything in one pass.',
    learnMoreLink: 'Official Documentation',
    problemLabel: 'Detected Defect:',
    impactLabel: 'Impact on Search & AI Standing:',
    solutionLabel: 'Recommended Production Fix:',
    modalTitle: '100% Score Master AI Repair Prompt',
    modalSub: 'Copy and paste this deterministic instruction payload directly into Claude 3.7, ChatGPT-4o, or Cursor / Antigravity to fix every detected issue in one pass.',
    copyPromptBtn: 'Copy Complete Master Prompt',
    promptCopiedToast: 'Master prompt copied to clipboard! Ready to paste into your AI agent.',
    downloadPromptBtn: 'Download Markdown',
    targetModelLabel: 'Target Model:',
    closeBtn: 'Close (Esc)',
    errorTitle: 'Audit Execution Failure',
    errorRetryBtn: 'Retry Analysis',
    categories: {
      seo: 'Traditional SEO',
      geo: 'Generative Engine (GEO)',
      performance: 'Performance & Speed',
      accessibility: 'Accessibility (A11y)',
      security: 'Security & Integrity',
    },
    severities: {
      critical: 'Critical',
      warning: 'Warning',
      passed: 'Passed',
    },
    emptyHeroTitle: 'Enterprise SEO & Generative AI Audit Platform',
    emptyHeroSub: 'Benchmark your web applications against modern search engines and generative AI agents (ChatGPT, Perplexity, Claude, Gemini) with 1-click deterministic repair prompt synthesis.',
    featureSeoTitle: 'Comprehensive Technical SEO',
    featureSeoDesc: 'Deep metadata, canonical integrity, heading trees, and OpenGraph telemetry.',
    featureGeoTitle: 'Generative Engine Optimization',
    featureGeoDesc: 'Verify llms.txt context, multi-agent bot permissions, and Schema.org entities.',
    featureSpeedTitle: 'Core Web Performance',
    featureSpeedDesc: 'Precision TTFB measurement, document weight, and DOM tree complexity.',
    featureFixTitle: '1-Click Master AI Repair',
    featureFixDesc: 'Deterministic prompt generator to guide Claude or Cursor to a 100/100 score.',
    uiuxHeroTitle: 'Autonomous UI/UX Architecture Lab & Design Auditor',
    uiuxHeroSub: 'Real DOM inspection of color palettes, typography, touch ergonomics, and visual hierarchy. Delivers deterministic prescriptive commands: fix this color, tune this contrast, expand button padding, with copyable CSS/Tailwind snippets.',
    uiuxInputPlaceholder: 'Enter any target URL for real UI/UX audit (e.g. https://example.com)...',
    uiuxAuditButton: 'Run Real UI/UX Audit',
    uiuxAuditingButton: 'Analyzing DOM & Extracting Palettes...',
    uiuxPaletteTitle: 'Extracted Color Palette & 90/10 Discipline',
    uiuxPaletteSub: 'Precision extraction of all HEX tones, relative luminance, and color dispersion.',
    uiuxPrescriptionsTitle: 'Actionable Design Prescriptions Ledger',
    uiuxPrescriptionsSub: 'Direct engineering directives and strict guidelines to fix contrast, touch boundaries, and CTAs.',
    uiuxActionLabel: 'Action Directive (Fix This):',
    uiuxDiagnosisLabel: 'Diagnostic Findings:',
    uiuxPrincipleLabel: 'Governing Design Principle:',
    uiuxCopySnippet: 'Copy CSS/Fix',
    uiuxSnippetCopied: 'Snippet Copied!',
    uiuxCopyAllCss: 'Copy Unified CSS Fixes',
    uiuxAllCssCopied: 'Unified CSS fixes copied!',
    uiuxCopyAllPrompt: 'Copy All UI/UX Directives for AI',
    uiuxAllPromptCopied: 'Master UI/UX prompt copied!',
    uiuxVectorsTitle: 'Five-Vector Interface Benchmark',
    uiuxColorsCategory: 'Colors & Contrast',
    uiuxTypographyCategory: 'Typography & Legibility',
    uiuxButtonsCategory: 'Buttons & Touch Ergonomics',
    uiuxHierarchyCategory: 'Hierarchy & Structure',
    uiuxFormsCategory: 'Forms & Inputs',
  },
};
