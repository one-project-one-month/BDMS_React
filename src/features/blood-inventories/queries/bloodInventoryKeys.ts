export const bloodInventoryKeys = {
  all: ["bloodInventories"] as const,
  lists: () => [...bloodInventoryKeys.all, "list"] as const,
  list: () => [...bloodInventoryKeys.lists()] as const,
  available: (params?: Record<string, any>) => [...bloodInventoryKeys.all, "available", params] as const,
};
