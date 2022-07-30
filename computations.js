const fs = require('fs');
const {weekNumberYear} = require('weeknumber')
const {cashInConfig, cashOutConfigForLegal, cashOutConfigForNatural , smallestCurrency} = require('./configs.js')

const userIdTransactions = {}

const getDataFromFileWithCheck = (filePath) => {

    if(!filePath.endsWith('.json')) {
        throw new Error('Invalid File : Please check File Type')
    }

   
    let rawdata = fs.readFileSync(filePath);
    return JSON.parse(rawdata);
}

const getCashInCommision = (amount) => {
    const {percents, max: {amount : cashMaxCommision}} = cashInConfig
    const commission = amount*percents/100
    return commission > cashMaxCommision ? cashMaxCommision : commission
}

const getCommisionForNatural = (amount, user_id, date) => {
    const {percents, week_limit : {amount:weeklyLimit}} = cashOutConfigForNatural

    const week = weekNumberYear(new Date(date)).week
    let newWeek = false
    let previousAmount = amount
    let finalAmount = amount

    //since we dont have a database where we can just query to compute for the accumulated amount
    // a global variable userIdTransactions is created to serve as a database.
    // Checking if the amount accumulated is within the week, and resetting it when a new week arrive.
    if(user_id in userIdTransactions){
 
        const latestWeek = userIdTransactions[user_id].latestWeekNumber
        if(latestWeek !== week){
            newWeek = true
            userIdTransactions[user_id].amount = amount
            userIdTransactions[user_id].latestWeekNumber = week
        }

        previousAmount = userIdTransactions[user_id].amount
        userIdTransactions[user_id].amount += amount
        const condition = previousAmount < weeklyLimit && userIdTransactions[user_id].amount >= 1000 && !newWeek
        const freedAmount = amount - weeklyLimit < 0 ? 0 :  amount - weeklyLimit;
        finalAmount = condition ? freedAmount : amount
    }else{
        userIdTransactions[user_id] = {amount, latestWeekNumber:week}
        finalAmount = amount >= weeklyLimit ? amount - weeklyLimit : amount
    }
    
    return  finalAmount*percents/100

}

const getCommisionForJuridical = (amount) => {
    const { percents , min : {amount:cashMinCommision}} = cashOutConfigForLegal
    const commission = amount*percents/100
    return commission < cashMinCommision ? cashMinCommision : commission
}

const getCashOutCommision = (cashOutInput) => {
    const {operation: {amount} , user_type , user_id, date} = cashOutInput

    switch(user_type){
        case 'natural':
            return getCommisionForNatural(amount, user_id, date)
        case 'juridical':
            return getCommisionForJuridical(amount)
    }
}

const compuTeCommision = (input) => {
    switch(input.type){
        case 'cash_in':
            return getCashInCommision(input.operation.amount)
        case 'cash_out':
            return getCashOutCommision(input)
    }
}

const convertToSmallestCurrency = (amount , currency) => {
    const {decimalNum} = smallestCurrency[currency]
    return +amount.toFixed(decimalNum)
}



module.exports = {
    getDataFromFileWithCheck,
    compuTeCommision,
    getCashInCommision,
    getCashOutCommision,
    getCommisionForNatural,
    getCommisionForJuridical,
    convertToSmallestCurrency,
}