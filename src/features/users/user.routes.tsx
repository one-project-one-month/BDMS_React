import type { RouteObject } from "react-router-dom";
import UserCreatePage from "./pages/user-create";
import UserDetailPage from "./pages/user-detail";
import UserEditPage from "./pages/user-edit";
import UserErrorPage from "./pages/user-error";
import UserListPage from "./pages/user-list";

export const userRoutes: RouteObject = {
  path: "users",
  errorElement: <UserErrorPage />,
  children: [
    {
      index: true,
      element: <UserListPage />,
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
