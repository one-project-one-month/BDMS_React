import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import BloodRequestCreateForm from "../../components/blood-request-form-admin";

export default function AdminRequestCreatePage() {
  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Add Blood Request
        </Typography>
      </header>

      <section>
        <BloodRequestCreateForm />
      </section>
    </Card>
  );
}
