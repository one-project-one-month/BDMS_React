import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { getBloodRequestQueryOptions } from "../queries";
import { getUserQueryOptions } from "@/features/users/queries";
import { getHospitalQueryOptions } from "@/features/hospitals/queries";
import { getBloodRequestQueryOptions } from "../../queries";
// import { formatBloodGroup } from "../utils";

const URGENCY_STYLES: Record<string, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-400 text-yellow-900",
  low: "bg-green-400 text-green-900",
};
const formatBloodGroup = (bloodGroup: string): string => {
  return bloodGroup.replace("negative", "-").replace("positive", "+");
};

export default function BloodRequestDetailTable({ id }: { id: number }) {
  const { data: request } = useSuspenseQuery(getBloodRequestQueryOptions(id));
  console.log("blood request", request);
  const { data: user } = useSuspenseQuery(getUserQueryOptions(request.userId));
  const { data: hospital } = useSuspenseQuery(
    getHospitalQueryOptions(request.hospitalId),
  );

  return (
    <>
      <div className="overflow-hidden rounded-[10px] border">
        <Table>
          <TableBody>
            <TableRow className="divide-x">
              <TableCell>Name</TableCell>
              <TableCell>{user?.username ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Email</TableCell>
              <TableCell>{user?.email ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Hospital</TableCell>
              <TableCell>{hospital?.name ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Patient Name</TableCell>
              <TableCell>{request?.patientName ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Blood Group</TableCell>
              <TableCell className="capitalize">
                {formatBloodGroup(request?.bloodGroup) ?? "-"}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Units Required</TableCell>
              <TableCell>
                {request?.unitsRequired
                  ? `${request.unitsRequired} unit(s)`
                  : "-"}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Contact Phone</TableCell>
              <TableCell>{request?.contactPhone ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Required Date</TableCell>
              <TableCell>{request?.requiredDate ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Reason</TableCell>
              <TableCell>{request?.reason ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Urgency</TableCell>
              <TableCell>
                <Badge
                  className={
                    URGENCY_STYLES[request?.urgency?.toLowerCase()] ??
                    "bg-gray-300 text-gray-800"
                  }
                >
                  <span className="capitalize">{request?.urgency ?? "-"}</span>
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <Button asChild variant="outline">
          <Link to={"/admin/blood-requests"}>Back to Blood Request List</Link>
        </Button>
      </div>
    </>
  );
}
