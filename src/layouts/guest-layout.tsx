import { Outlet } from "react-router-dom";
/** edited by KK */
import { Navbar } from "@/components/nav/nav-bar";
import { Footer } from "@/components/footer/footer";
export default function GuestLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={false} />
      {/*  Main content area */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}