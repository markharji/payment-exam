const cashInConfig = {
    percents: 0.03,
    max: {
        amount: 5,
        currency: "EUR"
    }
}

const cashOutConfigForNatural = {
    percents: 0.3,
    week_limit: {
        amount: 1000,
        currency: "EUR"
    }
}

const cashOutConfigForLegal = {
    percents: 0.3,
    min: {
        amount: 0.5,
        currency: "EUR"
    }
}

const smallestCurrency = {
    "EUR" : {
        name : 'cents',
        decimalNum : 2,
    }
}


module.exports = {
    cashInConfig,
    cashOutConfigForNatural,
    cashOutConfigForLegal,
    smallestCurrency
}