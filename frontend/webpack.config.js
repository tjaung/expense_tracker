const path = require("path");

module.exports = {
  output: {
    filename: "main.js",
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
};
