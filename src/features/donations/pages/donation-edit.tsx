import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { getDonationQueryOptions } from "../queries/donationQueries";
import DonationForm from "../components/donation-form";

export default function DonationEditPage() {
    const { id } = useParams<{ id: string }>();
    const donationId = Number(id);

    const { data: donation, isPending, isError } = useQuery(getDonationQueryOptions(donationId));

    if (isPending) return <div className="p-8">Loading donation details...</div>;
    if (isError || !donation) return <div className="p-8 text-destructive">Failed to load donation record.</div>;

    return (
        <Card className="px-8 py-6 max-w-4xl mx-auto">
            <header className="mb-6">
                <Typography as={"h1"} variant={"subtitle"}>
                    Edit Donation
                </Typography>
                <Typography variant={"body"}>
                    Update the details for donation #{donationId}
                </Typography>
            </header>
            <section>
                <DonationForm initialData={donation} isEditing={true} />
            </section>
        </Card>
    );
}
