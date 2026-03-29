import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { getUserQueryOptions } from "../queries";
import { Navigate, useParams } from "react-router-dom";

export default function UserDetailPage() {
  const { userId } = useParams();
  const idNum = Number(userId);

  const isValid = !!userId && !Number.isNaN(idNum);

  const { data: user, isPending } = useQuery({
    ...getUserQueryOptions(idNum),
    enabled: isValid,
  });

  if (!isValid && !user) {
    return <Navigate to="*" replace />;
  }

  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          User Detail
        </Typography>
      </header>

      <section>
        <Table>
          <TableBody>
            {isPending ? (
              <TableRow></TableRow>
            ) : (
              <TableRow>
                <TableCell>{user?.username}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </Card>
  );
}
