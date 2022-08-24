const { compuTeCommision } = require("./computations.js");
const {
  getDataFromFileWithCheck,
  convertToSmallestCurrency,
} = require("./helpers.js");

const inputFilePath = process.argv[2];

const data = getDataFromFileWithCheck(inputFilePath) || [];

data.forEach((input) => {
  const res = convertToSmallestCurrency(
    compuTeCommision(input),
    input.operation.currency
  );
  console.log(res.toFixed(2));
});
