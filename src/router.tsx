import { createBrowserRouter } from "react-router-dom";

import GuestLayout from "@/layouts/guest-layout";
import DashboardLayout from "@/layouts/dashboard-layout";

import ForbiddenPage from "@/pages/forbidden-page";
import NotFoundPage from "@/pages/not-found-page";
import ErrorPage from "@/pages/error-page";

import DemoPage from "@/components/demo";
import ProtectedRoute from "@/features/auth/components/protected-route";
import { authRoutes } from "@/features/auth/auth.routes";

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      /** public routes */
      {
        path: "/",
        element: <GuestLayout />,
        children: [
          {
            index: true,
            element: <div>Home</div>,
          },
          {
            // TODO: remove this in production
            path: "ui",
            element: <DemoPage />,
          },
          {
            path: "announcements",
            element: <div>Announcements</div>,
          },
        ],
      },

      /** auth routes */
      authRoutes,

      /** user dashboard */
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowed={["user"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <div>Client Dashboard Page</div>,
          },
        ],
      },

      /** admin / staff dashboard */
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowed={["admin", "staff"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <div>Admin Dashboard Page</div>,
          },
        ],
      },

      /** forbidden */
      {
        path: "unauthorized",
        element: <ForbiddenPage />,
      },

      /** 404 */
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
