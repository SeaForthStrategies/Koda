import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  // Ignore macOS metadata/temp files (e.g. `._page.tsx`) so they don't break lint/build
  {
    ignores: ["**/._*"],
  },
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
]);
