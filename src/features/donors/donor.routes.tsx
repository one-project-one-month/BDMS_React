import type { RouteObject } from "react-router-dom";
// import DonorDetailPage from "./pages/donor-detail";
// import DonorEditPage from "./pages/donor-edit";
import DonorListPage from "./pages/donor-list-page";
import DonorCreatePage from "./pages/donor-create-page";
import DonorDetailPage from "./pages/donor-detail-page";
import DonorEditPage from "./pages/donor-edit-page";
import DonorErrorPage from "./pages/donor-error-page";

export const donorRoutes: RouteObject = {
  path: "donors",
  errorElement: <DonorErrorPage />,
  children: [
    {
      index: true,
      element: <DonorListPage />,
    },
    {
      path: "create",
      element: <DonorCreatePage />,
    },
    {
      path: ":donorId/edit",
      element: <DonorEditPage />,
    },
    {
      path: ":donorId",
      element: <DonorDetailPage />,
    },
  ],
};
