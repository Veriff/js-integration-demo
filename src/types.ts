export type DocumentType = "PASSPORT" | "ID_CARD" | "DRIVERS_LICENSE";

export interface ImageSource {
  dir: string;
  context: string;
  filePrefix?: string;
}

export type CountryCode = "AR" | "BR" | "EE" | "MX" | "US";

interface BaseGenerateOptions {
  imageSources?: ImageSource[];
}

interface GenerateFromRegistry extends BaseGenerateOptions {
  useCase: string;
  documentType?: never;
  country?: never;
}

interface GenerateFromScratch extends BaseGenerateOptions {
  useCase?: never;
  documentType?: DocumentType;
  country?: CountryCode;
}

export type GenerateOptions = GenerateFromRegistry | GenerateFromScratch;

export interface Person {
  idNumber?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface Document {
  country: string;
  type?: DocumentType;
  number?: string;
  category?: string;
  firstIssue?: string;
  validFrom?: string;
  validUntil?: string;
}
