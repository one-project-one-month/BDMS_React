export const donorKeys = {
  all: ["donors"] as const,
  list: () => [...donorKeys.all] as const,
  detail: (id: number) => [...donorKeys.all, id] as const,
};
