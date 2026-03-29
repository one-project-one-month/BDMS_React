import { Skeleton } from "@/components/ui/skeleton";

interface SidebarSkeletonProps {
  count?: number;
}

export function SidebarSkeleton({ count = 8 }: SidebarSkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <div className="flex items-center justify-end ps-20" aria-hidden="true">
      <nav className="flex flex-1 flex-col items-end gap-2">
        {items.map((_, index) => (
          <div
            key={`sidebar-skeleton-${index}`}
            className="flex w-full items-center gap-4 py-3 ps-4 pe-2 rounded-s-[10px]"
          >
            <Skeleton className="size-5 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-30" />
          </div>
        ))}
      </nav>
    </div>
  );
}
