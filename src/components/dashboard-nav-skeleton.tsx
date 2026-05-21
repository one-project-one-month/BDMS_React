import { Skeleton } from "@/components/ui/skeleton";

export function DashboardNavSkeleton() {
  return (
    <div
      className="flex items-center gap-3 sm:gap-4 lg:gap-5"
      aria-hidden="true"
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
