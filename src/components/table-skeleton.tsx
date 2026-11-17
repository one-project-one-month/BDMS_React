import { Skeleton } from "./ui/skeleton";
import { TableCell, TableRow } from "./ui/table";

type TableSkeletonProps = {
  columns: number | readonly unknown[];
  rows?: number;
  showIndex?: boolean;
  showActions?: boolean;
};

export default function TableSkeleton({
  columns,
  rows = 10,
  showIndex = true,
  showActions = true,
}: TableSkeletonProps) {
  const columnCount = typeof columns === "number" ? columns : columns.length;

  return Array.from({ length: rows }).map((_, rowIndex) => (
    <TableRow key={`skeleton-${rowIndex}`}>
      {showIndex ? (
        <TableCell>
          <Skeleton className="h-4 w-6" />
        </TableCell>
      ) : null}
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
      {showActions ? (
        <TableCell>
          <Skeleton className="h-4 w-10" />
        </TableCell>
      ) : null}
    </TableRow>
  ));
}
