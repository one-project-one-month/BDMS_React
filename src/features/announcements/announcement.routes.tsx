import type { RouteObject } from "react-router-dom";
import AnnouncementCreatePage from "./pages/admin/announcement-create-page";
import AnnouncementEditPage from "./pages/admin/announcement-edit-page";
import AnnouncementListPage from "./pages/admin/announcement-list";

export const announcementRoutes: RouteObject = {
  path: "announcements",
  children: [
    {
      index: true,
      element: <AnnouncementListPage />,
    },
    {
      path: "create",
      element: <AnnouncementCreatePage />,
    },
    {
      path: ":announcementId/edit",
      element: <AnnouncementEditPage />,
    },
  ],
};
