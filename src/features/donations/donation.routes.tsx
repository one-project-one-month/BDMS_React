import type { RouteObject } from "react-router-dom";
import DonationListPage from "./pages/donation-list";

export const donationRoutes: RouteObject = {
    path: "donations",
    children: [
        {
            index: true,
            element: <DonationListPage />,
        },],
};