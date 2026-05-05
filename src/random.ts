import { DateTime } from "luxon";
import type { Person } from "./types";
import {
  MALE_FIRST_NAMES,
  FEMALE_FIRST_NAMES,
  LAST_NAMES,
} from "../data/BR/names";
import { DATE_FORMAT } from "./dates";

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

export function randomPerson(): Person {
  const gender = Math.random() < 0.5 ? "M" : "F";
  const firstName =
    gender === "M" ? pick(MALE_FIRST_NAMES) : pick(FEMALE_FIRST_NAMES);

  return {
    idNumber: randomIdNumber(),
    firstName,
    lastName: pick(LAST_NAMES),
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
