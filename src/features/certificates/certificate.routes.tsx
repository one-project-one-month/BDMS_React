import type { RouteObject } from "react-router-dom";
import CertificateCreatePage from "./pages/admin/certificate-create";
import CertificateDetailPage from "./pages/admin/certificate-detail";
import CertificateListPage from "./pages/admin/certificate-list";

export const certificateRoutes: RouteObject = {
  path: "certificates",
  children: [
    {
      index: true,
      element: <CertificateListPage />,
    },
    {
      path: "create",
      element: <CertificateCreatePage />,
    },
    {
      path: ":certificateId",
      element: <CertificateDetailPage />,
    },
  ],
};