'use client';

import * as React from 'react';
import { ArrowRight, ArrowLeft, AlertCircle, Globe2 } from 'lucide-react';
import { SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';

interface UrlInputBarProps {
  lang: SupportedLang;
  isLoading: boolean;
  onAudit: (url: string) => void;
}

export function UrlInputBar({ lang, isLoading, onAudit }: UrlInputBarProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const [url, setUrl] = React.useState('');
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const presets = [
    { label: 'linear.app', url: 'https://linear.app' },
    { label: 'github.com', url: 'https://github.com' },
    { label: 'wikipedia.org', url: 'https://wikipedia.org' },
    { label: 'docs.anthropic.com', url: 'https://docs.anthropic.com' },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setValidationError(t.urlEmptyError);
      inputRef.current?.focus();
      return;
    }

    let candidate = trimmed;
    if (!candidate.startsWith('http://') && !candidate.startsWith('https://')) {
      candidate = `https://${candidate}`;
    }

    try {
      const parsed = new URL(candidate);
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        setValidationError(t.urlInvalidError);
        return;
      }
      onAudit(candidate);
    } catch {
      setValidationError(t.urlInvalidError);
    }
  };

  const handlePresetClick = (presetUrl: string) => {
    setUrl(presetUrl);
    setValidationError(null);
    onAudit(presetUrl);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3.5">
      {/* Search HUD Console */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="surface-hud rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all focus-within:border-emerald-500/50 focus-within:shadow-[0_0_24px_rgba(16,185,129,0.12)]">
          {/* Input field with protocol chip */}
          <div className="relative flex-1 flex items-center">
            <div className="ps-3 pe-2 text-zinc-500 flex items-center gap-1.5 select-none text-xs font-mono" dir="ltr">
              <Globe2 className="size-4 text-emerald-400 stroke-[1.8]" />
              <span className="hidden sm:inline text-zinc-500 font-semibold">https://</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder={t.inputPlaceholder}
              disabled={isLoading}
              dir="ltr"
              aria-label="URL to audit"
              className="h-12 w-full bg-transparent pe-4 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50 text-start"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#06070A] text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none shrink-0 shadow-[0_2px_12px_rgba(16,185,129,0.25)]"
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

        {/* Inline Field Validation Error */}
        {validationError && (
          <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5 font-sans px-2 animate-in fade-in duration-150">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </form>

      {/* Quick Test Presets Rail */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
        <span className="text-zinc-400 text-xs font-medium shrink-0">
          {t.quickTestLabel}
        </span>
        <div className="flex flex-wrap items-center gap-1.5" dir="ltr">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePresetClick(preset.url)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-[#0D0F14] hover:bg-[#12151C] hover:border-emerald-500/30 text-zinc-300 text-xs font-mono transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
