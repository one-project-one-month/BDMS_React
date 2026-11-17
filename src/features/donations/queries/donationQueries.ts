import { queryOptions } from "@tanstack/react-query";
import { donationKeys } from "./donationKeys";
export { donationKeys };
import {
    getDonations,
    getDonationById,
    storeDonation,
    updateDonation,
    deleteDonation,
    updateDonationStatus,
    createDonationAppointment
} from "../api/donation.api";

export const getDonationsQueryOptions = queryOptions({
    queryKey: donationKeys.lists(),
    queryFn: getDonations,
});

export const getDonationQueryOptions = (id: number) => queryOptions({
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
    mutationFn: ({ id, status }: { id: number; status: import('../donation.types').DonationStatus }) => updateDonationStatus(id, status),
};

export const createDonationAppointmentMutationOptions = {
    mutationFn: ({ id, date }: { id: number; date: string }) => createDonationAppointment(id, date),
};
