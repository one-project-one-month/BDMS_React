import type { RouteObject } from "react-router-dom";
import DonationListPage from "./pages/donation-list";
import DonationCreatePage from "./pages/donation-create";
import DonationEditPage from "./pages/donation-edit";
import DonationDetailPage from "./pages/donation-detail";

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