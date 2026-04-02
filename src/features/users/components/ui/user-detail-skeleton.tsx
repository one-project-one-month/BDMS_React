import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function UserDetailSkeleton() {
  return (
    <div className="overflow-hidden rounded-[10px] border">
      <Table>
        <TableBody>
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={`skeleton-${index}`} className="divide-x">
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
