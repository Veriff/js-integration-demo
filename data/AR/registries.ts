import type { SessionMap } from "../types";

/*
 * Test cases source:
 * https://veriff.atlassian.net/wiki/spaces/ID/pages/5658804404/Argentina+Biometric+Registry+v1m0+-+Test+Plan#5.3-Session-driven-test-cases
 */
export const AR_REGISTRIES: SessionMap = {
  "AR-TC01": {
    name: "Happy path -- all validations pass",
    payload: {
      verification: {
        person: {
          firstName: "Bautista",
          lastName: "Pereyra",
          idNumber: "12345678",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "12345678",
          firstIssue: "2015-01-15",
          validFrom: "2024-01-15",
          validUntil: "2039-01-15",
        },
      },
    },
  },
  "AR-TC02": {
    name: "Person not found",
    payload: {
      verification: {
        person: {
          firstName: "Thiago",
          lastName: "Quiroga",
          idNumber: "66666666",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "66666666",
          firstIssue: "2016-02-20",
          validFrom: "2024-02-20",
          validUntil: "2039-02-20",
        },
      },
    },
  },
  "AR-TC03": {
    name: "Face mismatch -- similarity below threshold",
    payload: {
      verification: {
        person: {
          firstName: "Lorenzo",
          lastName: "Benitez",
          idNumber: "88888888",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "88888888",
          firstIssue: "2017-03-10",
          validFrom: "2024-03-10",
          validUntil: "2039-03-10",
        },
      },
    },
  },
  "AR-TC04": {
    name: "Name mismatch",
    payload: {
      verification: {
        person: {
          firstName: "Valentino",
          lastName: "Gimenez",
          idNumber: "12345678",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "12345679",
          firstIssue: "2018-04-05",
          validFrom: "2024-04-05",
          validUntil: "2039-04-05",
        },
      },
    },
  },
  "AR-TC05": {
    name: "Registry error · HTTP 500 internal server error",
    payload: {
      verification: {
        person: {
          firstName: "Santino",
          lastName: "Mansilla",
          idNumber: "55555555",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "55555555",
          firstIssue: "2019-05-12",
          validFrom: "2024-05-12",
          validUntil: "2039-05-12",
        },
      },
    },
  },
  "AR-TC06": {
    name: "Registry error · HTTP 401 unauthorized",
    payload: {
      verification: {
        person: {
          firstName: "Jeronimo",
          lastName: "Farias",
          idNumber: "22222222",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "22222222",
          firstIssue: "2020-06-18",
          validFrom: "2024-06-18",
          validUntil: "2039-06-18",
        },
      },
    },
  },
  "AR-TC07": {
    name: "Registry error · HTTP 429 rate limited",
    payload: {
      verification: {
        person: {
          firstName: "Felipe",
          lastName: "Aguirre",
          idNumber: "44444444",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "44444444",
          firstIssue: "2014-07-22",
          validFrom: "2024-07-22",
          validUntil: "2039-07-22",
        },
      },
    },
  },
  "AR-TC08": {
    name: "Registry error · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          firstName: "Gael",
          lastName: "Cabrera",
          idNumber: "11111111",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "11111111",
          firstIssue: "2013-08-30",
          validFrom: "2024-08-30",
          validUntil: "2039-08-30",
        },
      },
    },
  },
  "AR-TC08b": {
    name: "Registry error · HTTP 403 forbidden",
    payload: {
      verification: {
        person: {
          firstName: "Bruno",
          lastName: "Molina",
          idNumber: "33333333",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "33333333",
          firstIssue: "2012-09-14",
          validFrom: "2024-09-14",
          validUntil: "2039-09-14",
        },
      },
    },
  },
  "AR-TC09": {
    name: "Null fields from registry",
    payload: {
      verification: {
        person: {
          firstName: "Mateo",
          lastName: "Vera",
          idNumber: "77777777",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "77777777",
          firstIssue: "2021-10-03",
          validFrom: "2024-10-03",
          validUntil: "2039-10-03",
        },
      },
    },
  },
  "AR-TC10": {
    name: "Missing person name (first_name required) · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          lastName: "Ferreyra",
          idNumber: "12345678",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "12345680",
          firstIssue: "2015-11-25",
          validFrom: "2024-11-25",
          validUntil: "2039-11-25",
        },
      },
    },
  },
  "AR-TC11": {
    name: "Missing person name (first_name optional) · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          lastName: "Godoy",
          idNumber: "12345678",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "12345681",
          firstIssue: "2016-12-08",
          validFrom: "2024-12-08",
          validUntil: "2039-12-08",
        },
      },
    },
  },
  "AR-TC12": {
    name: "Non-standard ID number (11-digit CUIT) · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          firstName: "Lautaro",
          lastName: "Coronel",
          idNumber: "20368067709",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "12345682",
          firstIssue: "2018-01-27",
          validFrom: "2024-01-27",
          validUntil: "2039-01-27",
        },
      },
    },
  },
  "AR-TC13": {
    name: "Invalid ID number (5 digits) · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          firstName: "Tomas",
          lastName: "Roldan",
          idNumber: "12345",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "12345",
          firstIssue: "2019-02-11",
          validFrom: "2024-02-11",
          validUntil: "2039-02-11",
        },
      },
    },
  },
  "AR-TC14": {
    name: "DNI with dots · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          firstName: "Franco",
          lastName: "Villalba",
          idNumber: "12.345.678",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "12.345.678",
          firstIssue: "2020-03-19",
          validFrom: "2024-03-19",
          validUntil: "2039-03-19",
        },
      },
    },
  },
  "AR-TC15": {
    name: "Missing selfie (skip media upload)",
    skipImages: true,
    payload: {
      verification: {
        person: {
          firstName: "Joaquin",
          lastName: "Sosa",
          idNumber: "12345678",
          gender: "M",
        },
        document: {
          country: "AR",
          type: "ID_CARD",
          number: "12345683",
          firstIssue: "2014-04-24",
          validFrom: "2024-04-24",
          validUntil: "2039-04-24",
        },
      },
    },
  },
  "AR-TC16": {
    name: "Country code mismatch (BR instead of AR) · HTTP 400 bad request",
    payload: {
      verification: {
        person: {
          firstName: "Benjamin",
          lastName: "Ledesma",
          idNumber: "12345678",
          gender: "M",
        },
        document: {
          country: "BR",
          type: "ID_CARD",
          number: "12345684",
          firstIssue: "2013-05-29",
          validFrom: "2024-05-29",
          validUntil: "2039-05-29",
        },
      },
    },
  },
};
