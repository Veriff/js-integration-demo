import type { DocumentType, ImageSource } from "./types";

export const DOCUMENTS_EE = "./data/EE/biometric";
export const DOCUMENTS_US = "./data/US/documents";

export const DOCUMENT_TYPES: { title: string; value: DocumentType }[] = [
  { title: "Passport", value: "PASSPORT" },
  { title: "ID Card", value: "ID_CARD" },
  { title: "Driver's License", value: "DRIVERS_LICENSE" },
];

export const DOCUMENT_IMAGE_SOURCES: Record<string, ImageSource[]> = {
  PASSPORT: [
    {
      dir: DOCUMENTS_US,
      context: "document-front",
      filePrefix: "passport",
    },
  ],
  ID_CARD: [
    {
      dir: DOCUMENTS_EE,
      context: "document-front",
      filePrefix: "id_card_front",
    },
    {
      dir: DOCUMENTS_EE,
      context: "document-back",
      filePrefix: "id_card_back",
    },
  ],
  DRIVERS_LICENSE: [
    {
      dir: DOCUMENTS_US,
      context: "document-front",
      filePrefix: "driver_license_front",
    },
    {
      dir: DOCUMENTS_US,
      context: "document-back",
      filePrefix: "driver_license_back",
    },
  ],
};
