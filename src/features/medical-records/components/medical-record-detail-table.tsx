import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getDonationQueryOptions } from "@/features/donations/queries";
import { getHospitalQueryOptions } from "@/features/hospitals/queries";
import { getUserQueryOptions } from "@/features/users/queries";

import {
  deleteMedicalRecordMutationOptions,
  getMedicalRecordQueryOptions,
  medicalRecordKeys,
} from "../queries";

const getScreeningStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Approved";
    case 2:
      return "Rejected";
    default:
      return `Status ${status}`;
  }
};

const getScreeningStatusVariant = (status: number) => {
  switch (status) {
    case 1:
      return "default" as const;
    case 2:
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

const getResultLabel = (value: number) => {
  switch (value) {
    case 0:
      return "Negative";
    case 1:
      return "Positive";
    default:
      return `Result ${value}`;
  }
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export default function MedicalRecordDetailTable({ id }: { id: number }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: medicalRecord } = useSuspenseQuery(getMedicalRecordQueryOptions(id));
  const { data: donation } = useSuspenseQuery(
    getDonationQueryOptions(medicalRecord.donationId),
  );
  const { data: hospital } = useSuspenseQuery(
    getHospitalQueryOptions(medicalRecord.hospitalId),
  );
  const { data: screener } = useSuspenseQuery(
    getUserQueryOptions(medicalRecord.screenedBy),
  );

  const deleteMutation = useMutation({
    ...deleteMedicalRecordMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.list() });
      toast.success("Medical record deleted successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/medical-records");
    },
    onError: () => {
      toast.error("Failed to delete medical record.", {
        position: "bottom-right",
      });
    },
  });

  const handleConfirmDelete = () => {
    if (deleteMutation.isPending) return;
    deleteMutation.mutateAsync(medicalRecord.id);
  };

  return (
    <>
      <div className="overflow-hidden rounded-[10px] border">
        <Table>
          <TableBody>
            <TableRow className="divide-x">
              <TableCell>Medical Record ID</TableCell>
              <TableCell>#{medicalRecord.id}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Donation</TableCell>
              <TableCell>
                {donation?.donationCode
                  ? `${donation.donationCode} (#${medicalRecord.donationId})`
                  : `#${medicalRecord.donationId}`}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Hospital</TableCell>
              <TableCell>
                {hospital?.name
                  ? `${hospital.name} (#${medicalRecord.hospitalId})`
                  : `#${medicalRecord.hospitalId}`}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Hemoglobin Level</TableCell>
              <TableCell>{medicalRecord.hemoglobinLevel.toFixed(1)}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>HIV Result</TableCell>
              <TableCell>{getResultLabel(medicalRecord.hivResult)}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Hepatitis B Result</TableCell>
              <TableCell>
                {getResultLabel(medicalRecord.hepatitisBResult)}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Hepatitis C Result</TableCell>
              <TableCell>
                {getResultLabel(medicalRecord.hepatitisCResult)}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Malaria Result</TableCell>
              <TableCell>{getResultLabel(medicalRecord.malariaResult)}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Syphilis Result</TableCell>
              <TableCell>{getResultLabel(medicalRecord.syphilisResult)}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Screening Status</TableCell>
              <TableCell>
                <Badge
                  variant={getScreeningStatusVariant(
                    medicalRecord.screeningStatus,
                  )}
                >
                  {getScreeningStatusLabel(medicalRecord.screeningStatus)}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Screening Notes</TableCell>
              <TableCell className="whitespace-pre-wrap">
                {medicalRecord.screeningNotes || "-"}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Screened By</TableCell>
              <TableCell>
                {screener?.username
                  ? `${screener.username} (#${medicalRecord.screenedBy})`
                  : `#${medicalRecord.screenedBy}`}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Screening Date & Time</TableCell>
              <TableCell>{formatDateTime(medicalRecord.screeningAt)}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Created At</TableCell>
              <TableCell>{formatDateTime(medicalRecord.createdAt)}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Updated At</TableCell>
              <TableCell>{formatDateTime(medicalRecord.updatedAt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/admin/medical-records">Back to Medical Record List</Link>
        </Button>
        <Button asChild>
          <Link to={`/admin/medical-records/${medicalRecord.id}/edit`}>
            Edit Medical Record
          </Link>
        </Button>
        <Button
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
        >
          Delete Medical Record
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medical Record</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete
              medical record #{medicalRecord.id}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
