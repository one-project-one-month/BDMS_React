import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "@/layouts/guest-layout";
import DemoPage from "@/components/demo";
import AnnouncementPage from "./features/announcements/announcement-page";
import AnnouncementCreatePage from "./features/announcements/announcement-create-page";
import AnnouncementEditPage from "./features/announcements/announcement-edit-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/ui",
        element: <DemoPage />,
      },
      {
        index: true, // home
      },
      {
        path: "/announcements", // announcements
        element: <AnnouncementPage />
      },
      {
        path: "/announcements/create", // announcements
        element: <AnnouncementCreatePage />
      },
      {
        path: "/announcements/:id/edit", // announcements
        element: <AnnouncementEditPage />
      },
      {
        path: "/login", // login
      },
      {
        path: "/register", // register
      },
    ],
  },
]);
