/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@package/eslint-config/next.js"],
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.*.json"],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["*.js", "*.jsx"],
}
