import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import StepIndicator from "../components/step-indicator";
import BloodRequestForm from "../components/blood-request-form";
import { bloodRequestDetailQueryOptions } from "../queries";
import type { BloodRequestFormValues } from "../requests.types";

export default function RequestEditPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const numericRequestId = Number(requestId);
  const isValidId = Boolean(requestId) && !Number.isNaN(numericRequestId);

  const { data: request, isPending, isError, error } = useQuery({
    ...bloodRequestDetailQueryOptions(numericRequestId),
    enabled: isValidId,
  });

  const initialValues = useMemo<BloodRequestFormValues | undefined>(() => {
    if (!request) {
      return undefined;
    }

    return {
      patientName: request.patientName,
      bloodGroup: request.bloodGroup,
      hospitalId: request.hospitalId,
      hospitalAddress: request.hospitalAddress,
      unitsRequired: request.unitsRequired,
      requiredDate: new Date(request.requiredDate),
      requestType: request.requestType,
      relationshipToPatient: request.relationshipToPatient,
      contactPhone: request.contactPhone,
      reason: request.reason,
      additionalNotes: request.additionalNotes ?? "",
    };
  }, [request]);

  if (!isValidId) {
    return <Navigate to="/admin/blood-requests" replace />;
  }

  if (isPending) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Loading request for editing...
        </CardContent>
      </Card>
    );
  }

  if (isError || !initialValues) {
    return (
      <Card>
        <CardContent className="space-y-4 py-10 text-center">
          <Typography className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Blood request could not be loaded."}
          </Typography>
          <Button asChild variant="outline">
            <Link to="/admin/blood-requests">Back to List</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Edit Blood Request</CardTitle>
            <Typography className="text-muted-foreground">
              Update the request details and save the corrected information.
            </Typography>
          </div>
          <Button asChild variant="outline">
            <Link to={`/admin/blood-requests/${numericRequestId}`}>
              Back to Detail
            </Link>
          </Button>
        </CardHeader>
      </Card>

      <StepIndicator currentStep={currentStep} />

      <BloodRequestForm
        mode="edit"
        requestId={numericRequestId}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        initialValues={initialValues}
        onSubmitSuccess={(updatedRequest) => {
          navigate(`/admin/blood-requests/${updatedRequest.id}`);
        }}
      />
    </div>
  );
}
