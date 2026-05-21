import type { SessionMap } from "../types";

/*
 * Test cases source:
 * https://veriff.atlassian.net/wiki/spaces/ID/pages/5607948294/Brazil+Biometric+Registry+V3+-+Test+Plan#5.3-Session-driven-test-cases
 */
export const BR_REGISTRIES: SessionMap = {
  "BR-TC01": {
    name: "Happy path -- all validations pass",
    payload: {
      verification: {
        person: {
          idNumber: "12345678900",
          firstName: "Joao",
          lastName: "Silva",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000001",
          category: "AB",
          firstIssue: "2015-01-15",
          validFrom: "2024-01-15",
          validUntil: "2034-01-15",
        },
      },
    },
  },
  "BR-TC02": {
    name: "Person not found -- full mismatch",
    payload: {
      verification: {
        person: {
          idNumber: "12345678901",
          firstName: "Miguel",
          lastName: "Santos",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000002",
          category: "B",
          firstIssue: "2016-02-20",
          validFrom: "2024-02-20",
          validUntil: "2034-02-20",
        },
      },
    },
  },
  "BR-TC03": {
    name: "Face mismatch -- similarity below threshold",
    payload: {
      verification: {
        person: {
          idNumber: "12345678905",
          firstName: "Pedro",
          lastName: "Oliveira",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000003",
          category: "A",
          firstIssue: "2017-03-10",
          validFrom: "2024-03-10",
          validUntil: "2034-03-10",
        },
      },
    },
  },
  "BR-TC04": {
    name: "Name mismatch",
    payload: {
      verification: {
        person: {
          idNumber: "12345678903",
          firstName: "Lucas",
          lastName: "Costa",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000004",
          category: "AC",
          firstIssue: "2018-04-05",
          validFrom: "2024-04-05",
          validUntil: "2034-04-05",
        },
      },
    },
  },
  "BR-TC05": {
    name: "Date of birth mismatch",
    payload: {
      verification: {
        person: {
          idNumber: "12345678904",
          firstName: "Gabriel",
          lastName: "Pereira",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000005",
          category: "AD",
          firstIssue: "2019-05-12",
          validFrom: "2024-05-12",
          validUntil: "2034-05-12",
        },
      },
    },
  },
  "BR-TC06": {
    name: "Serpro error · HTTP 503 service unavailable",
    payload: {
      verification: {
        person: {
          idNumber: "11150300011",
          firstName: "Rafael",
          lastName: "Almeida",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000006",
          category: "AE",
          firstIssue: "2020-06-18",
          validFrom: "2024-06-18",
          validUntil: "2034-06-18",
        },
      },
    },
  },
  "BR-TC07": {
    name: "Serpro error · HTTP 422 DV001 (LGPD minors)",
    payload: {
      verification: {
        person: {
          idNumber: "11142200111",
          firstName: "Felipe",
          lastName: "Ribeiro",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000007",
          category: "C",
          firstIssue: "2014-07-22",
          validFrom: "2024-07-22",
          validUntil: "2034-07-22",
        },
      },
    },
  },
  "BR-TC08": {
    name: "Serpro error · HTTP 401 unauthorized",
    payload: {
      verification: {
        person: {
          idNumber: "11140100011",
          firstName: "Bruno",
          lastName: "Mendes",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000008",
          category: "D",
          firstIssue: "2013-08-30",
          validFrom: "2024-08-30",
          validUntil: "2034-08-30",
        },
      },
    },
  },
  "BR-TC09": {
    name: "Serpro error · HTTP 422 DV062 (liveness failure)",
    payload: {
      verification: {
        person: {
          idNumber: "11142206211",
          firstName: "Thiago",
          lastName: "Carvalho",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000009",
          category: "E",
          firstIssue: "2012-09-14",
          validFrom: "2024-09-14",
          validUntil: "2034-09-14",
        },
      },
    },
  },
  "BR-TC10": {
    name: "Missing person name · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          idNumber: "12345678900",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000010",
          category: "ACC",
          firstIssue: "2021-10-03",
          validFrom: "2024-10-03",
          validUntil: "2034-10-03",
        },
      },
    },
  },
  "BR-TC11": {
    name: "Missing date of birth · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          idNumber: "12345678900",
          firstName: "Gustavo",
          lastName: "Ferreira",
          gender: "M",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000011",
          category: "AB",
          firstIssue: "2015-11-25",
          validFrom: "2024-11-25",
          validUntil: "2034-11-25",
        },
      },
    },
  },
  "BR-TC12": {
    name: "Missing gender · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          idNumber: "12345678900",
          firstName: "Daniel",
          lastName: "Rocha",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000012",
          category: "B",
          firstIssue: "2016-12-08",
          validFrom: "2024-12-08",
          validUntil: "2034-12-08",
        },
      },
    },
  },
  "BR-TC13": {
    name: "Missing all DL fields · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          idNumber: "12345678900",
          firstName: "Mateus",
          lastName: "Barbosa",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
        },
      },
    },
  },
  "BR-TC14": {
    name: "Wrong document type (PASSPORT)",
    payload: {
      verification: {
        person: {
          idNumber: "12345678900",
          firstName: "Henrique",
          lastName: "Araujo",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "PASSPORT",
          number: "BRP000014",
          category: "AC",
          firstIssue: "2018-01-27",
          validFrom: "2024-01-27",
          validUntil: "2034-01-27",
        },
      },
    },
  },
  "BR-TC15": {
    name: "Missing selfie (skip media upload)",
    skipImages: true,
    payload: {
      verification: {
        person: {
          idNumber: "12345678900",
          firstName: "Caio",
          lastName: "Nunes",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000015",
          category: "AD",
          firstIssue: "2019-02-11",
          validFrom: "2024-02-11",
          validUntil: "2034-02-11",
        },
      },
    },
  },
  "BR-TC16": {
    name: "Missing CPF (idNumber) · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          firstName: "Andre",
          lastName: "Lima",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000016",
          category: "AE",
          firstIssue: "2020-03-19",
          validFrom: "2024-03-19",
          validUntil: "2034-03-19",
        },
      },
    },
  },
  "BR-TC17": {
    name: "Multiple fields missing (name + gender + DL number) · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          idNumber: "12345678900",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          category: "C",
          firstIssue: "2014-04-24",
          validFrom: "2024-04-24",
          validUntil: "2034-04-24",
        },
      },
    },
  },
  "BR-TC24": {
    name: "Person exists but no driver's license (no CNH)",
    payload: {
      verification: {
        person: {
          idNumber: "12345678902",
          firstName: "Marcos",
          lastName: "Gomes",
          gender: "M",
          dateOfBirth: "2000-01-01",
        },
        document: {
          country: "BR",
          type: "DRIVERS_LICENSE",
          number: "10000000024",
          category: "D",
          firstIssue: "2013-05-29",
          validFrom: "2024-05-29",
          validUntil: "2034-05-29",
        },
      },
    },
  },
};
