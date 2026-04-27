import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export function NextDonation() {


    return (
        <Card className="h-full shadow">
            <CardHeader className="flex flex-row items-center  space-y-0 pb-4">
                <svg width="20" height="20" className="size-5 text-pretty" aria-hidden="true" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 2C13.6426 2 17 5.35742 17 9.5C17 13.6426 13.6426 17 9.5 17C5.35742 17 2 13.6426 2 9.5C2 5.35742 5.35742 2 9.5 2ZM8.79688 5.51562V9.5C8.79688 9.73438 8.91406 9.9541 9.11035 10.0859L11.9229 11.9609C12.2451 12.1777 12.6816 12.0898 12.8984 11.7646C13.1152 11.4395 13.0273 11.0059 12.7021 10.7891L10.2031 9.125V5.51562C10.2031 5.12598 9.88965 4.8125 9.5 4.8125C9.11035 4.8125 8.79688 5.12598 8.79688 5.51562Z" fill="#600007" />
                </svg>

                <Typography className="text-dark-primary font-semibold">Next Donation Eligibility</Typography>

            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                    <div className="flex h-50 w-50 items-center justify-center rounded-full border-8 border-disabled">
                        <Typography variant="title" className="text-primary">
                            15
                        </Typography>
                    </div>
                </div>
                <div className="flex  justify-between px-4">

                    <div className="flex items-center gap-2 text-md!">
                        <Typography className="text-muted-foreground font-bold text-xl!">
                            15
                        </Typography>
                        <Typography className="text-foreground font-bold text-xl!">
                            Days left
                        </Typography>
                    </div>
                    <div className="flex items-center gap-2">
                        <Typography className="text-primary font-bold text-xl!">
                            45
                        </Typography>
                        <Typography className="text-foreground  font-bold text-xl!">
                            Days spent
                        </Typography>
                    </div>

                </div>

            </CardContent>
        </Card>
    );

}
