import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="text-center">
        <Typography as={"h1"} variant={"title"} className="text-primary">
          404
        </Typography>
        <Typography as={"p"} variant={"body"} className="text-dark-primary">
          Page not found
        </Typography>
      </div>

      <div className="mt-8">
        <Link to={"/"}>
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
