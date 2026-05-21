import { coreApi } from "../src/api";
import { logger } from "../src/logger";
import { timestamp } from "../src/dates";
import { readImageBase64, readImages } from "../src/images";

import { BIOMETRIC_EE } from "../src/constants";
import { SESSIONS, SessionPayload } from "../data/index";
import {
  pick,
  randomDriversLicenseDates,
  randomDriversLicenseNumber,
  randomIdCardNumber,
  randomPassportNumber,
  randomPerson,
  randomGender,
} from "../src/random";

import * as AR_NAMES from "../data/AR/names";
import * as BR_NAMES from "../data/BR/names";
import * as EE_NAMES from "../data/EE/names";
import * as MX_NAMES from "../data/MX/names";
import * as US_NAMES from "../data/US/names";

import type {
  CountryCode,
  ImageSource,
  GenerateOptions,
  DocumentType,
} from "../src/types";

const NAME_POOLS: Record<
  CountryCode,
  { MALE_FIRST_NAMES: string[]; FEMALE_FIRST_NAMES: string[]; LAST_NAMES: string[] }
> = { AR: AR_NAMES, BR: BR_NAMES, EE: EE_NAMES, MX: MX_NAMES, US: US_NAMES };

function buildDefaultPayload(
  documentType: DocumentType,
  country: CountryCode = "EE",
): SessionPayload {
  const person = randomPerson(country);

  if (documentType === "PASSPORT") {
    const documentDates = randomDriversLicenseDates();

    return {
      verification: {
        person,
        document: {
          country,
          type: "PASSPORT",
          number: randomPassportNumber(),
          category: "AB",
          ...documentDates,
        },
      },
    };
  }

  if (documentType === "ID_CARD") {
    const documentDates = randomDriversLicenseDates();

    return {
      verification: {
        person,
        document: {
          country,
          type: "ID_CARD",
          number: randomIdCardNumber(),
          category: "AB",
          ...documentDates,
        },
      },
    };
  }

  if (documentType === "DRIVERS_LICENSE") {
    const documentDates = randomDriversLicenseDates();

    return {
      verification: {
        person,
        document: {
          country,
          type: "DRIVERS_LICENSE",
          number: randomDriversLicenseNumber(),
          category: "AB",
          ...documentDates,
        },
      },
    };
  }

  throw new Error(`Unknown document type: ${documentType}`);
}

async function uploadImages(
  verificationId: string,
  imageSources: ImageSource[],
  shouldSkipImages?: boolean,
): Promise<void> {
  if (shouldSkipImages) {
    logger.warn("Skipping image uploads (test case requires it)");
    return;
  }

  for (const source of imageSources) {
    let files = readImages(source.dir);

    if (source.filePrefix) {
      files = files.filter((file) => file.startsWith(source.filePrefix!));
    }

    const file = files[Math.floor(Math.random() * files.length)];
    if (!file) {
      logger.warn(
        `No matching image found in ${source.dir} (prefix: ${source.filePrefix ?? "none"}, context: ${source.context})`,
      );
      continue;
    }

    await coreApi.uploadMedia(verificationId, {
      image: {
        context: source.context,
        content: readImageBase64(`${source.dir}/${file}`),
        timestamp: timestamp(),
      },
    });

    logger.info(`Uploaded ${file} with context ${source.context}`);
  }
}

export async function generateVerification(
  options?: GenerateOptions,
): Promise<void> {
  const USE_CASE = options?.useCase ?? process.env.USE_CASE;
  const imageSources: ImageSource[] = options?.imageSources ?? [
    {
      dir: BIOMETRIC_EE,
      context: "face",
    },
  ];

  if (USE_CASE && !SESSIONS[USE_CASE]) {
    logger.info("Available use cases:");
    Object.entries(SESSIONS).forEach(([id, tc]) =>
      logger.info(`  ${id}: ${tc.name}`),
    );
    throw new Error(`Unknown USE_CASE: ${USE_CASE}`);
  }

  if (USE_CASE) {
    const tc = SESSIONS[USE_CASE];
    logger.info(`Running use case: ${USE_CASE} - ${tc.name}`);
  }

  const payload: SessionPayload = USE_CASE
    ? structuredClone(SESSIONS[USE_CASE].payload)
    : buildDefaultPayload(
        options?.documentType ?? "DRIVERS_LICENSE",
        options?.country,
      );

  if (USE_CASE && payload.verification.person.firstName) {
    const country = (payload.verification.document.country ?? "BR") as CountryCode;
    const names = NAME_POOLS[country];
    const gender = payload.verification.person.gender ?? randomGender();
    payload.verification.person.firstName =
      gender === "M" ? pick(names.MALE_FIRST_NAMES) : pick(names.FEMALE_FIRST_NAMES);
    payload.verification.person.lastName = pick(names.LAST_NAMES);
  }

  if (options?.documentType) {
    payload.verification.document.type = options.documentType;
  }

  const session = await coreApi.createSession(payload);

  const verificationId = session.verification.id;
  logger.info(`Started verification: ${verificationId}`);

  const { person, document } = payload.verification;
  logger.info(
    `Details sent: ${person.firstName} ${person.lastName} | ${document.type} ${document.number} | ${document.country}`,
  );

  const selectedCase = USE_CASE ? SESSIONS[USE_CASE] : null;
  const shouldSkipImages = selectedCase?.skipImages;
  await uploadImages(verificationId, imageSources, shouldSkipImages);

  await coreApi.endSession(verificationId);
  logger.info("Ended verification");

  logger.info("Getting media for verification session");
  const media = await coreApi.getMedia(verificationId);
  logger.info({ media }, "Media response");
}
