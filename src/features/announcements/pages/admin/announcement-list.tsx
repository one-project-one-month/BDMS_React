import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import AnnouncementDataTable from "../../components/table/announcement-data-table";
import { buildColumns } from "../../components/table/announcement-columns";

import {
  announcementKeys,
  deleteAnnouncementMutationOptions,
  getAnnouncementQueryOptions,
} from "../../queries";

import type { Announcement } from "../../announcement.types";

export default function AnnouncementListPage() {
  const queryClient = useQueryClient();
  const { data: announcements, isPending } = useQuery(
    getAnnouncementQueryOptions,
  );
  const safeAnnouncements = announcements ?? [];

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const deleteMutation = useMutation({
    ...deleteAnnouncementMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.list() });
      toast.success("Announcement deleted successfully.", {
        position: "bottom-right",
      });
      setDeleteOpen(false);
      setSelectedAnnouncement(null);
    },
  });

  const handleRequestDelete = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedAnnouncement || deleteMutation.isPending) return;
    deleteMutation.mutateAsync(selectedAnnouncement.id);
  };

  const columns = useMemo(
    () =>
      buildColumns({
        onRequestDelete: handleRequestDelete,
      }),
    [],
  );

  return (
    <Card className="px-4 sm:px-6 md:px-8 py-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Announcement List
        </Typography>
        <Button asChild className="w-full sm:w-auto text-center justify-center">
          <Link to={"/admin/announcements/create"}>Create Announcement</Link>
        </Button>
      </header>

      <section>
        <AnnouncementDataTable
          columns={columns}
          data={safeAnnouncements}
          isPending={isPending}
        />
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete{" "}
              <span className="font-medium">
                {selectedAnnouncement?.title ?? "this announcement"}
              </span>
              ?
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
              className="hover:bg-dark-primary"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
