export const ANNOUNCEMENT_ENDPOINTS = {
    LIST: "/announcement",
    CREATE: "/announcement",
    DETAIL: (id: number) => `/announcement/${id}`,
    UPDATE: (id: number) => `/announcement/${id}`,
    DELETE: (id: number) => `/announcement/${id}`,
} as const;