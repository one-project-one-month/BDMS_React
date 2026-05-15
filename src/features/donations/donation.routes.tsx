import type { RouteObject } from "react-router-dom";
import DonationListPage from "./pages/admin/donation-list";
import DonationCreatePage from "./pages/admin/donation-create";
import DonationEditPage from "./pages/admin/donation-edit";
import DonationDetailPage from "./pages/admin/donation-detail";
import ClientDonationCreatePage from "./pages/client/donation-create";
import ClientDonationDetailPage from "./pages/client/donation-detail";
import ClientDonationListPage from "./pages/client/donation-list";

export const clientDonationRoutes: RouteObject = {
  path: "donations",
  children: [
    {
      index: true,
      element: <ClientDonationListPage />,
    },
    {
      path: "create",
      element: <ClientDonationCreatePage />,
    },
    {
      path: ":id",
      element: <ClientDonationDetailPage />,
    },
  ],
};

export const donationRoutes: RouteObject = {
  path: "donations",
  children: [
    {
      index: true,
      element: <DonationListPage />,
    },
    {
      path: "create",
      element: <DonationCreatePage />,
    },
    {
      path: ":id/edit",
      element: <DonationEditPage />,
    },
    {
      path: ":id",
      element: <DonationDetailPage />,
    },
  ],
};
