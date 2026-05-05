---
owner: "Client Tools"
description: "Demo for integrating with Veriff's API directly"
status: "production"
type: "documentation"
---

# Veriff's TypeScript Integration Demo

Headless Veriff API integration that skips Veriff's frontend application. Two entry points:

- **CLI** (`npm run cli`) — Interactive menu to generate verification sessions (from scratch or from pre-defined test case registries).
- **Webhook server** (`npm run server`) — Express server that listens for Veriff decision notification webhooks and validates HMAC-SHA256 signatures.

### Verification flow (CLI)

1. Starts a verification session with Veriff.
2. Uploads document and biometric images to the session.
3. Ends the verification session.
4. Queries media for the session and retrieves what was uploaded.

### Webhook flow (server)

1. Listens on `WEBHOOK_PORT` for POST requests to `/verification/`.
2. Validates `x-hmac-signature` header against the request body.
3. Logs the webhook payload and signature validation result.

## Prerequisites

- Node.js v24.15.0 (see `.nvmrc`)

## Installation

```bash
npm install
```

## Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Get **API key** and **API secret** from Management -> Vendor and set `API_TOKEN` and `API_SECRET` in `.env`.

## Run

```bash
# Interactive CLI — generate verifications
npm run cli

# Webhook server — listen for decision notifications
npm run server
```

## Environment Variables

| Variable       | Required         | Default            | Purpose                                             |
| -------------- | ---------------- | ------------------ | --------------------------------------------------- |
| `API_TOKEN`    | Yes              | —                  | Veriff API key (`x-auth-client` header)             |
| `API_SECRET`   | Yes              | —                  | HMAC-SHA256 signing key                             |
| `API_URL`      | No               | Veriff station API | Veriff API base URL                                 |
| `USE_CASE`     | No               | —                  | Test case ID from `data/sessions/` (e.g. `BR-TC01`) |
| `WEBHOOK_PORT` | Yes (for server) | —                  | Port for the webhook listener                       |

## Webhook

To receive decision notifications, update **Web hook url** (Management -> Vendor -> Edit) to point to your publicly reachable host and set `WEBHOOK_PORT` in `.env`. Run `npm run server` to start the listener.

## Test Cases

Available test cases live in `data/sessions/`. Each country has a registry file (e.g. `BR_registries.ts`, `AR_registries.ts`). Use `npm run cli` and select "Generate a verification from registries" to pick a test case.

To add new test cases, see [CLAUDE.md](CLAUDE.md#adding-new-test-cases).
