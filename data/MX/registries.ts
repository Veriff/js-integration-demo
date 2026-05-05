import type { SessionMap } from "../types";

// NOTE: This is a dummy registry for testing purposes. Replace with actual registries when available.
export const MX_REGISTRIES: SessionMap = {
  "MX-TC01": {
    name: "Happy path -- all validations pass (dummy registry)",
    payload: {
      verification: {
        person: {
          firstName: "Carlos",
          lastName: "Hernandez",
          idNumber: "HECA900101HDFRRL09",
          gender: "M",
        },
        document: {
          country: "MX",
          type: "ID_CARD",
          number: "1234567890123",
          firstIssue: "2015-01-15",
          validFrom: "2024-01-15",
          validUntil: "2034-01-15",
        },
      },
    },
  },
};
