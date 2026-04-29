export const BLOOD_REQUEST_ENDPOINTS = {
  LIST: "/BloodRequest/list",
  GET_BY_ID: (id: string | number) => `/BloodRequest/${id}`,
  DELETE: (id: string | number) => `/BloodRequest/${id}`,
  CREATE: "/BloodRequest/create",
  UPDATE: "/BloodRequest/update",
  PATCH_STATUS: (id: string | number) => `/BloodRequest/${id}/status`,
} as const;
