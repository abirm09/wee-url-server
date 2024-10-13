import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
export default [
  {
    ignores: ["dist"],
  },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "no-console": "error",
      "no-undef": "error",
      "no-unused-expressions": "error",
      "no-unreachable": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
];
