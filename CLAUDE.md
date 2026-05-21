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

## File Structure

```
cli.ts              — CLI entry point (interactive menus via prompts)
server.ts           — Webhook entry point (Express, HMAC validation)
scripts/
  generateVerification.ts — Core verification flow orchestrator
src/
  api.ts            — CoreApi class (Axios, HMAC-signed requests)
  types.ts          — Shared types (DocumentType, ImageSource, CountryCode, GenerateOptions, Person, Document)
  constants.ts      — Path constants (BIOMETRIC_EE, DOCUMENTS_*) and document image source configs
  random.ts         — Random data generators (person, document numbers, dates, face prefix)
  images.ts         — File readers (base64 encoding, directory listing)
  logger.ts         — Pino logger instance
  dates.ts          — Timestamp/date format helpers
data/
  index.ts          — Merges all country registries into SESSIONS map
  types.ts          — TestCase, SessionPayload, SessionMap types
  <COUNTRY>/        — Country-specific data (AR, BR, EE, MX, US)
    registries.ts   — Test cases (SessionMap entries)
    names.ts        — Localized first/last names for random generation
    documents/      — Document images (jpeg)
    biometric/      — Face images (jpeg, gendered: male_N/female_N)
    index.ts        — Re-exports for country
```

## Environment Variables

| Variable     | Required         | Default            | Purpose                                              |
| ------------ | ---------------- | ------------------ | ---------------------------------------------------- |
| API_TOKEN    | Yes              | —                  | Veriff API key (`x-auth-client` header)              |
| API_SECRET   | Yes              | —                  | HMAC-SHA256 signing key                              |
| API_URL      | No               | Veriff station API | Veriff API base URL                                  |
| USE_CASE     | No               | —                  | Test case ID from `data/<COUNTRY>/` (e.g. `BR-TC01`) |
| WEBHOOK_PORT | Yes (for server) | —                  | Port for the webhook listener                        |

Environment loaded via Node's `--env-file=.env` flag in npm scripts (no dotenv dependency).

## Architecture

**Two entry points:**

- `cli.ts` — Interactive menu (via `prompts`). Two flows: generate verification from scratch (pick document type) or from pre-defined registries (pick country → test case). Calls `generateVerification()`.
- `server.ts` — Express webhook listener. Receives Veriff decision notifications on `POST /verification/`, validates HMAC-SHA256 signature with timing-safe comparison, logs payload. No verification logic — webhook-only.

**Verification flow** (`scripts/generateVerification.ts`):
`generateVerification(options?)` → `buildDefaultPayload()` or use registry payload → `coreApi.createSession()` → `uploadImages()` per source → `coreApi.endSession()` → `coreApi.getMedia()`

**API client** (`src/api.ts`): `CoreApi` class wrapping Axios. Methods: `createSession()`, `uploadMedia()`, `endSession()`, `getMedia()`. All requests signed with HMAC-SHA256 via `x-auth-client` (token) and `x-hmac-signature` headers.

**Country data** (`data/<COUNTRY>/`): Each country folder contains `registries.ts` (test cases), `names.ts` (localized names for random generation), and optionally `documents/` (document images) and `biometric/` (face images). Currently: AR, BR, EE, MX, US. `data/index.ts` merges all country registries into a single `SESSIONS` map. Types defined in `data/types.ts`.

**Test case structure** (`data/types.ts`): `TestCase` has `name` (description), `payload` (`SessionPayload` with person + document), and optionally `skipImages: true` to skip image upload.

**Image upload logic**: `uploadImages()` reads from `ImageSource.dir`, filters by optional `filePrefix`, picks random matching file, base64-encodes and uploads. Biometric images use `randomFacePrefix(gender)` to select gendered face images (e.g. `male_3.jpeg`).

**Random person generation**: `randomPerson(country)` in `src/random.ts` uses country-specific name pools from `data/<COUNTRY>/names.ts`. Generates gendered first names, last names, DOB, and ID number.

## Key Types

```typescript
type CountryCode = "AR" | "BR" | "EE" | "MX" | "US";
type DocumentType = "PASSPORT" | "ID_CARD" | "DRIVERS_LICENSE";

interface ImageSource { dir: string; context: string; filePrefix?: string; }
interface TestCase { name: string; payload: SessionPayload; skipImages?: boolean; }
interface SessionPayload { verification: { person: Person; document: Document; } }
interface Person { idNumber?; firstName?; lastName?; gender?; dateOfBirth?; }
interface Document { country; type?; number?; category?; firstIssue?; validFrom?; validUntil?; }

type GenerateOptions = GenerateFromRegistry | GenerateFromScratch;
// GenerateFromRegistry: { useCase: string; imageSources?: ImageSource[]; }
// GenerateFromScratch: { documentType?: DocumentType; country?: CountryCode; imageSources?: ImageSource[]; }
```

## Dependencies

| Package       | Purpose                          |
| ------------- | -------------------------------- |
| axios         | HTTP client for Veriff API       |
| express       | Webhook server                   |
| luxon         | Date generation/formatting       |
| pino          | Structured JSON logging          |
| pino-pretty   | Human-readable log output        |
| prompts       | Interactive CLI menus             |
| tsx           | TypeScript execution (dev)       |
| typescript    | Type checking and compilation    |

## Conventions

- All named exports (no default exports)
- ESM (`"type": "module"` in package.json)
- Pino logger for all output in library code; `console.log` only in CLI entry point for user-facing messages
- Path constants in `src/constants.ts` — never hardcode file paths elsewhere
- Country registries imported individually in entry points, merged via `data/index.ts` for script use

## Adding New Test Cases

1. Add entries to existing `data/<COUNTRY>/registries.ts` or create new country folder
2. If new country: create `data/<COUNTRY>/` with `registries.ts`, `names.ts`, `documents/`, and `index.ts`
3. Import and spread new registry into `data/index.ts`
4. Add country to `CountryCode` type in `src/types.ts`
5. Add name pool import to `src/random.ts` `NAME_POOLS` record
6. If country has CLI support: add to `COUNTRY_REGISTRIES` and country choices in `cli.ts`
7. Key format: `<COUNTRY>-TC<NN>` (e.g. `AR-TC05`)
8. Run with `npm run cli` and select "Generate a verification from registries"

## Adding New Document Types

1. Add to `DocumentType` union in `src/types.ts`
2. Add entry to `DOCUMENT_TYPES` array in `src/constants.ts`
3. Add `DOCUMENT_IMAGE_SOURCES` entry in `src/constants.ts`
4. Add images to appropriate `data/<COUNTRY>/documents/` folder
5. Handle new type in `buildDefaultPayload()` in `scripts/generateVerification.ts`

## Things to Avoid

- Don't commit `.env` (contains secrets)
- Don't import across `data/<COUNTRY>/` folders directly — use `data/index.ts`
- Don't hardcode file paths — use constants from `src/constants.ts`
- Don't use `console.log` in `src/` or `scripts/` — use `logger` from `src/logger.ts`
