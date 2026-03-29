// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// const formSchema = z.object({
//   username: z.string().min(2, "Username must be at least 2 characters."),
//   email: z.email("Please enter a valid email address."),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   userRoleId: z.number(),
//   userHospitalId: z.number().nullable(),
// });

export default function UserEditForm() {
  //   const form = useForm<z.infer<typeof formSchema>>({
  //     resolver: zodResolver(formSchema),
  //     defaultValues: {
  //       username: "",
  //     },
  //   });

  return <div></div>;
}
