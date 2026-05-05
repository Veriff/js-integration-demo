import { coreApi } from "../src/api";
import { logger } from "../src/logger";
import { timestamp } from "../src/dates";
import { readImageBase64, readImages } from "../src/images";
import { SESSIONS, SessionPayload } from "../data/index";

import {
  randomDriversLicenseDates,
  randomDriversLicenseNumber,
  randomIdCardNumber,
  randomPassportNumber,
  randomPerson,
} from "../src/random";
import { BIOMETRIC_EE } from "../src/constants";
import type { ImageSource, GenerateOptions, DocumentType } from "../src/types";

function buildDefaultPayload(documentType: DocumentType): SessionPayload {
  const person = randomPerson();

  if (documentType === "PASSPORT") {
    const documentDates = randomDriversLicenseDates();

    return {
      verification: {
        person,
        document: {
          country: "BR",
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
          country: "BR",
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
          country: "BR",
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
  shouldSkipSelfie?: boolean,
): Promise<void> {
  if (shouldSkipSelfie) {
    logger.warn("Skipping selfie upload (test case requires it)");
    return;
  }

  for (const source of imageSources) {
    let files = readImages(source.dir);

    if (source.filePrefix) {
      files = files.filter((file) => file.startsWith(source.filePrefix!));
    }

    const file = files[Math.floor(Math.random() * files.length)];
    if (!file) {
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
    : buildDefaultPayload(options?.documentType ?? "DRIVERS_LICENSE");

  if (options?.documentType) {
    payload.verification.document.type = options.documentType;
  }

  const session = await coreApi.createSession(payload);
  const verificationId = session.verification.id;
  const { firstName, lastName } = payload.verification.person;
  logger.info(
    `Started verification: ${verificationId} | Name: ${firstName} ${lastName}`,
  );

  const selectedCase = USE_CASE ? SESSIONS[USE_CASE] : null;
  const shouldSkipSelfie = selectedCase?.skipSelfie;
  await uploadImages(verificationId, imageSources, shouldSkipSelfie);

  await coreApi.endSession(verificationId);
  logger.info("Ended verification");

  logger.info("Getting media for verification session");
  const media = await coreApi.getMedia(verificationId);
  logger.info({ media }, "Media response");
}
