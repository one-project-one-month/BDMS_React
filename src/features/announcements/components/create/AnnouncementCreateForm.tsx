"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import * as Switch from "@radix-ui/react-switch";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type {
  AnnouncementDetailTypes,
  AnnouncementResponseTypes,
} from "../../announcement.types";
import { useMutation } from "@tanstack/react-query";
import {
  createAnnouncementMutationOptions,
  updateAnnouncementMutationOptions,
} from "../../queries";

type FormValues = {
  title: string;
  category: string;
  content: string;
  isActive: boolean;
  expiredAt: {
    year: number;
    month: number;
    day: number;
  };
};

type Props = {
  defaultValues?: AnnouncementResponseTypes;
  mode: "create" | "edit";
};

const getDefaultExpiredAt = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const formatMonthValue = (value?: number) =>
  value == null ? "" : value.toString().padStart(2, "0");

const getYearOptions = (count = 5) => {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: count }, (_, index) => currentYear + index);
};

const formatExpiredAtPayload = (
  expiredAt: FormValues["expiredAt"],
): AnnouncementDetailTypes["expiredAt"] => {
  const month = expiredAt.month.toString().padStart(2, "0");
  const day = expiredAt.day.toString().padStart(2, "0");

  return `${expiredAt.year}-${month}-${day}`;
};

const CreateAnnouncementForm = ({ defaultValues, mode }: Props) => {
  const yearOptions = getYearOptions();

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<FormValues>({
      defaultValues: defaultValues || {
        title: "",
        category: "",
        content: "",
        isActive: true,
        expiredAt: getDefaultExpiredAt(),
      },
    });

  const month = watch("expiredAt.month");
  const year = watch("expiredAt.year");

  const { mutate: createAnnouncement, isPending: isCreating } = useMutation(
    createAnnouncementMutationOptions,
  );

  const { mutate: updateAnnouncement, isPending: isUpdating } = useMutation(
    updateAnnouncementMutationOptions,
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title,
        category: defaultValues.category,
        content: defaultValues.content,
        isActive: defaultValues.isActive,
        expiredAt: {
          year: defaultValues.expiredAt.year,
          month: defaultValues.expiredAt.month,
          day: defaultValues.expiredAt.day,
        },
      });
    }
  }, [defaultValues, reset]);

  const isActive = watch("isActive");

  const payloadFromForm = (data: FormValues): AnnouncementDetailTypes => ({
    title: data.title,
    category: data.category,
    content: data.content,
    isActive: data.isActive,
    expiredAt: formatExpiredAtPayload(data.expiredAt),
  });

  const onSubmit = (data: FormValues) => {
    const payload = payloadFromForm(data);

    if (mode === "edit" && defaultValues) {
      updateAnnouncement(
        {
          id: defaultValues.id,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success("Announcement edited successfully", {
              position: "bottom-right",
            });
            navigate("/Announcements");
          },
        },
      );
    } else {
      createAnnouncement(payload, {
        onSuccess: () => {
          toast.success("Announcement created successfully", {
            position: "bottom-right",
          });
          navigate("/Announcements");
          reset();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans">
      <FieldGroup>
        {/* Title */}
        <Field>
          <FieldLabel>Title</FieldLabel>
          <FieldContent>
            <Input {...register("title", { required: true })} />
          </FieldContent>
          <FieldError />
        </Field>

        {/* Category */}
        <Field>
          <FieldLabel>Category</FieldLabel>
          <FieldContent>
            <Input {...register("category", { required: true })} />
          </FieldContent>
          <FieldError />
        </Field>

        {/* Content */}
        <Field>
          <FieldLabel>Content</FieldLabel>
          <FieldContent>
            <Textarea {...register("content", { required: true })} />
          </FieldContent>
          <FieldError />
        </Field>

        {/* Active Switch */}
        <Field>
          <FieldLabel>Active</FieldLabel>
          <FieldContent>
            <Switch.Root
              checked={isActive}
              onCheckedChange={(val) => setValue("isActive", val)}
              className="w-10 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-green-500"
            >
              <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
            </Switch.Root>
          </FieldContent>
        </Field>

        {/* Expired Date */}
        <FieldLabel>Expired Date</FieldLabel>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Month</FieldLabel>
            <Select
              value={formatMonthValue(month)}
              onValueChange={(val) =>
                setValue("expiredAt.month", Number(val), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="01">01</SelectItem>
                  <SelectItem value="02">02</SelectItem>
                  <SelectItem value="03">03</SelectItem>
                  <SelectItem value="04">04</SelectItem>
                  <SelectItem value="05">05</SelectItem>
                  <SelectItem value="06">06</SelectItem>
                  <SelectItem value="07">07</SelectItem>
                  <SelectItem value="08">08</SelectItem>
                  <SelectItem value="09">09</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="11">11</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Year</FieldLabel>
            <Select
              value={year?.toString()}
              onValueChange={(val) =>
                setValue("expiredAt.year", Number(val), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {yearOptions.map((optionYear) => (
                    <SelectItem key={optionYear} value={optionYear.toString()}>
                      {optionYear}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Day</FieldLabel>
            <Input
              type="number"
              min={1}
              max={31}
              placeholder="12"
              {...register("expiredAt.day", { required: true })}
            />
          </Field>
        </div>

        {/* Submit */}
        {mode === "create" && (
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-4 py-2 mt-6 bg-primary text-white rounded-md w-fit mx-auto"
          >
            {isCreating ? "Creating..." : "Create Announcement"}
          </button>
        )}

        {mode === "edit" && (
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-4 py-2 mt-6 bg-primary text-white rounded-md w-fit mx-auto"
          >
            {isUpdating ? "Saving..." : "Save changes"}
          </button>
        )}
      </FieldGroup>
    </form>
  );
};

export default CreateAnnouncementForm;
