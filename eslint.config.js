import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier/flat";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tslint from "typescript-eslint";

export default tslint.config([
  globalIgnores(["dist"]),
  {
    extends: [
      js.configs.recommended,
      tslint.configs.strictTypeChecked,
      tslint.configs.stylisticTypeChecked,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      perfectionist.configs["recommended-natural"],
      prettierPlugin,
      prettierConfig,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    extends: [
      js.configs.recommended,
      perfectionist.configs["recommended-natural"],
      prettierPlugin,
      prettierConfig,
    ],
    files: ["**/*.js"],
  },
]);
