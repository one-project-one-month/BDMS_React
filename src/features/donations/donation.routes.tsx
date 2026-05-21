import type { RouteObject } from "react-router-dom";
import DonationListPage from "./pages/admin/donation-list";
import DonationCreatePage from "./pages/admin/donation-create";
import DonationEditPage from "./pages/admin/donation-edit";
import DonationDetailPage from "./pages/admin/donation-detail";

export const donationRoutes: RouteObject = {
    path: "donations",
    children: [
        {
            index: true,
            element: <DonationListPage />,
        },
        {
            path: "create",
            element: <DonationCreatePage />
        },
        {
            path: ":id/edit",
            element: <DonationEditPage />
        },
        {
            path: ":id",
            element: <DonationDetailPage />
        }
    ],
};