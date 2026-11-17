export const bloodRequestKeys = {
  all: ["blood-requests"] as const,
  list: () => [...bloodRequestKeys.all] as const,
  detail: (id: number) => [...bloodRequestKeys.all, id] as const,
};
