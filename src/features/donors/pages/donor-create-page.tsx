import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import DonorCreateForm from "../components/donor-create-form";

export default function DonorCreatePage() {
  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Add Donor
        </Typography>
      </header>

      <section>
        <DonorCreateForm />
      </section>
    </Card>
  );
}
