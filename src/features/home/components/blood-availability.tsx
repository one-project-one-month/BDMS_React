import React from "react";
import { Typography } from "@/components/ui/typography";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Container from "../../../components/container";
import Section from "../../../components/section";

const bloodData = [
  { type: "A+", amount: "1250 ML", status: "Available" },
  { type: "A-", amount: "450 ML", status: "Available" },
  { type: "B+", amount: "980 ML", status: "Available" },
  { type: "B-", amount: "320 ML", status: "Available" },
  { type: "AB+", amount: "560 ML", status: "Available" },
  { type: "AB-", amount: "180 ML", status: "Available" },
  { type: "O+", amount: "1450 ML", status: "Available" },
  { type: "O-", amount: "380 ML", status: "Available" },
];

const BloodAvailability: React.FC = () => {
  return (
    <section className="bg-background">
      <Section>
        <Container>
          <div className="rounded-[10px] bg-dark-primary px-5 py-10 shadow-sm sm:px-8 md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div className="text-center">
              <Typography
                as="h2"
                variant="title"
                className=" font-bold text-white sm:text-5xl"
              >
                Blood Availability
              </Typography>
            </div>

            <div className="mt-10 grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:mt-12 lg:grid-cols-8 lg:gap-5">
              {bloodData.map((item) => (
                <Card
                  key={item.type}
                  className="w-full max-w-[7.5rem] gap-0 rounded-[10px] border-0 bg-white py-5 shadow"
                >
                  <CardHeader className="flex flex-col items-center justify-center gap-2 px-3 text-center">
                    <CardTitle>
                      <Typography
                        as="span"
                        variant="title"
                        className="text-primary text-3xl font-extrabold leading-none text-pretty text-base "
                        style={{
                          textShadow: "4px 6px 5px rgba(255, 115, 125, 0.45)",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {item.type}
                      </Typography>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-3 pt-1 text-center">
                    <Typography
                      as="p"
                      variant="body"
                      className=" text-pretty text-base  text-card-foreground sm:text-sm"
                    >
                      {item.amount}
                      <br />
                      {item.status}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </section>
  );
};

export default BloodAvailability;