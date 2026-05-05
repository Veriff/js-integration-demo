import crypto from "node:crypto";
import axios, { AxiosInstance } from "axios";

import { timestamp } from "./dates";
import { logger } from "./logger";

import { SessionPayload } from "../data/index";

interface StartResponse {
  verification: {
    id: string;
  };
}

interface CoreApiOptions {
  apiSecret: string;
  apiToken: string;
  apiUrl?: string;
}

function requiredEnv(name: "API_SECRET" | "API_TOKEN"): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }

  return value;
}

export class CoreApi {
  private readonly apiSecret: string;
  private readonly client: AxiosInstance;

  constructor(options: CoreApiOptions) {
    this.apiSecret = options.apiSecret;

    this.client = axios.create({
      baseURL: options.apiUrl,
      adapter: "fetch",
      headers: {
        "x-auth-client": options.apiToken,
        "content-type": "application/json",
      },
    });
  }

  static generateSignature(payload: string, secret: string): string {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(Buffer.from(payload, "utf8"));
    return hmac.digest("hex");
  }

  private sign(payload: string): string {
    return CoreApi.generateSignature(payload, this.apiSecret);
  }

  async createSession(payload: SessionPayload): Promise<StartResponse> {
    logger.debug({ payload }, "Session payload");

    const headers = {
      "x-hmac-signature": this.sign(JSON.stringify(payload)),
    };

    const { data } = await this.client.post<StartResponse>(
      "/sessions",
      payload,
      { headers },
    );
    return data;
  }

  async uploadMedia(
    verificationId: string,
    payload: { image: { context: string; content: string; timestamp: string } },
  ): Promise<void> {
    const headers = {
      "x-hmac-signature": this.sign(JSON.stringify(payload)),
    };

    await this.client.post(`/sessions/${verificationId}/media`, payload, {
      headers,
    });
  }

  async endSession(verificationId: string): Promise<unknown> {
    const payload = {
      verification: {
        frontState: "done",
        status: "submitted",
        timestamp: timestamp(),
      },
    };

    const headers = {
      "x-hmac-signature": this.sign(JSON.stringify(payload)),
    };

    const { data } = await this.client.patch(
      `/sessions/${verificationId}`,
      payload,
      { headers },
    );
    return data;
  }

  async getMedia(verificationId: string): Promise<unknown> {
    const headers = {
      "x-hmac-signature": this.sign(verificationId),
    };

    const { data } = await this.client.get(
      `/sessions/${verificationId}/media`,
      { headers },
    );
    return data;
  }
}

export const coreApi = new CoreApi({
  apiSecret: requiredEnv("API_SECRET"),
  apiToken: requiredEnv("API_TOKEN"),
  apiUrl: process.env.API_URL,
});
