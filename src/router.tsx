import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "@/layouts/guest-layout";
import DashboardLayout from "@/layouts/dashboard-layout";
import ProtectedRoute from "@/features/auth/components/protected-route";
import AnnouncementPage from "./features/announcements/pages/website/announcement-page";
export const router = createBrowserRouter([
  {
    children: [
      /** Public Routes */
      {
        path: "/",
        element: <GuestLayout />,
        children: [
          {
            index: true,
            element: <div>Home</div>,
          },
          {
            path: "announcements",
            element: <AnnouncementPage/>,
          },
        ],
      },

      /** User Dashboard */
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
            element: <div>User Dashboard</div>,
          },
        ],
      },

      /** Admin Dashboard */
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
            element: <div>Admin Dashboard</div>,
          },
        ],
      },
    ],
  },
]);