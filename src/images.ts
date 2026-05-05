import fs from "node:fs";

export function readImageBase64(file: string): string {
  const bitmap = fs.readFileSync(file);
  return Buffer.from(bitmap).toString("base64");
}

export function readImages(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((file) => file.match(/.*\.(jpg|jpeg|png)/gi));
}
