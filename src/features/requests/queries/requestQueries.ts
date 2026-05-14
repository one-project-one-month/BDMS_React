import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type {
  BloodRequest,
  BloodRequestAdmin,
  BloodRequestStatus,
  BloodRequestStatusAdmin,
  Hospital,
} from "../request.types";
import {
  createBloodRequest,
  createBloodRequestAppointment,
  deleteBloodRequest,
  getBloodRequest,
  getBloodRequestAdmin,
  getBloodRequests,
  getBloodRequestsAdmin,
  getHospitals,
  storeBloodRequest,
  updateBloodRequest,
  updateBloodRequestAdmin,
  updateBloodRequestStatus,
  updateBloodRequestStatusAdmin,
} from "../api/request.api";
import { bloodRequestKeys } from "./requestKeys";

export const requestKeys = {
  all: ["blood-requests"] as const,
  list: () => [...requestKeys.all, "list"] as const,
  detail: (id: number) => [...requestKeys.all, "detail", id] as const,
  hospitals: () => [...requestKeys.all, "hospitals"] as const,
};

export const hospitalQueryOptions = queryOptions<Hospital[]>({
  queryKey: requestKeys.hospitals(),
  queryFn: getHospitals,
  staleTime: 5 * 60 * 1000,
  retry: false,
});

export const bloodRequestsQueryOptions = queryOptions<BloodRequest[]>({
  queryKey: requestKeys.list(),
  queryFn: getBloodRequests,
  retry: false,
});

export const bloodRequestDetailQueryOptions = (id: number) =>
  queryOptions<BloodRequest>({
    queryKey: requestKeys.detail(id),
    queryFn: () => getBloodRequest(id),
    retry: false,
  });

export const createBloodRequestMutationOptions = mutationOptions<
  BloodRequest,
  unknown,
  Parameters<typeof createBloodRequest>[0]
>({
  mutationFn: createBloodRequest,
});

export const updateBloodRequestMutationOptions = mutationOptions<
  BloodRequest,
  unknown,
  Parameters<typeof updateBloodRequest>[0]
>({
  mutationFn: updateBloodRequest,
});

export const updateBloodRequestStatusMutationOptions = mutationOptions<
  BloodRequest,
  unknown,
  Parameters<typeof updateBloodRequestStatus>[0]
>({
  mutationFn: updateBloodRequestStatus,
});

// Admin

export const deleteBloodRequestMutationOptions = mutationOptions<
  boolean,
  unknown,
  Parameters<typeof deleteBloodRequest>[0]
>({
  mutationFn: deleteBloodRequest,
});

export const getBloodRequestsQueryOptions = queryOptions<BloodRequestAdmin[]>({
  queryKey: bloodRequestKeys.list(),
  queryFn: getBloodRequestsAdmin,
});

export const createBloodRequestAdminMutationOptions = mutationOptions<
  BloodRequestAdmin,
  unknown,
  Parameters<typeof storeBloodRequest>[0]
>({
  mutationFn: storeBloodRequest,
});

export const getBloodRequestQueryOptions = (id: number) =>
  queryOptions<BloodRequestAdmin>({
    queryKey: bloodRequestKeys.detail(id),
    queryFn: () => getBloodRequestAdmin(id),
  });

export const updateBloodRequestAdminMutationOptions = mutationOptions<
  BloodRequestAdmin,
  unknown,
  Parameters<typeof updateBloodRequestAdmin>[0]
>({
  mutationFn: updateBloodRequestAdmin,
});

export const updateBloodRequestStatusAdminMutationOptions = {
  mutationFn: ({ id, status }: { id: number; status: BloodRequestStatus }) =>
    updateBloodRequestStatusAdmin(id, status),
};

export const createBloodRequestAppointmentMutationOptions = {
  mutationFn: ({ id, date }: { id: number; date: string }) =>
    createBloodRequestAppointment(id, date),
};
