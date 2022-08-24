const { cashInConfig } = require("./configs.js");

const getCashInCommision = (amount) => {
  const {
    percents,
    max: { amount: cashMaxCommision },
  } = cashInConfig;
  const commission = (amount * percents) / 100;
  return commission > cashMaxCommision ? cashMaxCommision : commission;
};

module.exports = {
  getCashInCommision,
};
