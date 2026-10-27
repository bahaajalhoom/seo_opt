'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import { SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';
import { Globe, Download, Menu, X, Award } from 'lucide-react';

interface AuditHeaderProps {
  lang: SupportedLang;
  onToggleLang: () => void;
  onExportReport?: () => void;
  hasReport?: boolean;
}

export function AuditHeader({
  lang,
  onToggleLang,
  onExportReport,
  hasReport = false,
}: AuditHeaderProps) {
  const t = translations[lang];
  const isAr = lang === 'ar';
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/', label: t.navAudit },
    { href: '/methodology', label: t.navMethodology },
    { href: '/about', label: t.navAbout },
    { href: '/terms', label: t.navTerms },
    { href: '/privacy', label: t.navPrivacy },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#050608]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Navigation Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <BrandLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    isActive
                      ? 'text-white bg-white/[0.08] font-bold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Elite Creator Attribution Pill */}
          <div className="flex items-center gap-2 bg-[#090C12] border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)]">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-200 font-semibold tracking-normal">
              {isAr ? 'المهندس: أحمد جلهوم' : 'Architect: Ahmad Jalhoom'}
            </span>
          </div>

          {/* Report Export Button */}
          {hasReport && onExportReport && (
            <button
              type="button"
              onClick={onExportReport}
              className="h-9 px-3 rounded-lg border border-white/[0.12] bg-[#0D0F14] hover:bg-[#12151C] text-xs text-zinc-200 transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 font-medium"
            >
              <Download className="size-3.5 rtl:-scale-x-100" />
              <span className="hidden sm:inline">{t.exportReport}</span>
            </button>
          )}

          {/* Language Direction Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="h-9 px-3 rounded-lg border border-white/[0.12] bg-[#0D0F14] hover:bg-[#12151C] text-xs text-zinc-200 transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40 font-medium"
            aria-label="Toggle language direction"
          >
            <Globe className="size-3.5 text-emerald-400" />
            <span className="font-semibold">{t.langToggle}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 rounded-lg border border-white/[0.1] bg-[#0D0F14] flex items-center justify-center text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-[#08090C] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
