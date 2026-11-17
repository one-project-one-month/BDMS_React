import type { RouteObject } from "react-router-dom";
import AppointmentCreatePage from "./pages/admin/appointment-create";
import AppointmentDetailPage from "./pages/admin/appointment-detail";
import AppointmentEditPage from "./pages/admin/appointment-edit";
import AppointmentListPage from "./pages/admin/appointment-list";
import ClientAppointmentListPage from "./pages/client/appointment-list";

export const clientAppointmentRoutes: RouteObject = {
  path: "appointments",
  children: [
    {
      index: true,
      element: <ClientAppointmentListPage />,
    },
  ],
};

export const appointmentRoutes: RouteObject = {
  path: "appointments",
  children: [
    {
      index: true,
      element: <AppointmentListPage />,
    },
    {
      path: "create",
      element: <AppointmentCreatePage />,
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
