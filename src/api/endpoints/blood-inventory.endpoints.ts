export const BLOOD_INVENTORY_ENDPOINTS = {
  LIST: "/BloodInventory/list",
  AVAILABLE_STOCK: "/BloodInventory/available-stock",
  ADD: (donationId: number) => `/BloodInventory/add/${donationId}`,
  USE: "/BloodInventory/use",
  STOCK_TAKE: "/BloodInventory/stock-take",
} as const;
