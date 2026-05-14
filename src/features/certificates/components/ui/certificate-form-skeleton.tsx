import { Skeleton } from "@/components/ui/skeleton";

export default function CertificateFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-10 w-full md:col-span-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="h-24 w-full rounded-md border border-transparent">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
