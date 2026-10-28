'use client';

// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import { SupportedLang } from '@/types/audit';
import { translations } from '@/lib/translations';
import { Globe, Download, Menu, X } from 'lucide-react';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Add or edit navigation bar links here.
const NAV_ROUTES = [
  { href: '/', labelKey: 'navAudit' as const },
  { href: '/methodology', labelKey: 'navMethodology' as const },
  { href: '/about', labelKey: 'navAbout' as const },
  { href: '/terms', labelKey: 'navTerms' as const },
  { href: '/privacy', labelKey: 'navPrivacy' as const },
] as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface AuditHeaderProps {
  lang: SupportedLang;
  onToggleLang: () => void;
  onExportReport?: () => void;
  hasReport?: boolean;
}

interface NavLinksProps {
  pathname: string;
  t: (typeof translations)[SupportedLang];
  onItemClick?: () => void;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
// (Pure navigation formatting functions)

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function CreatorAttributionPill({ isAr }: { isAr: boolean }) {
  const text = isAr ? 'المهندس: أحمد جلهوم' : 'Architect: Ahmad Jalhoom';

  return (
    <div className="flex items-center gap-2 bg-[#090C12] border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)]">
      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-xs text-zinc-200 font-semibold tracking-normal">{text}</span>
    </div>
  );
}

function DesktopNavigation({ pathname, t }: NavLinksProps) {
  return (
    <nav className="hidden lg:flex items-center gap-1 text-xs">
      {NAV_ROUTES.map((route) => {
        const isActive = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              isActive
                ? 'text-white bg-white/[0.08] font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            {t[route.labelKey]}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNavDrawer({ pathname, t, onItemClick }: NavLinksProps) {
  return (
    <div className="lg:hidden border-b border-white/[0.08] bg-[#08090C] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
      {NAV_ROUTES.map((route) => {
        const isActive = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            onClick={onItemClick}
            className={`block px-3 py-2 rounded-lg text-xs font-medium ${
              isActive
                ? 'text-white bg-white/[0.08] font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {t[route.labelKey]}
          </Link>
        );
      })}
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#050608]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-6 sm:gap-8">
          <BrandLogo />
          <DesktopNavigation pathname={pathname} t={t} />
        </div>

        {/* Action Controls Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Creator Attribution */}
          <CreatorAttributionPill isAr={isAr} />

          {/* Export Report Trigger */}
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

          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="h-9 px-3 rounded-lg border border-white/[0.12] bg-[#0D0F14] hover:bg-[#12151C] text-xs text-zinc-200 transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40 font-medium"
            aria-label="Toggle language direction"
          >
            <Globe className="size-3.5 text-emerald-400" />
            <span className="font-semibold">{t.langToggle}</span>
          </button>

          {/* Mobile Menu Hamburger */}
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <MobileNavDrawer
          pathname={pathname}
          t={t}
          onItemClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
