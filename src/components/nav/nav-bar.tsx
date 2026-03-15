import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
    LogIn,
    UserPlus,
    User,
    ChevronDown,
    Menu,
    X,
} from "lucide-react";

interface NavbarProps {
    isLoggedIn?: boolean;
    userName?: string;
    activePage?: "home" | "announcements" | "dashboard";
}

const navItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "announcements", label: "Announcements", href: "/announcements" },
] as const;

export function Navbar({
    isLoggedIn = false,
    userName = "Zar Ni",
    activePage,
}: NavbarProps) {
    const [currentPage, setCurrentPage] = useState<
        "home" | "announcements" | "dashboard"
    >("home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    return (
        <nav className="w-full bg-primary text-primary-foreground shadow font-[Roboto]">
            <div className="mx-auto flex h-[72px] w-full items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
                {/* LEFT - Logo */}
                <a
                    href="/"
                    className="flex shrink-0 items-center transition-opacity hover:opacity-90"
                >
                    <svg width="150" height="40" viewBox="0 0 164 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.4676 23.4381C9.7405 23.4381 8.33923 22.0233 8.33923 20.2793C8.33923 18.7789 10.4607 15.7696 11.0538 14.9569C11.1499 14.8252 11.3014 14.7512 11.4644 14.7512H11.4709C11.6338 14.7512 11.7854 14.8252 11.8815 14.9569C12.4746 15.7696 14.596 18.7789 14.596 20.2793C14.596 22.0233 13.1947 23.4381 11.4676 23.4381ZM10.1641 20.1477C10.1641 19.9289 9.98979 19.7527 9.77308 19.7527C9.55638 19.7527 9.38203 19.9289 9.38203 20.1477C9.38203 21.3832 10.3743 22.3852 11.598 22.3852C11.8147 22.3852 11.989 22.2091 11.989 21.9904C11.989 21.7714 11.8147 21.5954 11.598 21.5954C10.8061 21.5954 10.1641 20.9473 10.1641 20.1477Z" fill="white" />
                        <path d="M22.7363 8.45548L23.4238 5.87961L24.7529 5.1101C25.4309 4.7176 25.6623 3.8509 25.2707 3.17063L23.8545 0.710973C23.4628 0.030727 22.5985 -0.201733 21.9205 0.190771L9.64739 7.296C8.53652 7.93912 7.65826 8.92412 7.14253 10.1041L4.35761 16.4974C3.96566 17.3955 4.37331 18.4405 5.26901 18.8343C6.16469 19.2278 7.20643 18.8193 7.59838 17.9212L10.2318 11.877L14.5451 9.37996C15.0545 9.08502 15.7012 9.25895 15.9954 9.77011C16.2898 10.2813 16.1166 10.9298 15.6072 11.2247L12.8492 12.8214C12.1712 13.2139 11.9399 14.0806 12.3315 14.7608C12.7232 15.4412 13.5874 15.6737 14.2654 15.2811L20.0956 11.9058C21.3941 11.1541 22.3442 9.91231 22.7324 8.45771L22.7363 8.45548ZM2.72879 31.5425L2.03742 34.1204L0.708214 34.8899C0.030219 35.2825 -0.201121 36.1491 0.190565 36.8293L1.60678 39.2891C1.99844 39.9693 2.86266 40.2017 3.54068 39.8092L15.8176 32.7019C16.9286 32.0587 17.8068 31.0737 18.3225 29.8938L21.1073 23.5006C21.4994 22.6023 21.0918 21.5573 20.196 21.1638C19.3002 20.77 18.2585 21.1785 17.8666 22.0766L15.2292 28.123L10.9161 30.6202C10.4067 30.915 9.76003 30.741 9.4657 30.2299C9.1714 29.7188 9.3445 29.0703 9.85396 28.7754L12.612 27.1787C13.2899 26.7861 13.5213 25.9195 13.1296 25.2393C12.738 24.5589 11.8738 24.3264 11.1957 24.7189L5.36562 28.0942C4.06708 28.846 3.11704 30.0878 2.72879 31.5425Z" fill="white" />
                        <path d="M156.555 30.0882C155.506 30.0693 154.575 29.8658 153.762 29.4777C152.958 29.0801 152.292 28.5454 151.763 27.8733C151.234 27.1918 150.851 26.4109 150.614 25.5307C150.378 24.6409 150.298 23.6944 150.373 22.6911L150.43 22.109C150.534 21.0772 150.785 20.0834 151.182 19.1274C151.579 18.1619 152.108 17.3053 152.769 16.5576C153.441 15.8004 154.23 15.204 155.137 14.7686C156.044 14.3332 157.056 14.1297 158.171 14.1581C159.239 14.1771 160.142 14.3995 160.879 14.8254C161.616 15.2514 162.202 15.8193 162.637 16.5292C163.072 17.2296 163.36 18.0247 163.502 18.9144C163.653 19.8042 163.677 20.727 163.573 21.683L163.374 23.1454H151.862L152.259 20.6892L160.383 20.7034L160.44 20.4052C160.525 19.8089 160.492 19.2457 160.34 18.7157C160.199 18.1856 159.934 17.7502 159.546 17.4094C159.159 17.0687 158.639 16.8889 157.987 16.8699C157.278 16.851 156.668 16.9977 156.158 17.3101C155.657 17.6224 155.241 18.0436 154.91 18.5737C154.579 19.1037 154.32 19.6811 154.131 20.3058C153.951 20.9211 153.823 21.5221 153.748 22.109L153.691 22.6769C153.634 23.2353 153.648 23.789 153.734 24.338C153.819 24.887 153.984 25.3887 154.23 25.843C154.476 26.2879 154.816 26.6523 155.251 26.9363C155.685 27.2107 156.224 27.3575 156.867 27.3764C157.67 27.3953 158.398 27.2297 159.05 26.8795C159.712 26.5198 160.312 26.056 160.851 25.4881L162.495 27.2344C162.061 27.8875 161.522 28.427 160.879 28.853C160.246 29.2789 159.556 29.596 158.809 29.8042C158.072 30.003 157.32 30.0977 156.555 30.0882Z" fill="white" />
                        <path d="M141.657 29.8043H138.311L141.175 12.9656C141.307 11.8866 141.629 10.9495 142.139 10.1544C142.649 9.34986 143.321 8.72988 144.152 8.29448C144.984 7.85908 145.958 7.64611 147.073 7.65558C147.413 7.66504 147.753 7.69344 148.094 7.74076C148.434 7.78809 148.769 7.84961 149.1 7.92534L148.774 10.5945C148.566 10.5472 148.354 10.5094 148.136 10.481C147.928 10.4526 147.716 10.4336 147.498 10.4242C146.959 10.4242 146.482 10.5283 146.066 10.7365C145.66 10.9448 145.324 11.2382 145.06 11.6168C144.804 11.9859 144.634 12.4355 144.549 12.9656L141.657 29.8043ZM147.385 14.4422L146.931 16.941H138.254L138.708 14.4422H147.385Z" fill="white" />
                        <path d="M133.295 14.4423L130.63 29.8044H127.298L129.963 14.4423H133.295ZM130.431 10.4668C130.422 9.91786 130.601 9.46826 130.97 9.11804C131.339 8.76782 131.792 8.58798 132.331 8.57852C132.851 8.56905 133.295 8.72996 133.664 9.06125C134.042 9.38307 134.231 9.81374 134.231 10.3533C134.24 10.9022 134.056 11.3471 133.678 11.6879C133.309 12.0286 132.86 12.2037 132.331 12.2132C131.811 12.2227 131.367 12.0712 130.998 11.7589C130.63 11.437 130.441 11.0064 130.431 10.4668Z" fill="white" />
                        <path d="M124.338 7.99634L120.552 29.8043H117.221L120.992 7.99634H124.338Z" fill="white" />
                        <path d="M107.866 26.4252L111.056 7.99634H114.416L110.631 29.8043H107.625L107.866 26.4252ZM98.9058 22.4072L98.9342 22.1091C99.057 21.1625 99.2792 20.216 99.6005 19.2695C99.9313 18.323 100.376 17.4569 100.933 16.6713C101.5 15.8856 102.19 15.2609 103.003 14.7971C103.825 14.3333 104.79 14.1156 105.895 14.144C106.859 14.1724 107.663 14.4233 108.306 14.8965C108.948 15.3698 109.449 15.9803 109.808 16.7281C110.177 17.4758 110.427 18.2851 110.56 19.1559C110.692 20.0172 110.735 20.8597 110.687 21.6831L110.574 22.6486C110.423 23.5194 110.168 24.3997 109.808 25.2894C109.449 26.1791 108.981 26.9932 108.405 27.7314C107.838 28.4697 107.157 29.0566 106.363 29.492C105.579 29.9274 104.681 30.1309 103.669 30.1025C102.658 30.0646 101.822 29.8091 101.16 29.3358C100.498 28.8531 99.988 28.2331 99.6289 27.4759C99.2697 26.7092 99.0381 25.8857 98.9342 25.0054C98.8302 24.1157 98.8207 23.2496 98.9058 22.4072ZM102.308 22.0807L102.28 22.3788C102.223 22.871 102.2 23.3964 102.209 23.9548C102.219 24.5133 102.294 25.048 102.436 25.5592C102.587 26.0608 102.838 26.4773 103.187 26.8086C103.547 27.1399 104.048 27.3197 104.69 27.3481C105.437 27.3765 106.099 27.2061 106.675 26.837C107.261 26.4678 107.748 25.9851 108.135 25.3888C108.523 24.7925 108.797 24.1583 108.958 23.4863L109.355 20.8881C109.383 20.4148 109.35 19.9463 109.255 19.4825C109.17 19.0187 109.014 18.5975 108.788 18.2188C108.561 17.8402 108.258 17.5326 107.88 17.296C107.512 17.0499 107.063 16.9221 106.533 16.9126C105.834 16.8842 105.229 17.0262 104.719 17.3386C104.218 17.6509 103.802 18.0674 103.471 18.588C103.15 19.1086 102.894 19.6765 102.705 20.2917C102.516 20.907 102.384 21.5033 102.308 22.0807Z" fill="white" />
                        <path d="M80.01 22.3788L80.0525 22.0523C80.1659 20.9922 80.4258 19.9841 80.8323 19.0281C81.2387 18.0721 81.7774 17.225 82.4485 16.4867C83.129 15.7389 83.9277 15.1568 84.8445 14.7404C85.7708 14.3239 86.801 14.1298 87.9352 14.1582C89.0316 14.1772 89.9721 14.4043 90.7566 14.8397C91.5505 15.2751 92.1933 15.8573 92.6847 16.5861C93.1857 17.3054 93.5354 18.1289 93.7339 19.0565C93.9324 19.9746 93.9844 20.9354 93.8898 21.9387L93.8615 22.2652C93.7386 23.3254 93.4692 24.3287 93.0534 25.2752C92.6469 26.2217 92.1035 27.0641 91.4229 27.8024C90.7519 28.5313 89.9532 29.1039 89.0269 29.5204C88.1101 29.9274 87.0893 30.1167 85.9646 30.0883C84.8776 30.0694 83.9372 29.8469 83.1432 29.421C82.3587 28.9856 81.716 28.4082 81.2151 27.6889C80.7236 26.9695 80.3786 26.1555 80.1801 25.2468C79.9816 24.3287 79.9249 23.3727 80.01 22.3788ZM83.3701 22.0523L83.3417 22.3788C83.2944 22.8994 83.2897 23.4484 83.3275 24.0258C83.3653 24.6032 83.4787 25.1427 83.6678 25.6444C83.8568 26.146 84.1498 26.5578 84.5468 26.8796C84.9438 27.2014 85.4731 27.3718 86.1347 27.3907C86.8341 27.4096 87.4438 27.2676 87.9636 26.9648C88.4834 26.6619 88.9182 26.2549 89.2679 25.7437C89.6177 25.2326 89.8965 24.6742 90.1044 24.0684C90.3124 23.4531 90.4494 22.8521 90.5156 22.2652L90.5439 21.9387C90.6006 21.4276 90.6101 20.8833 90.5723 20.3059C90.5345 19.7191 90.4211 19.1701 90.232 18.659C90.043 18.1384 89.75 17.7172 89.353 17.3954C88.956 17.0641 88.4267 16.889 87.7651 16.87C87.0562 16.8511 86.4419 16.9978 85.922 17.3102C85.4022 17.6131 84.9674 18.0248 84.6177 18.5454C84.268 19.066 83.9891 19.6339 83.7812 20.2491C83.5827 20.8644 83.4457 21.4654 83.3701 22.0523Z" fill="white" />
                        <path d="M61.1141 22.3788L61.1566 22.0523C61.27 20.9922 61.53 19.9841 61.9364 19.0281C62.3428 18.0721 62.8816 17.225 63.5526 16.4867C64.2332 15.7389 65.0318 15.1568 65.9487 14.7404C66.8749 14.3239 67.9052 14.1298 69.0394 14.1582C70.1358 14.1772 71.0762 14.4043 71.8607 14.8397C72.6547 15.2751 73.2974 15.8573 73.7889 16.5861C74.2898 17.3054 74.6395 18.1289 74.838 19.0565C75.0365 19.9746 75.0885 20.9354 74.994 21.9387L74.9656 22.2652C74.8427 23.3254 74.5734 24.3287 74.1575 25.2752C73.7511 26.2217 73.2076 27.0641 72.5271 27.8024C71.856 28.5313 71.0573 29.1039 70.131 29.5204C69.2142 29.9274 68.1934 30.1167 67.0687 30.0883C65.9817 30.0694 65.0413 29.8469 64.2473 29.421C63.4628 28.9856 62.8201 28.4082 62.3192 27.6889C61.8277 26.9695 61.4827 26.1555 61.2842 25.2468C61.0857 24.3287 61.029 23.3727 61.1141 22.3788ZM64.4742 22.0523L64.4458 22.3788C64.3986 22.8994 64.3938 23.4484 64.4316 24.0258C64.4695 24.6032 64.5829 25.1427 64.7719 25.6444C64.9609 26.146 65.2539 26.5578 65.6509 26.8796C66.0479 27.2014 66.5772 27.3718 67.2388 27.3907C67.9382 27.4096 68.5479 27.2676 69.0677 26.9648C69.5876 26.6619 70.0224 26.2549 70.3721 25.7437C70.7218 25.2326 71.0006 24.6742 71.2085 24.0684C71.4165 23.4531 71.5535 22.8521 71.6197 22.2652L71.6481 21.9387C71.7048 21.4276 71.7142 20.8833 71.6764 20.3059C71.6386 19.7191 71.5252 19.1701 71.3361 18.659C71.1471 18.1384 70.8541 17.7172 70.4571 17.3954C70.0602 17.0641 69.5309 16.889 68.8692 16.87C68.1604 16.8511 67.546 16.9978 67.0262 17.3102C66.5063 17.6131 66.0715 18.0248 65.7218 18.5454C65.3721 19.066 65.0933 19.6339 64.8853 20.2491C64.6868 20.8644 64.5498 21.4654 64.4742 22.0523Z" fill="white" />
                        <path d="M57.6859 7.99634L53.9005 29.8043H50.5687L54.34 7.99634H57.6859Z" fill="white" />
                        <path d="M38.9742 21.0157H33.6009L34.1538 17.7502L38.0952 17.7644C38.6718 17.7644 39.2247 17.6982 39.754 17.5656C40.2927 17.4237 40.7464 17.1776 41.115 16.8274C41.4931 16.4771 41.7341 15.9802 41.8381 15.3366C41.9232 14.7497 41.8759 14.2907 41.6963 13.9594C41.5167 13.6186 41.2285 13.3773 40.8315 13.2353C40.444 13.0838 39.9808 13.0034 39.4421 12.9939L36.8476 12.9797L33.927 29.8043H29.0782L32.651 9.13208L39.598 9.14628C40.496 9.15574 41.3844 9.25513 42.2634 9.44443C43.1424 9.63374 43.9317 9.94136 44.6311 10.3673C45.3305 10.7838 45.8787 11.3517 46.2757 12.071C46.6727 12.7809 46.8381 13.6707 46.7719 14.7403C46.7057 15.9045 46.3797 16.851 45.7937 17.5798C45.2171 18.2992 44.4704 18.834 43.5536 19.1842C42.6368 19.525 41.6443 19.7095 40.5763 19.7379L38.9742 21.0157ZM37.3296 29.8043H30.8079L33.133 25.9708L37.4856 25.985C38.0243 25.9755 38.53 25.8856 39.0026 25.7153C39.4846 25.5449 39.8863 25.2798 40.2077 24.9202C40.5385 24.551 40.7511 24.0825 40.8457 23.5146C40.9307 23.0318 40.9213 22.6106 40.8173 22.251C40.7228 21.8818 40.5243 21.5931 40.2219 21.3849C39.9288 21.1766 39.5319 21.0583 39.0309 21.0299L34.7068 21.0157L35.3022 17.7502L40.0092 17.7644L40.8598 19.0564C41.8145 19.0659 42.6604 19.2363 43.3976 19.5676C44.1349 19.8988 44.702 20.4005 45.099 21.0725C45.5054 21.7351 45.6755 22.568 45.6093 23.5714C45.5148 25.1142 45.0706 26.3447 44.2766 27.2628C43.4827 28.1715 42.4714 28.8246 41.2426 29.2221C40.0139 29.6197 38.7096 29.8137 37.3296 29.8043Z" fill="white" />
                    </svg>
                </a>

                {/* DESKTOP RIGHT - Nav + Actions */}
                <div className="hidden items-center gap-6 lg:flex xl:gap-8">
                    {/* Navigation links */}
                    <div className="flex items-center gap-5 xl:gap-6">
                        {navItems.map((item) => (
                            <a
                                key={item.key}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center pb-1 transition-all",
                                    currentPage === item.key
                                        ? "opacity-100"
                                        : "opacity-90 hover:opacity-100"
                                )}
                            >
                                <Typography
                                    as={"p"}
                                    variant={"body"}
                                    className="text-sm! text-center"
                                >
                                    {item.label}
                                </Typography>

                                {currentPage === item.key && (
                                    <span className="absolute left-0 top-full mt-2 h-[2px] w-full rounded-full bg-white" />
                                )}
                            </a>
                        ))}

                        {isLoggedIn && (
                            <a
                                href="/dashboard"
                                className={cn(
                                    "relative flex items-center pb-1 transition-all cursor-pointer",
                                    currentPage === "dashboard"
                                        ? "opacity-100"
                                        : "opacity-90 hover:opacity-100"
                                )}
                            >
                                <Typography
                                    as={"p"}
                                    variant={"body"}
                                    className="text-sm! text-center"
                                >
                                    Dashboard
                                </Typography>

                                {currentPage === "dashboard" && (
                                    <span className="absolute left-0 top-full mt-2 h-[2px] w-full rounded-full bg-white" />
                                )}
                            </a>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                        {!isLoggedIn ? (
                            <>
                                <Button
                                    asChild
                                    variant="outline"
                                    website="outline"
                                    className="h-10 rounded-xl border-white bg-transparent px-4 text-white shadow-none hover:bg-white hover:text-primary"
                                >
                                    <a href="/login">
                                        <LogIn className="size-4" />
                                        <Typography
                                            as={"p"}
                                            variant={"body"}
                                            className="text-sm! text-center"
                                        >
                                            Log in
                                        </Typography>
                                    </a>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    website="outline"
                                    className="h-10 rounded-xl border-white bg-transparent px-4 text-white shadow-none hover:bg-white hover:text-primary"
                                >
                                    <a href="/register">
                                        <UserPlus className="size-4" />
                                        <Typography
                                            as={"p"}
                                            variant={"body"}
                                            className="text-sm! text-center"
                                        >
                                            Register
                                        </Typography>
                                    </a>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    website="outline"
                                    className="h-10 rounded-xl border-white bg-transparent px-4 text-white shadow-none hover:bg-white hover:text-primary"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="shrink-0"
                                    >
                                        <path
                                            d="M9.6109 10.2062L7.53936 13.2187C7.18942 13.7281 7.00195 14.3312 7.00195 14.9469L7.00195 15C7.00195 16.6562 8.34548 18 10.0015 18C11.6574 18 13.001 16.6562 13.001 15L13.001 14.9469C13.001 14.3281 12.8135 13.7281 12.4636 13.2187L10.392 10.2062C10.3045 10.0781 10.1577 10 10.0015 10C9.84524 10 9.69839 10.0781 9.6109 10.2062ZM15.5849 7.32812L16.916 6L18.0002 6C18.5532 6 19 5.55313 19 5L19 3C19 2.44687 18.5532 2 18.0002 2L7.98617 2C7.08006 2 6.19583 2.29062 5.4647 2.82812L1.5091 5.74375C0.952935 6.15312 0.834207 6.93437 1.24351 7.49062C1.65282 8.04687 2.43394 8.16562 2.9901 7.75625L6.73325 5L10.2514 5C10.667 5 11.0013 5.33437 11.0013 5.75C11.0013 6.16562 10.667 6.5 10.2514 6.5L8.00179 6.5C7.44876 6.5 7.00195 6.94687 7.00195 7.5C7.00195 8.05312 7.44876 8.5 8.00179 8.5L12.7573 8.5C13.8165 8.5 14.8351 8.07812 15.5849 7.32812Z"
                                            fill="currentColor"
                                        />
                                    </svg>

                                    <Typography
                                        as={"p"}
                                        variant={"body"}
                                        className="text-sm! text-center"
                                    >
                                        Become a Donor
                                    </Typography>
                                </Button>

                                <Button
                                    variant="outline"
                                    website="outline"
                                    className="h-10 rounded-xl border-white bg-transparent px-4 text-white shadow-none hover:bg-white hover:text-primary"
                                >
                                    <User className="size-4" />
                                    <Typography
                                        as={"p"}
                                        variant={"body"}
                                        className="text-sm! text-center"
                                    >
                                        {userName}
                                    </Typography>
                                    <ChevronDown className="size-4 opacity-80" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    className="flex items-center justify-center rounded-md p-2 text-white lg:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="border-t border-white/15 bg-primary px-4 pb-5 pt-4 sm:px-6 md:px-10 lg:hidden">
                    <div className="flex flex-col gap-4">
                        {/* Mobile nav links */}
                        <div className="flex flex-col gap-3">
                            {navItems.map((item) => (
                                <a
                                    key={item.key}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "rounded-md px-2 py-2 transition-all",
                                        currentPage === item.key
                                            ? "bg-white/10 opacity-100"
                                            : "opacity-90 hover:bg-white/10 hover:opacity-100"
                                    )}
                                >
                                    <Typography
                                        as={"p"}
                                        variant={"body"}
                                        className="text-sm! text-left"
                                    >
                                        {item.label}
                                    </Typography>
                                </a>
                            ))}

                            {isLoggedIn && (
                                <a
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "rounded-md px-2 py-2 transition-all",
                                        currentPage === "dashboard"
                                            ? "bg-white/10 opacity-100"
                                            : "opacity-90 hover:bg-white/10 hover:opacity-100"
                                    )}
                                >
                                    <Typography
                                        as={"p"}
                                        variant={"body"}
                                        className="text-sm! text-left"
                                    >
                                        Dashboard
                                    </Typography>
                                </a>
                            )}
                        </div>

                        {/* Mobile action buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            {!isLoggedIn ? (
                                <>
                                    <Button
                                        asChild
                                        variant="outline"
                                        website="outline"
                                        className="h-10 w-full rounded-xl border-white bg-transparent px-4 text-white shadow-none hover:bg-white hover:text-primary"
                                    >
                                        <a
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <LogIn className="size-4" />
                                            <Typography
                                                as={"p"}
                                                variant={"body"}
                                                className="text-sm! text-center"
                                            >
                                                Log in
                                            </Typography>
                                        </a>
                                    </Button>

                                    <Button
                                        asChild
                                        variant="outline"
                                        website="outline"
                                        className="h-10 w-full rounded-xl border-white bg-transparent px-4 text-white shadow-none hover:bg-white hover:text-primary"
                                    >
                                        <a
                                            href="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <UserPlus className="size-4" />
                                            <Typography
                                                as={"p"}
                                                variant={"body"}
                                                className="text-sm! text-center"
                                            >
                                                Register
                                            </Typography>
                                        </a>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <a
                                        href="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full"
                                    >
                                        <Button
                                            variant="outline"
                                            website="outline"
                                            className="h-10 w-full rounded-xl border-white bg-transparent px-4 text-white shadow-none hover:bg-white hover:text-primary"
                                        >
                                            <User className="size-4" />
                                            <Typography
                                                as={"p"}
                                                variant={"body"}
                                                className="text-sm! text-center"
                                            >
                                                Dashboard
                                            </Typography>
                                        </Button>
                                    </a>

                                    <Button
                                        variant="outline"
                                        website="outline"
                                        className="h-10 w-full rounded-xl border-white bg-transparent px-4 text-white shadow-none hover:bg-white hover:text-primary"
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9.6109 10.2062L7.53936 13.2187C7.18942 13.7281 7.00195 14.3312 7.00195 14.9469L7.00195 15C7.00195 16.6562 8.34548 18 10.0015 18C11.6574 18 13.001 16.6562 13.001 15L13.001 14.9469C13.001 14.3281 12.8135 13.7281 12.4636 13.2187L10.392 10.2062C10.3045 10.0781 10.1577 10 10.0015 10C9.84524 10 9.69839 10.0781 9.6109 10.2062ZM15.5849 7.32812L16.916 6L18.0002 6C18.5532 6 19 5.55313 19 5L19 3C19 2.44687 18.5532 2 18.0002 2L7.98617 2C7.08006 2 6.19583 2.29062 5.4647 2.82812L1.5091 5.74375C0.952935 6.15312 0.834207 6.93437 1.24351 7.49062C1.65282 8.04687 2.43394 8.16562 2.9901 7.75625L6.73325 5L10.2514 5C10.667 5 11.0013 5.33437 11.0013 5.75C11.0013 6.16562 10.667 6.5 10.2514 6.5L8.00179 6.5C7.44876 6.5 7.00195 6.94687 7.00195 7.5C7.00195 8.05312 7.44876 8.5 8.00179 8.5L12.7573 8.5C13.8165 8.5 14.8351 8.07812 15.5849 7.32812Z"
                                                fill="white"
                                            />
                                        </svg>

                                        <Typography
                                            as={"p"}
                                            variant={"body"}
                                            className="text-sm! text-center"
                                        >
                                            Become a Donor
                                        </Typography>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        website="outline"
                                        className="h-10 w-full rounded-xl border-white bg-transparent px-4 text-white shadow-none hover:bg-white hover:text-primary"
                                    >
                                        <User className="size-4" />
                                        <Typography
                                            as={"p"}
                                            variant={"body"}
                                            className="text-sm! text-center"
                                        >
                                            {userName}
                                        </Typography>
                                        <ChevronDown className="size-4 opacity-80" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}