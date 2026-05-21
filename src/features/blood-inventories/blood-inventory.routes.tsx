import type { RouteObject } from "react-router-dom";
import BloodInventoryListPage from "./pages/blood-inventory-list";

export const bloodInventoryRoutes: RouteObject = {
  path: "blood-inventories",
  children: [
    {
      index: true,
      element: <BloodInventoryListPage />,
    },
  ],
};
