/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@package/eslint-config/next.js"],
  rules: {
    "react/no-multi-comp": "off",
  },
}
