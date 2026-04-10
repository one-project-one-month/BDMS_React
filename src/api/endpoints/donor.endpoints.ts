export const DONOR_ENDPOINTS = {
	LIST: "/Donor/list",
	CREATE: "/Donor/create",
	GET_BY_ID: (id: string | number) => `/Donor/${id}`,
	UPDATE: "/Donor/update",
	DELETE: "/Donor/delete",
} as const;
