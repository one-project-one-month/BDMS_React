import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Menu, User, ChevronDown } from "lucide-react";

interface DashboardTopNavbarProps {
    userName?: string;
    onMenuClick?: () => void;
    onBecomeDonorClick?: () => void;
    showBecomeDonorButton?: boolean;
}

export function DashboardTopNavbar({
    userName = "Zar Ni",
    onMenuClick,
    onBecomeDonorClick,
    showBecomeDonorButton = true,
}: DashboardTopNavbarProps) {
    return (
        <header className="w-full bg-background font-[Roboto]">
            <div className="flex h-[84px] items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="rounded-md p-2 text-primary transition hover:bg-primary/10 lg:hidden"
                        aria-label="Open sidebar"
                    >
                        <Menu className="size-6" />
                    </button>
                </div>

                <div className="ml-auto flex items-center gap-3 sm:gap-4 lg:gap-5">
                    <a
                        href="/"
                        className="hidden text-primary transition hover:opacity-80 md:block"
                    >
                        <Typography
                            as="span"
                            variant="body"
                            className="!text-sm font-medium"
                        >
                            Home
                        </Typography>
                    </a>

                    <a
                        href="/announcements"
                        className="hidden text-primary transition hover:opacity-80 md:block"
                    >
                        <Typography
                            as="span"
                            variant="body"
                            className="!text-sm font-medium"
                        >
                            Announcements
                        </Typography>
                    </a>

                    {showBecomeDonorButton && (
                        <Button
                            type="button"
                            variant="outline"
                            website="outline"
                            onClick={onBecomeDonorClick}
                            className="h-10 rounded-xl border-primary bg-transparent px-4 text-primary shadow-none hover:bg-primary hover:text-primary-foreground"
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
                                as="span"
                                variant="body"
                                className="!text-sm font-medium"
                            >
                                <span className="hidden sm:inline">Become a Donor</span>
                                <span className="sm:hidden">Donate</span>
                            </Typography>
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        website="outline"
                        className="h-10 rounded-xl border-primary bg-transparent px-4 text-primary shadow-none hover:bg-primary hover:text-primary-foreground"
                    >
                        <User className="size-4 shrink-0" />
                        <Typography
                            as="span"
                            variant="body"
                            className="!text-sm font-medium"
                        >
                            {userName}
                        </Typography>
                        <ChevronDown className="size-4 shrink-0 opacity-80" />
                    </Button>
                </div>
            </div>
        </header>
    );
}