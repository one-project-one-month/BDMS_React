import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 4xx is a final answer (e.g. 403 = no access), so only retry server/network errors
      retry: (failureCount, error) =>
        !(isAxiosError(error) && (error.response?.status ?? 500) < 500) &&
        failureCount < 3,
    },
  },
});

export default queryClient;
