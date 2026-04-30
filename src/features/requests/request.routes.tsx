import type { RouteObject } from "react-router-dom";

// -- User Pages -- //
import UserRequestCreatePage from "./pages/user/request-create";
import UserRequestListPage from "./pages/user/request-list";

// -- Admin Pages -- //
import AdminRequestListPage from "./pages/admin/request-list";
import AdminRequestCreatePage from "./pages/admin/request-create";
import AdminRequestEditPage from "./pages/admin/request-edit";
import AdminRequestDetailPage from "./pages/admin/request-detail";

export const bloodRequestUserRoutes: RouteObject = {
  path: "blood-requests",
  children: [
    {
      index: true,
      element: <UserRequestListPage />,
    },
    {
      path: "create",
      element: <UserRequestCreatePage />,
    },
  ],
};

export const bloodRequestAdminRoutes: RouteObject = {
  path: "blood-requests",
  children: [
    {
      index: true,
      element: <AdminRequestListPage />,
    },
    {
      path: "create",
      element: <AdminRequestCreatePage />,
    },
    {
      path: ":requestId/edit",
      element: <AdminRequestEditPage />,
    },
    {
      path: ":requestId",
      element: <AdminRequestDetailPage />,
    },
  ],
};
