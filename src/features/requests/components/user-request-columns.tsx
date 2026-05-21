import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type {  BloodRequest } from "../request.types";
import {  statusTone } from "../request.constant";
import { formatBloodGroup, formatDate } from "../request.utils";

export const buildUserRequestColumns = (): ColumnDef<BloodRequest>[] => {
  return [
    {
      accessorKey: "bloodRequestCode",
      header: "Code",
    },
    {
      accessorKey: "patientName",
      header: "Patient",
    },
    {
      accessorKey: "hospitalName",
      header: "Hospital",
    },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
      cell: ({ row }) => formatBloodGroup(row.original.bloodGroup),
    },
    {
      accessorKey: "requiredDate",
      header: "Required Date",
      cell: ({ row }) => formatDate(row.original.requiredDate),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="secondary" className={statusTone[row.original.status]}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "formStatus",
      header: "Form Status",
      cell: ({ row }) => {
        const isCompleted = row.original.status === "fulfilled";
        return (
          <Badge variant={isCompleted ? "secondary" : "outline"}>
            {isCompleted ? "Completed" : "Not Completed"}
          </Badge>
        );
      },
    },
  ];
};
