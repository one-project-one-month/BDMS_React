import api from "@/api/axios-client";
import type { ApiResponse } from "@/features/auth/auth.types";
import { BLOOD_INVENTORY_ENDPOINTS } from "@/api/endpoints/blood-inventory.endpoints";
import type { BloodInventory, AvailableStock, ConsumeBloodPayload } from "../blood-inventory.types";

/** Get all blood inventory ledger */
export const getBloodInventories = async (): Promise<BloodInventory[]> => {
  const { data } = await api.get<ApiResponse<BloodInventory[]>>(BLOOD_INVENTORY_ENDPOINTS.LIST);
  if (!data.isSuccess) throw new Error(data.message || "Failed to fetch blood inventory ledger");
  return data.data;
};

/** Get aggregated available stock summary */
export const getAvailableStock = async (params?: { hospitalId?: number; bloodGroup?: string }): Promise<AvailableStock[]> => {
  const { data } = await api.get<ApiResponse<AvailableStock[]>>(BLOOD_INVENTORY_ENDPOINTS.AVAILABLE_STOCK, { params });
  if (!data.isSuccess) throw new Error(data.message || "Failed to fetch available stock summary");
  return data.data;
};

/** Add donation to inventory */
export const addDonationToInventory = async (donationId: number): Promise<BloodInventory> => {
  const { data } = await api.post<ApiResponse<BloodInventory>>(BLOOD_INVENTORY_ENDPOINTS.ADD(donationId));
  if (!data.isSuccess) throw new Error(data.message || `Failed to add donation ${donationId} to inventory`);
  return data.data;
};

/** Consume a blood bag (mark as used) */
export const consumeBloodBag = async (payload: ConsumeBloodPayload): Promise<BloodInventory> => {
  const { data } = await api.patch<ApiResponse<BloodInventory>>(BLOOD_INVENTORY_ENDPOINTS.USE, payload);
  if (!data.isSuccess) throw new Error(data.message || "Failed to consume blood bag");
  return data.data;
};

/** Run stock-take check to clean expired items */
export const runStockTake = async (hospitalId?: number): Promise<number> => {
  const { data } = await api.post<ApiResponse<number>>(BLOOD_INVENTORY_ENDPOINTS.STOCK_TAKE, null, {
    params: hospitalId ? { hospitalId } : undefined
  });
  if (!data.isSuccess) throw new Error(data.message || "Failed to run stock-take check");
  return data.data;
};
