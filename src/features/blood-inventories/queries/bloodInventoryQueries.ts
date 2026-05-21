import { queryOptions } from "@tanstack/react-query";
import { getBloodInventories, getAvailableStock } from "../api/blood-inventory.api";
import { bloodInventoryKeys } from "./bloodInventoryKeys";
import type { BloodInventory, AvailableStock } from "../blood-inventory.types";

/** Query options for the full ledger */
export const getBloodInventoriesQueryOptions = queryOptions<BloodInventory[]>({
  queryKey: bloodInventoryKeys.list(),
  queryFn: getBloodInventories,
});

/** Query options for the aggregated available stock */
export const getAvailableStockQueryOptions = (params?: { hospitalId?: number; bloodGroup?: string }) =>
  queryOptions<AvailableStock[]>({
    queryKey: bloodInventoryKeys.available(params),
    queryFn: () => getAvailableStock(params),
  });
