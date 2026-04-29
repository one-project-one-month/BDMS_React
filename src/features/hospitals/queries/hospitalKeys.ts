export const hospitalKeys = {
  all: ["hospitals"] as const,
  list: () => [...hospitalKeys.all] as const,
  detail: (id: number) => [...hospitalKeys.all, id] as const,
};
