import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import UserCreateForm from "../components/user-create-form";

export default function UserCreatePage() {
  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Create User
        </Typography>
      </header>

      <section>
        <UserCreateForm />
      </section>
    </Card>
  );
}
