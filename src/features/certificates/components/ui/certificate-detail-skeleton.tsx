import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function CertificateDetailSkeleton() {
  return (
    <div className="overflow-hidden rounded-[10px] border">
      <Table>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={`certificate-detail-skeleton-${index}`} className="divide-x">
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
