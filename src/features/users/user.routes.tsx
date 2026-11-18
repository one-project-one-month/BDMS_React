import { Navigate, type RouteObject } from "react-router-dom";
import UserCreatePage from "./pages/user-create";
import UserDetailPage from "./pages/user-detail";
import UserEditPage from "./pages/user-edit";
import UserErrorPage from "./pages/user-error";

export const userRoutes: RouteObject = {
  path: "users",
  errorElement: <UserErrorPage />,
  children: [
    {
      index: true,
      element: <Navigate to="/admin/security/users" replace />,
    },
    {
      path: "create",
      element: <UserCreatePage />,
    },
    {
      path: ":userId/edit",
      element: <UserEditPage />,
    },
    {
      path: ":userId",
      element: <UserDetailPage />,
    },
  ],
};
