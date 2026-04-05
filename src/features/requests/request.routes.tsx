import type { RouteObject } from "react-router-dom";
import RequestCreatePage from "./pages/request-create";
import RequestDetailPage from "./pages/request-detail";
import RequestEditPage from "./pages/request-edit";
import RequestListPage from "./pages/request-list";

export const bloodRequestUserRoutes: RouteObject = {
  path: "blood-requests",
  element: <RequestCreatePage />,
};

export const bloodRequestAdminRoutes: RouteObject = {
  path: "blood-requests",
  children: [
    {
      index: true,
      element: <RequestListPage />,
    },
    {
      path: ":requestId/edit",
      element: <RequestEditPage />,
    },
    {
      path: ":requestId",
      element: <RequestDetailPage />,
    },
  ],
};