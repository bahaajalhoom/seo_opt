import type { FetchedAuditContext } from './fetcher';
import type {
  UiUxAuditResult,
  UiUxMetrics,
  UiUxPrescription,
  ExtractedColor,
} from '@/types/uiux';

// ============================================================================
// HELPER CALCULATIONS: LUMINANCE & CONTRAST
// ============================================================================
function parseHexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return null;

  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrastRatio(lum1: number, lum2: number): number {
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return Number(((brighter + 0.05) / (darker + 0.05)).toFixed(2));
}

// ============================================================================
// COLOR EXTRACTOR
// ============================================================================
export function extractDomColors(rawHtml: string): ExtractedColor[] {
  const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
  const matches = rawHtml.match(hexRegex) || [];
  const frequencyMap = new Map<string, number>();

  for (const rawHex of matches) {
    const normalized =
      rawHex.length === 4
        ? '#' + rawHex.slice(1).split('').map((c) => c + c).join('').toUpperCase()
        : rawHex.toUpperCase();
    frequencyMap.set(normalized, (frequencyMap.get(normalized) || 0) + 1);
  }

  const sortedColors = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16);

  return sortedColors.map(([hex, frequency]) => {
    const rgb = parseHexToRgb(hex) || { r: 128, g: 128, b: 128 };
    const luminance = Number(getRelativeLuminance(rgb.r, rgb.g, rgb.b).toFixed(3));
    const isDark = luminance < 0.2;

    let role: ExtractedColor['role'] = 'neutral';
    if (luminance < 0.08) role = 'background';
    else if (luminance > 0.85) role = 'text';
    else if (rgb.r > 200 && rgb.g < 100) role = 'accent';
    else if (rgb.g > 150 && rgb.r < 100) role = 'accent';
    else if (rgb.b > 180 && rgb.r < 100) role = 'accent';

    return {
      hex,
      role,
      frequency,
      luminance,
      isDark,
    };
  });
}

// ============================================================================
// UI/UX AUDIT ENGINE CORE
// ============================================================================
export function runUiUxAudit(ctx: FetchedAuditContext): UiUxAuditResult {
  const { $, html, finalUrl } = ctx;
  const rawHtml = html || '';
  const prescriptions: UiUxPrescription[] = [];

  // 1. Color Analysis
  const extractedColors = extractDomColors(rawHtml);
  const totalColorsCount = extractedColors.length;

  let colorDeductions = 0;
  let typographyDeductions = 0;
  let buttonsDeductions = 0;
  let hierarchyDeductions = 0;
  let formsDeductions = 0;

  // Check 1.1: Color Palette Discipline (The 90/10 Rule)
  if (totalColorsCount > 10) {
    colorDeductions += 25;
    prescriptions.push({
      id: 'color-palette-bloat',
      category: 'colors',
      severity: 'critical',
      titleAr: 'تشتت لوني وفوضى في درجات الألوان',
      titleEn: 'Color Palette Fragmentation (>10 distinct hues)',
      diagnosisAr: `تم اكتشاف ${totalColorsCount} لوناً مختلفاً في كود الصفحة، مما يشتت العين ويفقد الموقع هويته الاحترافية الموحدة.`,
      diagnosisEn: `Discovered ${totalColorsCount} distinct color codes across styles, resulting in visual clutter and lack of brand cohesion.`,
      actionRuleAr:
        'اعمل هيك وسوي هيك: طبّق قاعدة 90/10 للألوان فوراً! اجعل 90% من الواجهة ألواناً محايدة (Obsidian/Carbon أو أبيض نقي ورمادي هادئ)، واحتفظ بـ 10% فقط للون التمييز (Accent) مثل الزمرد أو الأزرق للأزرار التفاعلية والروابط الحيوية.',
      actionRuleEn:
        'Prescription: Enforce the 90/10 color rule immediately. 90% of layout pixels should use calm neutral surfaces (Obsidian or Slate), while reserving exactly ONE high-energy accent for CTAs.',
      designPrinciple: '90/10 Neutral-to-Accent Rule',
      cssFixSnippet: `:root {\n  --surface-neutral: #0D0F14;\n  --text-primary: #F8F9FA;\n  --text-muted: #9CA3AF;\n  --brand-accent: #10B981; /* Single Action Accent */\n}`,
      currentValue: `${totalColorsCount} colors detected`,
      suggestedValue: '3-4 core tokens (Surface, Text, Muted, Accent)',
    });
  } else {
    prescriptions.push({
      id: 'color-palette-healthy',
      category: 'colors',
      severity: 'optimal',
      titleAr: 'انضباط ممتاز في لوحة الألوان',
      titleEn: 'Clean, disciplined color palette',
      diagnosisAr: 'لوحة ألوان متماسكة ومحدودة تعكس احترافية الواجهة.',
      diagnosisEn: 'Compact and controlled color palette reflecting visual discipline.',
      actionRuleAr: 'ممتاز! حافظ على نظام الرموز اللونية الحالي دون إضافة درجات عشوائية جديدة.',
      actionRuleEn: 'Great job. Preserve this color token palette across all sub-pages.',
      designPrinciple: 'Design System Cohesion',
    });
  }

  // Check 1.2: Dark mode & theme support
  const hasDarkMode =
    rawHtml.includes('dark:') ||
    rawHtml.includes('prefers-color-scheme') ||
    rawHtml.includes('color-scheme') ||
    rawHtml.includes('class="dark"') ||
    rawHtml.includes("class='dark'");

  if (!hasDarkMode) {
    colorDeductions += 10;
    prescriptions.push({
      id: 'color-no-dark-mode',
      category: 'colors',
      severity: 'warning',
      titleAr: 'غياب دعم النمط الداكن (Dark Mode)',
      titleEn: 'Missing Dark Mode Architecture',
      diagnosisAr: 'الموقع يفتقر إلى دعم التبديل التلقائي أو اليدوي للنمط الليلي المريح للعين.',
      diagnosisEn: 'The interface lacks system or toggleable dark-mode styling support.',
      actionRuleAr:
        'اعمل هيك: أضف خاصية `color-scheme: dark light` في ملف CSS الأساسي، أو جهّز كلاس `.dark` مع متغيرات CSS لتمكين تصفح مريح في الإضاءة المنخفضة وتقليل استهلاك بطارية الهواتف.',
      actionRuleEn:
        'Prescription: Add `color-scheme: dark light;` to :root or implement a Tailwind dark mode variant.',
      designPrinciple: 'Ergonomic Viewing & Battery Efficiency',
      cssFixSnippet: `html {\n  color-scheme: dark light;\n}`,
    });
  }

  // Check 2: Typography & Readability
  const fontMatches = rawHtml.match(/font-family:[^;"]+/gi) || [];
  const googleFonts: string[] = rawHtml.match(/fonts\.googleapis\.com\/css2\?family=([^&"']+)/gi) || [];
  const detectedFonts: string[] = Array.from(
    new Set(
      googleFonts.map((f: string) => decodeURIComponent(f.split('family=')[1] || '').split(':')[0])
    )
  );

  if (detectedFonts.length > 2) {
    typographyDeductions += 20;
    prescriptions.push({
      id: 'typo-too-many-fonts',
      category: 'typography',
      severity: 'critical',
      titleAr: 'تعدد خطوط مفرط (فوضى التايبوجرافي)',
      titleEn: 'Typography Overload (>2 font families)',
      diagnosisAr: `الموقع يقوم بتحميل واستخدام ${detectedFonts.length} عائلات خطوط مختلفة (${detectedFonts.join(
        ', '
      )})، مما يبطئ التحميل ويشتت انسيابية القراءة.`,
      diagnosisEn: `Page loads ${detectedFonts.length} distinct font families, slowing download and causing typographic discord.`,
      actionRuleAr:
        'اعمل هيك وسوي هيك: وحّد الخطوط على عائلة خطوط واحدة حديثة (مثل Cairo أو IBM Plex Sans للغة العربية، و Inter للإنجليزية)! استخدم تدرج الأوزان (Weights: 400 للقراءة، 600 للعناوين الفرعية، 800 للعناوين الرئيسية) بدلاً من استدعاء عدة خطوط مختلفة.',
      actionRuleEn:
        'Prescription: Standardize on a single modern font family. Create hierarchy using font weights (400 regular, 600 semibold, 800 bold) instead of loading competing typefaces.',
      designPrinciple: 'Typographic Harmony & Font Economy',
      suggestedValue: '1 Primary Sans + 1 Mono for data/code',
    });
  }

  // Check 2.2: Paragraph Line-Height & Readability
  const hasSmallLineHeight =
    rawHtml.includes('leading-none') ||
    rawHtml.includes('leading-tight') ||
    rawHtml.includes('line-height:1') ||
    rawHtml.includes('line-height: 1');

  if (hasSmallLineHeight) {
    typographyDeductions += 15;
    prescriptions.push({
      id: 'typo-cramped-lineheight',
      category: 'typography',
      severity: 'warning',
      titleAr: 'ارتفاع سطر خانق للنصوص (Line-Height غير مريح)',
      titleEn: 'Cramped Paragraph Line-Height (<1.5 ratio)',
      diagnosisAr: 'تم اكتشاف فقرات نصية تستخدم تباعد أسطر ضيقاً جداً، مما يرهق عين المستخدم أثناء قراءة المحتوى الطويل.',
      diagnosisEn: 'Paragraph texts use tight line spacing, causing visual fatigue during long reads.',
      actionRuleAr:
        'اعمل هيك: اضبط ارتفاع السطر للفقرات النصية على `line-height: 1.6` (أو `leading-relaxed` في Tailwind)! قاعدة التايبوجرافي الذهبية: كلما طال السطر، زادت الحاجة لمساحة تنفس عمودية بين الكلمات.',
      actionRuleEn:
        'Prescription: Enforce `line-height: 1.6` (Tailwind `leading-relaxed`) on all body paragraphs to give eyes a natural scanning rhythm.',
      designPrinciple: 'Readability Rhythm & Eye Tracking',
      cssFixSnippet: `p, article {\n  line-height: 1.625; /* Tailwind leading-relaxed */\n  letter-spacing: normal;\n}`,
    });
  }

  // Check 3: Buttons & Interactive Ergonomics (Fitts's Law)
  const buttons = $('button, a[role="button"], a.btn, a.button');
  const buttonCount = buttons.length;

  let hasClearPrimaryCta = false;
  buttons.each((_, el) => {
    const text = $(el).text().toLowerCase().trim();
    if (
      text.includes('start') ||
      text.includes('get started') ||
      text.includes('sign up') ||
      text.includes('ابدأ') ||
      text.includes('سجل') ||
      text.includes('اشترك') ||
      text.includes('فحص') ||
      text.includes('تجربة')
    ) {
      hasClearPrimaryCta = true;
    }
  });

  if (!hasClearPrimaryCta) {
    buttonsDeductions += 25;
    prescriptions.push({
      id: 'btn-missing-primary-cta',
      category: 'buttons',
      severity: 'critical',
      titleAr: 'غياب زر إجراء رئيسي بارز (Missing Primary CTA)',
      titleEn: 'Ambiguous Call-To-Action (No clear Primary Action)',
      diagnosisAr: 'الموقع لا يبرز زراً رئيسياً يقود المستخدم للخطوة الأولى الحاسمة، مما يرفع معدل الارتداد (Bounce Rate).',
      diagnosisEn: 'No standout primary action button detected in the viewport. Visitors lack an immediate next step.',
      actionRuleAr:
        'اعمل هيك وسوي هيك: صمم زراً رئيسياً واحداً بلون مميز وتباين عالٍ في الجزء العلوي (Above the fold). اجعل نصه فعلاً واضحاً مثل: "ابدأ الفحص المجاني" أو "أنشئ حسابك الآن"، وزوّده بحجم مريح وحشوة لا تقل عن 12px عمودياً و 24px أفقياً.',
      actionRuleEn:
        'Prescription: Anchor a high-contrast Primary CTA button above the fold with action-oriented copy ("Start Free Audit", "Deploy Now") with minimum 12px vertical and 24px horizontal padding.',
      designPrinciple: "Fitts's Law of Interactive Prominence",
      cssFixSnippet: `<button className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-md transition-all active:scale-[0.98]">\n  ابدأ الآن مجاناً ←\n</button>`,
    });
  }

  // Check 3.2: Mobile Touch Targets (< 44px)
  const smallLinks = $('a, button').filter((_, el) => {
    const text = $(el).text().trim();
    return text.length === 0 && !$(el).attr('aria-label');
  });

  if (smallLinks.length > 0) {
    buttonsDeductions += 15;
    prescriptions.push({
      id: 'btn-small-touch-targets',
      category: 'buttons',
      severity: 'warning',
      titleAr: 'أزرار وأيقونات بنقرات عمياء (Touch Target Issues)',
      titleEn: 'Ambiguous Icon Buttons without Accessible Labels',
      diagnosisAr: `تم اكتشاف ${smallLinks.length} عنصراً تفاعلياً فارغ النص وبدون خاصية aria-label، مما يعيق أصحاب شاشات اللمس وقارئات الشاشة.`,
      diagnosisEn: `Detected ${smallLinks.length} icon-only buttons or links lacking accessible labels or sufficient tap dimensions.`,
      actionRuleAr:
        'اعمل هيك: أضف دائماً `aria-label="اسم الإجراء"` لأي زر أيقونة، وتأكد من أن مساحة النقر الخارجية للزر لا تقل عن 44x44 بكسل لتجنب الضغطات الخاطئة على الجوال.',
      actionRuleEn:
        'Prescription: Add `aria-label` to all icon buttons and guarantee minimum 44x44px bounding box for comfortable mobile touch.',
      designPrinciple: 'Apple HIG & Android 44x44px Touch Target Standard',
    });
  }

  // Check 4: Navigation & Visual Hierarchy (Miller's Law 7±2)
  const navLinks = $('header nav a, nav a');
  const navCount = navLinks.length;

  if (navCount > 7) {
    hierarchyDeductions += 20;
    prescriptions.push({
      id: 'nav-choice-overload',
      category: 'hierarchy',
      severity: 'critical',
      titleAr: 'ازدحام شريط التنقل العلوي (قانون ميلر 7±2)',
      titleEn: "Navigation Overload (Violates Miller's Law 7±2)",
      diagnosisAr: `القائمة الرئيسية تحتوي على ${navCount} عناصر معروضة دفعة واحدة، مما يشتت الزائر ويؤخر اتخاذه للقرار (Choice Paralysis).`,
      diagnosisEn: `Top-level navigation contains ${navCount} links, exceeding the human working memory capacity of 7±2 items.`,
      actionRuleAr:
        'اعمل هيك وسوي هيك: اختصر شريط التنقل لـ 4 إلى 5 روابط جوهرية فقط! اجمع الروابط الثانوية (مثل الوثائق، الأسئلة الشائعة، الشروط) داخل قائمة منسدلة أنيقة (Dropdown) أو ضعها في الفوتر بأسفل الصفحة.',
      actionRuleEn:
        "Prescription: Consolidate navigation to 4-5 priority links. Move auxiliary links (Docs, Terms, FAQ) into a secondary dropdown or the footer.",
      designPrinciple: "Miller's Law (7±2 Working Memory Chunks)",
    });
  } else {
    prescriptions.push({
      id: 'nav-hierarchy-healthy',
      category: 'hierarchy',
      severity: 'optimal',
      titleAr: 'تنقل علوي خفيف ومركّز',
      titleEn: 'Focused Navigation Architecture',
      diagnosisAr: 'عدد الروابط العلوية مريح للعين ومطابق لأفضل ممارسات الـ UX.',
      diagnosisEn: 'Top navigation is lean, clear, and respects cognitive bandwidth.',
      actionRuleAr: 'ممتاز! حافظ على بساطة الهيدر وتجنب تكديس روابط فرعية إضافية.',
      actionRuleEn: 'Keep navigation focused on primary value routes.',
      designPrinciple: 'Lean Navigation',
    });
  }

  // Check 4.2: Mobile Viewport meta
  const viewportMeta = $('meta[name="viewport"]').attr('content');
  const hasResponsiveViewport = Boolean(viewportMeta && viewportMeta.includes('width=device-width'));

  if (!hasResponsiveViewport) {
    hierarchyDeductions += 30;
    prescriptions.push({
      id: 'layout-missing-viewport',
      category: 'hierarchy',
      severity: 'critical',
      titleAr: 'غياب وسم التجاوب الأساسي (Mobile Viewport Missing)',
      titleEn: 'Missing Mobile Responsive Viewport Meta',
      diagnosisAr: 'الصفحة لا تحتوي على وسم viewport الصحيح، مما يجعلها تبدو كنسخة كمبيوتر مصغرة وغير مقروءة على الهواتف.',
      diagnosisEn: 'Missing `<meta name="viewport" content="width=device-width, initial-scale=1">`. Page will render miniature on mobile.',
      actionRuleAr:
        'اعمل هيك فوراً: أضف وسم viewport في `<head>` ليتم ضبط مقياس العرض تلقائياً مع حجم شاشة الهاتف!',
      actionRuleEn: 'Add `<meta name="viewport" content="width=device-width, initial-scale=1">` to `<head>`.',
      designPrinciple: 'Mobile-First Responsive Foundation',
      cssFixSnippet: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    });
  }

  // Check 5: Forms & Input Usability
  const inputs = $('input:not([type="hidden"]), select, textarea');
  const formInputsCount = inputs.length;
  let inputsWithLabels = 0;

  inputs.each((_, el) => {
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledBy = $(el).attr('aria-labelledby');
    const hasParentLabel = $(el).closest('label').length > 0;
    const hasMatchingLabel = id ? $(`label[for="${id}"]`).length > 0 : false;

    if (ariaLabel || ariaLabelledBy || hasParentLabel || hasMatchingLabel) {
      inputsWithLabels++;
    }
  });

  if (formInputsCount > 0 && inputsWithLabels < formInputsCount) {
    formsDeductions += 25;
    prescriptions.push({
      id: 'form-placeholder-anti-pattern',
      category: 'forms',
      severity: 'critical',
      titleAr: 'فخ الاعتماد على الـ Placeholder فقط في النماذج',
      titleEn: 'Inputs Relying Exclusively on Placeholders',
      diagnosisAr: `${formInputsCount - inputsWithLabels} حقل إدخال يفتقر إلى وسم <label> صريح ويعتمد على placeholder فقط، مما يسبب فقدان المستخدم لسياق الحقل فور البدء بالكتابة.`,
      diagnosisEn: `${formInputsCount - inputsWithLabels} form inputs lack explicit '<label>' tags, relying only on disappearing placeholder text.`,
      actionRuleAr:
        'اعمل هيك وسوي هيك: لا تجعل الـ placeholder بديلاً عن التسمية! أضف وسماً مرئياً <label> أعلى كل حقل بخط صغير وواضح (text-xs font-medium text-zinc-300). استخدم الـ placeholder فقط كأمثلة توضيحية (مثل: "name@company.com").',
      actionRuleEn:
        'Prescription: Never substitute labels with placeholders. Anchor an explicit, permanent `<label>` above every input field and use placeholders solely for sample values.',
      designPrinciple: 'Nielsen Norman Group Form Usability Guideline',
      cssFixSnippet: `<label className="block text-xs font-semibold text-zinc-300 mb-1.5">\n  البريد الإلكتروني للعمل\n</label>\n<input type="email" placeholder="you@domain.com" className="h-10 w-full rounded-xl bg-[#090C12] border border-white/10 px-3 text-sm" />`,
    });
  }

  // Calculate Scores
  const colorScore = Math.max(10, 100 - colorDeductions);
  const typographyScore = Math.max(10, 100 - typographyDeductions);
  const buttonsScore = Math.max(10, 100 - buttonsDeductions);
  const hierarchyScore = Math.max(10, 100 - hierarchyDeductions);
  const formsScore = formInputsCount > 0 ? Math.max(10, 100 - formsDeductions) : 95;

  const overallScore = Math.round(
    0.25 * hierarchyScore +
      0.2 * colorScore +
      0.2 * typographyScore +
      0.2 * buttonsScore +
      0.15 * formsScore
  );

  let domain = 'target-domain.com';
  try {
    domain = new URL(finalUrl).hostname.replace(/^www\./, '');
  } catch {
    domain = finalUrl.replace(/^https?:\/\//, '').split('/')[0] || 'domain.com';
  }

  const verdictAr =
    overallScore >= 90
      ? 'تجربة مستخدم استثنائية · تصميم هندسي متماسك وعالي الجاذبية'
      : overallScore >= 75
      ? 'واجهة جيدة · تتطلب صقلاً في تباين الألوان ومناطق النقر'
      : overallScore >= 60
      ? 'واجهة متوسطة · تعاني من تشتت لوني وتزاحم في العناصر التفاعلية'
      : 'تجربة مستخدم ضعيفة · تتطلب إعادة هيكلة فورية للتسلسل البصري والأزرار';

  const verdictEn =
    overallScore >= 90
      ? 'Exceptional UI/UX Architecture · Studio-grade visual hierarchy and ergonomics'
      : overallScore >= 75
      ? 'Good Interface · Requires color contrast tuning and CTA prominence'
      : overallScore >= 60
      ? 'Average UX · Suffers from color fragmentation and choice overload'
      : 'Critical UX Defects · High cognitive load and broken mobile ergonomics';

  const metrics: UiUxMetrics = {
    totalColorsDetected: totalColorsCount,
    paletteDisciplineScore: Math.max(20, 100 - totalColorsCount * 4),
    detectedFonts,
    hasResponsiveViewport,
    headerNavItemsCount: navCount,
    totalButtonsCount: buttonCount,
    hasClearPrimaryCta,
    formInputsCount,
    inputsWithExplicitLabels: inputsWithLabels,
    hasDarkModeSupport: hasDarkMode,
    averageLineHeightRatio: hasSmallLineHeight ? 1.2 : 1.6,
    smallTouchTargetsCount: smallLinks.length,
  };

  return {
    url: finalUrl,
    domain,
    timestamp: new Date().toISOString(),
    overallScore,
    verdictAr,
    verdictEn,
    scores: {
      colors: colorScore,
      typography: typographyScore,
      buttons: buttonsScore,
      hierarchy: hierarchyScore,
      forms: formsScore,
    },
    metrics,
    extractedColors,
    prescriptions,
  };
}
