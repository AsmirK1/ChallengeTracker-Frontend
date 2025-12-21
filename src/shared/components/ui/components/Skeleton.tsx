import { type ReactNode } from "react";
import type { SkeletonProps } from "../schemas";

// Skeleton component for loading placeholders
export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div
    className={`animate-pulse bg-slate-800 rounded ${className}`}
    aria-hidden="true"
  />
);

// Skeleton text line component
export const SkeletonText = ({ className = "" }: SkeletonProps) => (
  <Skeleton className={`h-4 ${className}`} />
);

// Skeleton card component
export const SkeletonCard = () => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-8 w-20 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

// Skeleton list component
export const SkeletonList = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4" role="status" aria-label="Loading...">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

// Skeleton page layout component
export const SkeletonPage = ({ children }: { children?: ReactNode }) => (
  <main className="min-h-[calc(100vh-4rem)] bg-transparent text-slate-100 px-4 py-8">
    <div className="max-w-4xl mx-auto">
      {children ?? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/2" />
          <SkeletonList count={3} />
        </div>
      )}
    </div>
  </main>
);

// Skeleton component for challenge detail page
export const SkeletonChallengeDetail = () => (
  <main className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 px-4 py-8">
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4"
          >
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </main>
);

// Skeleton component for dashboard page
export const SkeletonDashboard = () => (
  <main className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 px-4 py-8">
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome section */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-6"
          >
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-16" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <SkeletonList count={2} />
      </div>
    </div>
  </main>
);

// Skeleton form component
export const SkeletonForm = () => (
  <div className="space-y-6 max-w-lg mx-auto">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    ))}
    <Skeleton className="h-12 w-full rounded-full" />
  </div>
);
