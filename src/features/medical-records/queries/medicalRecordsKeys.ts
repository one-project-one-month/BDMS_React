export const medicalRecordKeys = {
  all: ["medical-records"] as const,
  list: () => [...medicalRecordKeys.all] as const,
  detail: (id: number) => [...medicalRecordKeys.all, id] as const,
};
