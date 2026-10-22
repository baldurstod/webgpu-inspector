import tseslint from "typescript-eslint";


export default tseslint.config(
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylistic,
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/consistent-type-definitions": "off",
      /** We override a lot of browser methods */
      "@typescript-eslint/unbound-method": "off",
      /** Dom methods have any */
      "@typescript-eslint/no-explicit-any": "off",
    }
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
