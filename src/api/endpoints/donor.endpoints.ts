export const DONOR_ENDPOINTS = {
  LIST: "/Donor/list",
  CREATE: "/Donor/create",
  UPDATE: "/Donor/update",
  DELETE: (id: string | number) => `/Donor/delete?donorId=${id}`,
  GET_BY_ID: (id: string | number) => `/Donor/${id}?donorId=${id}`,
  UPDATE_STATUS: (id: string | number) => `/Donor/${id}/status`,
} as const;
