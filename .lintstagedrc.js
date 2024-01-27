module.exports = {
  "*.{js,jsx,ts,tsx,md,html,css,mdx}": "prettier --write",
  "*.{js,ts,tsx,jsx}": "eslint --fix",
  "*.{ts,tsx}": () => "tsc --noEmit",
};
