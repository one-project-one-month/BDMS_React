import api from "@/api/axios-client";
import { MEDICAL_RECORD_ENDPOINTS } from "@/api/endpoints/medical-record.endpoints";
import type { ApiResponse } from "@/features/auth/auth.types";
import type {
  MedicalRecord,
  StoreMedicalRecordPayload,
  UpdateMedicalRecordPayload,
} from "../medical-records.types";

/** Get all medical records */
export const getMedicalRecords = async (): Promise<MedicalRecord[]> => {
  const { data } = await api.get<ApiResponse<MedicalRecord[]>>(
    MEDICAL_RECORD_ENDPOINTS.LIST,
  );

  if (!data.isSuccess)
    throw new Error(
      data.message || `Failed to fetch ${MEDICAL_RECORD_ENDPOINTS.LIST}`,
    );

  return data.data;
};

/** Get a specific medical record */
export const getMedicalRecord = async (id: number): Promise<MedicalRecord> => {
  const { data } = await api.get<ApiResponse<MedicalRecord>>(
    MEDICAL_RECORD_ENDPOINTS.GET_BY_ID(id),
  );

  if (!data.isSuccess)
    throw new Error(
      data.message ||
        `Failed to fetch ${MEDICAL_RECORD_ENDPOINTS.GET_BY_ID(id)}`,
    );

  return data.data;
};

/** Store a medical record */
export const storeMedicalRecord = async (
  payload: StoreMedicalRecordPayload,
): Promise<MedicalRecord> => {
  const { data } = await api.post<ApiResponse<MedicalRecord>>(
    MEDICAL_RECORD_ENDPOINTS.CREATE,
    payload,
  );

  if (!data.isSuccess)
    throw new Error(
      data.message || `Failed to store ${MEDICAL_RECORD_ENDPOINTS.CREATE}`,
    );

  return data.data;
};

/** Update a specific medical record */
export const updateMedicalRecord = async (
  payload: UpdateMedicalRecordPayload,
): Promise<MedicalRecord> => {
  const { data } = await api.put<ApiResponse<MedicalRecord>>(
    MEDICAL_RECORD_ENDPOINTS.UPDATE,
    payload,
  );

  if (!data.isSuccess)
    throw new Error(
      data.message || `Failed to update ${MEDICAL_RECORD_ENDPOINTS.UPDATE}`,
    );

  return data.data;
};

/** Delete a specific medical record */
export const deleteMedicalRecord = async (id: number): Promise<boolean> => {
  const { data } = await api.delete<ApiResponse<null>>(
    MEDICAL_RECORD_ENDPOINTS.DELETE(id),
  );

  if (!data.isSuccess)
    throw new Error(
      data.message ||
        `Failed to delete ${MEDICAL_RECORD_ENDPOINTS.DELETE(id)}`,
    );

  return true;
};
