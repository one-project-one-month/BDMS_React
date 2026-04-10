import { isAxiosError } from "axios";

type ApiErrorPayload =
  | string
  | {
      message?: string;
      Message?: string;
      title?: string;
      detail?: string;
      error?: string;
      data?: { message?: string; Message?: string };
      errors?: Record<string, string[]>;
    }
  | undefined;

export const extractApiErrorMessage = (error: unknown): string | undefined => {
  if (isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload;

    if (typeof payload === "string" && payload.trim()) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      const message =
        payload.message ??
        payload.Message ??
        payload.title ??
        payload.detail ??
        payload.error ??
        payload.data?.message ??
        payload.data?.Message;

      if (message) {
        return message;
      }

      const firstValidationMessage = payload.errors
        ? Object.values(payload.errors).flat()[0]
        : undefined;

      if (firstValidationMessage) {
        return firstValidationMessage;
      }
    }

    if (error.response?.status) {
      return `Request failed with status code ${error.response.status}`;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return undefined;
};
