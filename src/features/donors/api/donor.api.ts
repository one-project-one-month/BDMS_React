import api from "@/api/axios-client";
import type { ApiResponse } from "@/features/auth/auth.types";
import type {
  Donor,
  StoreDonorPayload,
  UpdateDonorPayload,
} from "../donor.types";
import { DONOR_ENDPOINTS } from "@/api/endpoints/donor.endpoints";

/** Get all donors */
export const getDonors = async (): Promise<Donor[]> => {
  const { data } = await api.get<ApiResponse<Donor[]>>(DONOR_ENDPOINTS.LIST);

  if (!data.isSuccess)
    throw new Error(data.message || `Failed to fetch ${DONOR_ENDPOINTS.LIST}`);

  return data.data;
};

/** Get a specific donor */
export const getDonor = async (id: number): Promise<Donor> => {
  const { data } = await api.get<ApiResponse<Donor>>(
    DONOR_ENDPOINTS.GET_BY_ID(id),
  );

  if (!data.isSuccess)
    throw new Error(
      data.message || `Failed to fetch ${DONOR_ENDPOINTS.GET_BY_ID(id)}`,
    );

  return data.data;
};

/** Store a donor record */
export const storeDonor = async (
  payload: StoreDonorPayload,
): Promise<Donor> => {
  const { data } = await api.post<ApiResponse<Donor>>(
    DONOR_ENDPOINTS.CREATE,
    payload,
  );

  if (!data.isSuccess)
    throw new Error(
      data.message || `Failed to store ${DONOR_ENDPOINTS.CREATE}`,
    );

  return data.data;
};

/** Update a specific donor */
export const updateDonor = async (
  payload: UpdateDonorPayload,
): Promise<Donor> => {
  const { data } = await api.put<ApiResponse<Donor>>(
    DONOR_ENDPOINTS.UPDATE,
    payload,
  );

  if (!data.isSuccess)
    throw new Error(
      data.message || `Failed to update ${DONOR_ENDPOINTS.UPDATE}`,
    );

  return data.data;
};

/** Delete a specific donor */
export const deleteDonor = async (donorId: number): Promise<boolean> => {
  const { data } = await api.delete<ApiResponse<null>>(
    DONOR_ENDPOINTS.DELETE(donorId),
  );

  if (!data.isSuccess)
    throw new Error(
      data.message || `Failed to delete ${DONOR_ENDPOINTS.DELETE(donorId)}`,
    );

  return true;
};

/** Update a specific donor's status (isActive) */
const updateDonorStatus = async (
  id: number,
  isActive: boolean,
): Promise<Donor> => {
  const { data } = await api.patch<ApiResponse<Donor>>(
    DONOR_ENDPOINTS.UPDATE_STATUS(id),
    { isActive },
  );

  if (!data.isSuccess)
    throw new Error(
      data.message ||
        `Failed to update status for donor ${DONOR_ENDPOINTS.UPDATE_STATUS(id)}`,
    );

  return data.data;
};

/** Activate a specific donor */
export const activateDonor = (id: number) => updateDonorStatus(id, true);

/** Deactivate a specific donor */
export const deactivateDonor = (id: number) => updateDonorStatus(id, false);
