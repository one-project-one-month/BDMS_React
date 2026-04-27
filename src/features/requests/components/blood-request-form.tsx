import { useEffect, useMemo } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useForm,
  useWatch,
  type DefaultValues,
} from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useAuth from "@/context/auth/useAuth";
import { steps, formSchema } from "../schema";
import {
  createBloodRequestMutationOptions,
  hospitalQueryOptions,
  requestKeys,
  updateBloodRequestMutationOptions,
} from "../queries";
import type { BloodRequest, BloodRequestFormValues } from "../request.types";
import { BLOOD_GROUP_OPTIONS, RELATIONSHIP_OPTIONS } from "../request.types";
import { StyledInput } from "./styled-input";
import { StyledTextarea } from "./styled-text-area";
import { FormRow } from "./form-row";

type FormSchema = z.infer<typeof formSchema>;

interface BloodRequestFormProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  mode?: "create" | "edit";
  requestId?: number;
  initialValues?: BloodRequestFormValues;
  onSubmitSuccess?: (request: BloodRequest) => void;
  backToListPath?: string;
  role: string;
}

const createDefaultValues = (
  initialValues?: BloodRequestFormValues,
): DefaultValues<FormSchema> => ({
  patientName: initialValues?.patientName ?? "",
  bloodGroup: initialValues?.bloodGroup ?? "A+",
  hospitalId: initialValues?.hospitalId ?? 0,
  hospitalAddress: initialValues?.hospitalAddress ?? "",
  unitsRequired: initialValues?.unitsRequired ?? 1,
  requiredDate: initialValues?.requiredDate,
  requestType: initialValues?.requestType ?? "pre-booked",
  relationshipToPatient: initialValues?.relationshipToPatient ?? "relative",
  contactPhone: initialValues?.contactPhone ?? "",
  reason: initialValues?.reason ?? "",
  additionalNotes: initialValues?.additionalNotes ?? "",
});

const formatReviewDate = (date?: Date) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    : "-";

export const BloodRequestForm = ({
  currentStep,
  setCurrentStep,
  mode = "create",
  requestId,
  initialValues,
  onSubmitSuccess,
  role,
}: BloodRequestFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isLastStep = currentStep === steps.length - 1;

  const defaultValues = useMemo(
    () => createDefaultValues(initialValues),
    [initialValues],
  );

  const {
    data: hospitals = [],
    isPending: isHospitalsPending,
    isError: isHospitalsError,
    error: hospitalsError,
  } = useQuery(hospitalQueryOptions);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const selectedRequestType = useWatch({
    control: form.control,
    name: "requestType",
  });

  const selectedHospitalId = useWatch({
    control: form.control,
    name: "hospitalId",
  });

  const createMutation = useMutation(createBloodRequestMutationOptions);
  const updateMutation = useMutation(updateBloodRequestMutationOptions);
  const activeMutation = mode === "edit" ? updateMutation : createMutation;

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  useEffect(() => {
    if (!selectedHospitalId) {
      return;
    }

    const hospital = hospitals.find((item) => item.id === selectedHospitalId);
    if (!hospital) {
      return;
    }

    form.setValue("hospitalAddress", hospital.address, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [selectedHospitalId, hospitals, form]);

  const selectedHospital = hospitals.find(
    (hospital) => hospital.id === selectedHospitalId,
  );

  const handleNextButton = async () => {
    const currentFields = steps[currentStep].fields;
    const isValid = currentFields.length
      ? await form.trigger(currentFields)
      : true;

    if (isValid && !isLastStep) {
      setCurrentStep((previousStep) => previousStep + 1);
    }
  };

  const handleBackButton = () => {
    if (currentStep > 0) {
      setCurrentStep((previousStep) => previousStep - 1);
    }
  };

  const handleSubmit = async (values: FormSchema) => {
    if (!user?.userId) {
      toast.error("You must be logged in to submit a blood request.");
      return;
    }

    const payload = {
      userId: user.userId,
      values,
    };

    try {
      const request =
        mode === "edit" && requestId
          ? await updateMutation.mutateAsync({ id: requestId, ...payload })
          : await createMutation.mutateAsync(payload);

      queryClient.setQueryData<BloodRequest[]>(
        requestKeys.list(),
        (currentRequests = []) => [
          request,
          ...currentRequests.filter((item) => item.id !== request.id),
        ],
      );
      await queryClient.invalidateQueries({ queryKey: requestKeys.list() });
      queryClient.setQueryData(requestKeys.detail(request.id), request);

      toast.success(
        mode === "edit"
          ? "Blood request updated successfully."
          : "Blood request submitted successfully.",
        { position: "bottom-right" },
      );

      if (mode === "create") {
        form.reset(createDefaultValues());
        setCurrentStep(0);
      }

      onSubmitSuccess?.(request);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save the blood request.";

      toast.error(message, { position: "bottom-right" });
    }
  };

  const reviewValues = form.getValues();

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl text-primary">
          {mode === "edit" ? "Edit Blood Request" : "Request Blood Support"}
        </CardTitle>
        <CardDescription>
          Complete the form carefully so the team can process the request
          without follow-up delays.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {isHospitalsError && (
          <div className="rounded-md border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {hospitalsError instanceof Error
              ? hospitalsError.message
              : "Unable to load hospitals. Check your session and API connection."}
          </div>
        )}

        <form
          id="blood-request-form"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {currentStep === 0 && (
            <div className="flex flex-col gap-5">
              <Controller
                name="patientName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Patient name"
                    error={fieldState.error?.message}
                  >
                    <StyledInput
                      {...field}
                      placeholder="Enter patient's full name"
                      autoComplete="off"
                    />
                  </FormRow>
                )}
              />

              <Controller
                name="bloodGroup"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Blood group"
                    error={fieldState.error?.message}
                  >
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full border-red-200 bg-red-50 text-red-600 focus-visible:border-red-400 focus-visible:ring-red-100">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Blood groups</SelectLabel>
                          {BLOOD_GROUP_OPTIONS.map((bloodGroup) => (
                            <SelectItem key={bloodGroup} value={bloodGroup}>
                              {bloodGroup}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormRow>
                )}
              />

              <Controller
                name="hospitalId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow label="Hospital" error={fieldState.error?.message}>
                    <Select
                      name={field.name}
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={isHospitalsPending}
                    >
                      <SelectTrigger className="w-full border-red-200 bg-red-50 text-red-600 focus-visible:border-red-400 focus-visible:ring-red-100">
                        <SelectValue
                          placeholder={
                            isHospitalsPending
                              ? "Loading hospitals..."
                              : "Select hospital"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Hospitals</SelectLabel>
                          {hospitals.map((hospital) => (
                            <SelectItem
                              key={hospital.id}
                              value={String(hospital.id)}
                            >
                              {hospital.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormRow>
                )}
              />

              <Controller
                name="hospitalAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Hospital address"
                    error={fieldState.error?.message}
                  >
                    <StyledInput
                      {...field}
                      placeholder="Hospital address"
                      autoComplete="off"
                    />
                  </FormRow>
                )}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex flex-col gap-5">
              <Controller
                name="unitsRequired"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Units required"
                    error={fieldState.error?.message}
                  >
                    <StyledInput
                      {...field}
                      type="number"
                      placeholder="Enter number of blood units"
                      autoComplete="off"
                      onChange={(event) =>
                        field.onChange(Number(event.target.value) || 0)
                      }
                    />
                  </FormRow>
                )}
              />

              <Controller
                name="requiredDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Required date"
                    error={fieldState.error?.message}
                  >
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select required date"
                      className="w-full border-red-200 bg-red-50 text-red-600 focus-visible:border-red-400 focus-visible:ring-red-100"
                    />
                  </FormRow>
                )}
              />

              <Controller
                name="requestType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Request type"
                    error={fieldState.error?.message}
                  >
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-3"
                    >
                      <div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3">
                        <RadioGroupItem
                          value="emergency"
                          id="request-type-emergency"
                          className="border-red-400 text-red-500"
                        />
                        <label
                          htmlFor="request-type-emergency"
                          className="cursor-pointer text-sm font-medium text-gray-700"
                        >
                          Emergency
                        </label>
                      </div>
                      <div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3">
                        <RadioGroupItem
                          value="pre-booked"
                          id="request-type-pre-booked"
                          className="border-red-400 text-red-500"
                        />
                        <label
                          htmlFor="request-type-pre-booked"
                          className="cursor-pointer text-sm font-medium text-gray-700"
                        >
                          Pre-booked
                        </label>
                      </div>
                    </RadioGroup>
                  </FormRow>
                )}
              />

              {selectedRequestType === "emergency" && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 md:ml-[11rem]">
                  <p className="text-sm text-red-700">
                    Emergency requests are prioritized for rapid review and
                    donor matching.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-5">
              <Controller
                name="relationshipToPatient"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Relationship"
                    error={fieldState.error?.message}
                  >
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full border-red-200 bg-red-50 text-red-600 focus-visible:border-red-400 focus-visible:ring-red-100">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Relationship</SelectLabel>
                          {RELATIONSHIP_OPTIONS.map((relationship) => (
                            <SelectItem key={relationship} value={relationship}>
                              {relationship.charAt(0).toUpperCase() +
                                relationship.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormRow>
                )}
              />

              <Controller
                name="contactPhone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Contact number"
                    error={fieldState.error?.message}
                  >
                    <StyledInput
                      {...field}
                      placeholder="+95 9 123 456 789"
                      autoComplete="off"
                    />
                  </FormRow>
                )}
              />

              <Controller
                name="reason"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow label="Reason" error={fieldState.error?.message}>
                    <StyledTextarea
                      {...field}
                      placeholder="Reason for the blood request"
                      rows={4}
                    />
                  </FormRow>
                )}
              />

              <Controller
                name="additionalNotes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormRow
                    label="Additional notes"
                    error={fieldState.error?.message}
                  >
                    <StyledTextarea
                      {...field}
                      placeholder="Any extra context for the medical team"
                      rows={3}
                    />
                  </FormRow>
                )}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-muted/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Patient
                  </p>
                  <p className="mt-2 font-medium">{reviewValues.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    Blood group: {reviewValues.bloodGroup}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Units required: {reviewValues.unitsRequired}
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Hospital
                  </p>
                  <p className="mt-2 font-medium">
                    {selectedHospital?.name ?? "Selected hospital"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reviewValues.hospitalAddress}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Required date: {formatReviewDate(reviewValues.requiredDate)}
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Contact
                  </p>
                  <p className="mt-2 font-medium">
                    {reviewValues.relationshipToPatient}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reviewValues.contactPhone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Request type: {reviewValues.requestType}
                  </p>
                </div>

                <div className="rounded-lg border bg-muted/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Reason
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {reviewValues.reason}
                  </p>
                  {reviewValues.additionalNotes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Notes: {reviewValues.additionalNotes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        <div className="flex justify-between">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBackButton}
              className="text-gray-500"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button
              asChild
              type="button"
              variant="ghost"
              className="text-gray-500"
            >
              <Link to={`/${role}/blood-requests`}>Back to List</Link>
            </Button>
          )}

          {!isLastStep && (
            <Button
              type="button"
              onClick={handleNextButton}
              className="rounded-lg bg-red-500 px-6 font-semibold text-white hover:bg-red-600"
            >
              Next
              <ChevronsRight className="ml-1 h-4 w-4" />
            </Button>
          )}

          {isLastStep && (
            <Button
              type="submit"
              form="blood-request-form"
              disabled={activeMutation.isPending}
              className="rounded-lg bg-red-500 px-6 font-semibold text-white hover:bg-red-600"
            >
              {activeMutation.isPending ? (
                <Spinner size="sm" />
              ) : mode === "edit" ? (
                "Save Changes"
              ) : (
                "Submit Request"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodRequestForm;
