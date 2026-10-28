export type UiUxCategory = 'colors' | 'typography' | 'buttons' | 'hierarchy' | 'forms';
export type PrescriptionSeverity = 'critical' | 'warning' | 'optimal';

export interface UiUxPrescription {
  id: string;
  category: UiUxCategory;
  severity: PrescriptionSeverity;
  titleAr: string;
  titleEn: string;
  diagnosisAr: string; // المشكلة الحالية بدقة
  diagnosisEn: string;
  actionRuleAr: string; // "اعمل هيك وسوي هيك" - التوجيه الهندسي المباشر
  actionRuleEn: string;
  designPrinciple: string; // e.g. "WCAG 2.1 AA Contrast", "Fitts's Law", "Miller's Law (7±2)"
  cssFixSnippet?: string;
  currentValue?: string;
  suggestedValue?: string;
}

export interface ExtractedColor {
  hex: string;
  role: 'background' | 'text' | 'accent' | 'border' | 'neutral';
  frequency: number;
  luminance: number;
  isDark: boolean;
}

export interface UiUxMetrics {
  totalColorsDetected: number;
  paletteDisciplineScore: number; // 0-100
  detectedFonts: string[];
  hasResponsiveViewport: boolean;
  headerNavItemsCount: number;
  totalButtonsCount: number;
  hasClearPrimaryCta: boolean;
  formInputsCount: number;
  inputsWithExplicitLabels: number;
  hasDarkModeSupport: boolean;
  averageLineHeightRatio: number;
  smallTouchTargetsCount: number;
}

export interface UiUxAuditResult {
  url: string;
  domain: string;
  timestamp: string;
  overallScore: number;
  verdictAr: string;
  verdictEn: string;
  scores: {
    colors: number;
    typography: number;
    buttons: number;
    hierarchy: number;
    forms: number;
  };
  metrics: UiUxMetrics;
  extractedColors: ExtractedColor[];
  prescriptions: UiUxPrescription[];
}
