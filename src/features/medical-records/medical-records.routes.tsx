import type { RouteObject } from "react-router-dom";
import MedicalRecordListPage from "./pages/medical-record-list";
import MedicalRecordEditPage from "./pages/medical-record-edit";
import MedicalRecordDetailPage from "./pages/medical-record-detail";
import MedicalRecordCreatePage from "./pages/medical-record-create";

export const medicalRecordRoutes: RouteObject = {
  path: "medical-records",
  children: [
    {
      index: true,
      element: <MedicalRecordListPage />,
    },
    {
      path: "create",
      element: <MedicalRecordCreatePage />,
    },
    {
      path: ":id/edit",
      element: <MedicalRecordEditPage />,
    },
    {
      path: ":id",
      element: <MedicalRecordDetailPage />,
    },
  ],
};
