/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@package/eslint-config/next.js"],
  settings: {
    next: {
      rootDir: "./src",
    },
  },
  rules: {
    "import/no-default-export": "off",
  },
}
