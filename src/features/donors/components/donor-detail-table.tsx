import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDonorQueryOptions } from "../queries";

export default function DonorDetailTable({ id }: { id: number }) {
  const { data: donor } = useSuspenseQuery(getDonorQueryOptions(id));
  console.log("donor", donor);
  return (
    <>
      <div>
        <Button asChild variant={"outline"}>
          <Link to={"/admin/donors"}>Back to Donor List</Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-[10px] border">
        <Table>
          <TableBody>
            <TableRow className="divide-x">
              <TableCell>NIC No</TableCell>
              <TableCell>{donor?.nicNo ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Date of Birth</TableCell>
              <TableCell>{donor?.dateOfBirth ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Gender</TableCell>
              <TableCell>{donor?.gender ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Blood Group</TableCell>
              <TableCell>{donor?.bloodGroup ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Last Donation Date</TableCell>
              <TableCell>{donor?.lastDonationDate ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Address</TableCell>
              <TableCell>{donor?.address ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Emergency Contact</TableCell>
              <TableCell>{donor?.emergencyContact ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Emergency Phone</TableCell>
              <TableCell>{donor?.emergencyPhone ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Remarks</TableCell>
              <TableCell>{donor?.remarks ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Status</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-secondary",
                    donor?.isActive ? "bg-green-400" : "bg-destructive",
                  )}
                >
                  {donor?.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <Button asChild variant={"outline"}>
          <Link to={"/admin/donors"}>Back to Donor List</Link>
        </Button>
      </div>
    </>
  );
}
