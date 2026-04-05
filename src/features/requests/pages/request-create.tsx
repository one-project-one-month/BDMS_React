import { useState } from "react";
import { BloodRequestForm } from "../components/blood-request-form";
import StepIndicator from "../components/step-indicator";
import Container from "@/components/container";
import Section from "@/components/section";

export default function RequestCreatePage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <Container>
      <Section className="flex flex-col gap-6">
        <StepIndicator currentStep={currentStep} />
        <BloodRequestForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </Section>
    </Container>
  );
}
