const Money = require("./money");

class Portfolio {
    constructor() {
        this.moneys = [];
    }

    add(...moneys) {
        this.moneys = this.moneys.concat(moneys);
    }

    evaluate(currency) {
        let conversionFailures = [];
        let total = this.moneys.reduce((sum, money) => {
            const convertedAmount = this.convert(money, currency);
            if (convertedAmount === undefined) {
                conversionFailures.push(`${money.currency}->${currency}`);
                return sum;
            }
            return sum + convertedAmount;
        }, 0);

        if (conversionFailures.length > 0) {
            throw new Error(`Missing exchange rate(s):[${conversionFailures.join()}]`);
        }
        return new Money(total, currency);
    }

    convert(money, currency) {
        let exchangeRates = new Map();
        exchangeRates.set("EUR->USD", 1.2);
        exchangeRates.set("USD->KRW", 1100);

        if (money.currency === currency) {
            return money.amount;
        }

        const conversionKey = `${money.currency}->${currency}`;
        const rate = exchangeRates.get(conversionKey);
        if (rate === undefined) {
            return undefined;
        }
        return money.amount * rate;
    }
}

module.exports = Portfolio;