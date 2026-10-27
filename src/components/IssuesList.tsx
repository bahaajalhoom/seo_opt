'use client';

import * as React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Search,
  Filter,
  X,
  Code2,
  ArrowRight,
  ShieldAlert,
  FileCode2,
} from 'lucide-react';
import { AuditIssue, AuditCategory, IssueSeverity, SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';

interface IssuesListProps {
  issues: AuditIssue[];
  lang: SupportedLang;
  selectedCategory?: AuditCategory | 'all';
}

export function IssuesList({ issues, lang, selectedCategory = 'all' }: IssuesListProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [activeCategory, setActiveCategory] = React.useState<AuditCategory | 'all'>(selectedCategory);
  const [activeSeverity, setActiveSeverity] = React.useState<IssueSeverity | 'all'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = React.useState<string | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

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

  const filteredIssues = React.useMemo(() => {
    return issues.filter((issue) => {
      const matchCat = activeCategory === 'all' || issue.category === activeCategory;
      const matchSev = activeSeverity === 'all' || issue.severity === activeSeverity;
      const q = searchQuery.trim().toLowerCase();
      const title = (isAr ? issue.titleAr : issue.titleEn) || issue.title || '';
      const desc = (isAr ? issue.descriptionAr : issue.descriptionEn) || issue.description || '';
      const matchQuery =
        !q ||
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        (issue.codeSnippet && issue.codeSnippet.toLowerCase().includes(q));
      return matchCat && matchSev && matchQuery;
    });
  }, [issues, activeCategory, activeSeverity, searchQuery, isAr]);

  const handleCopyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const getSeverityBadge = (severity: IssueSeverity | 'good' | 'info' | string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          label: t.severities.critical,
          classes: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
          dot: 'bg-rose-500',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          label: t.severities.warning,
          classes: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
          dot: 'bg-amber-500',
        };
      case 'passed':
      default:
        return {
          icon: CheckCircle2,
          label: t.severities.passed,
          classes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
          dot: 'bg-emerald-500',
        };
    }
  };

  return (
    <div className="surface-hud rounded-3xl overflow-hidden space-y-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Control Header & Filters */}
      <div className="p-6 sm:p-7 border-b border-white/[0.08] space-y-5 bg-[#090B10]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span>{t.issuesListTitle}</span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400">
                {filteredIssues.length} / {issues.length}
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">{t.issuesListSub}</p>
          </div>

          {/* Quick Search Input with "/" shortcut */}
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchIssuesPlaceholder}
              aria-label="Filter findings"
              className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0D0F14] ps-10 pe-9 text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute end-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Filter Navigation Rails */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Categories Horizontal Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`h-8 px-3 rounded-xl text-xs font-mono transition-all ${
                activeCategory === 'all'
                  ? 'bg-emerald-500 text-[#06070A] font-bold shadow-[0_2px_10px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-white/[0.06]'
              }`}
            >
              {t.filterAll}
            </button>
            {(['seo', 'geo', 'performance', 'accessibility', 'security'] as AuditCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`h-8 px-3 rounded-xl text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-[#06070A] font-bold shadow-[0_2px_10px_rgba(16,185,129,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-white/[0.06]'
                }`}
              >
                {t.categories[cat]}
              </button>
            ))}
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Filter className="size-3.5 text-zinc-500 me-1 hidden sm:block" />
            {(['all', 'critical', 'warning', 'passed'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setActiveSeverity(sev)}
                className={`h-8 px-3 rounded-xl text-xs font-mono uppercase transition-all ${
                  activeSeverity === sev
                    ? 'bg-white/[0.12] text-white border border-white/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {sev === 'all' ? t.filterAll : t.severities[sev]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Issues Diagnostic Rows */}
      <div className="divide-y divide-white/[0.05]">
        {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => {
            const isExpanded = expandedId === issue.id;
            const badge = getSeverityBadge(issue.severity);
            const title = (isAr ? issue.titleAr : issue.titleEn) || issue.title || '';
            const desc = (isAr ? issue.descriptionAr : issue.descriptionEn) || issue.description || '';
            const impact = (isAr ? issue.impactAr : issue.impactEn) || issue.impact || '';
            const fix = (isAr ? issue.fixRecommendationAr : issue.fixRecommendationEn) || issue.recommendation || '';

            return (
              <div
                key={issue.id}
                className={`transition-colors ${
                  isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'
                }`}
              >
                {/* Issue Header Trigger */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-start p-5 sm:px-7 flex items-start sm:items-center justify-between gap-4 focus-visible:outline-none focus-visible:bg-white/[0.03]"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border shrink-0 font-bold ${badge.classes}`}
                    >
                      <span className={`size-1.5 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>

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
                    {/* Problem Description */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                        {t.problemLabel}
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed ps-1">{desc}</p>
                    </div>

                    {/* Technical & AI Search Impact */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400/90 block">
                        {t.impactLabel}
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed ps-1">{impact}</p>
                    </div>

                    {/* Recommendation Solution & Target File */}
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

                    {/* Production Code Solution Snippet */}
                    {issue.codeSnippet && (
                      <div className="mt-3 rounded-2xl border border-white/[0.08] bg-[#06070A] overflow-hidden">
                        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
                          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                            <Code2 className="size-3.5 text-emerald-400" />
                            <span>PRO FIX SNIPPET</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(issue.codeSnippet!, issue.id)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 hover:text-white px-2 py-0.5 rounded border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
                          >
                            {copiedSnippetId === issue.id ? (
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
                        <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed select-all text-start" dir="ltr">
                          <code>{issue.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="size-10 text-emerald-400 mx-auto stroke-[1.5]" />
            <p className="text-sm font-semibold text-zinc-200">{t.noMatchingIssuesTitle}</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">{t.noMatchingIssuesSub}</p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setActiveSeverity('all');
                setSearchQuery('');
              }}
              className="mt-2 inline-flex items-center h-8 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-zinc-200 transition-colors"
            >
              {t.resetFiltersBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
