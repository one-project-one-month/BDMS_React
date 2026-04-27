import React from "react";
import { Typography } from "@/components/ui/typography";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const impactItems = [
  { value: "150+", label: "Lives Saved" },
  { value: "50+", label: "Registered Donors" },
  { value: "60+", label: "Active Requests" },
  { value: "60+", label: "Blood Donations" },
];

const BloodDropIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 23"
    fill="none"
    className="size-5 shrink-0"
    aria-hidden="true"
  >
<path d="M8 23C3.58333 23 0 19.2538 0 14.6364C0 10.6636 5.425 2.6964 6.94167 0.544508C7.1875 0.196023 7.575 0 7.99167 0H8.00833C8.425 0 8.8125 0.196023 9.05833 0.544508C10.575 2.6964 16 10.6636 16 14.6364C16 19.2538 12.4167 23 8 23ZM4.66667 14.2879C4.66667 13.7085 4.22083 13.2424 3.66667 13.2424C3.1125 13.2424 2.66667 13.7085 2.66667 14.2879C2.66667 17.5593 5.20417 20.2121 8.33333 20.2121C8.8875 20.2121 9.33333 19.746 9.33333 19.1667C9.33333 18.5873 8.8875 18.1212 8.33333 18.1212C6.30833 18.1212 4.66667 16.4049 4.66667 14.2879Z" fill="#FF3443"/>

  </svg>
);

const ImpactSection: React.FC = () => {
  return (
    <section className="bg-background py-15 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-4">
            Our Impact
          </h2>
          <p className="text-dark-primary text-lg">
            Making a difference in our community
          </p>
        </div>

       <div className="mt-8 grid w-full grid-cols-1 justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-4">
  {impactItems.map((item) => (
    <Card
      key={item.label}
      className="w-full max-w-[14rem] gap-0 rounded-[10px] border-0 bg-card py-5 shadow"
    >
      <CardHeader className="flex flex-col items-center justify-center gap-2 px-4 text-center">
        <BloodDropIcon />

        <CardTitle>
          <Typography
            as="span"
            variant="title"
            className="text-primary text-4xl leading-none sm:text-5xl text-pretty text-base "
            style={{
              textShadow: "4px 6px 5px rgba(255, 115, 125, 0.45)",
              letterSpacing: "-0.03em",
            }}
          >
            {item.value}
          </Typography>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pt-3 text-center">
        <Typography
          as="p"
          variant="body"
          className="text-sm text-pretty text-base  text-card-foreground sm:text-base"
        >
          {item.label}
        </Typography>
      </CardContent>
    </Card>
  ))}
</div>
      </div>
    </section>
  );
};

export default ImpactSection;