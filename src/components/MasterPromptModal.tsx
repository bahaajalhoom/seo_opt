'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
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

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
const TARGET_MODELS = ['Claude 3.7', 'Cursor', 'ChatGPT-4o', 'Antigravity'] as const;
type TargetModel = (typeof TARGET_MODELS)[number];

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface MasterPromptModalProps {
  audit: AuditResult;
  lang: SupportedLang;
  isOpen: boolean;
  onClose: () => void;
}

interface ModalHeaderProps {
  title: string;
  subtitle: string;
  closeAriaLabel: string;
  onClose: () => void;
}

interface ModalToolbarProps {
  selectedTarget: TargetModel;
  promptLang: SupportedLang;
  copied: boolean;
  t: (typeof translations)[SupportedLang];
  onSelectTarget: (model: TargetModel) => void;
  onSelectPromptLang: (lang: SupportedLang) => void;
  onCopy: () => void;
  onDownload: () => void;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
/**
 * Triggers a client-side download of the synthesized repair prompt as markdown.
 */
function downloadPromptMarkdown(markdownText: string, domain: string): void {
  const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = `CRAWLIX-Master-Repair-Prompt-${domain}.md`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function ModalHeader({ title, subtitle, closeAriaLabel, onClose }: ModalHeaderProps) {
  return (
    <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Sparkles className="size-5 stroke-[1.8]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              {title}
            </h3>
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[11px] text-emerald-400">
              <Target className="size-3" />
              <span>Target: 100/100</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{subtitle}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={closeAriaLabel}
        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}

function ModalToolbar({
  selectedTarget,
  promptLang,
  copied,
  t,
  onSelectTarget,
  onSelectPromptLang,
  onCopy,
  onDownload,
}: ModalToolbarProps) {
  return (
    <div className="px-5 sm:px-6 py-3 border-b border-white/[0.08] bg-[#0A0C12] flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Target Model Pills */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-500 font-medium">{t.targetModelLabel}</span>
        <div className="flex items-center gap-1">
          {TARGET_MODELS.map((model) => (
            <button
              key={model}
              type="button"
              onClick={() => onSelectTarget(model)}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium text-[11px] ${
                selectedTarget === model
                  ? 'bg-emerald-500/20 border border-emerald-500/35 text-emerald-300 font-bold'
                  : 'bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Language of Generated Prompt */}
        <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => onSelectPromptLang('en')}
            className={`px-2 py-0.5 rounded ${
              promptLang === 'en'
                ? 'bg-white/[0.1] text-white font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onSelectPromptLang('ar')}
            className={`px-2 py-0.5 rounded ${
              promptLang === 'ar'
                ? 'bg-white/[0.1] text-white font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            AR
          </button>
        </div>

        {/* Download File */}
        <button
          type="button"
          onClick={onDownload}
          className="h-8 px-3 rounded-lg border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-200 text-xs inline-flex items-center gap-1.5 transition-colors font-medium"
        >
          <Download className="size-3.5" />
          <span className="hidden sm:inline">{t.downloadPromptBtn}</span>
        </button>

        {/* Copy Prompt */}
        <button
          type="button"
          onClick={onCopy}
          className="h-8 px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#06070A] text-xs font-bold inline-flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-[0_2px_12px_rgba(16,185,129,0.25)]"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span>{copied ? t.codeSnippetCopied : t.copyPromptBtn}</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
export function MasterPromptModal({
  audit,
  lang,
  isOpen,
  onClose,
}: MasterPromptModalProps) {
  const t = translations[lang];

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const [copied, setCopied] = React.useState(false);
  const [promptLang, setPromptLang] = React.useState<SupportedLang>(lang);
  const [selectedTarget, setSelectedTarget] = React.useState<TargetModel>('Claude 3.7');

  // --------------------------------------------------------------------------
  // KEYBOARD ACCESSIBILITY
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // --------------------------------------------------------------------------
  // DERIVED STATE
  // --------------------------------------------------------------------------
  const generatedPrompt = React.useMemo(() => {
    return generateMasterRepairPrompt(audit, promptLang);
  }, [audit, promptLang]);

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDownload = () => {
    downloadPromptMarkdown(generatedPrompt, audit.domain);
  };

  // --------------------------------------------------------------------------
  // RENDER VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="surface-elevated-modal rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative border border-white/[0.12]">
        {/* Modal Header */}
        <ModalHeader
          title={t.modalTitle}
          subtitle={t.modalSub}
          closeAriaLabel={t.closeBtn}
          onClose={onClose}
        />

        {/* Modal Toolbar */}
        <ModalToolbar
          selectedTarget={selectedTarget}
          promptLang={promptLang}
          copied={copied}
          t={t}
          onSelectTarget={setSelectedTarget}
          onSelectPromptLang={setPromptLang}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />

        {/* Prompt Output Viewport */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#06070A] font-mono text-xs text-zinc-300 leading-relaxed space-y-4 select-all text-start" dir="ltr">
          <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-zinc-300">
            {generatedPrompt}
          </pre>
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 sm:px-6 py-3 border-t border-white/[0.08] bg-[#0A0C12] flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5 font-mono">
            <FileCode className="size-3.5 text-emerald-400" />
            <span>Deterministic Prompt Payload: {generatedPrompt.length} chars</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">100% Score Ready</span>
        </div>
      </div>
    </div>
  );
}
