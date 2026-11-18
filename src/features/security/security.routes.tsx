import { Navigate, type RouteObject } from "react-router-dom";
import SecurityLayout from "./pages/security-layout";
import SecurityUsersPage from "./pages/security-users-page";
import SecurityRolesPage from "./pages/security-roles-page";
import SecurityPermissionsPage from "./pages/security-permissions-page";

export const securityRoutes: RouteObject = {
  path: "security",
  element: <SecurityLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="roles" replace />,
    },
    {
      path: "users",
      element: <SecurityUsersPage />,
    },
    {
      path: "roles",
      element: <SecurityRolesPage />,
    },
    {
      path: "permissions",
      element: <SecurityPermissionsPage />,
    },
  ],
};
