'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import { ArrowRight, ArrowLeft, AlertCircle, Globe2 } from 'lucide-react';
import { SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Add or remove quick-test test domains here.
const QUICK_PRESETS = [
  { label: 'linear.app', url: 'https://linear.app' },
  { label: 'github.com', url: 'https://github.com' },
  { label: 'wikipedia.org', url: 'https://wikipedia.org' },
  { label: 'docs.anthropic.com', url: 'https://docs.anthropic.com' },
] as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface UrlInputBarProps {
  lang: SupportedLang;
  isLoading: boolean;
  onAudit: (url: string) => void;
}

interface PresetRailProps {
  label: string;
  isLoading: boolean;
  onSelectPreset: (url: string) => void;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
/**
 * Normalizes user input into a valid HTTPS URL or returns localized validation error.
 */
function normalizeAuditUrl(
  rawInput: string,
  emptyError: string,
  invalidError: string
): { valid: true; url: string } | { valid: false; error: string } {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { valid: false, error: emptyError };
  }

  const candidate =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return { valid: false, error: invalidError };
    }
    return { valid: true, url: candidate };
  } catch {
    return { valid: false, error: invalidError };
  }
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function QuickPresetRail({ label, isLoading, onSelectPreset }: PresetRailProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
      <span className="text-zinc-400 text-xs font-medium shrink-0">{label}</span>
      <div className="flex flex-wrap items-center gap-1.5" dir="ltr">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onSelectPreset(preset.url)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-[#0D0F14] hover:bg-[#12151C] hover:border-emerald-500/30 text-zinc-300 text-xs font-mono transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
export function UrlInputBar({ lang, isLoading, onAudit }: UrlInputBarProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [url, setUrl] = React.useState('');
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const validation = normalizeAuditUrl(url, t.urlEmptyError, t.urlInvalidError);

    if (!validation.valid) {
      setValidationError(validation.error);
      inputRef.current?.focus();
      return;
    }

    onAudit(validation.url);
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setValidationError(null);
    onAudit(presetUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="w-full max-w-4xl mx-auto space-y-3.5">
      {/* Search HUD Console */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="surface-hud rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all focus-within:border-emerald-500/50 focus-within:shadow-[0_0_24px_rgba(16,185,129,0.12)]">
          {/* Protocol & Input Field */}
          <div className="relative flex-1 flex items-center">
            <div
              className="ps-3 pe-2 text-zinc-500 flex items-center gap-1.5 select-none text-xs font-mono"
              dir="ltr"
            >
              <Globe2 className="size-4 text-emerald-400 stroke-[1.8]" />
              <span className="hidden sm:inline text-zinc-500 font-semibold">https://</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder={t.inputPlaceholder}
              disabled={isLoading}
              dir="ltr"
              aria-label="URL to audit"
              className="h-12 w-full bg-transparent pe-4 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50 text-start"
            />
          </div>

          {/* Submit Action Button - High Prominence Primary CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 px-7 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#06070A] text-xs font-extrabold uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] tracking-wide"
          >
            {isLoading ? (
              <>
                <span className="size-4 rounded-full border-2 border-[#06070A] border-t-transparent animate-spin" />
                <span>{t.auditingButton}</span>
              </>
            ) : (
              <>
                <span>{t.auditButton}</span>
                {isAr ? (
                  <ArrowLeft className="size-4 stroke-[2.5]" />
                ) : (
                  <ArrowRight className="size-4 stroke-[2.5]" />
                )}
              </>
            )}
          </button>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5 font-sans px-2 animate-in fade-in duration-150">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </form>

      {/* Quick Test Presets Rail */}
      <QuickPresetRail
        label={t.quickTestLabel}
        isLoading={isLoading}
        onSelectPreset={handleSelectPreset}
      />
    </div>
  );
}
