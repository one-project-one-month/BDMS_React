import { format, parse, isValid } from "date-fns";
import { bloodGroupLabelMap } from "./request.constant";
import type { BloodGroup, BloodGroupRaw } from "./request.types";

export const toDateInputValue = (value: string) => {
  if (!value) return "";

  try {
    const parsed = parse(value, "yyyy-MM-dd", new Date());
    if (isValid(parsed)) {
      return format(parsed, "yyyy-MM-dd");
    }

    const date = new Date(value);
    if (!isValid(date)) return "";

    return format(date, "yyyy-MM-dd");
  } catch {
    return "";
  }
};

export const formatBloodGroup = (value: BloodGroupRaw | BloodGroup | string) => {
  if (value in bloodGroupLabelMap) {
    return bloodGroupLabelMap[value as BloodGroupRaw];
  }

  return value;
};

export const formatDate = (value: string) => {
  try {
    const date = new Date(value);
    if (!isValid(date)) return value;
    return format(date, "MMM d, yyyy");
  } catch {
    return value;
  }
};
