
const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded-md ${className}`}
    />
  );
};

const AnnouncementCreateFormLoader = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Active Switch */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>

      {/* Expired Date */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-48 rounded-md" />
      </div>
    </div>
  );
};

export default AnnouncementCreateFormLoader;