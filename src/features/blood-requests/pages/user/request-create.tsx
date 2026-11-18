import { BloodRequestForm } from "../../components/blood-request-form";
import StepIndicator from "../../components/step-indicator";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RequestCreatePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <StepIndicator currentStep={currentStep} />
      <BloodRequestForm
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onSubmitSuccess={() => {
          setCurrentStep(0);
          navigate("/client/blood-requests");
        }}
      />
    </div>
  );
}
