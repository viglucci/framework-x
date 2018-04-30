module.exports = {
  "extends": "eslint-config-airbnb",
  "rules": {
    "class-methods-use-this": [
      "warn"
    ],
    "no-bitwise": [
      "warn"
    ],
    "import/no-unresolved": [
      "warn"
    ],
    "no-plusplus": [
      "error",
      {
        "allowForLoopAfterthoughts": true
      }
    ]
  }
};
