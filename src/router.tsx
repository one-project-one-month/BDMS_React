import { createBrowserRouter } from "react-router-dom";

import GuestLayout from "@/layouts/guest-layout";
import DashboardLayout from "@/layouts/dashboard-layout";

import ForbiddenPage from "@/pages/forbidden-page";
import NotFoundPage from "@/pages/not-found-page";
import ErrorPage from "@/pages/error-page";

import DemoPage from "@/components/demo";
import ProtectedRoute from "@/features/auth/components/protected-route";
import { authRoutes } from "@/features/auth/auth.routes";
import AnnouncementPage from "@/features/announcements/pages/website/announcement-page";
import {
  bloodRequestAdminRoutes,
  bloodRequestUserRoutes,
} from "@/features/requests/request.routes";
import { userRoutes } from "@/features/users/user.routes";
import { donorRoutes } from "./features/donors/donor.routes";
import ClientDashboardLayout from "./features/client-dashboard/pages/client-dashboardLayout";
import { certificateRoutes } from "@/features/certificates/certificate.routes";
import { donationRoutes } from "./features/donations/donation.routes";

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      /** public routes */
      {
        path: "/",
        element: <GuestLayout />,
        children: [
          /** [start] commented by KK to remove the text "Home" in guestLayout*/
          // {
          //   index: true,
          //   element: <div>Home</div>,
          // },
          /** [end] commented by KK to remove the text "Home" in guestLayout*/
          {
            // TODO: remove this in production
            path: "ui",
            element: <DemoPage />,
          },
          {
            path: "announcements",
            element: <AnnouncementPage />,
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
            element: <ClientDashboardLayout />,
          },
          {
            path: "donations",
            element: <div>Client Donations Page</div>,
          },
          bloodRequestUserRoutes,
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
          /** user */
          userRoutes,
          donorRoutes,
          // {
          //   path: "donors",
          //   element: (
          //     <ProtectedRoute allowed={["admin"]}>
          //       <DonorPage />
          //     </ProtectedRoute>
          //   ),
          // },
          {
            path: "announcements",
            element: (
              <ProtectedRoute allowed={["admin"]}>
                <div>Admin Announcements Page</div>
              </ProtectedRoute>
            ),
          },
          //certificates
          certificateRoutes,
          {
            path: "settings",
            element: (
              <ProtectedRoute allowed={["admin"]}>
                <div>Admin Settings Page</div>
              </ProtectedRoute>
            ),
          },
          // donations
          donationRoutes,
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
