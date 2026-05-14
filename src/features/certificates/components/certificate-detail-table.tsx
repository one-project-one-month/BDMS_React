import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { getCertificateDetailQueryOptions, getDonorListQueryOptions } from "../queries";
import type { Certificate } from "../certificate.types";

export default function CertificateDetailTable({ id }: { id: number }) {
  const { data: certificate } = useSuspenseQuery(getCertificateDetailQueryOptions(id));
  const { data: donors } = useSuspenseQuery(getDonorListQueryOptions);

  const detail: Certificate = certificate;
  const detailRecord = detail as unknown as Record<string, unknown>;

  const userIdCandidate =
    detailRecord.userId ??
    detailRecord.userID ??
    ((detailRecord.donor as Record<string, unknown> | undefined)?.userId ??
      (detailRecord.donor as Record<string, unknown> | undefined)?.userID);

  const directDonorIdCandidate =
    detailRecord.donorId ??
    detailRecord.donorID ??
    detailRecord.donorProfileId ??
    detailRecord.donor_profile_id ??
    ((detailRecord.donor as Record<string, unknown> | undefined)?.donorId ??
      (detailRecord.donor as Record<string, unknown> | undefined)?.donorID);

  const userId = Number(userIdCandidate);
  const donorIdFromDonorList =
    Number.isFinite(userId) && userId > 0
      ? donors?.find((donor) => donor.userId === userId)?.donorId
      : undefined;

  const donorId = Number(directDonorIdCandidate ?? donorIdFromDonorList);
  const donorIdDisplay = Number.isFinite(donorId) && donorId > 0 ? `#${donorId}` : "-";

  const issuedDate = detail.createdAt ?? detail.issuedAt;
  const formattedDate = issuedDate
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(issuedDate))
    : new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date());

  return (
    <>
      <div className="overflow-hidden rounded-[10px] border">
        <Table>
          <TableBody>
            <TableRow className="divide-x">
              <TableCell>Certificate Title</TableCell>
              <TableCell>{detail.certificateTitle || "Certificate of Appreciation"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Donor ID</TableCell>
              <TableCell>{donorIdDisplay}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Description</TableCell>
              <TableCell className="whitespace-pre-wrap">
                {detail.certificateDescription ||
                  "In recognition of your generous and life-saving contribution to the blood donation program."}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Date Issued</TableCell>
              <TableCell>{formattedDate}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Certificate ID</TableCell>
              <TableCell>#{detail.id}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <Button asChild variant="outline">
          <Link to="/admin/certificates">Back to Certificate List</Link>
        </Button>
      </div>
    </>
  );
}
