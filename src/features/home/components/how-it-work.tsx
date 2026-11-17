import React from "react";
import { Typography } from "@/components/ui/typography";
import Container from "../../../components/container";
import Section from "../../../components/section";

const steps = [
    {
        title: "Register",
        description:
            "Create your account and complete your profile with medical information.",
    },
    {
        title: "Become a Donor",
        description:
            'Click "Become a Donor" to activate your donor status and join our community.',
    },
    {
        title: "Schedule Appointment",
        description: "Book a convenient time slot for your blood donation.",
    },
    {
        title: "Donate & Save",
        description:
            "Complete your donation and help save lives in your community.",
    },
];

const Icons = [
    () => (

        <svg aria-hidden="true" width="74" height="67" viewBox="0 0 74 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_318_367)">
                <path d="M45 48H53C55.2125 48 57 46.2125 57 44V12C57 9.7875 55.2125 8 53 8H45C42.7875 8 41 6.2125 41 4C41 1.7875 42.7875 0 45 0H53C59.625 0 65 5.375 65 12V44C65 50.625 59.625 56 53 56H45C42.7875 56 41 54.2125 41 52C41 49.7875 42.7875 48 45 48ZM43.825 25.175C45.3875 26.7375 45.3875 29.275 43.825 30.8375L27.825 46.8375C26.2625 48.4 23.725 48.4 22.1625 46.8375C20.6 45.275 20.6 42.7375 22.1625 41.175L31.3375 32H5C2.7875 32 1 30.2125 1 28C1 25.7875 2.7875 24 5 24H31.3375L22.1625 14.825C20.6 13.2625 20.6 10.725 22.1625 9.1625C23.725 7.6 26.2625 7.6 27.825 9.1625L43.825 25.1625V25.175Z" fill="#FF3443" />
            </g>
            <defs>
                <filter id="filter0_d_318_367" x="0" y="0" width="74" height="67" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="4" dy="6" />
                    <feGaussianBlur stdDeviation="2.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.45098 0 0 0 0 0.490196 0 0 0 0.45 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_318_367" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_318_367" result="shape" />
                </filter>
            </defs>
        </svg>

    ),
    () => (
        <svg aria-hidden="true" width="74" height="68" viewBox="0 0 74 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_318_372)">
                <path d="M31.6165 29.2348L24.2511 39.9668C23.0068 41.7814 22.3403 43.9301 22.3403 46.1232L22.3403 46.3125C22.3403 52.2129 27.1173 57 33.0052 57C38.8931 57 43.6701 52.2129 43.6701 46.3125L43.6701 46.1232C43.6701 43.9189 43.0036 41.7814 41.7593 39.9668L34.3939 29.2348C34.0828 28.7783 33.5607 28.5 33.0052 28.5C32.4497 28.5 31.9276 28.7783 31.6165 29.2348ZM52.8575 18.9814L57.5901 14.25L61.445 14.25C63.4114 14.25 65 12.658 65 10.6875L65 3.5625C65 1.592 63.4114 3.67581e-06 61.445 3.50391e-06L25.8397 3.91195e-07C22.618 1.09545e-07 19.4741 1.03535 16.8745 2.95019L2.81011 13.3371C0.832653 14.7955 0.410503 17.5787 1.86582 19.5604C3.32114 21.542 6.09846 21.965 8.07592 20.5066L21.3849 10.6875L33.8939 10.6875C35.3715 10.6875 36.5602 11.8787 36.5602 13.3594C36.5602 14.84 35.3715 16.0313 33.8939 16.0313L25.8952 16.0313C23.9289 16.0313 22.3403 17.6232 22.3403 19.5938C22.3403 21.5643 23.9289 23.1563 25.8952 23.1563L42.8036 23.1563C46.5697 23.1563 50.1913 21.6533 52.8575 18.9814Z" fill="#FF3443" />
            </g>
            <defs>
                <filter id="filter0_d_318_372" x="0" y="0" width="74" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="4" dy="6" />
                    <feGaussianBlur stdDeviation="2.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.45098 0 0 0 0 0.490196 0 0 0 0.45 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_318_372" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_318_372" result="shape" />
                </filter>
            </defs>
        </svg>

    ),
    () => (
        <svg aria-hidden="true" width="70" height="75" viewBox="0 0 70 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_318_380)">
                <path d="M43.8571 0C46.2277 0 48.1429 1.90667 48.1429 4.26667V8.53333H52.4286C57.1562 8.53333 61 12.36 61 17.0667V55.4667C61 60.1733 57.1562 64 52.4286 64H9.57143C4.84375 64 1 60.1733 1 55.4667V17.0667C1 12.36 4.84375 8.53333 9.57143 8.53333H13.8571V4.26667C13.8571 1.90667 15.7723 0 18.1429 0C20.5134 0 22.4286 1.90667 22.4286 4.26667V8.53333H39.5714V4.26667C39.5714 1.90667 41.4866 0 43.8571 0ZM46.8036 21.56C45.3705 20.52 43.3616 20.84 42.317 22.2667L26.3259 44.16L19.3482 37.2133C18.0893 35.96 16.0536 35.96 14.808 37.2133C13.5625 38.4667 13.5491 40.4933 14.808 41.7333L24.4509 51.3333C25.1205 52 26.0446 52.3333 26.9687 52.2667C27.8929 52.2 28.7634 51.72 29.3125 50.96L47.5134 26.0267C48.558 24.6 48.2366 22.6 46.8036 21.56Z" fill="#FF3947" />
            </g>
            <defs>
                <filter id="filter0_d_318_380" x="0" y="0" width="70" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="4" dy="6" />
                    <feGaussianBlur stdDeviation="2.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.45098 0 0 0 0 0.490196 0 0 0 0.45 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_318_380" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_318_380" result="shape" />
                </filter>
            </defs>
        </svg>

    ),
    () => (
        <svg aria-hidden="true" width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_318_376)">
                <path d="M4.625 16.647C6.62781 16.647 8.25 18.2593 8.25 20.2499V34.6797C8.25 36.2109 8.85719 37.6791 9.94469 38.76L14.5756 43.3628C15.3278 44.1104 16.5059 44.2275 17.385 43.642C18.5541 42.8674 18.7172 41.219 17.7203 40.2372C17.0588 39.5797 15.6269 38.1565 13.4428 35.9858C12.31 34.8598 12.31 33.0313 13.4428 31.9054C14.5756 30.7795 16.4153 30.7795 17.5481 31.9054C19.7322 34.0762 21.1641 35.4994 21.8256 36.1569L24.1184 38.4358C26.0216 40.3273 27.0909 42.8944 27.0909 45.5696V52.6764C27.0909 55.0633 25.1425 56.9999 22.7409 56.9999H16.6962C15.1556 56.9999 13.6784 56.3964 12.5909 55.3155L3.54656 46.3172C1.91531 44.6959 1 42.4981 1 40.2012V20.2499C1 18.2593 2.62219 16.647 4.625 16.647ZM55.375 16.647C57.3778 16.647 59 18.2593 59 20.2499V40.2012C59 42.4981 58.0847 44.6959 56.4534 46.3172L47.4 55.3155C46.3125 56.3964 44.8353 56.9999 43.2947 56.9999H37.25C34.8484 56.9999 32.9 55.0633 32.9 52.6764V45.5696C32.9 42.8944 33.9694 40.3273 35.8725 38.4358L38.1653 36.1569C38.8269 35.4994 40.2588 34.0762 42.4428 31.9054C43.5756 30.7795 45.4153 30.7795 46.5481 31.9054C47.6809 33.0313 47.6809 34.8598 46.5481 35.9858C44.3641 38.1565 42.9322 39.5797 42.2706 40.2372C41.2738 41.228 41.4369 42.8674 42.6059 43.642C43.485 44.2275 44.6631 44.1104 45.4153 43.3628L50.0463 38.76C51.1338 37.6791 51.7409 36.2109 51.7409 34.6797L51.75 20.2499C51.75 18.2593 53.3722 16.647 55.375 16.647Z" fill="#FF3443" />
                <path d="M31.375 13.125C35.0008 13.125 37.9375 10.1883 37.9375 6.5625C37.9375 2.93672 35.0008 0 31.375 0C27.7492 0 24.8125 2.93672 24.8125 6.5625C24.8125 10.1883 27.7492 13.125 31.375 13.125ZM29.7508 16.1875C24.3641 16.1875 20 20.5516 20 25.9383C20 26.8352 20.7273 27.5625 21.6242 27.5625H41.1258C42.0227 27.5625 42.75 26.8352 42.75 25.9383C42.75 20.5516 38.3859 16.1875 32.9992 16.1875H29.7508Z" fill="#FF3443" />
            </g>
            <defs>
                <filter id="filter0_d_318_376" x="0" y="0" width="68" height="68" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="4" dy="6" />
                    <feGaussianBlur stdDeviation="2.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.45098 0 0 0 0 0.490196 0 0 0 0.45 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_318_376" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_318_376" result="shape" />
                </filter>
            </defs>
        </svg>

    ),
];

const ArrowIcon = () => (
    <svg aria-hidden="true" width="74" height="18" viewBox="0 0 74 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 7.16016C0.671573 7.16016 7.24234e-08 7.83173 0 8.66016C-7.24234e-08 9.48858 0.671573 10.1602 1.5 10.1602L1.5 8.66016L1.5 7.16016ZM73.5 8.66016L58.5 -9.32454e-05L58.5 17.3204L73.5 8.66016ZM1.5 8.66016L1.5 10.1602L4.5 10.1602L4.5 8.66016L4.5 7.16016L1.5 7.16016L1.5 8.66016ZM10.5 8.66016L10.5 10.1602L16.5 10.1602L16.5 8.66016L16.5 7.16016L10.5 7.16016L10.5 8.66016ZM22.5 8.66016L22.5 10.1602L28.5 10.1602L28.5 8.66016L28.5 7.16016L22.5 7.16016L22.5 8.66016ZM34.5 8.66016L34.5 10.1602L40.5 10.1602L40.5 8.66016L40.5 7.16016L34.5 7.16016L34.5 8.66016ZM46.5 8.66016L46.5 10.1602L52.5 10.1602L52.5 8.66016L52.5 7.16016L46.5 7.16016L46.5 8.66016ZM58.5 8.66016L58.5 10.1602L64.5 10.1602L64.5 8.66016L64.5 7.16016L58.5 7.16016L58.5 8.66016Z" fill="#FF3443" />
    </svg>

);

const HowItWorks: React.FC = () => {
    return (
        <section className="bg-background -mt-10">
            <Section>
                <Container>
                    <div className="mx-auto flex max-w-6xl flex-col items-center">
                        {/* Title */}
                        <div className="text-center">
                            <Typography
                                as="h2"
                                variant="title"
                                className="text-foreground text-pretty "
                            >
                                How It Works
                            </Typography>
                        </div>

                        {/* Steps */}
                        <div className="pt-12 grid w-full grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-start lg:gap-x-2">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.title}>
                                    <div className="flex flex-col items-center text-center">
                                        {Icons[index] && React.createElement(Icons[index])}
                                        <Typography
                                            as="h3"
                                            variant="subtitle"
                                            className="mt-5 text-xl font-bold text-foreground sm:text-2xl"
                                        >
                                            {step.title}
                                        </Typography>

                                        <Typography
                                            as="p"
                                            variant="body"
                                            className="mt-4 text-pretty text-base leading-relaxed text-dark-primary"
                                        >
                                            {step.description}
                                        </Typography>
                                    </div>

                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:flex items-center justify-center mt-12">
                                            <ArrowIcon />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </Container>
            </Section>
        </section>
    );
};

export default HowItWorks;