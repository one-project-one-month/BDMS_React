export const APPOINTMENT_ENDPOINTS = {
  LIST: "/Appointment/list",
  GET_BY_ID: (id: string | number) => `/Appointment/${id}`,
  DELETE: (id: string | number) => `/Appointment/${id}`,
  CREATE_FROM_DONATION: (donationId: string | number) =>
    `/Appointment/donation/${donationId}`,
  PATCH_STATUS: (id: string | number) => `/Appointment/${id}/status`,
  PATCH_TIME: (id: string | number) => `/Appointment/${id}/time`,
  COMPLETE: (id: string | number) => `/Appointment/${id}/complete`,
} as const;
