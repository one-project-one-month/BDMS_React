export const DONATION_ENDPOINTS = {
    LIST: "/Donation/list",
    CREATE: "/Donation/create",
    UPDATE: "/Donation/update",
    DELETE: "/Donation/delete",
    GET_BY_ID: (id: string | number) => `/Donation/${id}`,
    UPDATE_STATUS: (id: string | number) => `/Donation/${id}/status`,
} as const;
