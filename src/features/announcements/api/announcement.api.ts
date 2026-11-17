import api from "@/api/axios-client";
import { ANNOUNCEMENT_ENDPOINTS } from "@/api/endpoints/announcement.endpoints";
import type { ApiResponse } from "@/features/auth/auth.types";

import type {
    Announcement,
    AnnouncementDetailTypes,
    AnnouncementResponseTypes,
} from "../announcement.types";

/** Get all announcements */
export const getAnnouncements = async (): Promise<Announcement[]> => {
    const { data } = await api.get<ApiResponse<Announcement[]>>(
        ANNOUNCEMENT_ENDPOINTS.LIST,
    );

    if (!data.isSuccess) {
        throw new Error(
            data.message || `Failed to fetch ${ANNOUNCEMENT_ENDPOINTS.LIST}`,
        );
    }

    return data.data;
};

/** Get a specific announcement */
export const getAnnouncementById = async (
    id: number,
): Promise<AnnouncementResponseTypes> => {
    const { data } = await api.get<ApiResponse<AnnouncementResponseTypes>>(
        ANNOUNCEMENT_ENDPOINTS.DETAIL(id),
    );

    if (!data.isSuccess) {
        throw new Error(
            data.message || `Failed to fetch ${ANNOUNCEMENT_ENDPOINTS.DETAIL(id)}`,
        );
    }

    return data.data;
};

/** Store an announcement record */
export const createAnnouncement = async (
    payload: AnnouncementDetailTypes,
): Promise<Announcement> => {
    const { data } = await api.post<ApiResponse<Announcement>>(
        ANNOUNCEMENT_ENDPOINTS.CREATE,
        payload,
    );

    if (!data.isSuccess) {
        throw new Error(
            data.message || `Failed to store ${ANNOUNCEMENT_ENDPOINTS.CREATE}`,
        );
    }

    return data.data;
};

/** Update a specific announcement */
export const updateAnnouncement = async (
    id: number,
    payload: AnnouncementDetailTypes,
): Promise<Announcement> => {
    const { data } = await api.put<ApiResponse<Announcement>>(
        ANNOUNCEMENT_ENDPOINTS.UPDATE(id),
        payload,
    );

    if (!data.isSuccess) {
        throw new Error(
            data.message || `Failed to update ${ANNOUNCEMENT_ENDPOINTS.UPDATE(id)}`,
        );
    }

    return data.data;
};

/** Delete a specific announcement */
export const deleteAnnouncement = async (id: number): Promise<boolean> => {
    const { data } = await api.delete<ApiResponse<null>>(
        ANNOUNCEMENT_ENDPOINTS.DELETE(id),
    );

    if (!data.isSuccess) {
        throw new Error(
            data.message || `Failed to delete ${ANNOUNCEMENT_ENDPOINTS.DELETE(id)}`,
        );
    }

    return true;
};
