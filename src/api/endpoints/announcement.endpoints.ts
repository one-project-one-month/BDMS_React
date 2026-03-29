export const ANNOUNCEMENT_ENDPOINTS = {
    LIST: "/announcements",
    CREATE: "/announcements",
    DETAIL: (id: number) => `/announcements/${id}`,
    UPDATE: (id: number) => `/announcements/${id}`,
    DELETE: (id: number) => `/announcements/${id}`,
} as const;