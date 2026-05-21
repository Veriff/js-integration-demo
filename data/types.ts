import type { Document, Person } from "../src/types";

export interface SessionPayload {
  verification: {
    person: Person;
    document: Document;
  };
}

export interface TestCase {
  name: string;
  payload: SessionPayload;
  skipImages?: boolean;
}

export type SessionMap = Record<string, TestCase>;
