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
import {  useCreateAnnouncement, useUpdateAnnouncement } from "../../hooks/useAnnouncement";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

type FormValues = {
  title: string;
  category?: string;
  content: string;
  isActive: boolean;
  expiredAt: {
    year: number;
    month: number;
    day: number;
  };
};

type props = {
  defaultValues?: FormValues;
  mode: string;
}


const CreateAnnouncementForm = ({defaultValues, mode} : props) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: defaultValues || {
      title: "",
      content: "",
      isActive: true,
      expiredAt: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      },
    },
  });

  const { mutate: createAnnouncement, isPending } = useCreateAnnouncement(); 
  const { mutate: updateAnnouncement } = useUpdateAnnouncement(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultValues){
      reset(defaultValues); 
    }
  }, [defaultValues, reset]); 

  const isActive = watch("isActive");

  const onSubmit = (data: FormValues) => {

    if (mode === "edit" && defaultValues){
      updateAnnouncement({
        id: (defaultValues as any).id, 
        data, 
      }); 
      navigate("/Announcements"); 
    } else {
      createAnnouncement(data);
      console.log("input data: ", data);
      navigate("/Announcements"); 
    }
    
    reset(); 
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 font-sans"
    >
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
              onCheckedChange={(val) =>
                setValue("isActive", val)
              }
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
              <FieldLabel>
                Month
              </FieldLabel>
              <Select 
                defaultValue=""  
                onValueChange={(val) => setValue("expiredAt.month", Number(val))}>
                <SelectTrigger>
                  <SelectValue placeholder="MM" {...register("expiredAt.month", { required: true })}/>
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
              <FieldLabel>
                Year
              </FieldLabel>
              <Select 
                defaultValue="" 
                 onValueChange={(val) => setValue("expiredAt.year", Number(val))} >
                <SelectTrigger >
                  <SelectValue placeholder="YYYY" {...register("expiredAt.year", { required: true })}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028</SelectItem>
                    <SelectItem value="2029">2029</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel >Day</FieldLabel>
              <Input placeholder="12" {...register("expiredAt.day", { required: true })}/>
            </Field>
          </div>
          
        {/* Submit */}
        {mode === "create" && (
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 mt-6 bg-primary text-white rounded-md w-fit mx-auto"
          >
            {isPending ? "Creating..." : "Create Announcement"}
          </button>
        )}

        {mode === "edit" && (
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 mt-6 bg-primary text-white rounded-md w-fit mx-auto"
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>
        )}
        

      </FieldGroup>
    </form>
  );
};

export default CreateAnnouncementForm;