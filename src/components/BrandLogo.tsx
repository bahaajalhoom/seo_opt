// ============================================================================
// 1. IMPORTS
// ============================================================================
import * as React from 'react';
import Link from 'next/link';

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
const BRAND_CONFIG = {
  name: 'CRAWLIX',
  edition: 'PRO',
  homeAriaLabel: 'CRAWLIX Home',
} as const;

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface BrandLogoProps {
  className?: string;
}

// ============================================================================
// 4. HELPER FUNCTIONS
// ============================================================================
// (Pure display formatters)

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================
function GeometricApertureMark() {
  return (
    <div className="relative size-10 rounded-xl bg-[#090C12] border border-emerald-500/35 flex items-center justify-center text-emerald-400 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.3),0_4px_16px_rgba(0,0,0,0.6)] transition-all group-hover:border-emerald-500/60 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-5 text-emerald-400"
      >
        {/* Hexagonal Isometric Prism Frame */}
        <path
          d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500/40"
        />
        {/* Dual Precision Crawl Vectors (Intersecting C & X geometry) */}
        <path
          d="M10 13L16 9.5L22 13M10 19L16 22.5L22 19"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-400"
        />
        {/* Center Laser Optics Beam */}
        <path
          d="M16 13.5V18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-emerald-300"
        />
        {/* Focal Precision Point */}
        <circle cx="16" cy="16" r="2" fill="currentColor" className="text-white" />
      </svg>

      {/* Ambient Optics Sensor Pip */}
      <span className="absolute -top-1 -end-1 size-2 rounded-full bg-emerald-400 ring-4 ring-[#050608]" />
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT
// ============================================================================
export function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group select-none ${className}`}
      aria-label={BRAND_CONFIG.homeAriaLabel}
    >
      <GeometricApertureMark />

      {/* Brand Typographic Identity */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors uppercase font-mono">
          {BRAND_CONFIG.name}
        </span>
        <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
          {BRAND_CONFIG.edition}
        </span>
      </div>
    </Link>
  );
}
