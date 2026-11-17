export const CERTIFICATE_ENDPOINTS = {
  GENERATE: "/Certificate/Generate",
  LIST: "/Certificate/list",
  GET_BY_ID: (id: string | number) => `/Certificate/${id}`,
  GET_BY_DONOR: (donorId: string | number) => `/Certificate/donor/${donorId}`,
} as const;