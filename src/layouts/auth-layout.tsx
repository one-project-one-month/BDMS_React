import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/context/auth/useAuth";
import Container from "@/components/container";
import Section from "@/components/section";

export default function AuthLayout() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    if (user.roleName === "admin" || user.roleName === "staff") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container>
      <Section className="flex flex-col min-h-screen items-center justify-center">
        <div className="mb-4">
          <img
            src="/images/logo.png"
            alt="blood-life-logo"
            fetchPriority="high"
            loading="eager"
            width={225}
            height={55}
            title="blood life logo"
          />
        </div>
        <Outlet />
      </Section>
    </Container>
  );
}
