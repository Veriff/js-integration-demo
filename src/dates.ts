import { DateTime } from "luxon";

export const DATE_FORMAT = "yyyy-MM-dd";

export function timestamp(): string {
  return DateTime.now().toISO();
}
