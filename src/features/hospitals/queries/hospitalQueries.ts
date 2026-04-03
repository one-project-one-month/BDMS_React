import { queryOptions } from "@tanstack/react-query";
import type { Hospital } from "../hospital.types";
import { hospitalKeys } from "./hospitalKeys";
import { getHospital, getHospitals } from "../api/hospital.api";

/**
 * Query: get all hospitals.
 */
export const getHospitalsQueryOptions = queryOptions<Hospital[]>({
  queryKey: hospitalKeys.list(),
  queryFn: getHospitals,
});

/**
 * Query: get specific hospital.
 */
export const getHospitalQueryOptions = (id: number) =>
  queryOptions<Hospital>({
    queryKey: hospitalKeys.detail(id),
    queryFn: () => getHospital(id),
  });
