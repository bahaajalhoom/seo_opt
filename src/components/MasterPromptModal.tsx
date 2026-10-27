'use client';

import * as React from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  X,
  Target,
  FileCode,
} from 'lucide-react';
import { AuditResult, SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';
import { generateMasterRepairPrompt } from '@/lib/promptGenerator';

interface MasterPromptModalProps {
  audit: AuditResult;
  lang: SupportedLang;
  isOpen: boolean;
  onClose: () => void;
}

export function MasterPromptModal({ audit, lang, isOpen, onClose }: MasterPromptModalProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const [copied, setCopied] = React.useState(false);
  const [promptLang, setPromptLang] = React.useState<SupportedLang>(lang);
  const [selectedTarget, setSelectedTarget] = React.useState<'Claude 3.7' | 'Cursor' | 'ChatGPT-4o' | 'Antigravity'>('Claude 3.7');

  const generatedPrompt = React.useMemo(() => {
    return generateMasterRepairPrompt(audit, promptLang);
  }, [audit, promptLang]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SEO-GEO-Master-Repair-Prompt-${audit.domain}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="surface-elevated-modal rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative border border-white/[0.12]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="size-5 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                  {t.modalTitle}
                </h3>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[11px] text-emerald-400">
                  <Target className="size-3" />
                  <span>Target: 100/100</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{t.modalSub}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeBtn}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Toolbar: Model Selector & Prompt Language */}
        <div className="px-5 sm:px-6 py-3 border-b border-white/[0.08] bg-[#0A0C12] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-mono text-[11px]">{t.targetModelLabel}</span>
            {(['Claude 3.7', 'Cursor', 'ChatGPT-4o', 'Antigravity'] as const).map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => setSelectedTarget(model)}
                className={`h-7 px-2.5 rounded-md font-mono text-[11px] transition-colors ${
                  selectedTarget === model
                    ? 'bg-emerald-500 text-[#08090C] font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {model}
              </button>
            ))}
          </div>

          {/* Prompt Language Toggle */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setPromptLang('ar')}
              className={`h-6 px-2.5 rounded text-[11px] font-medium transition-colors ${
                promptLang === 'ar' ? 'bg-[#0F1117] text-emerald-400 font-semibold' : 'text-zinc-400'
              }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setPromptLang('en')}
              className={`h-6 px-2.5 rounded text-[11px] font-medium transition-colors ${
                promptLang === 'en' ? 'bg-[#0F1117] text-emerald-400 font-semibold' : 'text-zinc-400'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Prompt Content Viewport */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-[#08090C]">
          <pre
            dir={promptLang === 'ar' ? 'rtl' : 'ltr'}
            className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed select-all"
          >
            {generatedPrompt}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0A0C12] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <FileCode className="size-4 text-emerald-400" />
            <span>
              {audit.issues.length} {isAr ? 'ملاحظة جاهزة للتنفيذ البرمجي' : 'items parsed for auto-fix'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="h-9 px-3.5 rounded-lg border border-white/[0.12] bg-[#0F1117] hover:bg-[#161922] text-xs font-medium text-zinc-200 transition-colors inline-flex items-center gap-1.5"
            >
              <Download className="size-3.5 rtl:-scale-x-100" />
              <span>{t.downloadPromptBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="h-9 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#08090C] text-xs font-semibold inline-flex items-center gap-1.5 transition-all active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="size-4 stroke-[2.5]" />
                  <span>{t.codeSnippetCopied}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 stroke-[2]" />
                  <span>{t.copyPromptBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
