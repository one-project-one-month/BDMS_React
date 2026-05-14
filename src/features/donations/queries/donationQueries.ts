import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createAppointmentFromDonation } from "@/features/appointments/api/appointment.api";
import {
  getDonations,
  getDonationById,
  storeDonation,
  updateDonation,
  deleteDonation,
  updateDonationStatus,
} from "../api/donation.api";

export const donationKeys = {
  all: ["donations"] as const,
  lists: () => [...donationKeys.all, "list"] as const,
  list: (filters: string) => [...donationKeys.lists(), { filters }] as const,
  details: () => [...donationKeys.all, "detail"] as const,
  detail: (id: number) => [...donationKeys.details(), id] as const,
};

export const getDonationsQueryOptions = queryOptions({
  queryKey: donationKeys.lists(),
  queryFn: getDonations,
});

export const getDonationQueryOptions = (id: number) =>
  queryOptions({
    queryKey: donationKeys.detail(id),
    queryFn: () => getDonationById(id),
  });

export const storeDonationMutationOptions = {
  mutationFn: storeDonation,
};

export const updateDonationMutationOptions = {
  mutationFn: updateDonation,
};

export const deleteDonationMutationOptions = {
  mutationFn: deleteDonation,
};

export const updateDonationStatusMutationOptions = {
  mutationFn: ({
    id,
    status,
  }: {
    id: number;
    status: import("../donation.types").DonationStatus;
  }) => updateDonationStatus(id, status),
};

export const createDonationAppointmentMutationOptions = mutationOptions({
  mutationFn: ({
    donationId,
    remarks,
  }: {
    donationId: number;
    remarks?: string;
  }) => createAppointmentFromDonation(donationId, { remarks }),
});
