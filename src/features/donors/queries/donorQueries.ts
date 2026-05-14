import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { donorKeys } from "./donorKeys";
import {
  activateDonor,
  deactivateDonor,
  deleteDonor,
  getDonor,
  getDonors,
  storeDonor,
  updateDonor,
} from "../api/donor.api";
import type { Donor } from "../donor.types";

/**
 * Query: get all donors.
 */
export const getDonorsQueryOptions = queryOptions<Donor[]>({
  queryKey: donorKeys.list(),
  queryFn: getDonors,
});

/**
 * Query: get specific donor.
 */
export const getDonorQueryOptions = (id: number) =>
  queryOptions<Donor>({
    queryKey: donorKeys.detail(id),
    queryFn: () => getDonor(id),
  });

/**
 * Mutation: create donor record.
 */
export const createDonorMutationOptions = mutationOptions<
  Donor,
  unknown,
  Parameters<typeof storeDonor>[0]
>({
  mutationFn: storeDonor,
});

/**
 * Mutation: update donor record.
 */
export const updateDonorMutationOptions = mutationOptions<
  Donor,
  unknown,
  Parameters<typeof updateDonor>[0]
>({
  mutationFn: updateDonor,
});

/**
 * Mutation: delete donor record.
 */

export const deleteDonorMutationOptions = mutationOptions<
  boolean,
  unknown,
  Parameters<typeof deleteDonor>[0]
>({
  mutationFn: deleteDonor,
});

/**
 * Mutation: activate donor.
 */
export const activateDonorMutationOptions = mutationOptions<
  Donor,
  unknown,
  Parameters<typeof activateDonor>[0]
>({
  mutationFn: activateDonor,
});

/**
 * Mutation: deactivate Donor.
 */
export const deactivateDonorMutationOptions = mutationOptions<
  Donor,
  unknown,
  Parameters<typeof deactivateDonor>[0]
>({
  mutationFn: deactivateDonor,
});
