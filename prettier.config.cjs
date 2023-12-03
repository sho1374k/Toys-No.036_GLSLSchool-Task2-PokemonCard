/** @type {import("prettier").Config} */
module.exports = {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  semi: true,
  printWidth: 240,
};
