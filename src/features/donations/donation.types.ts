import type { User, Hospital } from "@/features/users/user.types";

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type DonationStatus = 'pending' | 'cancelled' | 'approved' | 'screening' | 'rejected' | 'completed';

export interface Donation {
    id: number;
    donorId: number;
    hospitalId: number;
    bloodRequestId?: number | null;
    createdBy: number;
    donationCode?: string | null;
    bloodGroup: BloodGroup;
    unitsDonated?: number | null;
    donationDate: string;
    status: DonationStatus;
    approvedBy?: number | null;
    approvedAt?: string | null;
    remarks: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;

    // These fields would typically be hydrated by the backend to avoid n+1 network calls on the client
    donor?: User;
    hospital?: Hospital;
}

export interface StoreDonationPayload {
    donorId: number;
    hospitalId: number;
    bloodRequestId?: number | null;
    createdBy: number;
    donationCode?: string;
    bloodGroup: BloodGroup;
    unitsDonated?: number;
    donationDate: string;
    status: DonationStatus;
    remarks: string;
}

export interface UpdateDonationPayload extends StoreDonationPayload {
    id: number;
}
