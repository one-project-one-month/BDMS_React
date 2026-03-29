import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { DashboardNavSkeleton } from "@/components/dashboard-nav-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/context/auth/useAuth";
import { LogOut } from "lucide-react";

interface DashboardTopNavbarProps {
  onMenuClick?: () => void;
}

export function DashboardTopNavbar({ onMenuClick }: DashboardTopNavbarProps) {
  const { user, logout } = useAuth();
  const isUserRole = user?.roleName === "user";

  const handleLogout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await logout();
  };

  const profileRoute =
    user?.roleName === "admin" || user?.roleName === "staff"
      ? "/admin/profile"
      : "/client/profile";

  return (
    <header className="w-full bg-background font-[Roboto]">
      <div className="flex items-center justify-between py-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-md p-2 text-primary transition hover:bg-primary/10 lg:hidden"
            aria-label="Open sidebar"
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 shrink-0"
            >
              <path
                d="M5 9C5 7.89375 5.89375 7 7 7H31C32.1063 7 33 7.89375 33 9C33 10.1063 32.1063 11 31 11H7C5.89375 11 5 10.1063 5 9ZM5 19C5 17.8938 5.89375 17 7 17H31C32.1063 17 33 17.8938 33 19C33 20.1062 32.1063 21 31 21H7C5.89375 21 5 20.1062 5 19ZM33 29C33 30.1063 32.1063 31 31 31H7C5.89375 31 5 30.1063 5 29C5 27.8937 5.89375 27 7 27H31C32.1063 27 33 27.8937 33 29Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4 lg:gap-5">
          <Link
            to="/"
            className="hidden text-primary transition hover:opacity-80 md:block"
          >
            <Typography
              as="span"
              variant="body"
              className="text-sm! font-medium"
            >
              Home
            </Typography>
          </Link>

          <Link
            to="/announcements"
            className="hidden text-primary transition hover:opacity-80 md:block"
          >
            <Typography
              as="span"
              variant="body"
              className="text-sm! font-medium"
            >
              Announcements
            </Typography>
          </Link>

          {user ? (
            <>
              {isUserRole && !user.donor && (
                <Button
                  type="button"
                  variant="outline"
                  website="outline"
                  className="h-10 border-primary bg-transparent px-4 text-primary shadow-none hover:bg-primary hover:text-primary-foreground"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M9.6109 10.2062L7.53936 13.2187C7.18942 13.7281 7.00195 14.3312 7.00195 14.9469L7.00195 15C7.00195 16.6562 8.34548 18 10.0015 18C11.6574 18 13.001 16.6562 13.001 15L13.001 14.9469C13.001 14.3281 12.8135 13.7281 12.4636 13.2187L10.392 10.2062C10.3045 10.0781 10.1577 10 10.0015 10C9.84524 10 9.69839 10.0781 9.6109 10.2062ZM15.5849 7.32812L16.916 6L18.0002 6C18.5532 6 19 5.55313 19 5L19 3C19 2.44687 18.5532 2 18.0002 2L7.98617 2C7.08006 2 6.19583 2.29062 5.4647 2.82812L1.5091 5.74375C0.952935 6.15312 0.834207 6.93437 1.24351 7.49062C1.65282 8.04687 2.43394 8.16562 2.9901 7.75625L6.73325 5L10.2514 5C10.667 5 11.0013 5.33437 11.0013 5.75C11.0013 6.16562 10.667 6.5 10.2514 6.5L8.00179 6.5C7.44876 6.5 7.00195 6.94687 7.00195 7.5C7.00195 8.05312 7.44876 8.5 8.00179 8.5L12.7573 8.5C13.8165 8.5 14.8351 8.07812 15.5849 7.32812Z"
                      fill="currentColor"
                    />
                  </svg>

                  <Typography
                    as="span"
                    variant="body"
                    className="text-sm! font-medium"
                  >
                    <span className="hidden sm:inline">Become a Donor</span>
                    <span className="sm:hidden">Donate</span>
                  </Typography>
                </Button>
              )}

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    website="outline"
                    className="group h-10 border-primary bg-transparent px-4 text-primary shadow-none hover:bg-primary hover:text-primary-foreground"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    >
                      <path
                        d="M10.2275 9.57143C12.6182 9.57143 14.5545 7.65357 14.5545 5.28571C14.5545 2.91786 12.6182 1 10.2275 1C7.83691 1 5.90062 2.91786 5.90062 5.28571C5.90062 7.65357 7.83691 9.57143 10.2275 9.57143ZM9.15663 11.5714C5.60494 11.5714 2.72754 14.4214 2.72754 17.9393C2.72754 18.525 3.20711 19 3.79845 19H16.6566C17.248 19 17.7275 18.525 17.7275 17.9393C17.7275 14.4214 14.8501 11.5714 11.2985 11.5714H9.15663Z"
                        fill="currentColor"
                      />
                    </svg>
                    <Typography
                      as="span"
                      variant="body"
                      className="text-sm! font-medium"
                    >
                      {user.userName}
                    </Typography>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    >
                      <path
                        d="M9.6809 15.5357C10.0449 16.1548 10.9551 16.1548 11.3191 15.5357L17.8719 4.39286C18.2359 3.77381 17.7809 3 17.0528 3H3.94722C3.21914 3 2.76408 3.77381 3.12813 4.39286L9.6809 15.5357Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="justify-center">
                      <Link
                        to={profileRoute}
                        className="flex items-center justify-center gap-2 w-full"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        >
                          <path
                            d="M10.2275 9.57143C12.6182 9.57143 14.5545 7.65357 14.5545 5.28571C14.5545 2.91786 12.6182 1 10.2275 1C7.83691 1 5.90062 2.91786 5.90062 5.28571C5.90062 7.65357 7.83691 9.57143 10.2275 9.57143ZM9.15663 11.5714C5.60494 11.5714 2.72754 14.4214 2.72754 17.9393C2.72754 18.525 3.20711 19 3.79845 19H16.6566C17.248 19 17.7275 18.525 17.7275 17.9393C17.7275 14.4214 14.8501 11.5714 11.2985 11.5714H9.15663Z"
                            fill="currentColor"
                          />
                        </svg>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <form id="logout-form" onSubmit={handleLogout}>
                      <Button
                        type="submit"
                        variant={"default"}
                        className="w-full"
                      >
                        <LogOut className="size-4" />
                        Log out
                      </Button>
                    </form>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <DashboardNavSkeleton />
          )}
        </div>
      </div>
    </header>
  );
}
