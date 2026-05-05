# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Headless Veriff API integration demo. Runs a verification session without Veriff's frontend: creates session, uploads document images, closes session, retrieves media. Optionally listens for decision webhooks.

## Commands

```bash
# Install
npm install

# Setup — copy .env.example to .env and fill in API_TOKEN + API_SECRET
cp .env.example .env

# Interactive CLI — generate verifications
npm run cli

# Webhook server — listen for decision notifications
npm run server

# Type-check
npm run typecheck

# Compile to dist/
npm run build
```

TypeScript project using `tsx` for direct execution. No test framework or linter. Node v24.15.0 (see .nvmrc).

## Environment Variables

| Variable     | Required         | Default            | Purpose                                             |
| ------------ | ---------------- | ------------------ | --------------------------------------------------- |
| API_TOKEN    | Yes              | —                  | Veriff API key (`x-auth-client` header)             |
| API_SECRET   | Yes              | —                  | HMAC-SHA256 signing key                             |
| API_URL      | No               | Veriff station API | Veriff API base URL                                 |
| USE_CASE     | No               | —                  | Test case ID from `data/<COUNTRY>/` (e.g. `BR-TC01`) |
| WEBHOOK_PORT | Yes (for server) | —                  | Port for the webhook listener                       |

## Architecture

**Two entry points:**

- `cli.ts` — Interactive menu (via `prompts`). Two flows: generate verification from scratch (pick document type) or from pre-defined registries (pick test case). Calls `generateVerification()`.
- `server.ts` — Express webhook listener. Receives Veriff decision notifications on `POST /verification/`, validates HMAC-SHA256 signature, logs payload. No verification logic — webhook-only.

**Verification logic** (`scripts/generateVerification.ts`): `generateVerification()` → `createSession()` → `uploadImages()` per source → `endSession()` → `getMedia()`.

**API client** (`src/api.ts`): `CoreApi` class wrapping Axios. Methods: `createSession()`, `uploadMedia()`, `endSession()`, `getMedia()`. All requests signed with HMAC-SHA256.

**Country data** (`data/<COUNTRY>/`): Each country folder contains `registries.ts` (test cases), `names.ts` (localized names for random generation), and `documents/` (document images). `data/index.ts` merges all country registries into a single `SESSIONS` map. Types defined in `data/types.ts`.

**Test case structure**: Each entry has `name` (description), `payload` (verification session body), and optionally `skipSelfie: true` to skip image upload.

**Auth pattern**: Every API request includes `x-auth-client` (token) and `x-hmac-signature` (HMAC-SHA256 of JSON body or path param, signed with API_SECRET).

**Image upload**: Reads files from `data/<COUNTRY>/documents/` and `data/biometric/`, base64-encodes them, uses `image.context` field from `ImageSource` config.

## Adding New Test Cases

1. Add entries to existing `data/<COUNTRY>/registries.ts` or create new country folder
2. If new country: create `data/<COUNTRY>/` with `registries.ts`, `names.ts`, `documents/`, and `index.ts`
3. Import and spread new registry into `data/index.ts`
4. Key format: `<COUNTRY>-TC<NN>` (e.g. `AR-TC05`)
5. Run with `npm run cli` and select "Generate a verification from registries"
