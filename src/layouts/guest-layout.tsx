import { Outlet, useLocation } from "react-router-dom";
/** edited by KK */
import { Navbar } from "@/components/nav/nav-bar";
import { Footer } from "@/components/footer/footer";
import useAuth from "@/context/auth/useAuth";
import HeroSection from '@/features/home/components/hero-section';
import ImpactSection from '@/features/home/components/impact-section';
import BloodAvailability from '@/features/home/components/blood-availability';
import HowItWorks from '@/features/home/components/how-it-work';

export default function GuestLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAnnouncementPage = location.pathname === '/announcements';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={isAuthenticated} activePage={isHomePage ? 'home' : isAnnouncementPage ? 'announcements' : undefined} />
      {!isAnnouncementPage && isHomePage && <HeroSection />}
      {!isAnnouncementPage && isHomePage && <ImpactSection />}
      {!isAnnouncementPage && isHomePage && <BloodAvailability />}
      {!isAnnouncementPage && isHomePage && <HowItWorks />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}