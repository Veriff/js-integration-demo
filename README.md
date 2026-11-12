---
owner: "Client Tools"
description: "Demo for integrating with Veriff's API directly"
status: "production"
type: "documentation"
---

# Veriff JS integration demo

A minimal Node.js example of integrating with Veriff's API in headless mode, skipping Veriff's frontend application.

## What it does

1. Starts a verification session (`POST /sessions`).
2. Uploads every `.jpg`, `.jpeg` and `.png` image in `documents/` to the session (`POST /sessions/{id}/media`).
3. Submits the session (`PATCH /sessions/{id}`).
4. Fetches the session's media (`GET /sessions/{id}/media`) and prints it.
5. Optionally, starts a local Express server that receives the decision webhook and validates its signature.

Every request is signed with an HMAC-SHA256 signature (`x-hmac-signature`) generated from the payload and your API secret.

## Requirements

- Node.js 24 (see `.nvmrc`)
- npm
- A Veriff API key and API secret (Veriff Customer Portal → Management → Vendor)

## Installation

```sh
npm install
```

## Configuration

| Variable       | Required | Default                    | Description                                              |
| -------------- | -------- | -------------------------- | -------------------------------------------------------- |
| `API_TOKEN`    | Yes      | —                          | Veriff API key, sent as `x-auth-client`                  |
| `API_SECRET`   | Yes      | —                          | Veriff API secret, used to sign and validate requests    |
| `API_URL`      | No       | `https://api.veriff.me/v1` | Base URL of the Veriff API                               |
| `IMAGE_DIR`    | No       | `documents`                | Directory with the images to upload                      |
| `WEBHOOK_PORT` | No       | —                          | When set, starts the webhook server on this port         |

Variables can be passed inline or through a `.env` file:

```sh
API_TOKEN=your-api-key
API_SECRET=your-api-secret
```

## Usage

Inline variables:

```sh
API_TOKEN=your-api-key API_SECRET=your-api-secret node app.js
```

With a `.env` file:

```sh
node --env-file=.env app.js
```

### Images

Each image's file name (without extension) is sent as the media `context`, so files must be named after a valid Veriff context. The included samples are:

- `documents/document-front.jpeg` → `document-front`
- `documents/face.jpeg` → `face`

Add or replace files in `IMAGE_DIR` to upload different media.

### Receiving the decision webhook

1. In the Veriff Customer Portal, set the webhook URL (Management → Vendor → Edit) to a publicly reachable URL that forwards to `http://<host>:<WEBHOOK_PORT>/verification/`.
2. Run the demo with `WEBHOOK_PORT` set:

   ```sh
   WEBHOOK_PORT=3000 node --env-file=.env app.js
   ```

The server logs the payload and whether the signature is valid, then exits. The decision usually arrives within a few minutes.

## Project structure

```
.
├── app.js          # Session flow, HMAC signing and webhook server
├── documents/      # Sample images uploaded to the session
├── .nvmrc          # Node.js version
└── package.json
```
