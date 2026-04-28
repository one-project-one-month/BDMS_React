export const bloodRequestKeys = {
  all: ["donors"] as const,
  list: () => [...bloodRequestKeys.all] as const,
  detail: (id: number) => [...bloodRequestKeys.all, id] as const,
};
