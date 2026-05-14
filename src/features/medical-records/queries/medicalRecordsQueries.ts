import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  deleteMedicalRecord,
  getMedicalRecord,
  getMedicalRecords,
  storeMedicalRecord,
  updateMedicalRecord,
} from "../api/medical-records.api";
import type { MedicalRecord } from "../medical-records.types";
import { medicalRecordKeys } from "./medicalRecordsKeys";

/**
 * Query: get all medical records.
 */
export const getMedicalRecordsQueryOptions = queryOptions<MedicalRecord[]>({
  queryKey: medicalRecordKeys.list(),
  queryFn: getMedicalRecords,
});

/**
 * Query: get specific medical record.
 */
export const getMedicalRecordQueryOptions = (id: number) =>
  queryOptions<MedicalRecord>({
    queryKey: medicalRecordKeys.detail(id),
    queryFn: () => getMedicalRecord(id),
  });

/**
 * Mutation: create medical record.
 */
export const createMedicalRecordMutationOptions = mutationOptions<
  MedicalRecord,
  unknown,
  Parameters<typeof storeMedicalRecord>[0]
>({
  mutationFn: storeMedicalRecord,
});

/**
 * Mutation: update medical record.
 */
export const updateMedicalRecordMutationOptions = mutationOptions<
  MedicalRecord,
  unknown,
  Parameters<typeof updateMedicalRecord>[0]
>({
  mutationFn: updateMedicalRecord,
});

/**
 * Mutation: delete medical record.
 */
export const deleteMedicalRecordMutationOptions = mutationOptions<
  boolean,
  unknown,
  Parameters<typeof deleteMedicalRecord>[0]
>({
  mutationFn: deleteMedicalRecord,
});
