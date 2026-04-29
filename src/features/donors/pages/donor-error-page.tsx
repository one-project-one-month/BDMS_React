import { isAxiosError } from "axios";
import { Link, useRouteError } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export default function DonorErrorPage() {
  const error = useRouteError();
  const status = isAxiosError(error) ? error.response?.status : undefined;

  if (status === 404) {
    return (
      <Card className="px-8">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            Donor Not Found
          </Typography>
        </header>
        <section className="space-y-4">
          <Typography>This donor does not exist.</Typography>
          <Button asChild variant="outline">
            <Link to="/admin/donors">Back to Donor List</Link>
          </Button>
        </section>
      </Card>
    );
  }

  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          Something went wrong
        </Typography>
      </header>
      <Typography>Unexpected error.</Typography>
    </Card>
  );
}
