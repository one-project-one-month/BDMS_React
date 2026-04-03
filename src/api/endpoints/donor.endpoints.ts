export const DONOR_ENDPOINTS = {
  LIST: "/Donor/list",
  CREATE: "/Donor/create",
  UPDATE: "/Donor/update",
  DELETE: (id: string | number) => `/Donor/delete/${id}`,
  GET_BY_ID: (id: string | number) => `/Donor/${id}`,
  UPDATE_STATUS: (id: string | number) => `/Donor/${id}/status`,
} as const;
