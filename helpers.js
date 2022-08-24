const fs = require("fs");
const { smallestCurrency } = require("./configs.js");

const getDataFromFileWithCheck = (filePath) => {
  if (!filePath.endsWith(".json")) {
    throw new Error("Invalid File : Please check File Type");
  }

  let rawdata = fs.readFileSync(filePath);
  return JSON.parse(rawdata);
};

const convertToSmallestCurrency = (amount, currency) => {
  const { decimalNum } = smallestCurrency[currency];
  return +amount.toFixed(decimalNum);
};

module.exports = {
  getDataFromFileWithCheck,
  convertToSmallestCurrency,
};
