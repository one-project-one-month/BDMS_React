import { useState } from "react";
/** edited by KK */
import {
  DashboardSidebar,
  type DashboardSidebarItem,
} from "@/components/dashboard-sidebar/dashboardSidebar";
import { DashboardTopNavbar } from "@/components/dashboard-nav/dashboardNav";

export default function DashboardLayout() {
  const [activeItem, setActiveItem] =
    useState<DashboardSidebarItem>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDonateItem, setShowDonateItem] = useState(false);

  const handleBecomeDonorClick = () => {
    setShowDonateItem(true);
    setActiveItem("donate");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        onItemChange={setActiveItem}
        showDonateItem={showDonateItem}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopNavbar
          userName="Zar Ni"
          onMenuClick={() => setSidebarOpen(true)}
          onBecomeDonorClick={handleBecomeDonorClick}
          showBecomeDonorButton={!showDonateItem}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeItem === "dashboard" && <div>Dashboard content</div>}
          {activeItem === "donate" && <div>Donate content</div>}
          {activeItem === "request" && <div>Request content</div>}
          {activeItem === "appointment" && <div>Appointment content</div>}
          {activeItem === "records" && <div>Records content</div>}
          {activeItem === "profile" && <div>Profile content</div>}
          {activeItem === "settings" && <div>Settings content</div>}
        </main>
      </div>
    </div>
  );
}