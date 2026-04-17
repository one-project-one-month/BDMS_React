import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input"; // Assuming you have an Input component for filtering
import { Label } from "@/components/ui/label"; // Assuming you have a Label component

import DonationDataTable from "../../components/donation-data-table";
import { buildColumns } from "../../components/donation-columns";

import {
    deleteDonationMutationOptions,
    getDonationsQueryOptions,
    updateDonationStatusMutationOptions,
    createDonationAppointmentMutationOptions,
} from "../../queries/donationQueries";
import { donationKeys } from "../../queries/donationQueries";
import type { Donation, DonationStatus } from "../../donation.types";

export default function DonationListPage() {
    const queryClient = useQueryClient();

    // Filters state
    const [dateFilter, setDateFilter] = useState("");
    const [donorFilter, setDonorFilter] = useState("");
    const [hospitalFilter, setHospitalFilter] = useState("");

    // Fetch Donations
    const { data: donations, isPending } = useQuery(getDonationsQueryOptions);

    // Apply Client-Side Filtering as a demonstration
    const safeDonations = useMemo(() => {
        let items = donations ?? [];
        if (dateFilter) {
            items = items.filter(d => d.donationDate.includes(dateFilter));
        }
        if (donorFilter) {
            items = items.filter(d => {
                const name = d.donor?.username?.toLowerCase() || "";
                return name.includes(donorFilter.toLowerCase()) || d.donorId.toString().includes(donorFilter);
            });
        }
        if (hospitalFilter) {
            items = items.filter(d => {
                const name = d.hospital?.hospitalName?.toLowerCase() || "";
                return name.includes(hospitalFilter.toLowerCase()) || d.hospitalId.toString().includes(hospitalFilter);
            });
        }
        return items;
    }, [donations, dateFilter, donorFilter, hospitalFilter]);

    // Delete State
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

    // Appointment State
    const [appointmentOpen, setAppointmentOpen] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState("");

    const deleteMutation = useMutation({
        ...deleteDonationMutationOptions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
            setDeleteOpen(false);
            setSelectedDonation(null);
        },
    });

    const statusMutation = useMutation({
        ...updateDonationStatusMutationOptions,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
            toast.success(`Donation status updated to ${data.status}`, { position: "bottom-right" });
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update donation status.", { position: "bottom-right" });
        }
    });

    const appointmentMutation = useMutation({
        ...createDonationAppointmentMutationOptions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
            setAppointmentOpen(false);
            setSelectedDonation(null);
            setAppointmentDate("");
        },
    });

    const handleRequestDelete = (donation: Donation) => {
        setSelectedDonation(donation);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedDonation || deleteMutation.isPending) return;
        deleteMutation.mutateAsync(selectedDonation.id);
    };

    const handleRequestStatusChange = (donation: Donation, newStatus: DonationStatus) => {
        statusMutation.mutateAsync({ id: donation.id, status: newStatus });
    };

    const handleRequestCreateAppointment = (donation: Donation) => {
        setSelectedDonation(donation);
        setAppointmentOpen(true);
    };

    const handleConfirmAppointment = () => {
        if (!selectedDonation || !appointmentDate || appointmentMutation.isPending) return;
        appointmentMutation.mutateAsync({ id: selectedDonation.id, date: appointmentDate });
    };

    const columns = useMemo(
        () => buildColumns({
            onRequestDelete: handleRequestDelete,
            onRequestStatusChange: handleRequestStatusChange,
            onRequestCreateAppointment: handleRequestCreateAppointment
        }),
        [],
    );

    return (
        <Card className="px-8 py-6">
            <header className="flex items-center justify-between mb-6">
                <Typography as={"h1"} variant={"subtitle"}>
                    Donations
                </Typography>
                <Button asChild>
                    <Link to={"/admin/donations/create"}>Create Donation</Link>
                </Button>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-4 bg-secondary/10 rounded-lg">
                <div className="flex-1">
                    <Label htmlFor="dateFilter" className="text-xs mb-1 block">Date</Label>
                    <Input
                        id="dateFilter"
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        placeholder="Filter by date..."
                    />
                </div>
                <div className="flex-1">
                    <Label htmlFor="donorFilter" className="text-xs mb-1 block">Donor</Label>
                    <Input
                        id="donorFilter"
                        type="text"
                        value={donorFilter}
                        onChange={(e) => setDonorFilter(e.target.value)}
                        placeholder="Search donor..."
                    />
                </div>
                <div className="flex-1">
                    <Label htmlFor="hospitalFilter" className="text-xs mb-1 block">Hospital</Label>
                    <Input
                        id="hospitalFilter"
                        type="text"
                        value={hospitalFilter}
                        onChange={(e) => setHospitalFilter(e.target.value)}
                        placeholder="Search hospital..."
                    />
                </div>
                <div className="flex items-end">
                    <Button variant="outline" onClick={() => { setDateFilter(""); setDonorFilter(""); setHospitalFilter(""); }}>
                        Clear
                    </Button>
                </div>
            </div>

            <section>
                <DonationDataTable
                    columns={columns}
                    data={safeDonations}
                    isPending={isPending}
                />
            </section>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Donation</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. Are you sure you want to delete this donation record?
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

            {/* Create Appointment Dialog */}
            <Dialog open={appointmentOpen} onOpenChange={setAppointmentOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Appointment</DialogTitle>
                        <DialogDescription>
                            Schedule an appointment for donation {selectedDonation?.donationCode || selectedDonation?.id}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="appointmentDate">Appointment Date & Time</Label>
                        <Input
                            id="appointmentDate"
                            type="datetime-local"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAppointmentOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmAppointment}
                            disabled={appointmentMutation.isPending || !appointmentDate}
                            className="bg-primary text-white"
                        >
                            {appointmentMutation.isPending ? "Creating..." : "Confirm Appointment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}