import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export function TotalBloodDonation() {


    return (
        <Card className="shadow">
            <CardHeader >
                <Typography className="text-dark-primary font-semibold text-center ">My Donations</Typography>
            </CardHeader>

            <CardContent className="flex items-center justify-center ">
                <Typography
                    className="text-7xl! font-bold text-primary">
                    12
                </Typography>
            </CardContent>
        </Card>
    );

}
