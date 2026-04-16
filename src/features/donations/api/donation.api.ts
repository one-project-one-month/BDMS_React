import api from "@/api/axios-client";
import type { ApiResponse } from "@/features/auth/auth.types";
import { DONATION_ENDPOINTS } from "@/api/endpoints/donation.endpoints";
import type { Donation, StoreDonationPayload, UpdateDonationPayload, DonationStatus } from "../donation.types";

/** Get all donations */
export const getDonations = async (): Promise<Donation[]> => {
    const { data } = await api.get<ApiResponse<Donation[]>>(DONATION_ENDPOINTS.LIST);

    if (!data.isSuccess) throw new Error(data.message || `Failed to fetch ${DONATION_ENDPOINTS.LIST}`);

    return data.data;
}

/** Get a specific donation */
export const getDonation = async (id: number): Promise<Donation> => {
    const { data } = await api.get<ApiResponse<Donation>>(DONATION_ENDPOINTS.GET_BY_ID(id));

    if (!data.isSuccess) throw new Error(data.message || `Failed to fetch ${DONATION_ENDPOINTS.GET_BY_ID(id)}`);

    return data.data;
}

/** Store a donation record */
export const storeDonation = async (payload: StoreDonationPayload): Promise<Donation> => {
    const { data } = await api.post<ApiResponse<Donation>>(DONATION_ENDPOINTS.CREATE, payload);

    if (!data.isSuccess) throw new Error(data.message || `Failed to store ${DONATION_ENDPOINTS.CREATE}`);

    return data.data;
}

/** Update a specific donation */
export const updateDonation = async (payload: UpdateDonationPayload): Promise<Donation> => {
    const { data } = await api.put<ApiResponse<Donation>>(DONATION_ENDPOINTS.UPDATE, payload);

    if (!data.isSuccess) throw new Error(data.message || `Failed to update ${DONATION_ENDPOINTS.UPDATE}`);

    return data.data;
}

/** Delete a specific donation */
export const deleteDonation = async (id: number): Promise<boolean> => {
    const { data } = await api.delete<ApiResponse<null>>(
        DONATION_ENDPOINTS.DELETE,
        { data: { id } }
    );

    if (!data.isSuccess) throw new Error(data.message || `Failed to delete ${DONATION_ENDPOINTS.DELETE}`);

    return true;
}

/** Update a specific donation status */
export const updateDonationStatus = async (id: number, status: DonationStatus): Promise<Donation> => {
    const { data } = await api.patch<ApiResponse<Donation>>(DONATION_ENDPOINTS.UPDATE_STATUS(id), { status });

    if (!data.isSuccess) throw new Error(data.message || `Failed to update status for donation ${DONATION_ENDPOINTS.UPDATE_STATUS(id)}`);

    return data.data;
}

/** Create Appointment Placeholder */
export const createDonationAppointment = async (donationId: number, appointmentDate: string): Promise<boolean> => {
    // Note: Assuming a generic POST /Appointment/create or similar. Real implementation depends on the Appointment backend logic.
    const { data } = await api.post<ApiResponse<any>>("/Appointment/create", { donationId, appointmentDate });

    if (!data.isSuccess) throw new Error(data.message || `Failed to create appointment for donation ${donationId}`);

    return true;
}
