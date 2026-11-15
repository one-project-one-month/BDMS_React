import { useState } from "react";
import { HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import BecomeDonorDialog from "@/features/donors/components/become-donor-dialog";

/** Shown to client accounts that have no donor profile yet. */
export default function DonorRequiredCard() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="mx-auto max-w-xl items-center p-8 text-center">
      <HeartHandshake className="mb-4 size-12 text-primary" aria-hidden="true" />
      <Typography variant="subtitle" className="text-dark-primary">
        Donor profile required
      </Typography>
      <Typography className="mt-2 text-disabled">
        Apply to become a donor to record donations and see your donation history.
      </Typography>
      <Button className="mt-6" onClick={() => setOpen(true)}>
        Become a Donor
      </Button>
      <BecomeDonorDialog open={open} onOpenChange={setOpen} />
    </Card>
  );
}
