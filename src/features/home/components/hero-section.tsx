import React from "react";
import { Button } from "@/components/ui/button";
import Container from "../../../components/container"
import  Section  from "../../../components/section";
import { Typography } from "@/components/ui/typography";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-primary text-primary-foreground">
      <Section>
        <Container>
          <div className="flex flex-col items-center text-center py-6 md:py-10 lg:py-14">
            <Typography
              as="h3"
              variant="title"
            >
              "One Person&apos;s Blood Donation, Hope
              <br className="hidden md:block" /> For Many Lives"
            </Typography>

            <Typography
              as="p"
              variant="body"
              className="mt-5 text-pretty text-base  leading-relaxed sm:text-lg"
            >
              Your single donation can save up to three lives. Join our
              community of heroes today.
            </Typography>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                size="lg"
                className="min-w-[150px] bg-white text-primary shadow-none hover:bg-white/90"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 size-5 shrink-0"
                  aria-hidden="true"
                >
<path d="M9.6109 10.2062L7.53936 13.2187C7.18942 13.7281 7.00195 14.3312 7.00195 14.9469L7.00195 15C7.00195 16.6562 8.34548 18 10.0015 18C11.6574 18 13.001 16.6562 13.001 15L13.001 14.9469C13.001 14.3281 12.8135 13.7281 12.4636 13.2187L10.392 10.2062C10.3045 10.0781 10.1577 10 10.0015 10C9.84524 10 9.69839 10.0781 9.6109 10.2062ZM15.5849 7.32812L16.916 6L18.0002 6C18.5532 6 19 5.55313 19 5L19 3C19 2.44687 18.5532 2 18.0002 2L7.98617 2C7.08006 2 6.19583 2.29062 5.4647 2.82812L1.5091 5.74375C0.952935 6.15312 0.834207 6.93437 1.24351 7.49062C1.65282 8.04687 2.43394 8.16562 2.9901 7.75625L6.73325 5L10.2514 5C10.667 5 11.0013 5.33437 11.0013 5.75C11.0013 6.16562 10.667 6.5 10.2514 6.5L8.00179 6.5C7.44876 6.5 7.00195 6.94687 7.00195 7.5C7.00195 8.05312 7.44876 8.5 8.00179 8.5L12.7573 8.5C13.8165 8.5 14.8351 8.07812 15.5849 7.32812Z" fill="#FF3443"/>

                </svg>
                Donate
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="min-w-[150px] bg-white text-primary shadow-none hover:bg-white/90"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 size-5 shrink-0"
                  aria-hidden="true"
                >
<path d="M9.60798 2.20625L7.53644 5.21875C7.18649 5.72813 6.99902 6.33125 6.99902 6.94688V7C6.99902 8.65625 8.34256 10 9.99854 10C11.6545 10 12.998 8.65625 12.998 7V6.94688C12.998 6.32812 12.8106 5.72813 12.4606 5.21875L10.3891 2.20625C10.3016 2.07812 10.1548 2 9.99854 2C9.84231 2 9.69546 2.07812 9.60798 2.20625ZM4.41507 12.6719L3.08404 14H1.99984C1.4468 14 1 14.4469 1 15V17C1 17.5531 1.4468 18 1.99984 18H12.0138C12.9199 18 13.8042 17.7094 14.5353 17.1719L18.4909 14.2563C19.0471 13.8469 19.1658 13.0656 18.7565 12.5094C18.3472 11.9531 17.5661 11.8344 17.0099 12.2437L13.2668 15H9.74858C9.33302 15 8.9987 14.6656 8.9987 14.25C8.9987 13.8344 9.33302 13.5 9.74858 13.5H11.9982C12.5512 13.5 12.998 13.0531 12.998 12.5C12.998 11.9469 12.5512 11.5 11.9982 11.5H7.24273C6.18353 11.5 5.16495 11.9219 4.41507 12.6719Z" fill="#FF3443"/>
</svg>

                Request
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </section>
  );
};

export default HeroSection;