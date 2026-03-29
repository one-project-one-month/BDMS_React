import { Outlet } from "react-router-dom";
/** edited by KK */
import { Navbar } from "@/components/nav/nav-bar";
import { Footer } from "@/components/footer/footer";
import useAuth from "@/context/auth/useAuth";
export default function GuestLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={isAuthenticated} />
      {/*  Main content area */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}