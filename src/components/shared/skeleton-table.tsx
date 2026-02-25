import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable({ columns = 5 }: { columns?: number }) {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex justify-between px-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-48 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border overflow-hidden">
        {/* Header */}
        <div className="border-b bg-muted/40 px-3 py-3 flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`h-${i}`} className="h-4 flex-1" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 8 }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4 px-3 py-3 border-b last:border-0">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton key={`r-${rowIdx}-${colIdx}`} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`p-${i}`} className="h-8 w-8 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
