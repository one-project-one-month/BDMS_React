import { Typography } from "@/components/ui/typography";
import { steps } from "../schema";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex w-full items-start justify-center overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.title}
            className="flex min-w-36 items-start justify-center"
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow transition-colors md:h-14 md:w-14 ${
                  isActive || isCompleted ? "bg-red-500" : "bg-gray-300"
                }`}
              >
                <Typography
                  as="h3"
                  variant="title"
                  className={
                    isActive || isCompleted ? "text-white" : "text-gray-600"
                  }
                >
                  {index + 1}
                </Typography>
              </div>
              <Typography
                as="span"
                variant="body"
                className={`max-w-28 text-center text-sm! font-semibold leading-tight ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </Typography>
            </div>

            {!isLast && (
              <div
                className="mt-6 flex items-center md:mt-7"
                style={{ transform: "translateY(-50%)" }}
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-[1.5px] w-2 ${
                        isCompleted ? "bg-red-400" : "bg-gray-300"
                      }`}
                    />
                  ))}
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    className={`-ml-1 ${
                      isCompleted ? "text-red-400" : "text-gray-300"
                    }`}
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
