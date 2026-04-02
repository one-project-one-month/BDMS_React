import { queryOptions } from "@tanstack/react-query";
import { getHospitals } from "../api/api";

export const hospitalQueryOptions = queryOptions({
    queryKey: ["hospitals"],
    queryFn: getHospitals,
})