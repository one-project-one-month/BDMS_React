import { Skeleton } from "@/components/ui/skeleton";

export default function DonorFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* row 1 */}
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />

        {/* row 2 */}
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />

        {/* row 3 */}
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />

        {/* full width fields */}
        <Skeleton className="h-10 w-full md:col-span-2" />
        <Skeleton className="h-10 w-full md:col-span-2" />
      </div>

      {/* buttons */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
