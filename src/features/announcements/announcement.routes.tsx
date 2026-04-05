import type { RouteObject } from "react-router-dom";
import AnnouncementPage from "./pages/website/announcement-page";
import AnnouncementCreatePage from "./pages/admin/announcement-create-page";
import AnnouncementEditPage from "./pages/admin/announcement-edit-page";


export const announcementRoutes: RouteObject = {
  path: "admins", 
  children: [
    {
      index: true, 
      element: <AnnouncementPage/>,
    }, 
    {
      path: "create", 
      element: <AnnouncementCreatePage/>,
    }, 
    {
      path: ":announcementId/edit", 
      element: <AnnouncementEditPage/>    
    }
  ]
}