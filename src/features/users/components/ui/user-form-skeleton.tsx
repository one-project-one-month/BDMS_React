import { Skeleton } from "@/components/ui/skeleton";

export default function UserFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
