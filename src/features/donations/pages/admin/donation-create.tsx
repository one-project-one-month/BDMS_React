import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import DonationForm from "@/features/donations/components/donation-form";

export default function DonationCreatePage() {
    return (
        <Card className="px-8 py-6">
            <header className="mb-6">
                <Typography as={"h1"} variant={"subtitle"}>
                    Create Donation
                </Typography>
                <Typography variant={"body"}>
                    Fill in the details below to add a new donation record.
                </Typography>
            </header>
            <section>
                <DonationForm />
            </section>
        </Card>
    );
}
