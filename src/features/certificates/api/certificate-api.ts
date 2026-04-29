/** @author [NwayOoPyaeZo] */

import api from "@/api/axios-client";
import type { ApiResponse } from "@/features/auth/auth.types";
import { CERTIFICATE_ENDPOINTS } from "@/api/endpoints/certificate.endpoints";
import { DONATION_ENDPOINTS } from "@/api/endpoints/donation.endpoints";
import { DONOR_ENDPOINTS } from "@/api/endpoints/donor.endpoints";
import type { Certificate, Donor, GenerateCertificatePayload } from "../certificate.types";
import { extractApiErrorMessage } from "../utils/errorUtils";

const COMPLETED_DONATION_RULE_TEXT = "donor must have at least one completed donation";

type DonationRecord = {
    donorId?: number | string;
    status?: string;
};

const unwrapSuccessfulResponse = <T>(response: ApiResponse<T>, fallbackMessage: string): T => {
    if (!response.isSuccess) {
        throw new Error(response.message || fallbackMessage);
    }

    return response.data;
};

const donorHasCompletedDonation = async (donorId: number): Promise<boolean> => {
    const { data } = await api.get<ApiResponse<DonationRecord[]>>(
        DONATION_ENDPOINTS.LIST
    );

    if (!data.isSuccess) {
        return false;
    }

    return (data.data ?? []).some((donation) => {
        const donationDonorId = Number(donation?.donorId);
        const status = String(donation?.status ?? "").toLowerCase();
        return donationDonorId === donorId && status === "completed";
    });
};

/** Get all certificates for a specific donor */
export const getCertificatesByDonor = async (donorId: string | number): Promise<Certificate[]> => {
    const { data } = await api.get<ApiResponse<Certificate[]>>(
        CERTIFICATE_ENDPOINTS.GET_BY_DONOR(donorId)
    );

    return unwrapSuccessfulResponse(
        data,
        `Failed to fetch ${CERTIFICATE_ENDPOINTS.GET_BY_DONOR(donorId)}`
    );
};

/** Get a specific certificate */
export const getCertificateById = async (id: string | number): Promise<Certificate> => {
    const { data } = await api.get<ApiResponse<Certificate>>(
        CERTIFICATE_ENDPOINTS.GET_BY_ID(id)
    );

    return unwrapSuccessfulResponse(
        data,
        `Failed to fetch ${CERTIFICATE_ENDPOINTS.GET_BY_ID(id)}`
    );
};

/** Generate a new certificate */
export const generateCertificate = async (payload: GenerateCertificatePayload): Promise<Certificate> => {
    try {
        const { data } = await api.post<ApiResponse<Certificate>>(
            CERTIFICATE_ENDPOINTS.GENERATE,
            payload
        );

        if (!data.isSuccess || data.isError) {
            throw new Error(data.message || `Failed to generate ${CERTIFICATE_ENDPOINTS.GENERATE}`);
        }

        return data.data;
    } catch (error) {
        const message = extractApiErrorMessage(error)?.toLowerCase();

        if (message?.includes(COMPLETED_DONATION_RULE_TEXT)) {
            const hasCompletedDonation = await donorHasCompletedDonation(payload.donorId);

            if (hasCompletedDonation) {
                throw new Error(
                    `Backend rejected donor #${payload.donorId} even though a completed donation exists. Please update /api/Certificate/Generate validation.`
                );
            }
        }

        throw error;
    }
};

/** Get all certificates (global list) */
export const getCertificateList = async (): Promise<Certificate[]> => {
    const { data } = await api.get<ApiResponse<Certificate[]>>(
        CERTIFICATE_ENDPOINTS.LIST
    );

    return unwrapSuccessfulResponse(data, `Failed to fetch ${CERTIFICATE_ENDPOINTS.LIST}`);
};

/** Get all donors */
export const getDonorList = async (): Promise<Donor[]> => {
    const { data } = await api.get<ApiResponse<unknown[]>>(
        DONOR_ENDPOINTS.LIST
    );

    if (!data.isSuccess) throw new Error(data.message || `Failed to fetch ${DONOR_ENDPOINTS.LIST}`);

    const normalized: Array<Donor | null> = (data.data ?? [])
        .map((item) => {
            const source = item as Record<string, unknown>;
            const nestedDonor =
                source.donor && typeof source.donor === "object"
                    ? (source.donor as Record<string, unknown>)
                    : undefined;

            const donorIdRaw =
                source.donorId ??
                source.donorID ??
                nestedDonor?.donorId ??
                nestedDonor?.donorID ??
                source.donorProfileId ??
                source.donor_profile_id ??
                source.id;
            const userIdRaw =
                source.userId ??
                source.userID ??
                nestedDonor?.userId ??
                nestedDonor?.userID;
            const donorId = Number(donorIdRaw);
            const userId = Number(userIdRaw);

            if (!Number.isFinite(donorId) || donorId <= 0) {
                return null;
            }

            const donorName =
                (source.donorName as string | undefined) ??
                (source.name as string | undefined) ??
                (source.fullName as string | undefined) ??
                (source.userName as string | undefined) ??
                (source.username as string | undefined) ??
                (nestedDonor?.donorName as string | undefined) ??
                (nestedDonor?.name as string | undefined);

            const completedDonationCountRaw =
                source.completedDonationCount ??
                source.completeDonationCount ??
                source.totalCompletedDonations ??
                source.completedDonations ??
                source.donationCount;

            const completedDonationCount =
                completedDonationCountRaw == null
                    ? undefined
                    : Number(completedDonationCountRaw);

            const safeCompletedDonationCount =
                completedDonationCount != null && Number.isFinite(completedDonationCount)
                    ? Math.max(0, completedDonationCount)
                    : undefined;

            const safeUserId =
                Number.isFinite(userId) && userId > 0 ? userId : undefined;

            return {
                donorId,
                userId: safeUserId,
                completedDonationCount: safeCompletedDonationCount,
                ...(donorName ? { donorName } : {}),
            };
        });

    return normalized.filter((item): item is Donor => item !== null);
};
