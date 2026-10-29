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
import { Globe, Download, Menu, X, ChevronDown } from 'lucide-react';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
// Primary tools always visible on desktop
const CORE_ROUTES = [
  { href: '/', labelKey: 'navAudit' as const },
  { href: '/ui-ux', labelKey: 'navUiUx' as const },
] as const;

// Secondary documentation and legal routes
const SECONDARY_ROUTES = [
  { href: '/methodology', labelKey: 'navMethodology' as const },
  { href: '/about', labelKey: 'navAbout' as const },
  { href: '/terms', labelKey: 'navTerms' as const },
  { href: '/privacy', labelKey: 'navPrivacy' as const },
] as const;

// All routes combined for mobile drawer and full wide-screens
const ALL_ROUTES = [...CORE_ROUTES, ...SECONDARY_ROUTES] as const;

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
// Pure layout & styling helpers

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function CreatorAttributionPill({ isAr }: { isAr: boolean }) {
  const text = isAr ? 'المهندس: أحمد جلهوم' : 'Architect: Ahmad Jalhoom';

  return (
    <div className="hidden sm:flex items-center gap-2 bg-[#090C12] border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)] shrink-0 whitespace-nowrap select-none">
      <span className="size-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
      <span className="text-xs text-zinc-200 font-semibold tracking-normal">{text}</span>
    </div>
  );
}

function MorePagesDropdown({ pathname, t }: NavLinksProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isSecondaryActive = SECONDARY_ROUTES.some((r) => r.href === pathname);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`px-2.5 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1 text-xs shrink-0 whitespace-nowrap ${
          isSecondaryActive
            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 font-bold'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
        }`}
      >
        <span>{t.navMore}</span>
        <ChevronDown
          className={`size-3 transition-transform duration-150 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 end-0 w-44 rounded-xl border border-white/[0.1] bg-[#090C12] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5 backdrop-blur-xl">
          {SECONDARY_ROUTES.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/15 font-bold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>{t[route.labelKey]}</span>
                {isActive && <span className="size-1.5 rounded-full bg-emerald-400" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DesktopNavigation({ pathname, t }: NavLinksProps) {
  return (
    <nav className="hidden lg:flex items-center gap-1 text-xs shrink-0">
      {/* 1. Core Primary Tools (Always directly visible on all desktop sizes) */}
      {CORE_ROUTES.map((route) => {
        const isActive = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              isActive
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 font-bold shadow-sm'
                : 'text-zinc-200 hover:text-white hover:bg-white/[0.05] border border-transparent'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isActive ? 'bg-emerald-400' : 'bg-zinc-600'
              }`}
            />
            <span>{t[route.labelKey]}</span>
          </Link>
        );
      })}

      {/* 2. Secondary Routes: Direct on XL (1280px+), Dropdown on LG (1024px-1279px) */}
      <div className="hidden xl:flex items-center gap-1">
        {SECONDARY_ROUTES.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span>{t[route.labelKey]}</span>
            </Link>
          );
        })}
      </div>

      {/* Dropdown fallback on standard 1024px-1279px laptops to prevent header collision */}
      <div className="xl:hidden">
        <MorePagesDropdown pathname={pathname} t={t} />
      </div>
    </nav>
  );
}

function MobileNavDrawer({ pathname, t, onItemClick }: NavLinksProps) {
  return (
    <div className="lg:hidden border-b border-white/[0.08] bg-[#08090C] px-4 py-4 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
      {ALL_ROUTES.map((route) => {
        const isActive = pathname === route.href;
        const isCoreTool = route.href === '/' || route.href === '/ui-ux';
        return (
          <Link
            key={route.href}
            href={route.href}
            onClick={onItemClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold'
                : isCoreTool
                ? 'text-zinc-200 hover:text-white hover:bg-white/[0.04]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            {isCoreTool && (
              <span
                className={`size-1.5 rounded-full ${
                  isActive ? 'bg-emerald-400' : 'bg-zinc-600'
                }`}
              />
            )}
            <span>{t[route.labelKey]}</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6 min-w-0">
        {/* Brand Logo & Desktop Nav Cluster */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 min-w-0">
          <BrandLogo />
          <DesktopNavigation pathname={pathname} t={t} />
        </div>

        {/* Action Controls Cluster (Guaranteed Zero CLS & Zero Collision) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Creator Attribution */}
          <CreatorAttributionPill isAr={isAr} />

          {/* Export Report Trigger (Always rendered at fixed width to prevent CLS layout shift) */}
          {onExportReport && (
            <button
              type="button"
              onClick={hasReport ? onExportReport : undefined}
              disabled={!hasReport}
              title={hasReport ? t.exportReport : t.reportAvailableAfterAudit}
              aria-label={t.exportReport}
              className={`h-9 px-3 rounded-lg border text-xs transition-all inline-flex items-center gap-1.5 font-medium shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40 ${
                hasReport
                  ? 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] cursor-pointer'
                  : 'border-white/[0.08] bg-[#0D0F14]/50 text-zinc-500 cursor-not-allowed opacity-40'
              }`}
            >
              <Download
                className={`size-3.5 rtl:-scale-x-100 transition-colors ${
                  hasReport ? 'text-emerald-400' : 'text-zinc-500'
                }`}
              />
              <span className="hidden sm:inline">{t.exportReport}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="h-9 px-3 rounded-lg border border-white/[0.12] bg-[#0D0F14] hover:bg-[#12151C] text-xs text-zinc-200 transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40 font-medium shrink-0 whitespace-nowrap"
            aria-label="Toggle language direction"
          >
            <Globe className="size-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{t.langToggle}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 rounded-lg border border-white/[0.1] bg-[#0D0F14] flex items-center justify-center text-zinc-300 hover:text-white shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Accessible full list) */}
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
