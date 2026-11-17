import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { BloodRequest, Hospital } from "../request.types";
import {
  createBloodRequest,
  getBloodRequest,
  getBloodRequests,
  getHospitals,
  updateBloodRequest,
  updateBloodRequestStatus,
} from "../api/request.api";

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
