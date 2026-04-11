import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import * as z from "zod";

import { storeDonationMutationOptions, updateDonationMutationOptions, donationKeys } from "../queries/donationQueries";
import type { Donation, StoreDonationPayload, UpdateDonationPayload } from "../donation.types";

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    donor_id: z.number().min(1, "Donor ID is required."),
    hospital_id: z.number().min(1, "Hospital ID is required."),
    blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    donation_date: z.string().min(1, "Donation date is required."),
    status: z.enum(['pending', 'cancelled', 'approved', 'screening', 'rejected', 'completed']),
    units_donated: z.number().nullable().optional(),
    remarks: z.string().optional(),
});

interface DonationFormProps {
    initialData?: Donation;
    isEditing?: boolean;
}

export default function DonationForm({ initialData, isEditing = false }: DonationFormProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            donor_id: initialData?.donor_id || 0,
            hospital_id: initialData?.hospital_id || 0,
            blood_group: initialData?.blood_group || "O+",
            donation_date: initialData?.donation_date ? new Date(initialData.donation_date).toISOString().split('T')[0] : "",
            status: initialData?.status || "pending",
            units_donated: initialData?.units_donated || null,
            remarks: initialData?.remarks || "",
        },
    });

    const createMutation = useMutation({
        ...storeDonationMutationOptions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
            toast.success("Donation record created successfully.", { position: "bottom-right" });
            navigate("/admin/donations");
        },
        onError: (error) => {
            console.error(error);
            const message = isAxiosError(error) ? ((error.response?.data as any)?.message ?? "Failed to create donation") : "Failed to create donation";
            form.setError("root", { message });
            toast.error("Failed to create donation.", { position: "bottom-right" });
        },
    });

    const updateMutation = useMutation({
        ...updateDonationMutationOptions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
            if (initialData?.id) {
                queryClient.invalidateQueries({ queryKey: donationKeys.detail(initialData.id) });
            }
            toast.success("Donation updated successfully.", { position: "bottom-right" });
            navigate("/admin/donations");
        },
        onError: (error) => {
            console.error(error);
            const message = isAxiosError(error) ? ((error.response?.data as any)?.message ?? "Failed to update donation") : "Failed to update donation";
            form.setError("root", { message });
            toast.error("Failed to update donation.", { position: "bottom-right" });
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isEditing && initialData?.id) {
            updateMutation.mutateAsync({ ...values, id: initialData.id } as UpdateDonationPayload);
        } else {
            createMutation.mutateAsync(values as StoreDonationPayload);
        }
    }

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="grid grid-cols-2 gap-4">
                {/* Donor ID */}
                <Controller
                    name="donor_id"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-dark-primary">Donor (ID)</FieldLabel>
                            <Input
                                {...field}
                                type="number"
                                placeholder="Enter Donor ID"
                                value={field.value || ''}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {/* Hospital ID */}
                <Controller
                    name="hospital_id"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-dark-primary">Hospital (ID)</FieldLabel>
                            <Input
                                {...field}
                                type="number"
                                placeholder="Enter Hospital ID"
                                value={field.value || ''}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {/* Blood Group */}
                <Controller
                    name="blood_group"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-dark-primary">Blood Group</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Blood Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {/* Donation Date */}
                <Controller
                    name="donation_date"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-dark-primary">Donation Date</FieldLabel>
                            <Input {...field} type="date" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {/* Status */}
                <Controller
                    name="status"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-dark-primary">Status</FieldLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="screening">Screening</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {/* Units Donated */}
                <Controller
                    name="units_donated"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-dark-primary">Units Donated</FieldLabel>
                            <Input
                                {...field}
                                type="number"
                                placeholder="Units (e.g. 1)"
                                value={field.value || ''}
                                onChange={e => field.onChange(parseInt(e.target.value) || null)}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>

            {/* Remarks */}
            <FieldGroup>
                <Controller
                    name="remarks"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-dark-primary">Remarks</FieldLabel>
                            <Input {...field} placeholder="Additional notes..." />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>

            {form.formState.errors.root && (
                <FieldGroup>
                    <Field>
                        <FieldError errors={[form.formState.errors.root]} />
                    </Field>
                </FieldGroup>
            )}

            <FieldGroup>
                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Submitting..." : (isEditing ? "Update" : "Submit")}
                    </Button>
                    <Button variant={"outline"} asChild>
                        <Link to={"/admin/donations"}>Cancel</Link>
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
