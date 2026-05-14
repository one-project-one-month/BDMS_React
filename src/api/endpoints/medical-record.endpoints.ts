export const MEDICAL_RECORD_ENDPOINTS = {
  LIST: "/MedicalRecord/list",
  CREATE: "/MedicalRecord/create",
  UPDATE: "/MedicalRecord/update",
  DELETE: (id: string | number) => `/MedicalRecord/${id}`,
  GET_BY_ID: (id: string | number) => `/MedicalRecord/${id}`,
} as const;
