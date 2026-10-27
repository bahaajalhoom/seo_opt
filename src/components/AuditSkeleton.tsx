'use client';

import * as React from 'react';

export function AuditSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading audit report" role="status">
      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Hero Gauge Skeleton */}
        <div className="lg:col-span-5 surface-carbon rounded-2xl p-7 h-96 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-3 w-28 bg-white/[0.06] rounded" />
            <div className="h-6 w-48 bg-white/[0.08] rounded" />
            <div className="h-3 w-full max-w-xs bg-white/[0.05] rounded" />
          </div>
          <div className="size-36 rounded-full bg-white/[0.05] border-8 border-white/[0.04] mx-auto my-4" />
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <div className="h-3 w-32 bg-white/[0.06] rounded" />
            <div className="h-5 w-20 bg-white/[0.06] rounded" />
          </div>
        </div>

        {/* Right Categories Grid Skeleton */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2 surface-carbon rounded-xl p-4 h-28 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="h-4 w-36 bg-white/[0.07] rounded" />
              <div className="h-6 w-12 bg-white/[0.07] rounded" />
            </div>
            <div className="h-1.5 w-full bg-white/[0.05] rounded" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="surface-carbon rounded-xl p-4 h-28 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-white/[0.07] rounded" />
                <div className="h-6 w-10 bg-white/[0.07] rounded" />
              </div>
              <div className="h-1.5 w-full bg-white/[0.05] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* GEO Card Skeleton */}
      <div className="surface-carbon rounded-2xl p-6 h-64 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="h-5 w-44 bg-white/[0.08] rounded" />
          <div className="h-4 w-28 bg-white/[0.06] rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 rounded-xl bg-white/[0.04]" />
          <div className="h-32 rounded-xl bg-white/[0.04]" />
        </div>
      </div>

      {/* Issues Worklist Skeleton */}
      <div className="surface-carbon rounded-2xl p-6 h-80 space-y-3">
        <div className="h-5 w-48 bg-white/[0.08] rounded mb-4" />
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="h-12 w-full rounded-lg bg-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
