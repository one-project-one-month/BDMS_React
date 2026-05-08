import type { RouteObject } from "react-router-dom";
import AppointmentDetailPage from "./pages/admin/appointment-detail";
import AppointmentEditPage from "./pages/admin/appointment-edit";
import AppointmentListPage from "./pages/admin/appointment-list";

export const appointmentRoutes: RouteObject = {
  path: "appointments",
  children: [
    {
      index: true,
      element: <AppointmentListPage />,
    },
    {
      path: ":id/edit",
      element: <AppointmentEditPage />,
    },
    {
      path: ":id",
      element: <AppointmentDetailPage />,
    },
  ],
};
