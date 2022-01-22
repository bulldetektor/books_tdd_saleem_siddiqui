const Bank = require("./bank");
const Money = require("./money");

class Portfolio {
    constructor() {
        this.moneys = [];
    }

    add(...moneys) {
        this.moneys = this.moneys.concat(moneys);
    }

    evaluate(bank, currency) {
        let conversionFailures = [];
        let total = this.moneys.reduce((sum, money) => {
            try {
                const convertedMoney = bank.convert(money, currency);
                return sum + convertedMoney.amount;
            }
            catch (conversionError) {
                conversionFailures.push(conversionError.message);
                return sum;
            }
        }, 0);

        if (conversionFailures.length > 0) {
            throw new Error(`Missing exchange rate(s):[${conversionFailures.join()}]`);
        }
        return new Money(total, currency);
    }
}

module.exports = Portfolio;