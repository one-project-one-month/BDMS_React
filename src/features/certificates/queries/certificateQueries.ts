import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { Certificate, Donor } from "../certificate.types";
import { certificateKeys } from "./certificateKeys";
import { 
    getCertificateList,
    getDonorList,
    generateCertificate, 
    getCertificateById, 
    getCertificatesByDonor 
} from "../api/certificate-api";

/**
 * Query: get all certificates.
 */
export const getCertificateListQueryOptions = queryOptions<Certificate[]>({
    queryKey: certificateKeys.listAll(),
    queryFn: getCertificateList,
});

/**
 * Query: get all donors.
 */
export const getDonorListQueryOptions = queryOptions<Donor[]>({
    queryKey: ["donors", "list"],
    queryFn: getDonorList,
});

/**
 * Query: get all certificates for a specific donor.
 */
export const getCertificatesQueryOptions = (donorId: number | string) => queryOptions<Certificate[]>({
    queryKey: certificateKeys.list(donorId),
    queryFn: () => getCertificatesByDonor(donorId),
});

/**
 * Query: get specific certificate by ID.
 */
export const getCertificateQueryOptions = (id: number | string) => queryOptions<Certificate>({
    queryKey: certificateKeys.detail(id),
    queryFn: () => getCertificateById(id),
});

/**
 * Mutation: generate (create) certificate record.
 */
export const generateCertificateMutationOptions = mutationOptions<
    Certificate, 
    unknown,
    Parameters<typeof generateCertificate>[0]
>({
    mutationFn: generateCertificate,
});

