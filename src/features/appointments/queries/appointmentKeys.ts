export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (filters?: string) => [...appointmentKeys.lists(), { filters }] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const,
};
