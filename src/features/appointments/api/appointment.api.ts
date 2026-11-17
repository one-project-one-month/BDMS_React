import { isAxiosError } from "axios";

import api, { HAS_API_BASE_URL } from "@/api/axios-client";
import { APPOINTMENT_ENDPOINTS } from "@/api/endpoints/appointment.endpoints";
import type { ApiResponse } from "@/features/auth/auth.types";
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentFromDonationPayload,
  UpdateAppointmentTimePayload,
} from "../appointment.types";

const ensureApiBaseUrl = () => {
  if (!HAS_API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is not configured. Appointment API is unavailable.",
    );
  }
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const responseMessage =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message;

    return responseMessage || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

const extractApiData = <T>(payload: ApiResponse<T> | T): T => {
  if (
    payload &&
    typeof payload === "object" &&
    "isSuccess" in payload &&
    "isError" in payload
  ) {
    const response = payload as ApiResponse<T>;

    if (!response.isSuccess || response.isError) {
      throw new Error(response.message || "Request failed");
    }

    return response.data;
  }

  return payload as T;
};

export const getAppointments = async (): Promise<Appointment[]> => {
  ensureApiBaseUrl();

  try {
    const { data } = await api.get<ApiResponse<Appointment[]> | Appointment[]>(
      APPOINTMENT_ENDPOINTS.LIST,
    );

    return extractApiData(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch appointments"));
  }
};

export const getAppointmentById = async (id: number): Promise<Appointment> => {
  ensureApiBaseUrl();

  try {
    const { data } = await api.get<ApiResponse<Appointment> | Appointment>(
      APPOINTMENT_ENDPOINTS.GET_BY_ID(id),
    );

    return extractApiData(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch appointment"));
  }
};

export const deleteAppointment = async (id: number): Promise<boolean> => {
  ensureApiBaseUrl();

  try {
    const { data } = await api.delete<ApiResponse<unknown> | unknown>(
      APPOINTMENT_ENDPOINTS.DELETE(id),
    );
    extractApiData(data);

    return true;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to delete appointment"));
  }
};

export const createAppointmentFromDonation = async (
  donationId: number,
  payload: CreateAppointmentFromDonationPayload = {},
): Promise<Appointment> => {
  ensureApiBaseUrl();

  try {
    const { data } = await api.post<ApiResponse<Appointment> | Appointment>(
      APPOINTMENT_ENDPOINTS.CREATE_FROM_DONATION(donationId),
      payload,
    );

    return extractApiData(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to create appointment"));
  }
};

export const updateAppointmentStatus = async (
  id: number,
  status: AppointmentStatus,
): Promise<Appointment> => {
  ensureApiBaseUrl();

  try {
    const { data } = await api.patch<ApiResponse<Appointment> | Appointment>(
      APPOINTMENT_ENDPOINTS.PATCH_STATUS(id),
      { status },
    );
    const response = extractApiData(data);

    if (response && typeof response === "object" && "id" in response) {
      return response;
    }

    return getAppointmentById(id);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to update appointment status"),
    );
  }
};

export const updateAppointmentTime = async ({
  id,
  appointmentDate,
  appointmentTime,
}: UpdateAppointmentTimePayload): Promise<Appointment> => {
  ensureApiBaseUrl();

  try {
    const { data } = await api.patch<ApiResponse<Appointment> | Appointment>(
      APPOINTMENT_ENDPOINTS.PATCH_TIME(id),
      { appointmentDate, appointmentTime },
    );
    const response = extractApiData(data);

    if (response && typeof response === "object" && "id" in response) {
      return response;
    }

    return getAppointmentById(id);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to update appointment time"),
    );
  }
};

export const completeAppointment = async (id: number): Promise<Appointment> => {
  ensureApiBaseUrl();

  try {
    const { data } = await api.post<ApiResponse<Appointment> | Appointment>(
      APPOINTMENT_ENDPOINTS.COMPLETE(id),
    );
    const response = extractApiData(data);

    if (response && typeof response === "object" && "id" in response) {
      return response;
    }

    return getAppointmentById(id);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to complete appointment"));
  }
};
