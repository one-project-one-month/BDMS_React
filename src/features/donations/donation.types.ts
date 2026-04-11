import type { User, Hospital } from "@/features/users/user.types";

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type DonationStatus = 'pending' | 'cancelled' | 'approved' | 'screening' | 'rejected' | 'completed';

export interface Donation {
    id: number;
    donor_id: number;
    hospital_id: number;
    blood_request_id?: number | null;
    created_by: number;
    donation_code?: string | null;
    blood_group: BloodGroup;
    units_donated?: number | null;
    donation_date: string;
    status: DonationStatus;
    approved_by?: number | null;
    approved_at?: string | null;
    remarks: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    // These fields would typically be hydrated by the backend to avoid n+1 network calls on the client
    donor?: User;
    hospital?: Hospital;
}

export interface StoreDonationPayload {
    donor_id: number;
    hospital_id: number;
    blood_request_id?: number | null;
    donation_code?: string;
    blood_group: BloodGroup;
    units_donated?: number;
    donation_date: string;
    status: DonationStatus;
    remarks: string;
}

export interface UpdateDonationPayload extends StoreDonationPayload {
    id: number;
}
