import { Skeleton } from "@/components/ui/skeleton";
import { GlassCard } from "@/components/ui/glass-card";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-12 w-36 rounded-full" />
      </div>

      {/* Stats Row Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} className="p-4 h-24 flex items-center justify-between">
             <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-8" />
             </div>
             <Skeleton className="h-10 w-10 rounded-full" />
          </GlassCard>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GlassCard key={i} className="h-64 p-6 flex flex-col justify-between">
            <div className="flex justify-between">
               <Skeleton className="h-8 w-8 rounded-full" />
               <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-3">
               <Skeleton className="h-6 w-3/4" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}