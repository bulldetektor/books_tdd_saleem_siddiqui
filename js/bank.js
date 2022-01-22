const Money = require("./money");

class Bank {
    
    constructor() {
        this.exchangeRates = new Map();
    }

    addExchangeRate(from, to, rate) {
        const conversionKey = this.generateConversionKey(from, to);
        this.exchangeRates.set(conversionKey, rate);
    }

    convert(money, currency) {
        if (money.currency === currency) {
            return new Money(money.amount, money.currency);
        }

        const conversionKey = this.generateConversionKey(money.currency, currency);
        const rate = this.exchangeRates.get(conversionKey);
        if (rate === undefined) {
            throw Error(conversionKey);
        }
        return new Money(money.amount * rate, currency);
    }

    generateConversionKey = (from,to) => `${from}->${to}`;
}

module.exports = Bank;