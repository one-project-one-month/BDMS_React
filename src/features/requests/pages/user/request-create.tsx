import { BloodRequestForm } from "../../components/blood-request-form";
import StepIndicator from "../../components/step-indicator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Typography } from "@/components/ui/typography";
import { useState } from "react";

export default function RequestCreatePage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-3 text-center">
        <Typography as="h1" variant="subtitle">
          Blood Request Form
        </Typography>
        <Typography className="mx-auto max-w-2xl text-muted-foreground">
          Submit the request details clearly so the coordination team can review
          eligibility and find donors faster.
        </Typography>
        <div className="flex justify-center">
          <Button asChild type="button" variant="outline">
            <Link to="/client/blood-requests">Back to Blood Requests</Link>
          </Button>
        </div>
      </div>

      <StepIndicator currentStep={currentStep} />
      <BloodRequestForm
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onSubmitSuccess={() => {
          setCurrentStep(0);
        }}
      />
    </div>
  );
}
