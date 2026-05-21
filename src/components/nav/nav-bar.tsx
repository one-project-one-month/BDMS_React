import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Container from "../container";
import { Menu, X, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useAuth from "@/context/auth/useAuth";

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  activePage?: "home" | "announcements" | "dashboard";
}

type NavKey = "home" | "announcements" | "dashboard";

type NavItem = {
  key: NavKey;
  label: string;
  href: string;
};

const guestItems: NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "announcements", label: "Announcements", href: "/announcements" },
];

export function Navbar({ isLoggedIn = false, activePage }: NavbarProps) {
  const { user, logout } = useAuth();

  const handleLogout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logout();
  };

  const profileRoute =
    user?.roleName === "admin" || user?.roleName === "user"
      ? "/admin/profile"
      : "/client/profile";

  const dashboardRoute =
    user?.roleName === "admin" || user?.roleName === "user"
      ? "/admin"
      : "/client";

  const isUserRole = user?.roleName === "user";

  const [currentPage, setCurrentPage] = useState<NavKey>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authItems: NavItem[] = [
    { key: "home", label: "Home", href: "/" },
    { key: "announcements", label: "Announcements", href: "/announcements" },
    { key: "dashboard", label: "Dashboard", href: dashboardRoute },
  ];

  // Choose which links to show based on login status
  const currentNavItems = isLoggedIn ? authItems : guestItems;

  useEffect(() => {
    if (activePage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(activePage);
      return;
    }

    const pathname = window.location.pathname;

    if (pathname === "/announcements") {
      setCurrentPage("announcements");
    } else if (pathname === "/dashboard") {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("home");
    }
  }, [activePage]);

  const focusStyles =
    "focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50 rounded-[10px] outline-none";

  return (
    <nav className="w-full bg-primary text-primary-foreground shadow font-[Roboto]">
      <Container className="max-w-7xl py-4">
        <div className="flex w-full items-center justify-between ">
          {/* LEFT - Logo */}
          <Link
            to="/"
            className={cn(
              "flex shrink-0 items-center transition-opacity hover:opacity-90 lg:-ml-2 xl:-ml-5",
              focusStyles,
            )}
          >
            <span className="sr-only">Go to Home Page</span>
            <svg
              aria-hidden="true"
              width="164"
              height="40"
              viewBox="0 0 164 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.4675 23.4381C9.74038 23.4381 8.33911 22.0233 8.33911 20.2793C8.33911 18.7789 10.4606 15.7696 11.0537 14.9569C11.1498 14.8252 11.3013 14.7512 11.4643 14.7512H11.4708C11.6337 14.7512 11.7853 14.8252 11.8814 14.9569C12.4745 15.7696 14.5959 18.7789 14.5959 20.2793C14.5959 22.0233 13.1946 23.4381 11.4675 23.4381ZM10.164 20.1477C10.164 19.9289 9.98967 19.7527 9.77296 19.7527C9.55626 19.7527 9.38191 19.9289 9.38191 20.1477C9.38191 21.3832 10.3742 22.3852 11.5979 22.3852C11.8146 22.3852 11.9889 22.2091 11.9889 21.9904C11.9889 21.7714 11.8146 21.5954 11.5979 21.5954C10.806 21.5954 10.164 20.9473 10.164 20.1477Z"
                fill="white"
              />
              <path
                d="M22.7363 8.45548L23.4238 5.87961L24.7529 5.1101C25.4309 4.7176 25.6623 3.8509 25.2707 3.17063L23.8545 0.710973C23.4628 0.030727 22.5985 -0.201733 21.9205 0.190771L9.64739 7.296C8.53652 7.93912 7.65826 8.92412 7.14253 10.1041L4.35761 16.4974C3.96566 17.3955 4.37331 18.4405 5.26901 18.8343C6.16469 19.2278 7.20643 18.8193 7.59838 17.9212L10.2318 11.877L14.5451 9.37996C15.0545 9.08502 15.7012 9.25895 15.9954 9.77011C16.2898 10.2813 16.1166 10.9298 15.6072 11.2247L12.8492 12.8214C12.1712 13.2139 11.9399 14.0806 12.3315 14.7608C12.7232 15.4412 13.5874 15.6737 14.2654 15.2811L20.0956 11.9058C21.3941 11.1541 22.3442 9.91231 22.7324 8.45771L22.7363 8.45548ZM2.72879 31.5425L2.03742 34.1204L0.708214 34.8899C0.030219 35.2825 -0.201121 36.1491 0.190565 36.8293L1.60678 39.2891C1.99844 39.9693 2.86266 40.2017 3.54068 39.8092L15.8176 32.7019C16.9286 32.0587 17.8068 31.0737 18.3225 29.8938L21.1073 23.5006C21.4994 22.6023 21.0918 21.5573 20.196 21.1638C19.3002 20.77 18.2585 21.1785 17.8666 22.0766L15.2292 28.123L10.9161 30.6202C10.4067 30.915 9.76003 30.741 9.4657 30.2299C9.1714 29.7188 9.3445 29.0703 9.85396 28.7754L12.612 27.1787C13.2899 26.7861 13.5213 25.9195 13.1296 25.2393C12.738 24.5589 11.8738 24.3264 11.1957 24.7189L5.36562 28.0942C4.06708 28.846 3.11704 30.0878 2.72879 31.5425Z"
                fill="white"
              />
              <path
                d="M156.555 30.0882C155.506 30.0693 154.575 29.8658 153.762 29.4777C152.959 29.0801 152.292 28.5454 151.763 27.8733C151.234 27.1918 150.851 26.4109 150.615 25.5307C150.378 24.6409 150.298 23.6944 150.374 22.6911L150.43 22.109C150.534 21.0772 150.785 20.0834 151.182 19.1274C151.579 18.1619 152.108 17.3053 152.77 16.5576C153.441 15.8004 154.23 15.204 155.137 14.7686C156.045 14.3332 157.056 14.1297 158.171 14.1581C159.239 14.1771 160.142 14.3995 160.879 14.8254C161.617 15.2514 162.203 15.8193 162.637 16.5292C163.072 17.2296 163.36 18.0247 163.502 18.9144C163.653 19.8042 163.677 20.727 163.573 21.683L163.375 23.1454H151.862L152.259 20.6892L160.383 20.7034L160.44 20.4052C160.525 19.8089 160.492 19.2457 160.341 18.7157C160.199 18.1856 159.934 17.7502 159.547 17.4094C159.159 17.0687 158.639 16.8889 157.987 16.8699C157.278 16.851 156.669 16.9977 156.158 17.3101C155.657 17.6224 155.241 18.0436 154.911 18.5737C154.58 19.1037 154.32 19.6811 154.131 20.3058C153.951 20.9211 153.824 21.5221 153.748 22.109L153.691 22.6769C153.635 23.2353 153.649 23.789 153.734 24.338C153.819 24.887 153.984 25.3887 154.23 25.843C154.476 26.2879 154.816 26.6523 155.251 26.9363C155.686 27.2107 156.224 27.3575 156.867 27.3764C157.67 27.3953 158.398 27.2297 159.05 26.8795C159.712 26.5198 160.312 26.056 160.851 25.4881L162.496 27.2344C162.061 27.8875 161.522 28.427 160.879 28.853C160.246 29.2789 159.556 29.596 158.809 29.8042C158.072 30.003 157.321 30.0977 156.555 30.0882Z"
                fill="white"
              />
              <path
                d="M141.657 29.8043H138.311L141.175 12.9656C141.308 11.8866 141.629 10.9495 142.139 10.1544C142.65 9.34986 143.321 8.72988 144.153 8.29448C144.984 7.85908 145.958 7.64611 147.073 7.65558C147.413 7.66504 147.754 7.69344 148.094 7.74076C148.434 7.78809 148.77 7.84961 149.101 7.92534L148.774 10.5945C148.566 10.5472 148.354 10.5094 148.136 10.481C147.928 10.4526 147.716 10.4336 147.498 10.4242C146.96 10.4242 146.482 10.5283 146.067 10.7365C145.66 10.9448 145.325 11.2382 145.06 11.6168C144.805 11.9859 144.635 12.4355 144.549 12.9656L141.657 29.8043ZM147.385 14.4422L146.931 16.941H138.255L138.708 14.4422H147.385Z"
                fill="white"
              />
              <path
                d="M133.295 14.4423L130.63 29.8044H127.298L129.963 14.4423H133.295ZM130.431 10.4668C130.422 9.91786 130.601 9.46826 130.97 9.11804C131.339 8.76782 131.792 8.58798 132.331 8.57852C132.851 8.56905 133.295 8.72996 133.664 9.06125C134.042 9.38307 134.231 9.81374 134.231 10.3533C134.24 10.9022 134.056 11.3471 133.678 11.6879C133.309 12.0286 132.86 12.2037 132.331 12.2132C131.811 12.2227 131.367 12.0712 130.998 11.7589C130.63 11.437 130.441 11.0064 130.431 10.4668Z"
                fill="white"
              />
              <path
                d="M124.338 7.99634L120.552 29.8043H117.221L120.992 7.99634H124.338Z"
                fill="white"
              />
              <path
                d="M107.866 26.4252L111.056 7.99634H114.416L110.631 29.8043H107.625L107.866 26.4252ZM98.9061 22.4072L98.9344 22.1091C99.0573 21.1625 99.2794 20.216 99.6008 19.2695C99.9316 18.323 100.376 17.4569 100.933 16.6713C101.501 15.8856 102.191 15.2609 103.003 14.7971C103.826 14.3333 104.79 14.1156 105.896 14.144C106.86 14.1724 107.663 14.4233 108.306 14.8965C108.949 15.3698 109.449 15.9803 109.809 16.7281C110.177 17.4758 110.428 18.2851 110.56 19.1559C110.692 20.0172 110.735 20.8597 110.688 21.6831L110.574 22.6486C110.423 23.5194 110.168 24.3997 109.809 25.2894C109.449 26.1791 108.982 26.9932 108.405 27.7314C107.838 28.4697 107.157 29.0566 106.363 29.492C105.579 29.9274 104.681 30.1309 103.67 30.1025C102.658 30.0646 101.822 29.8091 101.16 29.3358C100.499 28.8531 99.9883 28.2331 99.6291 27.4759C99.2699 26.7092 99.0384 25.8857 98.9344 25.0054C98.8304 24.1157 98.821 23.2496 98.9061 22.4072ZM102.309 22.0807L102.28 22.3788C102.224 22.871 102.2 23.3964 102.209 23.9548C102.219 24.5133 102.295 25.048 102.436 25.5592C102.588 26.0608 102.838 26.4773 103.188 26.8086C103.547 27.1399 104.048 27.3197 104.691 27.3481C105.437 27.3765 106.099 27.2061 106.675 26.837C107.261 26.4678 107.748 25.9851 108.136 25.3888C108.523 24.7925 108.797 24.1583 108.958 23.4863L109.355 20.8881C109.383 20.4148 109.35 19.9463 109.256 19.4825C109.171 19.0187 109.015 18.5975 108.788 18.2188C108.561 17.8402 108.259 17.5326 107.88 17.296C107.512 17.0499 107.063 16.9221 106.534 16.9126C105.834 16.8842 105.229 17.0262 104.719 17.3386C104.218 17.6509 103.802 18.0674 103.471 18.588C103.15 19.1086 102.895 19.6765 102.706 20.2917C102.517 20.907 102.384 21.5033 102.309 22.0807Z"
                fill="white"
              />
              <path
                d="M80.0102 22.3788L80.0527 22.0523C80.1662 20.9922 80.4261 19.9841 80.8325 19.0281C81.2389 18.0721 81.7777 17.225 82.4488 16.4867C83.1293 15.7389 83.928 15.1568 84.8448 14.7404C85.771 14.3239 86.8013 14.1298 87.9355 14.1582C89.0319 14.1772 89.9723 14.4043 90.7568 14.8397C91.5508 15.2751 92.1935 15.8573 92.685 16.5861C93.1859 17.3054 93.5356 18.1289 93.7341 19.0565C93.9326 19.9746 93.9846 20.9354 93.8901 21.9387L93.8617 22.2652C93.7389 23.3254 93.4695 24.3287 93.0536 25.2752C92.6472 26.2217 92.1037 27.0641 91.4232 27.8024C90.7521 28.5313 89.9534 29.1039 89.0272 29.5204C88.1103 29.9274 87.0896 30.1167 85.9648 30.0883C84.8779 30.0694 83.9374 29.8469 83.1435 29.421C82.359 28.9856 81.7162 28.4082 81.2153 27.6889C80.7238 26.9695 80.3788 26.1555 80.1803 25.2468C79.9818 24.3287 79.9251 23.3727 80.0102 22.3788ZM83.3703 22.0523L83.3419 22.3788C83.2947 22.8994 83.29 23.4484 83.3278 24.0258C83.3656 24.6032 83.479 25.1427 83.668 25.6444C83.8571 26.146 84.1501 26.5578 84.547 26.8796C84.944 27.2014 85.4733 27.3718 86.1349 27.3907C86.8344 27.4096 87.444 27.2676 87.9638 26.9648C88.4837 26.6619 88.9185 26.2549 89.2682 25.7437C89.6179 25.2326 89.8967 24.6742 90.1047 24.0684C90.3126 23.4531 90.4497 22.8521 90.5158 22.2652L90.5442 21.9387C90.6009 21.4276 90.6103 20.8833 90.5725 20.3059C90.5347 19.7191 90.4213 19.1701 90.2323 18.659C90.0432 18.1384 89.7502 17.7172 89.3533 17.3954C88.9563 17.0641 88.427 16.889 87.7654 16.87C87.0565 16.8511 86.4421 16.9978 85.9223 17.3102C85.4024 17.6131 84.9676 18.0248 84.6179 18.5454C84.2682 19.066 83.9894 19.6339 83.7814 20.2491C83.583 20.8644 83.4459 21.4654 83.3703 22.0523Z"
                fill="white"
              />
              <path
                d="M61.1142 22.3788L61.1567 22.0523C61.2702 20.9922 61.5301 19.9841 61.9365 19.0281C62.3429 18.0721 62.8817 17.225 63.5528 16.4867C64.2333 15.7389 65.032 15.1568 65.9488 14.7404C66.875 14.3239 67.9053 14.1298 69.0395 14.1582C70.1359 14.1772 71.0763 14.4043 71.8608 14.8397C72.6548 15.2751 73.2975 15.8573 73.789 16.5861C74.2899 17.3054 74.6397 18.1289 74.8381 19.0565C75.0366 19.9746 75.0886 20.9354 74.9941 21.9387L74.9657 22.2652C74.8429 23.3254 74.5735 24.3287 74.1576 25.2752C73.7512 26.2217 73.2077 27.0641 72.5272 27.8024C71.8561 28.5313 71.0574 29.1039 70.1312 29.5204C69.2144 29.9274 68.1936 30.1167 67.0688 30.0883C65.9819 30.0694 65.0414 29.8469 64.2475 29.421C63.463 28.9856 62.8202 28.4082 62.3193 27.6889C61.8278 26.9695 61.4828 26.1555 61.2843 25.2468C61.0859 24.3287 61.0291 23.3727 61.1142 22.3788ZM64.4743 22.0523L64.4459 22.3788C64.3987 22.8994 64.394 23.4484 64.4318 24.0258C64.4696 24.6032 64.583 25.1427 64.772 25.6444C64.9611 26.146 65.2541 26.5578 65.651 26.8796C66.048 27.2014 66.5773 27.3718 67.2389 27.3907C67.9384 27.4096 68.548 27.2676 69.0678 26.9648C69.5877 26.6619 70.0225 26.2549 70.3722 25.7437C70.7219 25.2326 71.0007 24.6742 71.2087 24.0684C71.4166 23.4531 71.5537 22.8521 71.6198 22.2652L71.6482 21.9387C71.7049 21.4276 71.7143 20.8833 71.6765 20.3059C71.6387 19.7191 71.5253 19.1701 71.3363 18.659C71.1472 18.1384 70.8542 17.7172 70.4573 17.3954C70.0603 17.0641 69.531 16.889 68.8694 16.87C68.1605 16.8511 67.5461 16.9978 67.0263 17.3102C66.5064 17.6131 66.0716 18.0248 65.7219 18.5454C65.3722 19.066 65.0934 19.6339 64.8855 20.2491C64.687 20.8644 64.5499 21.4654 64.4743 22.0523Z"
                fill="white"
              />
              <path
                d="M57.686 7.99634L53.9006 29.8043H50.5688L54.3401 7.99634H57.686Z"
                fill="white"
              />
              <path
                d="M38.9743 21.0157H33.601L34.154 17.7502L38.0953 17.7644C38.6719 17.7644 39.2248 17.6982 39.7541 17.5656C40.2929 17.4237 40.7465 17.1776 41.1152 16.8274C41.4932 16.4771 41.7343 15.9802 41.8382 15.3366C41.9233 14.7497 41.876 14.2907 41.6964 13.9594C41.5169 13.6186 41.2286 13.3773 40.8316 13.2353C40.4441 13.0838 39.981 13.0034 39.4422 12.9939L36.8477 12.9797L33.9271 29.8043H29.0784L32.6511 9.13208L39.5982 9.14628C40.4961 9.15574 41.3845 9.25513 42.2636 9.44443C43.1426 9.63374 43.9318 9.94136 44.6312 10.3673C45.3306 10.7838 45.8788 11.3517 46.2758 12.071C46.6728 12.7809 46.8382 13.6707 46.772 14.7403C46.7059 15.9045 46.3798 16.851 45.7938 17.5798C45.2172 18.2992 44.4705 18.834 43.5537 19.1842C42.6369 19.525 41.6445 19.7095 40.5764 19.7379L38.9743 21.0157ZM37.3297 29.8043H30.808L33.1332 25.9708L37.4857 25.985C38.0244 25.9755 38.5301 25.8856 39.0027 25.7153C39.4847 25.5449 39.8864 25.2798 40.2078 24.9202C40.5386 24.551 40.7513 24.0825 40.8458 23.5146C40.9309 23.0318 40.9214 22.6106 40.8174 22.251C40.7229 21.8818 40.5244 21.5931 40.222 21.3849C39.929 21.1766 39.532 21.0583 39.0311 21.0299L34.7069 21.0157L35.3023 17.7502L40.0093 17.7644L40.86 19.0564C41.8146 19.0659 42.6605 19.2363 43.3978 19.5676C44.135 19.8988 44.7021 20.4005 45.0991 21.0725C45.5055 21.7351 45.6756 22.568 45.6095 23.5714C45.5149 25.1142 45.0707 26.3447 44.2768 27.2628C43.4828 28.1715 42.4715 28.8246 41.2428 29.2221C40.014 29.6197 38.7097 29.8137 37.3297 29.8043Z"
                fill="white"
              />
            </svg>
          </Link>

          {/* DESKTOP RIGHT - Nav + Actions */}
          <div className="hidden items-center gap-5 lg:flex lg:ml-auto lg:translate-x-2 xl:gap-8 xl:translate-x-10">
            {/* Navigation links */}
            <div className="flex items-center gap-5">
              {currentNavItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => setCurrentPage(item.key)}
                  className={cn(
                    "relative flex px-1 items-center py-1 transition-all",
                    "before:content-[''] before:absolute before:left-1/2 before:-bottom-0.5 before:-translate-x-1/2 before:h-0.75 before:w-12.5 before:rounded-[3px] before:bg-secondary before:transition-all",
                    currentPage === item.key
                      ? "opacity-100 before:scale-x-100"
                      : "opacity-90 hover:opacity-100 before:scale-x-0",
                  )}
                >
                  <Typography
                    as={"p"}
                    variant={"body"}
                    className="text-sm! text-center font-semibold"
                  >
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-5">
              {!isLoggedIn ? (
                <>
                  <Button
                    asChild
                    variant="outline"
                    website="outline"
                    className="rounded-[10px] border-2 border-secondary bg-transparent p-5 text-secondary shadow-none hover:bg-secondary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50"
                  >
                    <Link to="/login">
                      <svg
                        aria-hidden="true"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 shrink-0"
                      >
                        <path
                          d="M13 5H15C15.5531 5 16 5.44688 16 6V14C16 14.5531 15.5531 15 15 15H13C12.4469 15 12 15.4469 12 16C12 16.5531 12.4469 17 13 17H15C16.6562 17 18 15.6562 18 14V6C18 4.34375 16.6562 3 15 3H13C12.4469 3 12 3.44687 12 4C12 4.55313 12.4469 5 13 5ZM12.7063 10.7063C13.0969 10.3156 13.0969 9.68125 12.7063 9.29062L8.70625 5.29063C8.31563 4.9 7.68125 4.9 7.29063 5.29063C6.9 5.68125 6.9 6.31563 7.29063 6.70625L9.58438 9H3C2.44687 9 2 9.44688 2 10C2 10.5531 2.44687 11 3 11H9.58438L7.29063 13.2937C6.9 13.6844 6.9 14.3188 7.29063 14.7094C7.68125 15.1 8.31563 15.1 8.70625 14.7094L12.7063 10.7094V10.7063Z"
                          fill="currentColor"
                        />
                      </svg>

                      <Typography
                        as={"p"}
                        variant={"body"}
                        className="text-sm! text-center font-semibold"
                      >
                        Log in
                      </Typography>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    website="outline"
                    className="rounded-[10px] border-2 border-secondary bg-transparent p-5 text-secondary shadow-none hover:bg-secondary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50"
                  >
                    <Link to="/register">
                      <svg
                        aria-hidden="true"
                        className="size-5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.5 5.7619C6.775 5.7619 7.80769 4.69643 7.80769 3.38095C7.80769 2.06548 6.775 1 5.5 1C4.225 1 3.19231 2.06548 3.19231 3.38095C3.19231 4.69643 4.225 5.7619 5.5 5.7619ZM4.92885 6.87302C3.03462 6.87302 1.5 8.45635 1.5 10.4107C1.5 10.7361 1.75577 11 2.07115 11H8.92885C9.24423 11 9.5 10.7361 9.5 10.4107C9.5 8.45635 7.96538 6.87302 6.07115 6.87302H4.92885Z"
                          fill="currentColor"
                        />
                        <path
                          d="M16.2807 12.1613C16.9541 12.1613 17.5 12.7072 17.5 13.3807C17.5 14.0541 16.9541 14.6 16.2807 14.6H7.71934C7.04592 14.6 6.5 14.0541 6.5 13.3807C6.5 12.7072 7.04592 12.1613 7.71934 12.1613H16.2807ZM12.0055 8C12.7756 8 13.3998 8.62424 13.3998 9.39429V17.6057C13.3998 18.3758 12.7756 19 12.0055 19C11.2355 19 10.6112 18.3758 10.6112 17.6057V9.39429C10.6112 8.62424 11.2355 8 12.0055 8Z"
                          fill="currentColor"
                        />
                      </svg>

                      <Typography
                        as={"p"}
                        variant={"body"}
                        className="text-sm! text-center font-semibold"
                      >
                        Register
                      </Typography>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  {isUserRole && !user.donor && (
                    <Button
                      variant="outline"
                      website="outline"
                      className="rounded-[10px] border-2 border-secondary bg-transparent p-5 text-secondary shadow-none hover:bg-secondary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50 font-semibold"
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
                        as={"p"}
                        variant={"body"}
                        className="text-sm! text-center font-semibold"
                      >
                        Become a Donor
                      </Typography>
                    </Button>
                  )}

                  {/* Profile */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        website="outline"
                        className="rounded-[10px] border-2 border-secondary bg-transparent p-5 text-secondary shadow-none hover:bg-secondary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50 font-semibold"
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
                          className="text-sm! text-center font-semibold"
                        >
                          {user?.userName || "User Name"}
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
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-md p-2 text-secondary hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </Container>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="border-t border-secondary/15 bg-primary lg:hidden">
          <Container className="max-w-7xl pb-5 pt-4">
            <div className="flex flex-col gap-4">
              {/* Mobile nav links */}
              <div className="flex flex-col gap-2">
                {currentNavItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => {
                      setCurrentPage(item.key);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "rounded-md px-8 py-2 transition-all",
                      //   currentPage === item.key
                      //     ? "bg-white/10 opacity-100"
                      //     : "opacity-90 hover:bg-white/10 hover:opacity-100"
                      currentPage === item.key
                        ? "bg-primary-dark opacity-100"
                        : "opacity-90 hover:bg-primary-dark/80 hover:opacity-100",
                    )}
                  >
                    <Typography
                      as={"p"}
                      variant={"body"}
                      className="text-center font-semibold"
                    >
                      {item.label}
                    </Typography>
                  </Link>
                ))}
              </div>

              {/* Mobile action buttons */}
              <div className="flex flex-col gap-3 ">
                {!isLoggedIn ? (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      website="outline"
                      className="w-full rounded-[10px] border-2 border-secondary bg-transparent p-5 text-secondary shadow-none hover:bg-secondary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50"
                      //   className="w-full border-white bg-transparent px-4 py-2 text-white shadow-none hover:bg-white hover:text-primary"
                    >
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg
                          aria-hidden="true"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5"
                        >
                          <path
                            d="M13 5H15C15.5531 5 16 5.44688 16 6V14C16 14.5531 15.5531 15 15 15H13C12.4469 15 12 15.4469 12 16C12 16.5531 12.4469 17 13 17H15C16.6562 17 18 15.6562 18 14V6C18 4.34375 16.6562 3 15 3H13C12.4469 3 12 3.44687 12 4C12 4.55313 12.4469 5 13 5ZM12.7063 10.7063C13.0969 10.3156 13.0969 9.68125 12.7063 9.29062L8.70625 5.29063C8.31563 4.9 7.68125 4.9 7.29063 5.29063C6.9 5.68125 6.9 6.31563 7.29063 6.70625L9.58438 9H3C2.44687 9 2 9.44688 2 10C2 10.5531 2.44687 11 3 11H9.58438L7.29063 13.2937C6.9 13.6844 6.9 14.3188 7.29063 14.7094C7.68125 15.1 8.31563 15.1 8.70625 14.7094L12.7063 10.7094V10.7063Z"
                            fill="currentColor"
                          />
                        </svg>

                        <Typography
                          as={"p"}
                          variant={"body"}
                          className="text-center font-semibold"
                        >
                          Log in
                        </Typography>
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      website="outline"
                      className="w-full rounded-[10px] border-2 border-secondary bg-transparent p-5 text-secondary shadow-none hover:bg-secondary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50"
                      //   className="w-full border-white bg-transparent px-4 py-2 text-white shadow-none hover:bg-white hover:text-primary"
                    >
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg
                          aria-hidden="true"
                          className="size-5"
                          fill="none"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.5 5.7619C6.775 5.7619 7.80769 4.69643 7.80769 3.38095C7.80769 2.06548 6.775 1 5.5 1C4.225 1 3.19231 2.06548 3.19231 3.38095C3.19231 4.69643 4.225 5.7619 5.5 5.7619ZM4.92885 6.87302C3.03462 6.87302 1.5 8.45635 1.5 10.4107C1.5 10.7361 1.75577 11 2.07115 11H8.92885C9.24423 11 9.5 10.7361 9.5 10.4107C9.5 8.45635 7.96538 6.87302 6.07115 6.87302H4.92885Z"
                            fill="currentColor"
                          />
                          <path
                            d="M16.2807 12.1613C16.9541 12.1613 17.5 12.7072 17.5 13.3807C17.5 14.0541 16.9541 14.6 16.2807 14.6H7.71934C7.04592 14.6 6.5 14.0541 6.5 13.3807C6.5 12.7072 7.04592 12.1613 7.71934 12.1613H16.2807ZM12.0055 8C12.7756 8 13.3998 8.62424 13.3998 9.39429V17.6057C13.3998 18.3758 12.7756 19 12.0055 19C11.2355 19 10.6112 18.3758 10.6112 17.6057V9.39429C10.6112 8.62424 11.2355 8 12.0055 8Z"
                            fill="currentColor"
                          />
                        </svg>

                        <Typography
                          as={"p"}
                          variant={"body"}
                          className="text-center font-semibold"
                        >
                          Register
                        </Typography>
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    {isUserRole && !user.donor && (
                      <Button
                        variant="outline"
                        website="outline"
                        className="rounded-[10px] border-2 border-secondary bg-transparent p-5 text-secondary shadow-none hover:bg-secondary hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50 font-semibold"
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
                          as={"p"}
                          variant={"body"}
                          className="text-sm! text-center font-semibold"
                        >
                          Become a Donor
                        </Typography>
                      </Button>
                    )}

                    {/* Profile */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          website="outline"
                          className="rounded-[10px] border-white bg-transparent px-4 py-2 text-white shadow-none hover:bg-white hover:text-primary focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50 font-semibold"
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
                            className="text-sm! text-center font-semibold"
                          >
                            {user?.userName || "User Name"}
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
                      <DropdownMenuContent className="px-37" align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="justify-center">
                            <Link
                              to={profileRoute}
                              className="flex items-center justify-center gap-3 w-full "
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
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}
