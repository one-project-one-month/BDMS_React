import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import AnnouncementCreateSection from "../../components/create/AnnouncementCreateSection";

export default function AnnouncementCreatePage() {
  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Create User
        </Typography>
      </header>

      <section>
        <AnnouncementCreateSection />
      </section>
    </Card>
  );
}
