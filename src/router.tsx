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
        path: "/client",
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
          {
            path: "donations",
            element: <div>Client Donations Page</div>,
          },
          {
            path: "blood-requests",
            element: <div>Client Blood Requests Page</div>,
          },
          {
            path: "appointments",
            element: <div>Client Appointments Page</div>,
          },
          {
            path: "certificates",
            element: <div>Client Certificates Page</div>,
          },
          {
            path: "profile",
            element: <div>Client Profile Page</div>,
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
          {
            path: "users",
            element: (
              <ProtectedRoute allowed={["admin"]}>
                <div>Admin Users Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "donors",
            element: (
              <ProtectedRoute allowed={["admin"]}>
                <div>Admin Donors Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "announcements",
            element: (
              <ProtectedRoute allowed={["admin"]}>
                <div>Admin Announcements Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "certificates",
            element: (
              <ProtectedRoute allowed={["admin"]}>
                <div>Admin Certificates Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute allowed={["admin"]}>
                <div>Admin Settings Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "donations",
            element: (
              <ProtectedRoute allowed={["admin", "staff"]}>
                <div>Admin Donations Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "blood-requests",
            element: (
              <ProtectedRoute allowed={["admin", "staff"]}>
                <div>Admin Blood Requests Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "appointments",
            element: (
              <ProtectedRoute allowed={["admin", "staff"]}>
                <div>Admin Appointments Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "medical-records",
            element: (
              <ProtectedRoute allowed={["admin", "staff"]}>
                <div>Admin Medical Records Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "blood-inventories",
            element: (
              <ProtectedRoute allowed={["admin", "staff"]}>
                <div>Admin Blood Inventories Page</div>
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute allowed={["admin", "staff"]}>
                <div>Admin Profile Page</div>
              </ProtectedRoute>
            ),
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
