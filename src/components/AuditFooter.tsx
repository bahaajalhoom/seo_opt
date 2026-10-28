'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';
import { ExternalLink, Award } from 'lucide-react';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Edit footer navigation groups, links, and runtime indicators here.
const PLATFORM_LINKS = [
  { href: '/', labelKey: 'navAudit' as const },
  { href: '/methodology', labelKey: 'navMethodology' as const },
  { href: '/about', labelKey: 'navAbout' as const },
] as const;

const LEGAL_LINKS = [
  { href: '/terms', labelKey: 'navTerms' as const },
  { href: '/privacy', labelKey: 'navPrivacy' as const },
] as const;

const RUNTIME_METADATA = [
  'Engine: Node.js 24 + Next 16',
  'SSRF Guard: Active (RFC 9457)',
  'Isolation: Ephemeral In-Memory',
] as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface AuditFooterProps {
  lang: SupportedLang;
}

interface CreatorCardProps {
  creatorRole: string;
  isAr: boolean;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
// (Pure display utilities)

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function CreatorBadgeCard({ creatorRole, isAr }: CreatorCardProps) {
  const roleTitle = isAr ? 'المهندس والمؤسس' : 'Lead Architect & Founder';

  return (
    <div className="rounded-xl border border-emerald-500/25 bg-[#090C11] p-3.5 space-y-2 max-w-sm shadow-[inset_0_1px_0_0_rgba(16,185,129,0.15)]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
          <Award className="size-3.5" />
          <span>{roleTitle}</span>
        </span>
        <span className="text-[11px] text-zinc-500 font-mono">2026</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-white tracking-tight">
          Ahmad Jalhoom · أحمد جلهوم
        </span>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">{creatorRole}</p>
    </div>
  );
}

function RuntimeTelemetryBox({ systemStatus, isAr }: { systemStatus: string; isAr: boolean }) {
  const sectionTitle = isAr ? 'حالة النظام والمعالجة' : 'Audit Runtime';

  return (
    <div className="lg:col-span-3 space-y-3">
      <span className="text-xs font-bold text-white block">{sectionTitle}</span>
      <div className="rounded-xl border border-white/[0.08] bg-[#07090D] p-3.5 space-y-2.5">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
          <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{systemStatus}</span>
        </div>
        <div className="text-[11px] text-zinc-400 font-mono space-y-1" dir="ltr">
          {RUNTIME_METADATA.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
export function AuditFooter({ lang }: AuditFooterProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050608] text-zinc-400 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Creator Showcase */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {t.footerTagline}
            </p>
            <CreatorBadgeCard creatorRole={t.creatorRole} isAr={isAr} />
          </div>

          {/* Col 2: Platform Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-bold text-white block">
              {isAr ? 'المنصة' : 'Platform'}
            </span>
            <ul className="space-y-2 text-xs">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-emerald-400 transition-colors">
                    {t[link.labelKey]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal & Standards */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-bold text-white block">
              {isAr ? 'المعايير والقوانين' : 'Legal & Trust'}
            </span>
            <ul className="space-y-2 text-xs">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-emerald-400 transition-colors">
                    {t[link.labelKey]}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://llmstxt.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>llms.txt Standard</span>
                  <ExternalLink className="size-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Engine Status */}
          <RuntimeTelemetryBox systemStatus={t.systemStatus} isAr={isAr} />
        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span>{t.footerCopyright}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-zinc-400">{t.officialBadge}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-emerald-400 font-bold">100% Anti-Slop Studio Craft</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
