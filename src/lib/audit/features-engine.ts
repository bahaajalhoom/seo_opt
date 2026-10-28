// ============================================================================
// 1. IMPORTS & DEPENDENCIES
// ============================================================================
import * as cheerio from 'cheerio';
import type { FetchedAuditContext } from './fetcher';
import type {
  FeaturesAuditResult,
  FeaturesAuditMetrics,
  DetectedCapability,
  ProposedFeature,
  SiteArchetype,
  FeaturePillar,
} from '@/types/features';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS
// ============================================================================
const ARCHETYPE_MAP: Record<
  SiteArchetype,
  { labelAr: string; labelEn: string; primaryFocusAr: string }
> = {
  saas: {
    labelAr: 'برمجيات كخدمة (SaaS / Web App)',
    labelEn: 'Software as a Service (SaaS)',
    primaryFocusAr: 'مضاعفة معدلات تحويل التجارب المجانية والاحتفاظ بالعملاء (PLG Loops)',
  },
  ecommerce: {
    labelAr: 'تجارة إلكترونية ومنتجات رقمية (E-Commerce)',
    labelEn: 'E-Commerce & Digital Commerce',
    primaryFocusAr: 'رفع متوسط قيمة السلة (AOV) وتقليل التخلي عن إتمام الطلب (Checkout Friction)',
  },
  devtools: {
    labelAr: 'أدوات مطورين ومنصات تقنية (DevTools & API)',
    labelEn: 'Developer Tools & Cloud Infrastructure',
    primaryFocusAr: 'تسريع وقت الوصول للقيمة الأولية (Time to Hello World) وتكاملات الـ CLI',
  },
  agency_b2b: {
    labelAr: 'خدمات أعمال ووكالة احترافية (B2B Services & Agency)',
    labelEn: 'B2B Services & Enterprise Agency',
    primaryFocusAr: 'اقتناص وتأهيل العملاء المحتملين تلقائياً (Lead Qualification & Booking)',
  },
  edtech: {
    labelAr: 'أكاديمية وتعليم تفاعلي (EdTech & Courses)',
    labelEn: 'Education & Interactive E-Learning',
    primaryFocusAr: 'زيادة معدلات إكمال الدروس والتفاعل المستمر (Gamification & Retention)',
  },
  publishing: {
    labelAr: 'منصة محتوى ونشر رقمي (Content & Media)',
    labelEn: 'Digital Publishing & Media',
    primaryFocusAr: 'توليد السيو البرمجي والاشتراكات البريدية وتلخيص المقالات بالذكاء الاصطناعي',
  },
  fintech: {
    labelAr: 'تطبيقات مالية واستثمارية (Fintech & Finance)',
    labelEn: 'Financial Technology & Wealth',
    primaryFocusAr: 'الأمان الصارم وسجل النشاطات والحاسبات المالية التفاعلية',
  },
  general_web: {
    labelAr: 'موقع مؤسسي / بوابة عامة (Corporate Platform)',
    labelEn: 'Corporate Web Presence',
    primaryFocusAr: 'تعزيز الموثوقية البصرية ومحركات البحث الدلالية وسهولة التواصل',
  },
};

// ============================================================================
// 3. HELPER FUNCTIONS: DEEP CRAWLING & FINGERPRINTING
// ============================================================================

/**
 * Analyzes DOM, internal links, script bundles, and metadata to classify archetype.
 */
function detectSiteArchetype(
  html: string,
  $: cheerio.CheerioAPI,
  internalLinks: string[]
): {
  archetype: SiteArchetype;
  keyPages: FeaturesAuditMetrics['discoveredKeyPages'];
  technologies: string[];
} {
  const lowerHtml = html.toLowerCase();
  const allLinksStr = internalLinks.join(' ').toLowerCase();

  // 1. Key Pages Discovery
  const hasPricing =
    /(\/pricing|\/plans|\/prices|\/billing|أسعار|خطط|باقات)/i.test(allLinksStr) ||
    lowerHtml.includes('pricing-table') ||
    lowerHtml.includes('data-plan');

  const hasAuthOrPortal =
    /(\/login|\/signin|\/signup|\/register|\/auth|\/dashboard|\/portal|\/app|تسجيل الدخول|إنشاء حساب)/i.test(
      allLinksStr
    ) ||
    lowerHtml.includes('auth0') ||
    lowerHtml.includes('clerk');

  const hasBlogOrArticles =
    /(\/blog|\/articles|\/posts|\/news|\/insights|مدونة|مقالات)/i.test(
      allLinksStr
    );

  const hasDocsOrHelp =
    /(\/docs|\/documentation|\/api|\/guides|\/kb|\/help|توثيق|مساعدة)/i.test(
      allLinksStr
    );

  const hasContactOrBooking =
    /(\/contact|\/support|\/book|\/demo|\/schedule|اتصل بنا|تواصل معنا|احجز)/i.test(
      allLinksStr
    ) || $('form').length > 0;

  const hasSearchEngine =
    $('input[type="search"]').length > 0 ||
    $('input[name*="search"]').length > 0 ||
    $('input[name*="query"]').length > 0 ||
    /(\/search|بحث)/i.test(allLinksStr);

  const hasCheckoutOrCart =
    /(\/cart|\/checkout|\/basket|\/order|سلة|سلة الشراء|الدفع)/i.test(
      allLinksStr
    ) ||
    lowerHtml.includes('stripe') ||
    lowerHtml.includes('shopify') ||
    lowerHtml.includes('add-to-cart');

  const keyPages = {
    hasPricing,
    hasAuthOrPortal,
    hasBlogOrArticles,
    hasDocsOrHelp,
    hasContactOrBooking,
    hasSearchEngine,
    hasCheckoutOrCart,
  };

  // 2. Tech Stack Fingerprinting
  const technologies: string[] = [];
  if (lowerHtml.includes('__next') || lowerHtml.includes('/_next/')) technologies.push('Next.js');
  if (lowerHtml.includes('react')) technologies.push('React');
  if (lowerHtml.includes('tailwind')) technologies.push('Tailwind CSS');
  if (lowerHtml.includes('stripe')) technologies.push('Stripe Payments');
  if (lowerHtml.includes('supabase')) technologies.push('Supabase Backend');
  if (lowerHtml.includes('firebase')) technologies.push('Firebase Cloud');
  if (lowerHtml.includes('wp-content') || lowerHtml.includes('wordpress')) technologies.push('WordPress');
  if (lowerHtml.includes('shopify')) technologies.push('Shopify Platform');
  if (lowerHtml.includes('gtag') || lowerHtml.includes('google-analytics')) technologies.push('Google Analytics');
  if (lowerHtml.includes('posthog')) technologies.push('PostHog Telemetry');
  if (lowerHtml.includes('crisp') || lowerHtml.includes('intercom')) technologies.push('Live Chat Widget');
  if (technologies.length === 0) technologies.push('Modern Web Architecture (SSR/SSG)');

  // 3. Archetype Decision Matrix
  let archetype: SiteArchetype = 'general_web';

  if (hasCheckoutOrCart) {
    archetype = 'ecommerce';
  } else if (hasPricing && (hasAuthOrPortal || hasDocsOrHelp)) {
    archetype = 'saas';
  } else if (hasDocsOrHelp && (lowerHtml.includes('api') || lowerHtml.includes('sdk') || lowerHtml.includes('cli'))) {
    archetype = 'devtools';
  } else if (lowerHtml.includes('course') || lowerHtml.includes('دورات') || lowerHtml.includes('منهج') || lowerHtml.includes('دروس')) {
    archetype = 'edtech';
  } else if (lowerHtml.includes('finance') || lowerHtml.includes('استثمار') || lowerHtml.includes('تداول') || lowerHtml.includes('محفظة')) {
    archetype = 'fintech';
  } else if (hasBlogOrArticles && !hasPricing && !hasAuthOrPortal) {
    archetype = 'publishing';
  } else if (hasContactOrBooking && !hasCheckoutOrCart && !hasAuthOrPortal) {
    archetype = 'agency_b2b';
  }

  return { archetype, keyPages, technologies };
}

/**
 * Builds comprehensive inventory of detected features vs missing gaps.
 */
function buildCapabilitiesInventory(
  keyPages: FeaturesAuditMetrics['discoveredKeyPages'],
  technologies: string[],
  html: string,
  $: cheerio.CheerioAPI
): DetectedCapability[] {
  const lowerHtml = html.toLowerCase();
  const inventory: DetectedCapability[] = [];

  // 1. User Authentication & Portal
  inventory.push({
    id: 'cap-auth',
    nameAr: 'بوابة الدخول وحسابات المستخدمين (User Auth & Portal)',
    nameEn: 'User Authentication & Member Portal',
    status: keyPages.hasAuthOrPortal ? 'present' : 'missing',
    evidence: keyPages.hasAuthOrPortal
      ? 'تم رصد روابط تسجيل دخول وبوابة أعضاء نشطة'
      : 'لا يوجد نظام تسجيل مستخدمين أو لوحة تحكم ذاتية',
  });

  // 2. Interactive Pricing / ROI Calculator
  inventory.push({
    id: 'cap-pricing',
    nameAr: 'هندسة الأسعار التفاعلية (Interactive Pricing / Calculator)',
    nameEn: 'Interactive Pricing & Tier Matrix',
    status: keyPages.hasPricing ? 'present' : 'missing',
    evidence: keyPages.hasPricing
      ? 'تم اكتشاف جدول أسعار أو باقات معلنة'
      : 'يفتقر الموقع لجدول أسعار تفاعلي أو حاسبة عائد الاستثمار',
  });

  // 3. Deep Instant Search Engine (Command ⌘K)
  inventory.push({
    id: 'cap-search',
    nameAr: 'محرك البحث الداخلي ولوحة الأوامر (Command Palette ⌘K)',
    nameEn: 'Instant Search & Global Command Palette',
    status: keyPages.hasSearchEngine ? 'present' : 'missing',
    evidence: keyPages.hasSearchEngine
      ? 'يحتوي على حقل بحث تقليدي في الواجهة'
      : 'لا يوجد محرك بحث فوري أو لوحة أوامر سريعة ⌘K',
  });

  // 4. RAG / Generative AI Assistant
  const hasAiAssistant =
    lowerHtml.includes('chat-widget') ||
    lowerHtml.includes('ai-assistant') ||
    lowerHtml.includes('copilot') ||
    lowerHtml.includes('llms.txt');

  inventory.push({
    id: 'cap-ai-rag',
    nameAr: 'مساعد الذكاء الاصطناعي التوليدي (Semantic AI Copilot)',
    nameEn: 'Semantic Vector AI Copilot (RAG)',
    status: hasAiAssistant ? 'partial' : 'missing',
    evidence: hasAiAssistant
      ? 'يحتوي على تجهيزات أولية للذكاء الاصطناعي (مثل ملفات llms)'
      : 'لا يوجد مساعد دردشة ذكي مدرب على بيانات ومحتوى الموقع',
  });

  // 5. Lead Capture & Interactive Stepper
  inventory.push({
    id: 'cap-lead-flow',
    nameAr: 'مسار تأهيل وحجز العملاء (Lead Funnel & Booking Stepper)',
    nameEn: 'Multi-Step Lead Qualifier & Booking Flow',
    status: keyPages.hasContactOrBooking ? 'present' : 'missing',
    evidence: keyPages.hasContactOrBooking
      ? 'يحتوي على نماذج مراسلة أو صفحات حجز'
      : 'يفتقر لمسار تفاعلي متعدد الخطوات لحجز المواعيد وتأهيل العملاء',
  });

  // 6. Dynamic Social Proof & Live Telemetry
  const hasSocialProof =
    lowerHtml.includes('testimonial') ||
    lowerHtml.includes('review') ||
    lowerHtml.includes('آراء') ||
    lowerHtml.includes('عملاؤنا') ||
    lowerHtml.includes('شركاء');

  inventory.push({
    id: 'cap-social-proof',
    nameAr: 'الإثبات الاجتماعي التفاعلي (Social Proof & Trust Wall)',
    nameEn: 'Interactive Social Proof & Verified Reviews',
    status: hasSocialProof ? 'present' : 'missing',
    evidence: hasSocialProof
      ? 'تم رصد أقسام استعراض آراء العملاء أو شعارات الشركاء'
      : 'لا توجد عناصر حية تبرز آراء المستخدمين والنشاط اللحظي',
  });

  // 7. Developer & Enterprise API Webhooks
  inventory.push({
    id: 'cap-api-webhooks',
    nameAr: 'واجهات برمجة التطبيقات للمطورين (Public API & Webhooks)',
    nameEn: 'Developer API Keys & Outbound Webhooks',
    status: keyPages.hasDocsOrHelp ? 'partial' : 'missing',
    evidence: keyPages.hasDocsOrHelp
      ? 'توجد توثيقات تقنية أولية'
      : 'غياب كامل لتوثيق الـ API والمفاتيح والويبهوكس لربط الأنظمة الخارجية',
  });

  // 8. Self-Service Data Export Engine
  inventory.push({
    id: 'cap-export',
    nameAr: 'تصدير التقارير والبيانات (Automated PDF/CSV Data Export)',
    nameEn: 'Self-Service Export Engine (PDF / CSV / JSON)',
    status: 'missing',
    evidence: 'لا توجد ميزة تتيح للزائر أو العميل تصدير بياناته كملف PDF رسمي أو CSV',
  });

  return inventory;
}

/**
 * Generates tailored, studio-grade proposed features with complete architecture and AI prompt.
 */
function generateTailoredFeatures(
  archetype: SiteArchetype,
  domain: string,
  cleanUrl: string,
  keyPages: FeaturesAuditMetrics['discoveredKeyPages'],
  technologies: string[]
): ProposedFeature[] {
  const isSaas = archetype === 'saas' || archetype === 'devtools';
  const isEcommerce = archetype === 'ecommerce';
  const isAgency = archetype === 'agency_b2b';

  const features: ProposedFeature[] = [
    // 1. Feature: Global Command Palette (⌘K)
    {
      id: 'feat-command-palette',
      titleAr: 'لوحة الأوامر السريعة والبحث الفوري (Command Palette ⌘K)',
      titleEn: 'Global Command Palette & Instant Search (⌘K)',
      taglineAr: 'تنقل لحظي فائق السرعة يعزز إنتاجية المستخدم بنسبة 40%',
      taglineEn: 'Sub-10ms keyboard-driven navigation and search overlay',
      pillar: 'ux',
      priority: 'high',
      difficulty: 'quick-win',
      impactMetricAr: '+38% سرعة التنقل والتفاعل',
      impactMetricEn: '+38% Faster Task Completion',
      rationaleAr: `الموقع يمتلك هيكلية صفحات متعددة، وتوفير نافذة أوامر منبثقة بنقرة واحدة (Cmd+K / Ctrl+K) يختصر وقت الوصول للخدمات والصفحات الرئيسية ويمنح تجربة هندسية تضاهي Linear و Vercel.`,
      rationaleEn: `Instant keyboard-driven spotlight search dramatically reduces navigation friction and elevates user delight.`,
      architecturePlanAr: `بناء نافذة Modal عائمة متجاوبة تستمع لاختصار لوحة المفاتيح (Cmd+K). يتم فرز الروابط والصفحات والإجراءات الرئيسية بسرعة فائقة مع تمييز الحروف المكتوبة وحفظ آخر عمليات البحث محلياً (localStorage).`,
      architecturePlanEn: `Implement an accessible cmdk modal listening to global keyboard events with fuzzy matching and recent history caching.`,
      techStack: ['cmdk / kbar', 'Tailwind CSS', 'Lucide React', 'Framer Motion'],
      keySteps: [
        'تثبيت مكتبة cmdk أو إنشاء مكون Modal خفيف ومفحوص إمكانية الوصول (A11y ARIA-modal).',
        'ربط مستمع المفاتيح العالمي (keydown: Meta+K / Ctrl+K).',
        'تغذية القائمة بكافة صفحات الموقع المكتشفة والإجراءات السريعة.',
        'إضافة مؤشرات لوحة المفاتيح والأسهم للتنقل والـ Enter للاختيار.',
      ],
      aiImplementationPrompt: `أنت مهندس واجهات وتجربة مستخدم رئيسي.
المهمة: قم ببناء لوحة أوامر سريعة (Command Palette ⌘K) احترافية لموقع (${domain}) باستخدام React و Tailwind CSS.
المعايير الهندسية:
1. استمع لاختصارات (Meta+K / Ctrl+K) لفتح النافذة واختصار (Escape) للإغلاق.
2. تدرج ألوان أوبسيديان متزن (Canvas #08090C, Surface #11141A, Accent #10B981) بدون أي تدرجات فاقعة.
3. دعم كامل للأسهم (ArrowUp / ArrowDown) وزر (Enter) للتنقل السلس.
4. تقسيم العناصر لأقسام: "صفحات رئيسية"، "إجراءات سريعة"، "مساعدة ودعم".
5. كود نظيف مكتوب بالكامل في ملف واحد جاهز للنسخ.`,
    },

    // 2. Feature: AI Knowledge Copilot (RAG)
    {
      id: 'feat-ai-copilot',
      titleAr: 'المساعد الذكي التفاعلي المدرب على الموقع (Site AI Copilot)',
      titleEn: 'Context-Aware RAG Knowledge Assistant',
      taglineAr: 'يجيب على استفسارات الزوار ويقودهم لإتمام الطلب أو الشراء آلياً 24/7',
      taglineEn: 'Trained on your sitemap, FAQs and documentation to convert visitors into customers',
      pillar: 'ai',
      priority: 'critical',
      difficulty: 'medium',
      impactMetricAr: '+45% معدل الرد وتحويل الزوار',
      impactMetricEn: '+45% Lead Conversion Rate',
      rationaleAr: `يستقبل الزوار أسئلة متكررة حول الخدمات والأسعار، وتوفير ويدجت ذكي مدرب على محتوى الموقع وملفات llms.txt يقلل معدل الارتداد ويحول الزائر المتردد إلى عميل مسجل.`,
      rationaleEn: `Autonomous domain-trained copilot answers inquiries instantly, dramatically shortening the sales cycle.`,
      architecturePlanAr: `إنشاء ويدجت محادثة عائم في الزاوية، يتصل بـ Server Action أو API Route مصغر يعتمد Streaming Text مع تزويده بملخص بيانات الموقع وسياق الخدمات المكتشفة.`,
      architecturePlanEn: `Deploy a floating chat drawer powered by Next.js streaming API and pre-indexed site embeddings.`,
      techStack: ['AI SDK (@ai-sdk/react)', 'Next.js Server Actions', 'Tailwind CSS', 'Lucide React'],
      keySteps: [
        'تصميم درج محادثة قابل للطي أسفل يمين الشاشة بألوان هادئة وأيقونة تفاعلية.',
        'تضمين اقتراحات سريعة (Prompt Pills) مثل: "ما هي الأسعار؟"، "كيف أبدأ؟".',
        'تفعيل وضع الكتابة المتدفقة (Streaming Text Effect) للردود اللحظية.',
        'إضافة زر نسخ الإجابة وزر توجيه مباشر لصفحة التواصل أو التسجيل.',
      ],
      aiImplementationPrompt: `أنت خبير ذكاء اصطناعي ومهندس Full-Stack.
المهمة: صمم وبرمج مكون المساعد الذكي (AI Copilot Widget) لموقع (${domain}) بالاعتماد على Next.js App Router و Tailwind CSS.
المواصفات:
- زر عائم سفلي دائري مع إشعار نبضي خفيف (Pulse).
- نافذة محادثة منبثقة بتصميم Obsidian أنيق مع شريط عنوان به اسم المساعد وحالة الاتصال (Online).
- شريط إدخال نصي مع زر إرسال وأزرار مقترحات سريعة جاهزة للنقر.
- محاكاة استجابة متدفقة وتنسيق Markdown للنصوص الناتجة.
- التزام صارم بـ WCAG 2.1 AA وبدون عناصر عشوائية.`,
    },

    // 3. Feature: Interactive ROI / Pricing Simulator
    {
      id: 'feat-pricing-calculator',
      titleAr: isEcommerce
        ? 'حاسبة الخصم والحزمة الذكية (Bundle & Savings Calculator)'
        : 'حاسبة العائد على الاستثمار والأسعار التفاعلية (Interactive ROI Calculator)',
      titleEn: isEcommerce ? 'Dynamic Bundle Savings Simulator' : 'Interactive ROI & Pricing Simulator',
      taglineAr: 'تسمح للعميل بتحديد احتياجاته ورؤية القيمة الموفرة لحظياً قبل الدفع',
      taglineEn: 'Instant visual value projection with real-time sliders and direct checkout CTA',
      pillar: 'growth',
      priority: 'critical',
      difficulty: 'quick-win',
      impactMetricAr: '+32% رغبة في الشراء والاشتراك',
      impactMetricEn: '+32% Plan Upgrade Rate',
      rationaleAr: `جداول الأسعار الثابتة تسبب حيرة للزائر. حاسبة الأسعار التفاعلية تمنحه السيطرة والشفافية عبر سحب شريط التمرير ومشاهدة التكلفة والوفورات المباشرة.`,
      rationaleEn: `Replacing rigid static pricing tables with interactive sliders increases customer agency and checkout velocity.`,
      architecturePlanAr: `مكون تفاعلي يحتوي على Range Sliders مع مؤشرات عددية Tabular Nums وزر ترقية أو طلب مباشر يحسب الخصومات السنوية آلياً.`,
      architecturePlanEn: `Stateful slider component recalculating tier pricing, annual discounts, and projected ROI in real-time.`,
      techStack: ['React 19 Hooks', 'Tailwind CSS', 'Tabular Nums Styling', 'Canvas-Confetti'],
      keySteps: [
        'بناء أشرطة تمرير تفاعلية (حجم الفريق / كمية الطلب / الاستخدام الشهري).',
        'مفتاح تبديل شهري / سنوي مع شارة خصم واضحة (وفر 20%).',
        'تحديث الرقم الإجمالي لحظياً بخط عريض وأرقام متناسقة بدون Layout Shift.',
        'زر CTA تفاعلي يوجه مباشرة لصفحة الدفع أو حجز العرض مع تمرير القيم في الـ URL.',
      ],
      aiImplementationPrompt: `أنت مهندس نمو وتصميم واجهات (Growth Engineer).
المهمة: ابنِ مكون حاسبة أسعار وتوفير تفاعلية (Interactive Pricing Calculator) لموقع (${domain}).
المتطلبات:
1. شريط تمرير (Slider) لتحديد حجم الاستخدام أو الوحدات مع تحديث السعر لحظياً.
2. زر تبديل (Monthly vs Annual) مع حساب وتظليل نسبة التوفير.
3. بطاقة ملخص تبرز "العائد المتوقع شهرياً" و "التكلفة الفعلية".
4. زر CTA رئيسي بلون تمييز زمردي (#10B981) بنص حاسم "ابدأ الآن بالباقة المخصصة".
5. كود React كامل وخالٍ من الأخطاء.`,
    },

    // 4. Feature: Multi-Step Lead Qualification Stepper
    {
      id: 'feat-lead-funnel',
      titleAr: 'مسار تأهيل وحجز العملاء التفاعلي (Interactive Lead Stepper)',
      titleEn: 'Multi-Step Progressive Lead Qualification Flow',
      taglineAr: 'يستبدل نموذج "اتصل بنا" التقليدي بمسار ذكي من 3 خطوات يضاعف الردود',
      taglineEn: 'Replaces boring contact forms with high-converting micro-commitments',
      pillar: 'growth',
      priority: 'high',
      difficulty: 'medium',
      impactMetricAr: '2.4x مضاعفة طلبات التواصل المؤهلة',
      impactMetricEn: '2.4x Qualified Inquiries',
      rationaleAr: `نماذج التواصل الطويلة تؤدي لهروب 70% من الزوار. تحويل التواصل إلى أسئلة سريعة باختيارات متعددة (Micro-commitments) يرفع الإكمال بشكل هائل.`,
      rationaleEn: `Progressive disclosure through bite-sized steps significantly lowers cognitive friction compared to long monolithic forms.`,
      architecturePlanAr: `نموذج متعدد الخطوات (3 خطوات) مع شريط تقدم تفاعلي، يجمع المتطلبات أولاً، ثم الميزانية المقدرة، وفي الخطوة الأخيرة الاسم والبريد الإلكتروني.`,
      architecturePlanEn: `Step-based state machine with animated transitions, form validation with Zod, and progress bar indicator.`,
      techStack: ['React Hook Form', 'Zod Validation', 'Tailwind CSS', 'Framer Motion'],
      keySteps: [
        'الخطوة 1: اختيار الخدمة أو الهدف المطلوب عبر بطاقات نقر تفاعلية.',
        'الخطوة 2: اختيار النطاق الزمني أو الميزانية المتوقعة.',
        'الخطوة 3: إدخال البريد ورقم الهاتف مع زر تأكيد فوري ورسالة نجاح.',
        'إرسال إشعار فوري لفريق العمل عبر Webhook أو البريد الإلكتروني.',
      ],
      aiImplementationPrompt: `أنت مهندس تحويل وتجربة مستخدم (CRO Specialist).
المهمة: اكتب كود مسار تأهيل وحجز عملاء تفاعلي من 3 خطوات (3-Step Lead Stepper) لموقع (${domain}).
المعايير:
- استخدام بطاقات قابلة للنقر لاختيار نوع الخدمة المطلوبة في الخطوة الأولى.
- شريط تقدم خطي يوضح النسبة المئوية للإنجاز (Progress Bar).
- خطوة نهائية لبيانات التواصل مع تحقق فوري من صحة البريد الإلكتروني.
- شاشة شكر وتأكيد بعد الإرسال تتضمن رقم مرجعي للطلب.
- التزام بتصميم صناعي داكن أنيق ومتجاوب مع الموبايل.`,
    },

    // 5. Feature: Dynamic OpenGraph & Social Cards Generator
    {
      id: 'feat-dynamic-og',
      titleAr: 'مولد بطاقات التواصل الاجتماعي الديناميكية (@vercel/og)',
      titleEn: 'Dynamic Edge-Rendered OpenGraph Engine',
      taglineAr: 'توليد صور معاينة تلقائية بدقة عالية لكل مقال وصفحة لمضاعفة النقرات',
      taglineEn: 'Auto-generates branded 1200x630 preview banners for every URL shared on Twitter & LinkedIn',
      pillar: 'seo_content',
      priority: 'medium',
      difficulty: 'quick-win',
      impactMetricAr: '+60% نقرات على الروابط في منصات التواصل',
      impactMetricEn: '+60% Social CTR',
      rationaleAr: `مشاركة الروابط بدون صور معاينة جذابة تفقدهم 60% من النقرات. محرك توليد بطاقات OG على الحافة ينشئ صورة مخصصة لكل صفحة تحمل الشعار والعنوان تلقائياً.`,
      rationaleEn: `Custom programmatic social preview banners dramatically increase click-through rates across Twitter, LinkedIn, and WhatsApp.`,
      architecturePlanAr: `مسار API Route باستخدام ImageResponse من next/og ينشئ صورة بدقة 1200x630 ديناميكياً بناءً على معلمات الرابط (العنوان، التصنيف، الشعار).`,
      architecturePlanEn: `Next.js ImageResponse endpoint generating high-fidelity branded SVG/PNG graphics on edge runtime in sub-50ms.`,
      techStack: ['@vercel/og / next/og', 'Edge Runtime', 'Tailwind CSS in SVG', 'Canvas'],
      keySteps: [
        'إنشاء ملف src/app/api/og/route.tsx باستخدام ImageResponse.',
        'قراءة العنوان والشعار من استعلام الرابط (?title=...&category=...).',
        'تنسيق خلفية أوبسيديان فخمة مع شعار الموقع وإطار أنيق.',
        'ربط المسار في layout.tsx و metadata لكل الصفحات.',
      ],
      aiImplementationPrompt: `أنت خبير هندسة السيو والـ Edge Computing في Next.js.
المهمة: اكتب كود مسار (API Route) متكامل لتوليد بطاقات OpenGraph ديناميكية لموقع (${domain}) باستخدام 'next/og' و ImageResponse.
المواصفات:
- المقاس: 1200x630 بكسل على Edge Runtime.
- خلفية داكنة فخمة (#08090C) مع خطوط شبكية رفيعة (Grid lines).
- قراءة بارامتر 'title' لعرض عنوان المقال بخط عريض واضح.
- وضع اسم الموقع وشعاره بالأسفل مع شارة "CRAWLIX VERIFIED".
- كود إنتاجي نظيف جاهز للوضع في src/app/api/og/route.tsx مباشرة.`,
    },

    // 6. Feature: Instant PDF & Data Report Exporter
    {
      id: 'feat-report-export',
      titleAr: 'محرك تصدير التقارير الرسمية (Branded PDF / CSV Export)',
      titleEn: 'Self-Service Branded PDF & Data Export Engine',
      taglineAr: 'تحميل ملخصات ووثائق رسمية مخصصة للعميل تحمل هويتك بنقرة واحدة',
      taglineEn: 'Instant client-side PDF document generation formatted for C-level presentation',
      pillar: 'enterprise',
      priority: 'high',
      difficulty: 'medium',
      impactMetricAr: '+50% موثوقية مؤسسية واحتفاظ بالعملاء',
      impactMetricEn: '+50% Enterprise Trust & Retention',
      rationaleAr: `العملاء والشركات يحتاجون توثيقاً رسمياً لتقديمه للإدارة. زر التصدير الذاتي يحول النتائج أو البيانات إلى تقرير PDF منسق ومعتمد بضغطة زر.`,
      rationaleEn: `Providing download-ready executive summaries establishes high corporate authority and viral document sharing.`,
      architecturePlanAr: `توليد وثيقة PDF نظيفة في المتصفح أو على السيرفر، مع تنسيق صفحات A4، وشعار رسمي، وجداول مرتبة، وجاهزية تامة للطباعة.`,
      architecturePlanEn: `Client-side or server-rendered document builder generating styled A4 reports with corporate watermarks and tables.`,
      techStack: ['html2canvas / jspdf / react-pdf', 'CSS Print Styles', 'Tailwind CSS', 'Lucide React'],
      keySteps: [
        'تجهيز قالب التقرير مع ترويسة وتذييل وأرقام الصفحات.',
        'تفعيل زر "تحميل التقرير الرسمي PDF" مع مؤشر تحميل فوري.',
        'تضمين ختم الاعتماد وتاريخ التقرير ورابط الموقع الأصلي.',
        'توفير نسخة CSV للبيانات الرقمية والجداول.',
      ],
      aiImplementationPrompt: `أنت مهندس نظم برمجية وتطوير واجهات (Software Systems Architect).
المهمة: صمم وبرمج ميزة تصدير التقارير الرسمية (Branded PDF Exporter) لموقع (${domain}) باستخدام React و Tailwind CSS.
المواصفات:
- زر تحميل أنيق مع أيقونة تنزيل ومؤشر حالة (Generating...).
- إنشاء مستند منظم يتضمن ترويسة الشركة، التاريخ، ملخص تنفيذي، وجدول بيانات متناسق.
- دعم كامل للعربية والإنجليزية والطباعة المتناسقة (@media print).
- تصميم هادئ ورفيع يترك انطباعاً رسمياً بالغ الاحترافية.`,
    },

    // 7. Feature: Social Proof & Live Activity Telemetry
    {
      id: 'feat-live-telemetry',
      titleAr: 'شريط النشاط الحي والإثبات الاجتماعي (Live Activity & Social Proof)',
      titleEn: 'Real-Time Social Proof & Activity Stream',
      taglineAr: 'إبراز تفاعل الزوار والتقييمات الأخيرة بطريقة راقية غير مزعجة',
      taglineEn: 'Subtle toast notifications showcasing recent signups, ratings and platform milestones',
      pillar: 'growth',
      priority: 'medium',
      difficulty: 'quick-win',
      impactMetricAr: '+28% تحفيز الزوار الجدد وتخفيف التردد',
      impactMetricEn: '+28% Signup Velocity',
      rationaleAr: `رؤية زوار آخرين يستخدمون المنصة أو يقيمون الخدمات يزيل حاجز التردد ويخلق زخماً اجتماعياً أصيلاً يشجع الزائر الجديد على البدء فوراً.`,
      rationaleEn: `Real-time activity indicators validate popularity and provide authentic psychological reassurance to first-time visitors.`,
      architecturePlanAr: `مكون إشعارات منبثقة غير متطفل يظهر أسفل الشاشة، يعرض إحصائيات حقيقية أو إنجازات المنصة مع إمكانية الإغلاق السريع والتنقل التلقائي.`,
      architecturePlanEn: `Polite non-intrusive activity stream with auto-dismiss timers, paused on hover, and accessible close button.`,
      techStack: ['Sonner / Radix Toast', 'Tailwind CSS', 'Framer Motion', 'Lucide React'],
      keySteps: [
        'بناء بطاقة إشعار صغيرة تظهر بسلاسة أسفل يسار الشاشة.',
        'عرض معلومات دقيقة وموثوقة (مثل: "تم تدقيق 450 موقعاً اليوم" أو تقييمات موثقة).',
        'مراعاة عدم حجب المحتوى وزر إغلاق صريح وتوقف مؤقت عند مرور الفأرة.',
        'حفظ حالة الإغلاق في الجلسة لمنع الإزعاج.',
      ],
      aiImplementationPrompt: `أنت خبير واجهات ونمو نفسي (UX Psychology & Growth).
المهمة: اكتب كود شريط النشاط التفاعلي (Live Social Proof Pill/Toast) لموقع (${domain}) باستخدام Tailwind CSS و React.
المعايير:
- مظهر بالغ الأناقة (Obsidian Card مع إطار دقيق وشارة نجاح خضراء).
- حركة دخول وخروج ناعمة وشفافة مع مؤشر وقت انقضاء.
- محتوى راقٍ وغير مبتذل (مثال: إحصائيات الاستخدام الحقيقي، اعتمادات الجودة).
- زر إغلاق صريح وزر تفاعل للمزيد من التفاصيل.`,
    },

    // 8. Feature: Developer API & Webhook Management Hub
    {
      id: 'feat-api-webhooks',
      titleAr: 'بوابة المطورين والربط البرمجي (Developer API & Webhooks)',
      titleEn: 'Developer API Keys & Webhook Dispatcher',
      taglineAr: 'تمكين العملاء والشركاء من ربط الموقع بـ Zapier و Make وأنظمتهم الداخلية',
      taglineEn: 'Empower enterprise clients to integrate with Zapier, Slack and custom backend webhooks',
      pillar: 'enterprise',
      priority: 'high',
      difficulty: 'advanced',
      impactMetricAr: 'فتح أسواق B2B والشركات الكبرى (Enterprise Expansion)',
      impactMetricEn: 'Unlocks B2B & Enterprise Integrations',
      rationaleAr: `الشركات المتقدمة لا تكتفي بالواجهة اليدوية، بل تحتاج ربط الأحداث (مثل استلام طلب، أو نتيجة فحص) بأنظمتها الخاصة عبر API ومفاتيح معتمدة.`,
      rationaleEn: `Providing secure API endpoints and event webhooks transforms a standalone website into a high-value platform ecosystem.`,
      architecturePlanAr: `لوحة تحكم مصغرة للمطورين تتيح توليد مفاتيح API آمنة (Bearer Tokens)، واختبار إرسال Webhooks لأي رابط خارجي مع سجل للأخطاء والاستجابات.`,
      architecturePlanEn: `Developer settings dashboard featuring scoped API token generation, webhook subscription registry, and delivery log viewer.`,
      techStack: ['Next.js Route Handlers', 'Crypto Hashing', 'Tailwind CSS', 'Lucide React'],
      keySteps: [
        'واجهة إدارة مفاتيح API (إنشاء مفتاح، نسخه مرة واحدة، وإلغاؤه).',
        'حقل لإدخال رابط Webhook واختيار الأحداث المشترك بها.',
        'زر "إرسال اختبار فوري" (Send Test Payload) للتحقق من الاتصال.',
        'جدول سجلات الطلبات الأخيرة مع كود الاستجابة HTTP (200 OK, 500 Error).',
      ],
      aiImplementationPrompt: `أنت كبير مهندسي النظم الخلفية والواجهات (Principal Full-Stack Architect).
المهمة: اكتب كود واجهة إدارة مفاتيح الـ API والويبهوكس (Developer API & Webhook Hub) لموقع (${domain}) باستخدام React و Tailwind CSS.
المتطلبات:
1. جدول لعرض المفاتيح الحالية مع زر "Generate New Key" وإخفاء الرموز الحساسة (sk_live_••••••).
2. قسم تسجيل الويبهوكس (Webhook URL Input + Event Checkboxes).
3. بطاقة سجل إرسال تجريبي مع زر "Test Ping" وعرض كود JSON التفاعلي.
4. تصميم ستوديو عالي الحرفية باللون الأسود والأخضر الداكن.`,
    },
  ];

  return features;
}

/**
 * Builds the Master AI Implementation Prompt assembling all proposed features.
 */
function assembleMasterFeaturesPrompt(
  domain: string,
  cleanUrl: string,
  archetype: SiteArchetype,
  archetypeLabel: string,
  features: ProposedFeature[],
  inventory: DetectedCapability[]
): string {
  const missingCaps = inventory
    .filter((c) => c.status === 'missing')
    .map((c) => `- ❌ غائب حالياً: ${c.nameAr} (${c.evidence})`)
    .join('\n');

  const presentCaps = inventory
    .filter((c) => c.status === 'present')
    .map((c) => `- ✅ متوفر حالياً: ${c.nameAr}`)
    .join('\n');

  const featuresList = features
    .map(
      (f, idx) => `
### ${idx + 1}. [${f.pillar.toUpperCase()}] ${f.titleAr} (${f.titleEn})
- **الأولوية ومستوى الأثر:** ${f.priority === 'critical' ? '🔴 حاسمة للمنافسة' : f.priority === 'high' ? '🟠 عالية الأثر' : '🟡 تحسين نوعي'} | الأثر المتوقع: ${f.impactMetricAr}
- **صعوبة وزمن التنفيذ:** ${f.difficulty === 'quick-win' ? 'سريع (1-2 أيام)' : f.difficulty === 'medium' ? 'متوسط (1 أسبوع)' : 'متقدم (2-3 أسابيع)'}
- **التبرير الهندسي:** ${f.rationaleAr}
- **المكتبات والتقنيات المقترحة:** ${f.techStack.join(', ')}
- **خطة البناء المعمارية:**
${f.keySteps.map((s) => `  * ${s}`).join('\n')}

**برومبت التنفيذ المباشر للذكاء الاصطناعي:**
\`\`\`markdown
${f.aiImplementationPrompt}
\`\`\`
`
    )
    .join('\n---\n');

  return `# 🚀 المخطط المعماري الشامل لبناء الميزات والنمو (Master Feature Blueprint)
**الموقع المستهدف:** ${cleanUrl}
**طبيعة المنصة (Site Archetype):** ${archetypeLabel}
**الهدف:** تزويد الموقع بمنظومة ميزات هندسية متقدمة تضاعف التحويل، وتعزز الاحتفاظ بالعملاء، وتنقله إلى مستوى منصات الـ Enterprise العالمية.

---

## 📊 1. تشخيص المنظومة والقدرات المكتشفة:
### الميزات المتوفرة حالياً:
${presentCaps || '- لم يتم رصد ميزات متقدمة مكتملة'}

### الفرص الضائعة والقدرات الغائبة الحرجة:
${missingCaps || '- لا توجد نواقص رئيسية'}

---

## 🛠️ 2. خارطة الميزات الهندسية المقترحة وجداول التنفيذ (${features.length} ميزات استراتيجية):
${featuresList}

---

## 🎯 تعليمات موجهة للذكاء الاصطناعي (Claude / Cursor / ChatGPT):
1. قم بتنفيذ الميزات بالأولوية الحرجة (Critical) أولاً.
2. استخدم الكود النظيف المعياري (Next.js 15 App Router, React 19, Tailwind CSS, TypeScript 5 Strict).
3. التزم بتجربة مستخدم رفيعة وصامتة، وتجنب الابتذال والتدرجات الفاقعة.
4. احرص على سرعة الاستجابة اللحظية (Zero CLS، معالجة الـ Errors، وإمكانية الوصول WCAG 2.1 AA).
`;
}

// ============================================================================
// 4. MAIN EXPORTED ENGINE FUNCTION
// ============================================================================

/**
 * Runs deep website feature analysis, capabilities inventory, and architectural proposals.
 */
export function runFeaturesAudit(context: FetchedAuditContext): FeaturesAuditResult {
  const { targetUrl, finalUrl, html, $ } = context;
  const parsed = new URL(finalUrl || targetUrl);
  const domain = parsed.hostname;
  const cleanUrl = `${parsed.protocol}//${parsed.host}`;

  // 1. Extract all internal links from the page
  const internalLinks: string[] = [];
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    if (href.startsWith('/') || href.includes(domain)) {
      internalLinks.push(href);
    }
  });

  // 2. Classify Archetype & Detect Technologies
  const { archetype, keyPages, technologies } = detectSiteArchetype(html, $, internalLinks);
  const archetypeInfo = ARCHETYPE_MAP[archetype];

  // 3. Build Capability Inventory
  const capabilitiesInventory = buildCapabilitiesInventory(keyPages, technologies, html, $);

  const presentCount = capabilitiesInventory.filter((c) => c.status === 'present').length;
  const missingCount = capabilitiesInventory.filter((c) => c.status === 'missing').length;

  // Calculate Feature Maturity Score (0-100)
  const featureMaturityScore = Math.min(
    100,
    Math.max(25, Math.round((presentCount / capabilitiesInventory.length) * 100) + 15)
  );

  const metrics: FeaturesAuditMetrics = {
    siteArchetype: archetype,
    archetypeLabelAr: archetypeInfo.labelAr,
    archetypeLabelEn: archetypeInfo.labelEn,
    totalInternalLinksFound: internalLinks.length,
    discoveredKeyPages: keyPages,
    detectedTechnologies: technologies,
    featureMaturityScore,
    presentCapabilitiesCount: presentCount,
    missingOpportunitiesCount: missingCount,
  };

  // 4. Generate Tailored Proposed Features
  const proposedFeatures = generateTailoredFeatures(
    archetype,
    domain,
    cleanUrl,
    keyPages,
    technologies
  );

  // 5. Assemble Master AI Prompt
  const masterAiPrompt = assembleMasterFeaturesPrompt(
    domain,
    cleanUrl,
    archetype,
    archetypeInfo.labelAr,
    proposedFeatures,
    capabilitiesInventory
  );

  return {
    url: cleanUrl,
    domain,
    timestamp: new Date().toISOString(),
    metrics,
    capabilitiesInventory,
    proposedFeatures,
    masterAiPrompt,
  };
}
