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
    donorId: z.number().min(1, "Donor ID is required."),
    hospitalId: z.number().min(1, "Hospital ID is required."),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    donationDate: z.string().min(1, "Donation date is required."),
    status: z.enum(['pending', 'cancelled', 'approved', 'screening', 'rejected', 'completed']),
    unitsDonated: z.number().nullable().optional(),
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
            donorId: initialData?.donorId || 0,
            hospitalId: initialData?.hospitalId || 0,
            bloodGroup: initialData?.bloodGroup || "O+",
            donationDate: initialData?.donationDate ? new Date(initialData.donationDate).toISOString().split('T')[0] : "",
            status: initialData?.status || "pending",
            unitsDonated: initialData?.unitsDonated || null,
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
                    name="donorId"
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
                    name="hospitalId"
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
                    name="bloodGroup"
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
                    name="donationDate"
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
                    name="unitsDonated"
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
                <div className="flex items-center gap-4 mt-6">
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
