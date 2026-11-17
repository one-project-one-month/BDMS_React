export const HOSPITAL_ENDPOINTS = {
    LIST: "/Hospital/list",
    GET_BY_ID: (id: number) => `/Hospital/get?id=${id}`,
} as const;