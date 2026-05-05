export type DocumentType = "PASSPORT" | "ID_CARD" | "DRIVERS_LICENSE";

export interface ImageSource {
  dir: string;
  context: string;
  filePrefix?: string;
}

export interface GenerateOptions {
  useCase?: string;
  documentType?: DocumentType;
  imageSources?: ImageSource[];
}

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
