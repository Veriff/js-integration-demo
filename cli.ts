import prompts from "prompts";

import { AR_REGISTRIES } from "./data/AR/registries";
import { BR_REGISTRIES } from "./data/BR/registries";
import { MX_REGISTRIES } from "./data/MX/registries";
import {
  BIOMETRIC_EE,
  DOCUMENT_IMAGE_SOURCES,
  DOCUMENT_TYPES,
} from "./src/constants";

import { generateVerification } from "./scripts/generateVerification";
import { randomFacePrefix } from "./src/random";
import type { SessionMap } from "./data/types";

const COUNTRY_REGISTRIES: Record<string, SessionMap> = {
  AR: AR_REGISTRIES,
  BR: BR_REGISTRIES,
  MX: MX_REGISTRIES,
};

function onCancel() {
  console.log("Aborted.");
  process.exit(0);
}

const backChoice = { title: "← Back", value: "back" };

function clearLastPromptLine() {
  process.stdout.write("\x1b[1A\x1b[2K");
}

async function generateFromScratch(): Promise<"back" | void> {
  const { documentType } = await prompts(
    {
      type: "select",
      name: "documentType",
      message: "Select document type:",
      choices: [backChoice, ...DOCUMENT_TYPES],
      initial: 1,
    },
    { onCancel },
  );

  if (documentType === "back") {
    clearLastPromptLine();
    return "back";
  }

  const docSources = DOCUMENT_IMAGE_SOURCES[documentType] ?? [];
  const imageSources = [{ dir: BIOMETRIC_EE, context: "face" }, ...docSources];

  console.log("\nStarting verification...\n");

  await generateVerification({
    documentType,
    imageSources,
  });
}

async function generateFromRegistries(): Promise<"back" | void> {
  const { country } = await prompts(
    {
      type: "select",
      name: "country",
      message: "Select country:",
      choices: [
        backChoice,
        { title: "Argentina", value: "AR" },
        { title: "Brazil", value: "BR" },
        { title: "Mexico", value: "MX" },
      ],
      initial: 1,
    },
    { onCancel },
  );

  if (country === "back") {
    clearLastPromptLine();
    return "back";
  }

  const registry = COUNTRY_REGISTRIES[country];
  const useCaseChoices = Object.entries(registry).map(([id, tc]) => ({
    title: `${id}: ${tc.name}`,
    value: id,
  }));

  const { useCase } = await prompts(
    {
      type: "select",
      name: "useCase",
      message: "Select a use case:",
      choices: [backChoice, ...useCaseChoices],
      initial: 1,
    },
    { onCancel },
  );

  if (useCase === "back") {
    clearLastPromptLine();
    clearLastPromptLine();
    return generateFromRegistries();
  }

  const gender = registry[useCase].payload.verification.person.gender;
  const facePrefix = randomFacePrefix(gender);

  console.log("\nStarting verification...\n");

  await generateVerification({
    useCase,
    imageSources: [
      { dir: BIOMETRIC_EE, context: "face", filePrefix: facePrefix },
    ],
  });
}

async function main(): Promise<void> {
  const { action } = await prompts(
    {
      type: "select",
      name: "action",
      message: "Select an action:",
      choices: [
        { title: "Generate a verification", value: "generate" },
        {
          title: "Generate a verification from registries",
          value: "registries",
        },
        { title: "Exit", value: "exit" },
      ],
    },
    { onCancel },
  );

  if (action === "exit") {
    console.log("Exiting...");
    return;
  }

  if (action === "registries") {
    const result = await generateFromRegistries();
    if (result === "back") {
      clearLastPromptLine();
      return main();
    }
    return;
  }

  if (action === "generate") {
    const result = await generateFromScratch();
    if (result === "back") {
      clearLastPromptLine();
      return main();
    }
    return;
  }

  console.log("Invalid action");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
