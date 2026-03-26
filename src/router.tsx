import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "@/layouts/guest-layout";
import DemoPage from "@/components/demo";
import AnnouncementPage from "./features/announcements/announcement-page";

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
        path: "/login", // login
      },
      {
        path: "/register", // register
      },
    ],
  },
]);
