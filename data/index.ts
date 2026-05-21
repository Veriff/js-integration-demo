import { AR_REGISTRIES } from "./AR/registries";
import { BR_REGISTRIES } from "./BR/registries";
import { MX_REGISTRIES } from "./MX/registries";
import type { SessionMap } from "./types";

export const SESSIONS: SessionMap = {
  ...BR_REGISTRIES,
  ...AR_REGISTRIES,
  ...MX_REGISTRIES,
};

export type { TestCase, SessionPayload, SessionMap } from "./types";
