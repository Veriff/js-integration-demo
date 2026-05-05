import { DateTime } from "luxon";
import type { CountryCode, Person } from "./types";
import * as AR_NAMES from "../data/AR/names";
import * as BR_NAMES from "../data/BR/names";
import * as EE_NAMES from "../data/EE/names";
import * as MX_NAMES from "../data/MX/names";
import * as US_NAMES from "../data/US/names";
import { DATE_FORMAT } from "./dates";

const NAME_POOLS: Record<
  CountryCode,
  {
    MALE_FIRST_NAMES: string[];
    FEMALE_FIRST_NAMES: string[];
    LAST_NAMES: string[];
  }
> = {
  AR: AR_NAMES,
  BR: BR_NAMES,
  EE: EE_NAMES,
  MX: MX_NAMES,
  US: US_NAMES,
};

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomIdNumber(): string {
  return String(Math.floor(Math.random() * 90000000000) + 10000000000);
}

export function randomPassportNumber(): string {
  return `AB${String(Math.floor(Math.random() * 900000) + 100000)}`;
}

export function randomIdCardNumber(): string {
  return String(Math.floor(Math.random() * 9000000000) + 1000000000);
}

export function randomDriversLicenseNumber(): string {
  return String(Math.floor(Math.random() * 90000000000) + 10000000000);
}

export function randomPerson(country: CountryCode = "BR"): Person {
  const names = NAME_POOLS[country];
  const gender = Math.random() < 0.5 ? "M" : "F";

  const firstName =
    gender === "M"
      ? pick(names.MALE_FIRST_NAMES)
      : pick(names.FEMALE_FIRST_NAMES);

  return {
    idNumber: randomIdNumber(),
    firstName,
    lastName: pick(names.LAST_NAMES),
    gender,
    dateOfBirth: randomDateOfBirth(),
  };
}

export function randomDateOfBirth(): string {
  const minYear = 1970;
  const maxYear = 2004;
  const year = minYear + Math.floor(Math.random() * (maxYear - minYear + 1));
  const month = 1 + Math.floor(Math.random() * 12);
  const maxDay = DateTime.local(year, month).daysInMonth!;
  const day = 1 + Math.floor(Math.random() * maxDay);

  return DateTime.local(year, month, day).toFormat(DATE_FORMAT);
}

export function randomDateBetween(start: DateTime, end: DateTime): DateTime {
  const startMillis = start.toMillis();
  const endMillis = end.toMillis();
  const randomMillis =
    startMillis + Math.floor(Math.random() * (endMillis - startMillis + 1));

  return DateTime.fromMillis(randomMillis);
}

export function randomDriversLicenseDates(): {
  firstIssue: string;
  validFrom: string;
  validUntil: string;
} {
  const firstIssue = randomDateBetween(
    DateTime.local(2012, 1, 1),
    DateTime.local(2021, 12, 31),
  );

  const validFrom = randomDateBetween(
    DateTime.local(2024, 1, 1),
    DateTime.local(2024, 12, 31),
  );

  const validUntil = validFrom.plus({ years: 10 });

  return {
    firstIssue: firstIssue.toFormat(DATE_FORMAT),
    validFrom: validFrom.toFormat(DATE_FORMAT),
    validUntil: validUntil.toFormat(DATE_FORMAT),
  };
}
