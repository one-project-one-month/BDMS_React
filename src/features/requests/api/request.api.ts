import { isAxiosError } from "axios";

import api, { HAS_API_BASE_URL } from "@/api/axios-client";
import { BLOOD_REQUEST_ENDPOINTS } from "@/api/endpoints/blood-request.endpoints";
import { HOSPITAL_ENDPOINTS } from "@/api/endpoints/hospital.endpoint";
import type {
  ApiResponse,
  BloodRequest,
  BloodRequestFormValues,
  BloodRequestStatus,
  BloodRequestUrgency,
  CreateBloodRequestPayload,
  Hospital,
  RequestMutationInput,
  RequestStatusUpdateInput,
  RequestType,
  UpdateBloodRequestPayload,
} from "../request.types";

type UpdateRequestMutationInput = RequestMutationInput & { id: number };
type DateOnlyLike = {
  year: number;
  month: number;
  day: number;
};

const getNowIso = () => new Date().toISOString();

const toRequestType = (urgency: BloodRequestUrgency): RequestType =>
  urgency === "critical" || urgency === "high" ? "emergency" : "pre-booked";

const toUrgency = (requestType: RequestType): BloodRequestUrgency =>
  requestType === "emergency" ? "critical" : "medium";

const toRequiredDatePayload = (
  requiredDate: Date,
): CreateBloodRequestPayload["requiredDate"] => {
  const year = requiredDate.getFullYear();
  const month = String(requiredDate.getMonth() + 1).padStart(2, "0");
  const day = String(requiredDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const toIsoDateString = (
  value: string | Date | DateOnlyLike | undefined | null,
) => {
  if (!value) {
    return getNowIso();
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value.year, value.month - 1, value.day).toISOString();
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

const sortRequests = (requests: BloodRequest[]) =>
  [...requests].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

const ensureApiBaseUrl = () => {
  if (!HAS_API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is not configured. Blood request API is unavailable.",
    );
  }
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

const normalizeRequest = (
  request: Partial<BloodRequest>,
  hospitals: Hospital[],
  fallback?: {
    userId?: number;
    values?: BloodRequestFormValues;
    status?: BloodRequestStatus;
  },
): BloodRequest => {
  const hospital =
    hospitals.find((item) => item.id === request.hospitalId) ??
    (fallback?.values
      ? {
          id: fallback.values.hospitalId,
          name: request.hospitalName ?? "",
          address:
            request.hospitalAddress ?? fallback.values.hospitalAddress ?? "",
        }
      : null);

  const requestType =
    request.requestType ??
    (fallback?.values ? fallback.values.requestType : undefined) ??
    toRequestType(request.urgency ?? "medium");

  return {
    id: request.id ?? 0,
    userId: request.userId ?? fallback?.userId ?? 0,
    hospitalId: request.hospitalId ?? fallback?.values?.hospitalId ?? 0,
    bloodRequestCode: request.bloodRequestCode ?? `BR-${String(request.id ?? 0).padStart(4, "0")}`,
    patientName: request.patientName ?? fallback?.values?.patientName ?? "",
    bloodGroup: request.bloodGroup ?? fallback?.values?.bloodGroup ?? "A+",
    hospitalName:
      request.hospitalName ?? hospital?.name ?? "Unknown hospital",
    hospitalAddress:
      request.hospitalAddress ??
      fallback?.values?.hospitalAddress ??
      hospital?.address ??
      "",
    unitsRequired:
      request.unitsRequired ?? fallback?.values?.unitsRequired ?? 1,
    contactPhone:
      request.contactPhone ?? fallback?.values?.contactPhone ?? "",
    urgency: request.urgency ?? toUrgency(requestType),
    requestType,
    relationshipToPatient:
      request.relationshipToPatient ??
      fallback?.values?.relationshipToPatient ??
      "relative",
    requiredDate: toIsoDateString(
      request.requiredDate ?? fallback?.values?.requiredDate,
    ),
    status: request.status ?? fallback?.status ?? "pending",
    reason: request.reason ?? fallback?.values?.reason ?? "",
    additionalNotes:
      request.additionalNotes ?? fallback?.values?.additionalNotes ?? null,
    approvedBy: request.approvedBy ?? null,
    approvedAt: request.approvedAt ?? null,
    createdAt: request.createdAt ?? getNowIso(),
    updatedAt: request.updatedAt ?? getNowIso(),
    deletedAt: request.deletedAt ?? null,
  };
};

const buildApiPayload = (
  input: RequestMutationInput,
): CreateBloodRequestPayload => ({
  userId: input.userId,
  hospitalId: input.values.hospitalId,
  patientName: input.values.patientName.trim(),
  bloodGroup: input.values.bloodGroup,
  unitsRequired: input.values.unitsRequired,
  contactPhone: input.values.contactPhone.trim(),
  urgency: ((input.values as any).urgency as BloodRequestUrgency) || toUrgency(input.values.requestType),
  requiredDate: toRequiredDatePayload(input.values.requiredDate),
  reason: input.values.reason.trim(),
});

export const getHospitals = async (): Promise<Hospital[]> => {
  ensureApiBaseUrl();

  try {
    const { data } = await api.get<ApiResponse<Hospital[]> | Hospital[]>(
      HOSPITAL_ENDPOINTS.LIST,
    );
    return extractApiData(data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch hospitals"));
  }
};

export const getBloodRequests = async (): Promise<BloodRequest[]> => {
  ensureApiBaseUrl();

  try {
    const hospitals = await getHospitals();
    const { data } = await api.get<ApiResponse<BloodRequest[]> | BloodRequest[]>(
      BLOOD_REQUEST_ENDPOINTS.LIST,
    );
    const requests = extractApiData(data);

    return sortRequests(
      requests.map((request) => normalizeRequest(request, hospitals)),
    );
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to fetch blood requests"),
    );
  }
};

export const getBloodRequest = async (id: number): Promise<BloodRequest> => {
  ensureApiBaseUrl();

  try {
    const hospitals = await getHospitals();
    const { data } = await api.get<ApiResponse<BloodRequest> | BloodRequest>(
      BLOOD_REQUEST_ENDPOINTS.GET_BY_ID(id),
    );
    return normalizeRequest(extractApiData(data), hospitals);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to fetch blood request"),
    );
  }
};

export const createBloodRequest = async (
  input: RequestMutationInput,
): Promise<BloodRequest> => {
  ensureApiBaseUrl();

  try {
    const hospitals = await getHospitals();
    const { data } = await api.post<ApiResponse<BloodRequest> | BloodRequest | null>(
      BLOOD_REQUEST_ENDPOINTS.CREATE,
      buildApiPayload(input),
    );
    const createdRequest = extractApiData(data);

    if (createdRequest && typeof createdRequest === "object" && "id" in createdRequest) {
      return normalizeRequest(createdRequest, hospitals, {
        userId: input.userId,
        values: input.values,
        status: "pending",
      });
    }

    const requests = await getBloodRequests();
    const latestRequest = requests.find(
      (request) =>
        request.userId === input.userId &&
        request.patientName === input.values.patientName.trim() &&
        request.hospitalId === input.values.hospitalId,
    );

    if (!latestRequest) {
      throw new Error(
        "Blood request was submitted, but the API did not return the created record.",
      );
    }

    return latestRequest;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to create blood request"),
    );
  }
};

export const updateBloodRequest = async (
  input: UpdateRequestMutationInput,
): Promise<BloodRequest> => {
  ensureApiBaseUrl();

  try {
    const payload: UpdateBloodRequestPayload = {
      id: input.id,
      ...buildApiPayload(input),
    };
    const { data } = await api.put<ApiResponse<BloodRequest> | BloodRequest | null>(
      BLOOD_REQUEST_ENDPOINTS.UPDATE,
      payload,
    );
    const updatedRequest = extractApiData(data);

    if (updatedRequest && typeof updatedRequest === "object" && "id" in updatedRequest) {
      const hospitals = await getHospitals();
      const currentRequest = await getBloodRequest(input.id);

      return normalizeRequest(updatedRequest, hospitals, {
        userId: currentRequest.userId,
        values: input.values,
        status: currentRequest.status,
      });
    }

    return getBloodRequest(input.id);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to update blood request"),
    );
  }
};

export const updateBloodRequestStatus = async ({
  id,
  status,
}: RequestStatusUpdateInput): Promise<BloodRequest> => {
  ensureApiBaseUrl();

  try {
    const { data } = await api.patch<ApiResponse<unknown> | unknown>(
      BLOOD_REQUEST_ENDPOINTS.PATCH_STATUS(id),
      { status },
    );
    extractApiData(data);

    return getBloodRequest(id);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to update request status"),
    );
  }
};
