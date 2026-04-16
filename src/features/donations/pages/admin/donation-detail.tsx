import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDonationQueryOptions } from "@/features/donations/queries/donationQueries";

export default function DonationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const donationId = Number(id);

    const { data: donation, isPending, isError } = useQuery(getDonationQueryOptions(donationId));

    if (isPending) return <div className="p-8">Loading donation details...</div>;
    if (isError || !donation) return <div className="p-8 text-destructive">Failed to load donation record.</div>;

    const donationDateStr = new Date(donation.donation_date);
    const isValidDate = !isNaN(donationDateStr.getTime());

    return (
        <Card className="px-8 py-6 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-6 pb-6 border-b">
                <div>
                    <Typography as={"h1"} variant={"subtitle"}>
                        Donation Detail
                    </Typography>
                    <Typography variant={"body"} className="text-secondary">
                        Donation Code: {donation.donation_code || `#${donation.id}`}
                    </Typography>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" asChild>
                        <Link to={`/admin/donations/${donation.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link to={"/admin/donations"}>Back to List</Link>
                    </Button>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <Typography variant="body" className="font-semibold mb-1 block">Donor</Typography>
                        <Typography>{donation.donor?.username || `Donor ID: ${donation.donor_id}`}</Typography>
                    </div>

                    <div>
                        <Typography variant="body" className="font-semibold mb-1 block">Hospital</Typography>
                        <Typography>{donation.hospital?.hospitalName || `Hospital ID: ${donation.hospital_id}`}</Typography>
                    </div>

                    <div>
                        <Typography variant="body" className="font-semibold mb-1 block">Blood Group</Typography>
                        <Badge variant="outline" className="text-lg">{donation.blood_group}</Badge>
                    </div>

                    <div>
                        <Typography variant="body" className="font-semibold mb-1 block">Units Donated</Typography>
                        <Typography>{donation.units_donated ?? "N/A"}</Typography>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <Typography variant="body" className="font-semibold mb-1 block">Status</Typography>
                        <Badge variant="outline" className="capitalize px-3 py-1">
                            {donation.status}
                        </Badge>
                    </div>

                    <div>
                        <Typography variant="body" className="font-semibold mb-1 block">Donation Date</Typography>
                        <Typography>
                            {isValidDate ? new Intl.DateTimeFormat('en-US').format(donationDateStr) : "Invalid Date"}
                        </Typography>
                    </div>

                    <div>
                        <Typography variant="body" className="font-semibold mb-1 block">Remarks</Typography>
                        <Typography className="whitespace-pre-wrap">{donation.remarks || "No remarks provided."}</Typography>
                    </div>
                </div>
            </section>

            <footer className="mt-12 pt-6 border-t text-sm text-gray-500 flex justify-between">
                <span>Created At: {new Date(donation.created_at).toLocaleString()}</span>
                <span>Last Updated: {new Date(donation.updated_at).toLocaleString()}</span>
            </footer>
        </Card>
    );
}
