import { Typography } from "@/components/ui/typography";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { label: "Person Details" },
  { label: "Requirement Details" },
  { label: "Contact & Reason" },
  { label: "Confirm" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-start justify-center w-full">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex items-start justify-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow
                  ${isActive ? "bg-red-500" : "bg-gray-400"}`}
              >
                <Typography
                  as="h3"
                  variant="title"
                  className={isActive ? "text-white" : "text-gray-100"}
                >
                  {index + 1}
                </Typography>
              </div>
              <Typography
                as="span"
                variant="body"
                className="font-semibold text-center leading-tight text-gray-90"
              >
                {step.label}
              </Typography>
            </div>

            {/* Connector arrows */}
            {!isLast && (
              <div className="flex items-center" style={{ marginTop: "2rem", transform: "translateY(-50%)" }}>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-2 h-[1.5px] bg-gray-400" />
                  ))}
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    className="text-gray-400 -ml-1"
                  >
                    <path
                      d="M1 1 L6 4 L1 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}