export const HOSPITAL_ENDPOINTS = {
  LIST: "/Hospital/list",
  GET_BY_ID: (id: string | number) => `/Hospital/get?id=${id}`,
  UPDATE: "/Hospital/update",
  DELETE: "/Hospital/delete",
} as const;
