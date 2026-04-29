export const ANNOUNCEMENT_ENDPOINTS = {
    LIST: "/Announcement/List",
    CREATE: "/Announcement",
    DETAIL: (id: number) => `/Announcement/${id}`,
    UPDATE: (id: number) => `/Announcement/${id}`,
    DELETE: (id: number) => `/Announcement/${id}`,
} as const;