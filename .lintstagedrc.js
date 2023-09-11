module.exports = {
  "*.{js,jsx,ts,tsx,md,html,css}": "prettier --write",
  "*.{js,ts,tsx,jsx}": "eslint --fix",
  "*.{ts,tsx}": () => "tsc --noEmit",
};
