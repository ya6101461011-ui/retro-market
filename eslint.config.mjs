import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // RETROMART uses plain <img> so that product image URLs can gracefully
      // fall back at runtime when an external image is unavailable.
      "@next/next/no-img-element": "off",
      // These client pages intentionally synchronize localStorage/sessionStorage
      // state after mount.
      "react-hooks/set-state-in-effect": "off",
      // Storage parsing intentionally ignores malformed persisted data.
      "no-empty": "off",
      // Product copy contains intentional English punctuation such as "THE INTERNET'S...".
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
