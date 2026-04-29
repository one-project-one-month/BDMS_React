import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

const bloodStocks = [
    { type: "A+", unit: 10 },
    { type: "A-", unit: 50 },
    { type: "B+", unit: 80 },
    { type: "B-", unit: 3 },
    { type: "AB+", unit: 4 },
    { type: "AB-", unit: 2 },
    { type: "O+", unit: 12 },
    { type: "O-", unit: 6 },
]

export function BloodStock() {
    return (
        <Card className="h-full shadow">
            <CardHeader className="flex flex-row items-center  space-y-0 pb-4" araia-hidden="true">
                <svg width="25" height="25" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 32.4C11.7031 32.4 7 27.5625 7 21.6C7 16.47 14.1203 6.18189 16.1109 3.40314C16.4336 2.95314 16.9422 2.70001 17.4891 2.70001H17.5109C18.0578 2.70001 18.5664 2.95314 18.8891 3.40314C20.8797 6.18189 28 16.47 28 21.6C28 27.5625 23.2969 32.4 17.5 32.4ZM13.125 21.15C13.125 20.4019 12.5398 19.8 11.8125 19.8C11.0852 19.8 10.5 20.4019 10.5 21.15C10.5 25.3744 13.8305 28.8 17.9375 28.8C18.6648 28.8 19.25 28.1981 19.25 27.45C19.25 26.7019 18.6648 26.1 17.9375 26.1C15.2797 26.1 13.125 23.8838 13.125 21.15Z" fill="#600007" />
                </svg>

                <Typography className="text-dark-primary font-semibold">Blood Availability</Typography>

            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {bloodStocks.map((stock) => (
                        <div key={stock.type} className="flex flex-col items-center gap-3">
                            <Typography className="text-dark-primary! font-semibold">
                                {stock.type}
                            </Typography>
                            <div className="w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-primary"
                                    style={{ width: `${(stock.unit / 100) * 100}%` }}
                                ></div>
                            </div>
                            <Typography className="text-muted-foreground text-sm! text-center">
                                {stock.unit} units
                            </Typography>
                        </div>


                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
