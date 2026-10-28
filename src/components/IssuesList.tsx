'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Copy,
  Check,
  Search,
  Code2,
  FileCode2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { AuditIssue, AuditCategory, IssueSeverity, SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Customize category tabs order and severity badges styling here.
const SEVERITY_CONFIG = {
  critical: {
    icon: AlertCircle,
    labelKey: 'critical' as const,
    classes: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
    dot: 'bg-rose-500',
  },
  warning: {
    icon: AlertTriangle,
    labelKey: 'warning' as const,
    classes: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    dot: 'bg-amber-500',
  },
  passed: {
    icon: CheckCircle2,
    labelKey: 'passed' as const,
    classes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    dot: 'bg-emerald-500',
  },
} as const;

const CATEGORY_TABS: (AuditCategory | 'all')[] = [
  'all',
  'seo',
  'geo',
  'performance',
  'accessibility',
  'security',
];

const SEVERITY_FILTERS: (IssueSeverity | 'all')[] = ['all', 'critical', 'warning', 'passed'];

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface IssuesListProps {
  issues: AuditIssue[];
  lang: SupportedLang;
  selectedCategory?: AuditCategory | 'all';
  onOpenMasterPrompt?: () => void;
}

interface IssueRowProps {
  issue: AuditIssue;
  isExpanded: boolean;
  copiedId: string | null;
  lang: SupportedLang;
  t: (typeof translations)[SupportedLang];
  onToggle: () => void;
  onCopyCode: (code: string, id: string) => void;
}

interface FilterBarProps {
  activeCategory: AuditCategory | 'all';
  activeSeverity: IssueSeverity | 'all';
  searchQuery: string;
  totalFiltered: number;
  totalOriginal: number;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  t: (typeof translations)[SupportedLang];
  onCategoryChange: (cat: AuditCategory | 'all') => void;
  onSeverityChange: (sev: IssueSeverity | 'all') => void;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
}

// ============================================================================
// 4. HELPER FUNCTIONS & HOOKS
// ============================================================================
/**
 * Filters the audit issues list by category, severity, and text search.
 */
function filterIssues(
  issues: AuditIssue[],
  category: AuditCategory | 'all',
  severity: IssueSeverity | 'all',
  searchQuery: string,
  isAr: boolean
): AuditIssue[] {
  const query = searchQuery.trim().toLowerCase();

  return issues.filter((issue) => {
    const matchCategory = category === 'all' || issue.category === category;
    const matchSeverity = severity === 'all' || issue.severity === severity;

    if (!matchCategory || !matchSeverity) return false;
    if (!query) return true;

    const title = ((isAr ? issue.titleAr : issue.titleEn) || issue.title || '').toLowerCase();
    const desc = ((isAr ? issue.descriptionAr : issue.descriptionEn) || issue.description || '').toLowerCase();
    const code = (issue.codeSnippet || '').toLowerCase();

    return title.includes(query) || desc.includes(query) || code.includes(query);
  });
}

/**
 * Synthesizes a unified, multi-file AI prompt containing all detected issues,
 * target files, problem diagnoses, technical impacts, and exact fix snippets.
 */
function buildAllIssuesAiPrompt(issues: AuditIssue[], isAr: boolean): string {
  const header = isAr
    ? `# 🛠️ برومبت الإصلاح الشامل لكافة المشاكل البرمجية المكتشفة (${issues.length} مشكلة)
أنت مهندس برمجيات رئيسي (Principal Full-Stack & Technical SEO/GEO Architect).
مهمتك تطبيق الحلول البرمجية لكافة المشاكل التالية في المشروع بالكامل دفعة واحدة وبأعلى المعايير الهندسية:
1. تقديم كود إنتاجي كامل drop-in replacement لكل ملف مستهدف.
2. حل المشاكل دون التسبب في أي أخطاء جانبية.`
    : `# 🛠️ UNIFIED MASTER REPAIR PROMPT: Fix All ${issues.length} Detected Issues
You are a Principal Full-Stack & Technical SEO/GEO Architect.
Your task is to implement production-ready fixes for all detected technical issues in this project:
1. Provide full drop-in replacement code for each targeted source file.
2. Ensure zero regressions and strict compliance with modern web standards.`;

  const items = issues
    .map((issue, idx) => {
      const title = isAr ? issue.titleAr : issue.titleEn;
      const desc = isAr ? issue.descriptionAr : issue.descriptionEn;
      const impact = isAr ? issue.impactAr : issue.impactEn;
      const fix = isAr ? issue.fixRecommendationAr : issue.fixRecommendationEn;
      const targetFile = issue.targetFile
        ? `\n- **${isAr ? 'الملف المستهدف' : 'Target File'}:** \`${issue.targetFile}\``
        : '';
      const code = issue.codeSnippet ? `\n\`\`\`\n${issue.codeSnippet}\n\`\`\`` : '';

      return `### ${idx + 1}. [${issue.category.toUpperCase()}] ${title} (${issue.severity.toUpperCase()})${targetFile}
- **${isAr ? 'المشكلة' : 'Defect'}:** ${desc}
- **${isAr ? 'الأثر التقني' : 'Technical Impact'}:** ${impact}
- **${isAr ? 'الحل الهندسي' : 'Production Fix'}:** ${fix}${code}`;
    })
    .join('\n\n');

  return `${header}\n\n${items}`;
}

/**
 * Combines all production fix code snippets into a single unified code block.
 */
function buildAllCodeSnippetsOnly(issues: AuditIssue[]): string {
  const snippets = issues
    .filter((i) => Boolean(i.codeSnippet))
    .map((issue, idx) => {
      const fileHeader = issue.targetFile ? `// File: ${issue.targetFile}\n` : '';
      return `/* ============================================================================
 * ${idx + 1}. [${issue.category.toUpperCase()}] ${issue.titleEn || issue.title} (${issue.severity.toUpperCase()})
 * ${fileHeader}============================================================================ */
${issue.codeSnippet}`;
    })
    .join('\n\n');

  return snippets || '// No actionable code snippets found in the selected issues.';
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function SeverityBadgePill({
  severity,
  t,
}: {
  severity: IssueSeverity | string;
  t: (typeof translations)[SupportedLang];
}) {
  const config =
    severity === 'critical'
      ? SEVERITY_CONFIG.critical
      : severity === 'passed'
      ? SEVERITY_CONFIG.passed
      : SEVERITY_CONFIG.warning;

  const label = t.severities[config.labelKey];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border shrink-0 font-bold ${config.classes}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      <span>{label}</span>
    </span>
  );
}

function IssueCodeBlock({
  codeSnippet,
  issueId,
  copiedId,
  t,
  onCopy,
}: {
  codeSnippet: string;
  issueId: string;
  copiedId: string | null;
  t: (typeof translations)[SupportedLang];
  onCopy: (snippet: string, id: string) => void;
}) {
  const isCopied = copiedId === issueId;

  return (
    <div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#06070A] overflow-hidden">
      <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <Code2 className="size-3.5 text-emerald-400" />
          <span>PRO FIX SNIPPET</span>
        </span>
        <button
          type="button"
          onClick={() => onCopy(codeSnippet, issueId)}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 hover:text-white px-2 py-0.5 rounded border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
        >
          {isCopied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400">{t.codeSnippetCopied}</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>{t.copyFixSnippet}</span>
            </>
          )}
        </button>
      </div>
      <pre
        className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed select-all text-start"
        dir="ltr"
      >
        <code>{codeSnippet}</code>
      </pre>
    </div>
  );
}

function IssueRow({
  issue,
  isExpanded,
  copiedId,
  lang,
  t,
  onToggle,
  onCopyCode,
}: IssueRowProps) {
  const isAr = lang === 'ar';
  const title = (isAr ? issue.titleAr : issue.titleEn) || issue.title || '';
  const desc = (isAr ? issue.descriptionAr : issue.descriptionEn) || issue.description || '';
  const impact = (isAr ? issue.impactAr : issue.impactEn) || issue.impact || '';
  const fix = (isAr ? issue.fixRecommendationAr : issue.fixRecommendationEn) || issue.recommendation || '';

  return (
    <div className={`transition-colors ${isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}>
      {/* Accordion Trigger Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full text-start p-5 sm:px-7 flex items-start sm:items-center justify-between gap-4 focus-visible:outline-none focus-visible:bg-white/[0.03]"
      >
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <SeverityBadgePill severity={issue.severity} t={t} />

          <span className="text-xs font-mono text-zinc-500 uppercase hidden md:inline px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
            {issue.category}
          </span>

          <span className="text-sm font-semibold text-zinc-100 truncate tracking-tight">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {issue.codeSnippet && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 px-2 py-0.5 rounded-md">
              <Code2 className="size-3" />
              <span>FIX READY</span>
            </span>
          )}
          <ChevronDown
            className={`size-4 text-zinc-500 transition-transform duration-200 ${
              isExpanded ? 'rotate-180 text-white' : ''
            }`}
          />
        </div>
      </button>

      {/* Expanded Diagnostic Detail Drawer */}
      {isExpanded && (
        <div className="px-5 sm:px-7 pb-6 pt-2 space-y-4 border-t border-white/[0.04] bg-[#0A0C11] animate-in fade-in duration-150">
          {/* Defect Description */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
              {t.problemLabel}
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed ps-1">{desc}</p>
          </div>

          {/* Technical & Search Impact */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400/90 block">
              {t.impactLabel}
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed ps-1">{impact}</p>
          </div>

          {/* Recommended Fix */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                {t.solutionLabel}
              </span>
              {issue.targetFile && (
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] px-2.5 py-0.5 rounded-lg">
                  <FileCode2 className="size-3 text-emerald-400" />
                  <span>{issue.targetFile}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed ps-1">{fix}</p>
          </div>

          {/* Copyable Production Fix Snippet */}
          {issue.codeSnippet && (
            <IssueCodeBlock
              codeSnippet={issue.codeSnippet}
              issueId={issue.id}
              copiedId={copiedId}
              t={t}
              onCopy={onCopyCode}
            />
          )}
        </div>
      )}
    </div>
  );
}

function IssuesFilterBar({
  activeCategory,
  activeSeverity,
  searchQuery,
  totalFiltered,
  totalOriginal,
  searchInputRef,
  t,
  onCategoryChange,
  onSeverityChange,
  onSearchChange,
  onResetFilters,
}: FilterBarProps) {
  return (
    <div className="p-6 border-b border-white/[0.08] space-y-4">
      {/* Title & Live Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{t.issuesListTitle}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">{t.issuesListSub}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg tabular-nums">
            {totalFiltered} / {totalOriginal}
          </span>
          {(activeCategory !== 'all' || activeSeverity !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-mono text-emerald-400 hover:underline px-1"
            >
              {t.resetFiltersBtn}
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          {CATEGORY_TABS.map((catKey) => {
            const isActive = activeCategory === catKey;
            const label = catKey === 'all' ? t.filterAll : t.categories[catKey];
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => onCategoryChange(catKey)}
                className={`px-3 py-1.5 rounded-xl border transition-all text-xs ${
                  isActive
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-[#0A0C11] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Severity & Search Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Dropdown Filter */}
          <div className="flex items-center gap-1 bg-[#0A0C11] border border-white/[0.08] p-1 rounded-xl text-xs font-medium">
            {SEVERITY_FILTERS.map((sev) => {
              const isActive = activeSeverity === sev;
              const label = sev === 'all' ? t.filterAll : t.severities[sev];
              return (
                <button
                  key={sev}
                  type="button"
                  onClick={() => onSeverityChange(sev)}
                  className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                    isActive
                      ? 'bg-white/[0.1] text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="size-3.5 text-zinc-500 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchIssuesPlaceholder}
              className="w-full h-8 ps-8 pe-3 rounded-xl bg-[#0A0C11] border border-white/[0.08] text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BatchFixActionBanner({
  issuesCount,
  onCopyAllPrompt,
  onCopyAllSnippets,
  onOpenMasterModal,
  copiedPrompt,
  copiedSnippets,
  t,
}: {
  issuesCount: number;
  onCopyAllPrompt: () => void;
  onCopyAllSnippets: () => void;
  onOpenMasterModal?: () => void;
  copiedPrompt: boolean;
  copiedSnippets: boolean;
  t: (typeof translations)[SupportedLang];
}) {
  return (
    <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/30 via-[#0B0E14] to-[#0A0C11] border-b border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="space-y-1 max-w-xl">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-400" />
            <span>{t.batchFixBannerTitle}</span>
          </h4>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed ps-4">{t.batchFixBannerSub}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap shrink-0 w-full md:w-auto">
        <button
          type="button"
          onClick={onCopyAllPrompt}
          className="flex-1 md:flex-initial h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] active:scale-[0.98]"
        >
          {copiedPrompt ? (
            <>
              <Check className="size-4 text-zinc-950" />
              <span>{t.allIssuesPromptCopied}</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4 text-zinc-950" />
              <span>{t.copyAllIssuesPrompt}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCopyAllSnippets}
          className="h-10 px-3.5 rounded-xl bg-[#0E121A] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-zinc-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all"
        >
          {copiedSnippets ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400">{t.allCodeSnippetsCopied}</span>
            </>
          ) : (
            <>
              <FileCode2 className="size-3.5 text-zinc-400" />
              <span>{t.copyAllCodeSnippets}</span>
            </>
          )}
        </button>

        {onOpenMasterModal && (
          <button
            type="button"
            onClick={onOpenMasterModal}
            className="h-10 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs flex items-center justify-center gap-1.5 transition-colors"
            title={t.openMasterPromptBtn}
          >
            <ExternalLink className="size-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.openMasterPromptBtn}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
export function IssuesList({
  issues,
  lang,
  selectedCategory = 'all',
  onOpenMasterPrompt,
}: IssuesListProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const [categoryFilter, setCategoryFilter] = React.useState<AuditCategory | 'all'>(selectedCategory);
  const [severityFilter, setSeverityFilter] = React.useState<IssueSeverity | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = React.useState<string | null>(null);
  const [copiedAllPrompt, setCopiedAllPrompt] = React.useState(false);
  const [copiedAllSnippets, setCopiedAllSnippets] = React.useState(false);

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Sync external category click from ScoreBento if prop changes
  React.useEffect(() => {
    if (selectedCategory) {
      setCategoryFilter(selectedCategory);
    }
  }, [selectedCategory]);

  // Keyboard shortcut to focus search input with '/'
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --------------------------------------------------------------------------
  // DERIVED STATE
  // --------------------------------------------------------------------------
  const filteredIssues = React.useMemo(() => {
    return filterIssues(issues, categoryFilter, severityFilter, searchQuery, isAr);
  }, [issues, categoryFilter, severityFilter, searchQuery, isAr]);

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------
  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCopySnippet = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleCopyAllPrompt = () => {
    const targetIssues = filteredIssues.length > 0 ? filteredIssues : issues;
    const promptText = buildAllIssuesAiPrompt(targetIssues, isAr);
    navigator.clipboard.writeText(promptText);
    setCopiedAllPrompt(true);
    setTimeout(() => setCopiedAllPrompt(false), 2500);
  };

  const handleCopyAllSnippets = () => {
    const targetIssues = filteredIssues.length > 0 ? filteredIssues : issues;
    const codeText = buildAllCodeSnippetsOnly(targetIssues);
    navigator.clipboard.writeText(codeText);
    setCopiedAllSnippets(true);
    setTimeout(() => setCopiedAllSnippets(false), 2500);
  };

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setSeverityFilter('all');
    setSearchQuery('');
  };

  // --------------------------------------------------------------------------
  // RENDER VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="surface-hud rounded-3xl overflow-hidden">
      {/* 1-Click Complete Issue Resolution Banner */}
      <BatchFixActionBanner
        issuesCount={filteredIssues.length}
        onCopyAllPrompt={handleCopyAllPrompt}
        onCopyAllSnippets={handleCopyAllSnippets}
        onOpenMasterModal={onOpenMasterPrompt}
        copiedPrompt={copiedAllPrompt}
        copiedSnippets={copiedAllSnippets}
        t={t}
      />

      {/* Filter and Search Bar */}
      <IssuesFilterBar
        activeCategory={categoryFilter}
        activeSeverity={severityFilter}
        searchQuery={searchQuery}
        totalFiltered={filteredIssues.length}
        totalOriginal={issues.length}
        searchInputRef={searchInputRef}
        t={t}
        onCategoryChange={setCategoryFilter}
        onSeverityChange={setSeverityFilter}
        onSearchChange={setSearchQuery}
        onResetFilters={handleResetFilters}
      />

      {/* Issues Diagnostic Rows */}
      <div className="divide-y divide-white/[0.05]">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              isExpanded={expandedId === issue.id}
              copiedId={copiedSnippetId}
              lang={lang}
              t={t}
              onToggle={() => handleToggleExpand(issue.id)}
              onCopyCode={handleCopySnippet}
            />
          ))
        ) : (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="size-10 text-emerald-400 mx-auto stroke-[1.5]" />
            <p className="text-sm font-semibold text-zinc-200">{t.noMatchingIssuesTitle}</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">{t.noMatchingIssuesSub}</p>
          </div>
        )}
      </div>
    </div>
  );
}
