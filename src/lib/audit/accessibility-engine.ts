import type { FetchedAuditContext } from './fetcher';
import type { CategoryResult, AccessibilityMetrics, AuditIssue } from '../../types/audit';

export function runAccessibilityAudit(ctx: FetchedAuditContext): CategoryResult<AccessibilityMetrics> {
  const { $ } = ctx;
  const issues: AuditIssue[] = [];
  let scoreDeduction = 0;

  // 1. HTML lang attribute
  const htmlLangAttr = $('html').attr('lang')?.trim() ?? null;
  const hasLang = Boolean(htmlLangAttr && htmlLangAttr.length >= 2);
  const isValidLangFormat = hasLang ? /^[a-z]{2,3}(-[a-zA-Z]{2,4})?$/i.test(htmlLangAttr!) : false;

  if (!hasLang) {
    scoreDeduction += 20;
    issues.push({
      id: 'a11y-missing-html-lang',
      category: 'accessibility',
      severity: 'critical',
      title: 'Missing `lang` Attribute on <html> Element',
      description: 'The root `<html>` tag lacks a valid language attribute (e.g. `lang="en"`).',
      impact: 'Screen readers cannot determine the correct pronunciation rules and fallback voice synthesizers.',
      recommendation: 'Add `lang="en"` (or your target locale) to the root `<html>` tag.',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `<html lang="en">\n  <body>{children}</body>\n</html>`,
    });
  } else if (!isValidLangFormat) {
    scoreDeduction += 5;
    issues.push({
      id: 'a11y-invalid-html-lang',
      category: 'accessibility',
      severity: 'warning',
      title: 'Invalid `lang` Attribute Format on <html>',
      description: `The \`lang="${htmlLangAttr}"\` attribute does not match standard BCP 47 language code format.`,
      impact: 'Assistive devices cannot properly configure pronunciation and screen reader dictionaries.',
      recommendation: 'Use standard language codes like "en" or "en-US".',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `// Use standard BCP 47 language code\n<html lang="en" dir="ltr">\n  <body>{children}</body>\n</html>`,
      evidence: { currentLang: htmlLangAttr },
    });
  }

  // 2. Heading Sequence Integrity
  const headingList: Array<{ tag: string; level: number; text: string }> = [];
  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const tagName = el.tagName.toLowerCase();
    const level = parseInt(tagName.replace('h', ''), 10);
    headingList.push({
      tag: tagName,
      level,
      text: $(el).text().trim(),
    });
  });

  const headingSkips: string[] = [];
  for (let i = 0; i < headingList.length - 1; i++) {
    const current = headingList[i]!;
    const next = headingList[i + 1]!;
    // Skips occur if next level is more than 1 level deeper (e.g. H1 to H3 or H2 to H5)
    if (next.level > current.level + 1) {
      headingSkips.push(`${current.tag.toUpperCase()} -> ${next.tag.toUpperCase()} ("${next.text.slice(0, 30)}")`);
    }
  }

  if (headingSkips.length > 0) {
    scoreDeduction += 10;
    issues.push({
      id: 'a11y-heading-sequence-skip',
      category: 'accessibility',
      severity: 'warning',
      title: 'Broken Heading Sequence Hierarchy',
      description: `Heading levels skip improperly: ${headingSkips.slice(0, 3).join(', ')}.`,
      impact: 'Screen reader users navigating by heading keys (H / 1-6) encounter an unpredictable document structure.',
      recommendation: 'Do not skip heading levels (e.g., use an <h2> before nesting an <h3>).',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Maintain sequential heading hierarchy -->\n<h1>Page Main Title</h1>\n  <h2>Section Topic Header</h2>\n    <h3>Subtopic Specifics</h3>`,
      evidence: { skips: headingSkips },
    });
  }

  // 3. Image Alt Attributes
  let missingAlts = 0;
  let decorativeAlts = 0;
  let validAlts = 0;

  $('img').each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined) {
      missingAlts++;
    } else if (alt.trim() === '') {
      decorativeAlts++;
    } else {
      validAlts++;
    }
  });

  if (missingAlts > 0) {
    scoreDeduction += Math.min(25, missingAlts * 5);
    issues.push({
      id: 'a11y-missing-alt-tags',
      category: 'accessibility',
      severity: 'critical',
      title: `${missingAlts} Image(s) Missing alt Attribute`,
      description: `Found ${missingAlts} image(s) with no \`alt\` attribute defined.`,
      impact: 'Screen readers announce raw image filenames or URL paths, creating a jarring experience for blind users.',
      recommendation: 'Provide meaningful alt descriptions, or alt="" if the image is strictly decorative.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Provide accessible alt text for screen readers -->\n<img src="/feature.png" alt="Descriptive summary of the visual diagram" />`,
    });
  }

  // 4. Form Controls & Label Association
  let totalInputs = 0;
  let labeledInputs = 0;
  let unlabeledInputs = 0;
  const sampleUnlabeled: string[] = [];

  $('input, select, textarea').each((_, el) => {
    const type = $(el).attr('type')?.toLowerCase();
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') return;

    totalInputs++;
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledBy = $(el).attr('aria-labelledby');
    const title = $(el).attr('title');

    // Check if wrapped in <label>
    const isWrappedInLabel = $(el).closest('label').length > 0;
    // Check if matching <label for="id"> exists
    const hasMatchingLabel = id ? $(`label[for="${id}"]`).length > 0 : false;

    if (ariaLabel || ariaLabelledBy || isWrappedInLabel || hasMatchingLabel || title) {
      labeledInputs++;
    } else {
      unlabeledInputs++;
      if (sampleUnlabeled.length < 5) {
        sampleUnlabeled.push(
          `<${el.tagName.toLowerCase()} type="${type ?? 'text'}" name="${$(el).attr('name') ?? ''}">`
        );
      }
    }
  });

  if (unlabeledInputs > 0) {
    scoreDeduction += Math.min(20, unlabeledInputs * 8);
    issues.push({
      id: 'a11y-unlabeled-form-controls',
      category: 'accessibility',
      severity: 'critical',
      title: `${unlabeledInputs} Form Control(s) Lack Accessible Labels`,
      description: `Detected ${unlabeledInputs} input/select/textarea element(s) with no associated <label> or aria-label.`,
      impact: 'Screen reader users cannot identify the purpose of form input fields.',
      recommendation: 'Associate inputs with a `<label htmlFor="id">` or add `aria-label="Input description"`.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<!-- Associate explicit label with form control -->\n<label htmlFor="url-input" className="sr-only">Target URL</label>\n<input id="url-input" name="url" type="url" placeholder="https://..." />`,
      evidence: { sampleElements: sampleUnlabeled },
    });
  }

  // 5. Button Accessible Text
  let totalButtons = 0;
  let withAriaOrText = 0;
  let emptyButtons = 0;

  $('button, [role="button"]').each((_, el) => {
    totalButtons++;
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label')?.trim();
    const ariaLabelledBy = $(el).attr('aria-labelledby')?.trim();
    const title = $(el).attr('title')?.trim();

    if (text.length > 0 || ariaLabel || ariaLabelledBy || title) {
      withAriaOrText++;
    } else {
      emptyButtons++;
    }
  });

  if (emptyButtons > 0) {
    scoreDeduction += Math.min(15, emptyButtons * 5);
    issues.push({
      id: 'a11y-empty-buttons',
      category: 'accessibility',
      severity: 'critical',
      title: `${emptyButtons} Button(s) Lack Accessible Text`,
      description: `Found ${emptyButtons} button element(s) with no text content and no aria-label.`,
      impact: 'Screen readers read empty buttons as "button", giving blind users no indication of what clicking it will do.',
      recommendation: 'Add descriptive text, or `aria-label="Action name"` for icon-only buttons.',
      targetFile: 'src/app/page.tsx',
      codeSnippet: `<button type="button" aria-label="Close dialog">\n  <XIcon className="w-5 h-5" />\n</button>`,
    });
  }

  // 6. Viewport Zoom Restrictions
  const viewportContent = $('meta[name="viewport"]').attr('content')?.toLowerCase() ?? '';
  const restrictsScalable = viewportContent.includes('user-scalable=no') || viewportContent.includes('user-scalable=0');
  const restrictsMaxScale =
    /maximum-scale\s*=\s*1(\.0)?/i.test(viewportContent) && !viewportContent.includes('maximum-scale=5');

  if (restrictsScalable || restrictsMaxScale) {
    scoreDeduction += 15;
    issues.push({
      id: 'a11y-viewport-zoom-blocked',
      category: 'accessibility',
      severity: 'critical',
      title: 'Viewport Prevents User Zooming',
      description: 'The viewport meta tag disables pinch-to-zoom (`user-scalable=no` or `maximum-scale=1.0`).',
      impact: 'Violates WCAG 2.1 Success Criterion 1.4.4 (Resize text). Low-vision users are prevented from magnifying text.',
      recommendation: 'Remove user-scalable=no and maximum-scale=1.0 from viewport config.',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `export const viewport: Viewport = {\n  width: 'device-width',\n  initialScale: 1,\n};`,
      evidence: { viewport: viewportContent },
    });
  }

  // 7. Landmark Elements
  const hasMain = $('main, [role="main"]').length > 0;
  const hasNav = $('nav, [role="navigation"]').length > 0;
  const hasHeader = $('header, [role="banner"]').length > 0;
  const hasFooter = $('footer, [role="contentinfo"]').length > 0;

  const missingLandmarks: string[] = [];
  if (!hasMain) missingLandmarks.push('<main>');
  if (!hasNav) missingLandmarks.push('<nav>');
  if (!hasHeader) missingLandmarks.push('<header>');
  if (!hasFooter) missingLandmarks.push('<footer>');

  if (!hasMain) {
    scoreDeduction += 15;
    issues.push({
      id: 'a11y-missing-main-landmark',
      category: 'accessibility',
      severity: 'critical',
      title: 'Missing `<main>` Landmark Element',
      description: 'The document lacks a `<main>` container enclosing the core page content.',
      impact: 'Screen reader users cannot quickly jump past navigation to the main article or content body.',
      recommendation: 'Wrap the primary content in a `<main>` tag.',
      targetFile: 'src/app/layout.tsx',
      codeSnippet: `// In src/app/layout.tsx\n<main className="flex-1 max-w-7xl mx-auto">\n  {children}\n</main>`,
    });
  }

  const finalScore = Math.max(0, 100 - scoreDeduction);

  const metrics: AccessibilityMetrics = {
    htmlLang: {
      present: hasLang,
      value: htmlLangAttr,
      isValidFormat: isValidLangFormat,
    },
    headingSequence: {
      valid: headingSkips.length === 0,
      skips: headingSkips,
    },
    imageAlts: {
      missingCount: missingAlts,
      decorativeCount: decorativeAlts,
      validCount: validAlts,
    },
    formControls: {
      totalInputs,
      labeledInputs,
      unlabeledInputs,
      sampleUnlabeled,
    },
    buttons: {
      totalButtons,
      withAriaOrText,
      emptyButtons,
    },
    viewportZoom: {
      scalable: !restrictsScalable,
      maximumScaleRestricted: restrictsMaxScale,
    },
    landmarks: {
      hasMain,
      hasNav,
      hasHeader,
      hasFooter,
      missingLandmarks,
    },
  };

  return {
    score: finalScore,
    metrics,
    issues,
  };
}
