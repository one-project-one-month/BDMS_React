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
} from "../requests.types";

const MOCK_REQUEST_STORAGE_KEY = "bdms.mock-blood-requests";
const USE_REQUEST_LOCAL_CACHE = true;

const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 1,
    name: "Yangon General Hospital",
    address: "Bogyoke Aung San Road, Lanmadaw Township, Yangon",
    phone: "+95 1 000 0001",
    email: "contact@ygh.example",
    isActive: true,
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
  },
  {
    id: 2,
    name: "North Okkalapa General Hospital",
    address: "North Okkalapa Township, Yangon",
    phone: "+95 1 000 0002",
    email: "contact@nogh.example",
    isActive: true,
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
  },
  {
    id: 3,
    name: "Mandalay General Hospital",
    address: "Chanayethazan Township, Mandalay",
    phone: "+95 2 000 0003",
    email: "contact@mgh.example",
    isActive: true,
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    deletedAt: null,
  },
];

type UpdateRequestMutationInput = RequestMutationInput & { id: number };

const getNowIso = () => new Date().toISOString();

const toRequestType = (urgency: BloodRequestUrgency): RequestType =>
  urgency === "critical" || urgency === "high" ? "emergency" : "pre-booked";

const toUrgency = (requestType: RequestType): BloodRequestUrgency =>
  requestType === "emergency" ? "critical" : "medium";

const toRequiredDatePayload = (
  requiredDate: Date,
): CreateBloodRequestPayload["requiredDate"] => ({
  year: requiredDate.getFullYear(),
  month: requiredDate.getMonth() + 1,
  day: requiredDate.getDate(),
  dayOfWeek: requiredDate.getDay(),
});

const sortRequests = (requests: BloodRequest[]) =>
  [...requests].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

const readMockRequests = (): BloodRequest[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(MOCK_REQUEST_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return sortRequests(JSON.parse(raw) as BloodRequest[]);
  } catch {
    window.localStorage.removeItem(MOCK_REQUEST_STORAGE_KEY);
    return [];
  }
};

const writeMockRequests = (requests: BloodRequest[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    MOCK_REQUEST_STORAGE_KEY,
    JSON.stringify(sortRequests(requests)),
  );
};

const resolveHospital = (hospitalId: number, hospitals: Hospital[]) => {
  const hospital = hospitals.find((item) => item.id === hospitalId);

  if (!hospital) {
    throw new Error("Selected hospital could not be found.");
  }

  return hospital;
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
    requiredDate:
      request.requiredDate ??
      fallback?.values?.requiredDate.toISOString() ??
      getNowIso(),
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
  urgency: toUrgency(input.values.requestType),
  requiredDate: toRequiredDatePayload(input.values.requiredDate),
  reason: input.values.reason.trim(),
});

const buildStoredRequest = (
  input: RequestMutationInput,
  hospital: Hospital,
  existing?: BloodRequest,
): BloodRequest => {
  const now = getNowIso();

  return {
    id:
      existing?.id ??
      Math.max(0, ...readMockRequests().map((request) => request.id)) + 1,
    userId: existing?.userId ?? input.userId,
    hospitalId: input.values.hospitalId,
    bloodRequestCode:
      existing?.bloodRequestCode ??
      `BR-${String(Math.max(0, ...readMockRequests().map((request) => request.id)) + 1).padStart(4, "0")}`,
    patientName: input.values.patientName.trim(),
    bloodGroup: input.values.bloodGroup,
    hospitalName: hospital.name,
    hospitalAddress: input.values.hospitalAddress.trim() || hospital.address,
    unitsRequired: input.values.unitsRequired,
    contactPhone: input.values.contactPhone.trim(),
    urgency: toUrgency(input.values.requestType),
    requestType: input.values.requestType,
    relationshipToPatient: input.values.relationshipToPatient,
    requiredDate: input.values.requiredDate.toISOString(),
    status: existing?.status ?? "pending",
    reason: input.values.reason.trim(),
    additionalNotes: input.values.additionalNotes.trim() || null,
    approvedBy: existing?.approvedBy ?? null,
    approvedAt: existing?.approvedAt ?? null,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    deletedAt: existing?.deletedAt ?? null,
  };
};

const saveMockRequest = async (
  input: RequestMutationInput,
  existing?: BloodRequest,
): Promise<BloodRequest> => {
  const hospitals = await getHospitals();
  const hospital = resolveHospital(input.values.hospitalId, hospitals);
  const storedRequest = buildStoredRequest(input, hospital, existing);
  const requests = readMockRequests();
  const remainingRequests = requests.filter(
    (request) => request.id !== storedRequest.id,
  );

  writeMockRequests([storedRequest, ...remainingRequests]);
  return storedRequest;
};

const setMockRequestStatus = (
  input: RequestStatusUpdateInput,
): BloodRequest => {
  const requests = readMockRequests();
  const existingRequest = requests.find((request) => request.id === input.id);

  if (!existingRequest) {
    throw new Error("Blood request not found");
  }

  const updatedRequest: BloodRequest = {
    ...existingRequest,
    status: input.status,
    approvedAt:
      input.status === "approved" || input.status === "fulfilled"
        ? getNowIso()
        : null,
    updatedAt: getNowIso(),
  };

  writeMockRequests([
    updatedRequest,
    ...requests.filter((request) => request.id !== input.id),
  ]);

  return updatedRequest;
};

export const getHospitals = async (): Promise<Hospital[]> => {
  if (USE_REQUEST_LOCAL_CACHE || !HAS_API_BASE_URL) {
    return MOCK_HOSPITALS;
  }

  try {
    const { data } = await api.get<ApiResponse<Hospital[]>>(
      HOSPITAL_ENDPOINTS.LIST,
    );

    if (!data.isSuccess || data.isError) {
      throw new Error(data.message || "Failed to fetch hospitals");
    }

    return data.data;
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return MOCK_HOSPITALS;
    }

    throw error;
  }
};

export const getBloodRequests = async (): Promise<BloodRequest[]> => {
  if (USE_REQUEST_LOCAL_CACHE || !HAS_API_BASE_URL) {
    return readMockRequests();
  }

  try {
    const hospitals = await getHospitals();
    const { data } = await api.get<ApiResponse<BloodRequest[]>>(
      BLOOD_REQUEST_ENDPOINTS.LIST,
    );

    if (!data.isSuccess || data.isError) {
      throw new Error(data.message || "Failed to fetch blood requests");
    }

    return sortRequests(
      data.data.map((request) => normalizeRequest(request, hospitals)),
    );
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return readMockRequests();
    }

    throw error;
  }
};

export const getBloodRequest = async (id: number): Promise<BloodRequest> => {
  if (USE_REQUEST_LOCAL_CACHE || !HAS_API_BASE_URL) {
    const request = readMockRequests().find((item) => item.id === id);

    if (!request) {
      throw new Error("Blood request not found");
    }

    return request;
  }

  try {
    const hospitals = await getHospitals();
    const { data } = await api.get<ApiResponse<BloodRequest>>(
      BLOOD_REQUEST_ENDPOINTS.GET_BY_ID(id),
    );

    if (!data.isSuccess || data.isError) {
      throw new Error(data.message || "Failed to fetch blood request");
    }

    return normalizeRequest(data.data, hospitals);
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      const request = readMockRequests().find((item) => item.id === id);

      if (!request) {
        throw new Error("Blood request not found");
      }

      return request;
    }

    throw error;
  }
};

export const createBloodRequest = async (
  input: RequestMutationInput,
): Promise<BloodRequest> => {
  if (USE_REQUEST_LOCAL_CACHE || !HAS_API_BASE_URL) {
    return saveMockRequest(input);
  }

  try {
    const hospitals = await getHospitals();
    const { data } = await api.post<ApiResponse<BloodRequest>>(
      BLOOD_REQUEST_ENDPOINTS.CREATE,
      buildApiPayload(input),
    );

    if (!data.isSuccess || data.isError) {
      throw new Error(data.message || "Failed to create blood request");
    }

    return normalizeRequest(data.data, hospitals, {
      userId: input.userId,
      values: input.values,
      status: "pending",
    });
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return saveMockRequest(input);
    }

    throw error;
  }
};

export const updateBloodRequest = async (
  input: UpdateRequestMutationInput,
): Promise<BloodRequest> => {
  if (USE_REQUEST_LOCAL_CACHE || !HAS_API_BASE_URL) {
    const existingRequest = readMockRequests().find(
      (request) => request.id === input.id,
    );

    if (!existingRequest) {
      throw new Error("Blood request not found");
    }

    return saveMockRequest(input, existingRequest);
  }

  try {
    const hospitals = await getHospitals();
    const payload: UpdateBloodRequestPayload = {
      id: input.id,
      ...buildApiPayload(input),
    };
    const { data } = await api.put<ApiResponse<BloodRequest>>(
      BLOOD_REQUEST_ENDPOINTS.UPDATE,
      payload,
    );

    if (!data.isSuccess || data.isError) {
      throw new Error(data.message || "Failed to update blood request");
    }

    const currentRequest = await getBloodRequest(input.id);
    return normalizeRequest(data.data, hospitals, {
      userId: currentRequest.userId,
      values: input.values,
      status: currentRequest.status,
    });
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      const existingRequest = readMockRequests().find(
        (request) => request.id === input.id,
      );

      if (!existingRequest) {
        throw new Error("Blood request not found");
      }

      return saveMockRequest(input, existingRequest);
    }

    throw error;
  }
};

export const updateBloodRequestStatus = async ({
  id,
  status,
}: RequestStatusUpdateInput): Promise<BloodRequest> => {
  if (USE_REQUEST_LOCAL_CACHE || !HAS_API_BASE_URL) {
    return setMockRequestStatus({ id, status });
  }

  try {
    const { data } = await api.patch<ApiResponse<unknown>>(
      BLOOD_REQUEST_ENDPOINTS.PATCH_STATUS(id),
      { status },
    );

    if (!data.isSuccess || data.isError) {
      throw new Error(data.message || "Failed to update request status");
    }

    return getBloodRequest(id);
  } catch (error) {
    if (isAxiosError(error) && !error.response) {
      return setMockRequestStatus({ id, status });
    }

    throw error;
  }
};
