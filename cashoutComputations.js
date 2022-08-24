const { weekNumberYear } = require("weeknumber");
const {
  cashOutConfigForLegal,
  cashOutConfigForNatural,
} = require("./configs.js");

const userIdTransactions = {};

const getCommisionForNatural = (amount, user_id, date) => {
  const {
    percents,
    week_limit: { amount: weeklyLimit },
  } = cashOutConfigForNatural;

  const week = weekNumberYear(new Date(date)).week;
  let newWeek = false;
  let previousAmount = amount;
  let finalAmount = amount;

  //since we dont have a database where we can just query to compute for the accumulated amount
  // a global variable userIdTransactions is created to serve as a database.
  // Checking if the amount accumulated is within the week, and resetting it when a new week arrive.
  if (user_id in userIdTransactions) {
    const latestWeek = userIdTransactions[user_id].latestWeekNumber;
    if (latestWeek !== week) {
      newWeek = true;
      userIdTransactions[user_id].amount = amount;
      userIdTransactions[user_id].latestWeekNumber = week;
    }

    previousAmount = userIdTransactions[user_id].amount;
    userIdTransactions[user_id].amount += amount;
    const condition =
      previousAmount < weeklyLimit &&
      userIdTransactions[user_id].amount >= 1000;
    const freedAmount = amount - weeklyLimit < 0 ? 0 : amount - weeklyLimit;
    finalAmount = condition && !newWeek ? freedAmount : amount;
  } else {
    userIdTransactions[user_id] = { amount, latestWeekNumber: week };
    finalAmount = amount >= weeklyLimit ? amount - weeklyLimit : amount;
  }

  return (finalAmount * percents) / 100;
};

const getCommisionForJuridical = (amount) => {
  const {
    percents,
    min: { amount: cashMinCommision },
  } = cashOutConfigForLegal;
  const commission = (amount * percents) / 100;
  return commission < cashMinCommision ? cashMinCommision : commission;
};

const getCashOutCommision = (cashOutInput) => {
  const {
    operation: { amount },
    user_type,
    user_id,
    date,
  } = cashOutInput;

  switch (user_type) {
    case "natural":
      return getCommisionForNatural(amount, user_id, date);
    case "juridical":
      return getCommisionForJuridical(amount);
  }
};

module.exports = {
  getCommisionForNatural,
  getCommisionForJuridical,
  getCashOutCommision,
};
