import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ChevronLeft, ChevronsRight } from "lucide-react";
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
import { steps, formSchema } from "../schema";
import { hospitalQueryOptions } from "../queries";
import { StyledInput } from "./styled-input";
import { StyledTextarea } from "./styled-text-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormRow } from "./form-row";

type FormSchema = z.infer<typeof formSchema>;

interface BloodRequestFormProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export const BloodRequestForm = ({
  currentStep,
  setCurrentStep,
}: BloodRequestFormProps) => {
  const isLastStep = currentStep === steps.length - 1;
  const { data: hospitals, isPending: isHospitalsPending } = useQuery(hospitalQueryOptions);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      bloodType: "",
      hospitalName: "",
      address: "",
      numberOfUnits: 1,
      requiredDate: undefined,
      requestType: "",
      relationshipToPatient: "",
      contactNumber: "",
      reasonForRequest: "",
      additionalNotes: "",
    },
    mode: "onChange",
  });

  const handleNextButton = async () => {
    const currentFields = steps[currentStep].fields;
    const isValid = await form.trigger(currentFields as (keyof FormSchema)[]);
    if (isValid && !isLastStep) setCurrentStep((prev) => prev + 1);
  };

  const handleBackButton = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (values: FormSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(
      "Blood request submitted successfully! Our system is now searching for donors.",
    );
    console.log("Blood Request:", values);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col gap-5">
            {/* Patient Name */}
            <Controller
              name="patientName"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow label="Patient name" error={fieldState.error?.message}>
                  <StyledInput
                    {...field}
                    placeholder="Enter patient's full name"
                    autoComplete="off"
                  />
                </FormRow>
              )}
            />

            {/* Blood Type */}
            <Controller
              name="bloodType"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow label="Blood type" error={fieldState.error?.message}>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-red-50 border border-red-200 text-red-500 focus:border-red-400">
                      <SelectValue placeholder="Select blood type" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Blood Types</SelectLabel>
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ].map((bt) => (
                            <SelectItem key={bt} value={bt}>
                              {bt}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </FormRow>
              )}
            />

            {/* Hospital Name */}
            <Controller
              name="hospitalName"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow
                  label="Hospital name"
                  error={fieldState.error?.message}
                >
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isHospitalsPending}
                  >
                    <SelectTrigger className="bg-red-50 border border-red-200 text-red-500 focus:border-red-400">
                      <SelectValue
                        placeholder={
                          isHospitalsPending
                            ? "Loading hospitals..."
                            : "Select hospital"
                        }
                      />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Hospitals</SelectLabel>
                          {(hospitals ?? []).map((hospital) => (
                            <SelectItem key={hospital.id} value={hospital.name}>
                              {hospital.name}
                            </SelectItem>
                          ))}
                          {!isHospitalsPending && (hospitals?.length ?? 0) === 0 && (
                            <SelectItem value="no-hospitals" disabled>
                              No hospitals available
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </FormRow>
              )}
            />

            {/* Address */}
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow label="Address" error={fieldState.error?.message}>
                  <StyledInput
                    {...field}
                    placeholder="Enter hospital address"
                    autoComplete="off"
                  />
                </FormRow>
              )}
            />
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col gap-5">
            {/* Number of Units */}
            <Controller
              name="numberOfUnits"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow
                  label="No. of units"
                  error={fieldState.error?.message}
                >
                  <StyledInput
                    {...field}
                    type="number"
                    placeholder="Enter number of blood units"
                    autoComplete="off"
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormRow>
              )}
            />

            {/* Required Date */}
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
                    className="bg-red-50 border border-red-200 text-red-500 w-full"
                  />
                </FormRow>
              )}
            />

            {/* Request Type */}
            <Controller
              name="requestType"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow
                  label="Is it an emergency or a pre-booked surgery date?"
                  error={fieldState.error?.message}
                >
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-row gap-3"
                  >
                    {[
                      {
                        label: "Emergency",
                        value: "emergency",
                      },
                      { label: "Pre-booked", value: "pre-booked" },
                    ].map((item) => (
                      <div key={item.value} className="flex items-center gap-3">
                        <RadioGroupItem
                          value={item.value}
                          id={item.value}
                          className="border-red-400 text-red-500"
                        />
                        <label
                          htmlFor={item.value}
                          className="text-sm cursor-pointer text-gray-700"
                        >
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormRow>
              )}
            />
            {form.watch("requestType") === "emergency" && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 ml-42">
                <p className="text-red-700 text-sm">
                  Emergency requests will be prioritized. Our team will contact
                  you within 30 minutes.
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-5">
            {/* Relationship */}
            <Controller
              name="relationshipToPatient"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow label="Relationship" error={fieldState.error?.message}>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-red-50 border border-red-200 text-red-500 focus:border-red-400">
                      <SelectValue placeholder="Select relationship" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Relationship</SelectLabel>
                          {[
                            "self",
                            "parent",
                            "spouse",
                            "child",
                            "sibling",
                            "relative",
                            "friend",
                            "guardian",
                            "other",
                          ].map((r) => (
                            <SelectItem key={r} value={r}>
                              {r.charAt(0).toUpperCase() + r.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </FormRow>
              )}
            />

            {/* Contact Number */}
            <Controller
              name="contactNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow
                  label="Contact number"
                  error={fieldState.error?.message}
                >
                  <StyledInput
                    {...field}
                    placeholder="+1 234 567 8900"
                    autoComplete="off"
                  />
                </FormRow>
              )}
            />

            {/* Reason for Request */}
            <Controller
              name="reasonForRequest"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow label="Reason" error={fieldState.error?.message}>
                  <StyledTextarea
                    {...field}
                    placeholder="Reason for blood request..."
                    rows={4}
                  />
                </FormRow>
              )}
            />

            {/* Additional Notes */}
            <Controller
              name="additionalNotes"
              control={form.control}
              render={({ field, fieldState }) => (
                <FormRow
                  label="Notes (optional)"
                  error={fieldState.error?.message}
                >
                  <StyledTextarea
                    {...field}
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </FormRow>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader></CardHeader>
      <CardContent>
        <form id="blood-request-form" onSubmit={form.handleSubmit(onSubmit)}>
          {renderStep()}
        </form>

        <div className="flex justify-between mt-8">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBackButton}
              className="text-gray-500"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : (
            <div />
          )}

          {!isLastStep && (
            <Button
              type="button"
              onClick={handleNextButton}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 rounded-lg"
            >
              Next <ChevronsRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {isLastStep && (
            <Button
              type="submit"
              form="blood-request-form"
              disabled={form.formState.isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 rounded-lg"
            >
              {form.formState.isSubmitting ? (
                <Spinner size="sm" />
              ) : (
                "Submit & Search Donors"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodRequestForm;
