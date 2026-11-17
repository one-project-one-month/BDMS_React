import { Award, Clock, ShieldOff } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";

interface CertificateRequiredCardProps {
  /** The API answered 403 for certificates, so the account has no access. */
  forbidden?: boolean;
}

/** Shown on certificate pages when the account cannot have certificates yet. */
export default function CertificateRequiredCard({
  forbidden = false,
}: CertificateRequiredCardProps) {
  const { user } = useAuth();

  if (!forbidden && user?.donor?.status === "pending") {
    return (
      <Card className="mx-auto max-w-xl items-center p-8 text-center">
        <Clock className="mb-4 size-12 text-primary" aria-hidden="true" />
        <Typography variant="subtitle" className="text-dark-primary">
          Certificates after approval
        </Typography>
        <Typography className="mt-2 text-disabled">
          Your donor application is still pending. Certificates are issued once
          it is approved and you complete a donation.
        </Typography>
      </Card>
    );
  }

  if (!forbidden && user?.donor) {
    return (
      <Card className="mx-auto max-w-xl items-center p-8 text-center">
        <Award className="mb-4 size-12 text-primary" aria-hidden="true" />
        <Typography variant="subtitle" className="text-dark-primary">
          No certificates yet
        </Typography>
        <Typography className="mt-2 text-disabled">
          Certificates are issued by the blood bank after a completed donation.
        </Typography>
        <Button asChild className="mt-6">
          <Link to="/client/donations">View my donations</Link>
        </Button>
      </Card>
    );
  }

  if (!forbidden) {
    return (
      <Card className="mx-auto max-w-xl items-center p-8 text-center">
        <Award className="mb-4 size-12 text-primary" aria-hidden="true" />
        <Typography variant="subtitle" className="text-dark-primary">
          Certificates are for donors
        </Typography>
        <Typography className="mt-2 text-disabled">
          Become an approved donor and complete a donation to receive a
          certificate.
        </Typography>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl items-center p-8 text-center">
      <ShieldOff className="mb-4 size-12 text-primary" aria-hidden="true" />
      <Typography variant="subtitle" className="text-dark-primary">
        Certificates unavailable
      </Typography>
      <Typography className="mt-2 text-disabled">
        This account does not have access to certificates. Contact the blood
        bank if you think this is a mistake.
      </Typography>
    </Card>
  );
}
