import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Link } from "react-router-dom";

export default function DonationListPage() {
  return (
    <Card className="px-8">
      <header className="flex items-center justify-between mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Donation Lists
        </Typography>
        <Button asChild>
          <Link to={"/client/donations/create"}>Create Donation</Link>
        </Button>
      </header>

      <section>
        <div>Donation List Table</div>
      </section>
    </Card>
  );
}