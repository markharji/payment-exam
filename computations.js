const { getCashOutCommision } = require("./cashOutComputations.js");
const { getCashInCommision } = require("./cashInComputations.js");

const compuTeCommision = (input) => {
  switch (input.type) {
    case "cash_in":
      return getCashInCommision(input.operation.amount);
    case "cash_out":
      return getCashOutCommision(input);
  }
};

module.exports = {
  compuTeCommision,
};
