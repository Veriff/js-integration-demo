import crypto from "node:crypto";
import express from "express";
import { logger } from "./src/logger";

if (!process.env.API_SECRET) {
  throw new Error("API_SECRET environment variable is required");
}

if (!process.env.WEBHOOK_PORT) {
  throw new Error("WEBHOOK_PORT environment variable is required");
}

const API_SECRET: string = process.env.API_SECRET;
const WEBHOOK_PORT = process.env.WEBHOOK_PORT;

function isSignatureValid(data: {
  signature: string;
  secret: string;
  payload: unknown;
}): boolean {
  const jsonPayload =
    typeof data.payload === "object"
      ? JSON.stringify(data.payload)
      : String(data.payload);

  const hmac = crypto.createHmac("sha256", data.secret);
  hmac.update(Buffer.from(jsonPayload, "utf8"));

  const expected = hmac.digest();
  const received = Buffer.from(data.signature.toLowerCase(), "hex");

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

const app = express();
app.use(express.json());

app.post("/verification/", (req, res) => {
  const signature = req.get("x-hmac-signature") ?? "";
  const payload: unknown = req.body;

  const valid = isSignatureValid({
    signature,
    secret: API_SECRET,
    payload,
  });

  logger.info("Received webhook");

  if (!valid) {
    logger.warn("Invalid webhook signature");
    res.status(401).json({ error: "invalid signature" });
    return;
  }

  logger.info({ payload }, "Webhook payload");
  res.json({ status: "success" });
});

app.listen(WEBHOOK_PORT, () => {
  logger.info(`Webhook server listening on port ${WEBHOOK_PORT}`);
});
