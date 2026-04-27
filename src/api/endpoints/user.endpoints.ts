export const USER_ENDPOINTS = {
  LIST: "/User/list",
  CREATE: "/User/create",
  UPDATE: "/User/update",
  DELETE: (id: string | number) => `/User/delete/${id}`,
  GET_BY_ID: (id: string | number) => `/User/${id}`,
  UPDATE_STATUS: (id: string | number) => `/User/${id}/status`,
} as const;
