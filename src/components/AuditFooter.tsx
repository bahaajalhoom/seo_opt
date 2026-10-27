'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';
import { ExternalLink, Award, ShieldCheck } from 'lucide-react';

interface AuditFooterProps {
  lang: SupportedLang;
}

export function AuditFooter({ lang }: AuditFooterProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050608] text-zinc-400 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Creator Showcase (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {t.footerTagline}
            </p>

            {/* Creator Badge Box */}
            <div className="rounded-xl border border-emerald-500/25 bg-[#090C11] p-3.5 space-y-2 max-w-sm shadow-[inset_0_1px_0_0_rgba(16,185,129,0.15)]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <Award className="size-3.5" />
                  <span>{isAr ? 'المهندس والمؤسس' : 'Lead Architect & Founder'}</span>
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">2026</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-white tracking-tight">
                  Ahmad Jalhoom · أحمد جلهوم
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {t.creatorRole}
              </p>
            </div>
          </div>

          {/* Col 2: Platform Navigation (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-bold text-white block">
              {isAr ? 'المنصة' : 'Platform'}
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  {t.navAudit}
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-emerald-400 transition-colors">
                  {t.navMethodology}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  {t.navAbout}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Standards (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-bold text-white block">
              {isAr ? 'المعايير والقوانين' : 'Legal & Trust'}
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  {t.navTerms}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  {t.navPrivacy}
                </Link>
              </li>
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

          {/* Col 4: Engine Status (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-bold text-white block">
              {isAr ? 'حالة النظام والمعالجة' : 'Audit Runtime'}
            </span>
            <div className="rounded-xl border border-white/[0.08] bg-[#07090D] p-3.5 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{t.systemStatus}</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono space-y-1" dir="ltr">
                <div>Engine: Node.js 24 + Next 16</div>
                <div>SSRF Guard: Active (RFC 9457)</div>
                <div>Isolation: Ephemeral In-Memory</div>
              </div>
            </div>
          </div>
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
