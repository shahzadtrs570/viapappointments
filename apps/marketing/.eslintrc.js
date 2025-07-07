/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@package/eslint-config/next.js"],
  parserOptions: {
    // Removing the implicit project: true that may be inherited
    tsconfigRootDir: __dirname,
  },
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
}
