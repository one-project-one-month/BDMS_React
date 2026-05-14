import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

import { buildColumns } from "../components/table/medical-record-columns";
import MedicalRecordDataTable from "../components/table/medical-record-data-table";
import type { MedicalRecord } from "../medical-records.types";
import {
  deleteMedicalRecordMutationOptions,
  getMedicalRecordsQueryOptions,
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

export default function MedicalRecordListPage() {
  const queryClient = useQueryClient();
  const { data: medicalRecords, isPending } = useQuery(
    getMedicalRecordsQueryOptions,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null,
  );

  const filteredRecords = useMemo(() => {
    let items = medicalRecords ?? [];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      items = items.filter((record) => {
        return (
          record.id.toString().includes(search) ||
          record.donationId.toString().includes(search) ||
          record.hospitalId.toString().includes(search) ||
          record.screenedBy.toString().includes(search) ||
          record.screeningNotes.toLowerCase().includes(search) ||
          getScreeningStatusLabel(record.screeningStatus)
            .toLowerCase()
            .includes(search)
        );
      });
    }

    if (dateFilter) {
      items = items.filter((record) => record.screeningAt.includes(dateFilter));
    }

    return items;
  }, [dateFilter, medicalRecords, searchTerm]);

  const deleteMutation = useMutation({
    ...deleteMedicalRecordMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.list() });
      toast.success("Medical record deleted successfully.", {
        position: "bottom-right",
      });
      setDeleteOpen(false);
      setSelectedRecord(null);
    },
    onError: () => {
      toast.error("Failed to delete medical record.", {
        position: "bottom-right",
      });
    },
  });

  const handleRequestDelete = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRecord || deleteMutation.isPending) return;
    deleteMutation.mutateAsync(selectedRecord.id);
  };

  const columns = useMemo(
    () =>
      buildColumns({
        onRequestDelete: handleRequestDelete,
      }),
    [],
  );

  return (
    <Card className="px-8 py-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <Typography as="h1" variant="subtitle">
          Medical Records
        </Typography>
        <Button asChild>
          <Link to="/admin/medical-records/create">Add Record</Link>
        </Button>
      </header>

      <section className="mb-4 flex flex-col gap-4 rounded-lg bg-secondary/10 p-4 md:flex-row">
        <div className="flex-1">
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="medical-record-search"
          >
            Search
          </label>
          <Input
            id="medical-record-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            placeholder="Search by record, donation, hospital, screener, status, or note"
          />
        </div>

        <div className="w-full md:max-w-[240px]">
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="medical-record-date"
          >
            Screening Date
          </label>
          <Input
            id="medical-record-date"
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.currentTarget.value)}
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setDateFilter("");
            }}
          >
            Clear
          </Button>
        </div>
      </section>

      <section>
        <MedicalRecordDataTable
          columns={columns}
          data={filteredRecords}
          isPending={isPending}
        />
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medical Record</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete
              medical record #{selectedRecord?.id ?? ""}?
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
    </Card>
  );
}
