const {
    getDataFromFileWithCheck,
    compuTeCommision,
    getCashInCommision,
    getCashOutCommision,
    getCommisionForNatural,
    getCommisionForJuridical,
    convertToSmallestCurrency,
} = require('./computations.js')

const {cashInConfig, cashOutConfigForLegal, cashOutConfigForNatural , smallestCurrency} = require('./configs.js')


test('Checking file type Validation : getDataFromFileWithCheck()', () => {
    try {
        getDataFromFileWithCheck('inputNoJsonExtension');
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
    } catch (e) {
        expect(e.message).toBe("Invalid File : Please check File Type");
    }

    const assertData = [
        { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } }
    ]

    expect(getDataFromFileWithCheck('input.mock.json')).toEqual(assertData);
})

test('Computing Commision : compuTeCommision()' , () => {
    const mockData = [
    { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
    { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
    { "date": "2016-01-06", "user_id": 3, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } },
    { "date": "2016-01-07", "user_id": 3, "user_type": "natural", "type": "cash_out", "operation": { "amount": 900.00, "currency": "EUR" } }
    ]

    expect(compuTeCommision(mockData[0])).toBe(0.06)
    expect(compuTeCommision(mockData[1])).toBe(0.90)
    expect(compuTeCommision(mockData[2])).toBe(87.00)
    expect(compuTeCommision(mockData[3])).toBe(2.70)
})

test('Computing for cash_in type commision : getCashInCommision()' , () => {
    expect(getCashInCommision(200)).toBe(0.06)

    // maximum of 5 commision
    expect(getCashInCommision(100000)).toBe(5)
})

test('Computing for cash_out type () commision : getCashOutCommision()' , () => {
    const mockData = [
        { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
        { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
    ]
    const cashOutJudirical = jest.fn();
    expect(getCashOutCommision(mockData[0])).toBe(0.90)
    expect(cashOutJudirical).toHaveBeenCalledTimes(0);

    const cashOutNatural = jest.fn();
    expect(getCashOutCommision(mockData[1])).toBe(.3)
    expect(cashOutNatural).toHaveBeenCalledTimes(0);
})

test('Computing for the commision fee for natural type cash out : getCommisionForNatural', () => {
    expect(getCommisionForNatural(100,1,'2016-01-07')).toBe(0.3)
})

test('computing for commission fee for natural type cash out with same and new week', () => {
    const mockData = [
            { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100, "currency": "EUR" } },
            { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 900.00, "currency": "EUR" } },
            { "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
            { "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
            { "date": "2016-02-15", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } }
        ]
   
    const mockAnswer  = [0.3 ,2.70 ,0.30 ,0.30,0.9]

    mockData.forEach((mock, index) => {
        expect(getCommisionForNatural(mock.operation.amount, mock.user_id)).toBe(mockAnswer[index])
    });
     
})

test('Computing for the commision fee for natural type cash out : getCommisionForJuridical', () => {
    
    expect(getCommisionForJuridical(300)).toBe(0.9)

    //minimum of 0.5 Euro per operation
    expect(getCommisionForJuridical(100)).toBe(0.5)
})

test('rounding off to the smallest currency : convertToSmallestCurrency', () => {
    const mockData =   [
        { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
        { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 423.00, "currency": "EUR" } }
    ]

    expect(convertToSmallestCurrency(compuTeCommision(mockData[0]),mockData[0].operation.currency)).toBe(0.06)

    //    0.12689999999999999 not rounded off , final answer should be -> 0.13
    expect(convertToSmallestCurrency(compuTeCommision(mockData[1]),mockData[1].operation.currency)).toBe(0.13)
    
})