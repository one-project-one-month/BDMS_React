import { Suspense, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

import UserEditForm from "../components/user-edit-form";
import UserFormSkeleton from "../components/ui/user-form-skeleton";

export default function UserEditPage() {
  const { userId } = useParams();

  const idNum = useMemo(() => Number(userId), [userId]);
  const isValidId = Number.isInteger(idNum) && idNum > 0;

  if (!isValidId) {
    return (
      <Card className="px-8">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            User Detail
          </Typography>
        </header>
        <section className="space-y-4">
          <Typography>Invalid user id.</Typography>
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/users">Back to User List</Link>
            </Button>
          </div>
        </section>
      </Card>
    );
  }

  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Edit User
        </Typography>
      </header>

      <section>
        <Suspense fallback={<UserFormSkeleton />}>
          <UserEditForm id={idNum} />
        </Suspense>
      </section>
    </Card>
  );
}
