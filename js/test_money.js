const { AssertionError } = require("assert");
const assert = require("assert");
const Money = require("./money");
const Portfolio = require("./portfolio");
const Bank = require("./bank");

class MoneyTests {

    constructor() {
        this.bank = new Bank();
        this.bank.addExchangeRate("EUR", "USD", 1.2);
        this.bank.addExchangeRate("USD", "KRW", 1100);
    }

    testMultiplication() {
        let tenEuros = new Money(10, "EUR");

        let actual = tenEuros.times(2);

        let expected = new Money(20, "EUR");
        assert.deepStrictEqual(actual, expected);
    }

    testDivision() {
        let originalMoney = new Money(4002, "KRW");

        let actual = originalMoney.divide(4);

        let expected = new Money(1000.5, "KRW");
        assert.deepStrictEqual(actual, expected);
    }

    testAddition() {
        let fiveDollars = new Money(5, "USD");
        let tenDollars = new Money(10, "USD");
        let portfolio = new Portfolio();
        
        portfolio.add(fiveDollars, tenDollars);
        
        const expected = new Money(15, "USD");
        const actual = portfolio.evaluate(this.bank, "USD");
        assert.deepStrictEqual(actual, expected);
    }

    testAdditionOfEurosAndDollars() {
        let fiveDollars = new Money(5, "USD");
        let tenEuros = new Money(10, "EUR");
        let portfolio = new Portfolio();

        portfolio.add(fiveDollars, tenEuros);

        const expected = new Money(17, "USD");
        const actual = portfolio.evaluate(this.bank, "USD");
        assert.deepStrictEqual(actual, expected);
    }

    // 1 USD + 1100 KRW = 2200 KRW
    testAdditionOfDollarsAndWons() {
        let oneDollar = new Money(1, "USD");
        let elevenHundredWon = new Money(1100, "KRW");
        let portfolio = new Portfolio();

        portfolio.add(oneDollar, elevenHundredWon);

        const expected = new Money(2200, "KRW");
        const actual = portfolio.evaluate(this.bank, "KRW");
        assert.deepStrictEqual(actual, expected);
    }

    // handle unknown exchange rates
    testAdditionOfMultipleMissingExchangeRates() {
        let oneDollar = new Money(1, "USD");
        let oneEuro = new Money(1, "EUR");
        let oneWon = new Money(1, "KRW");
        let portfolio = new Portfolio();

        portfolio.add(oneDollar, oneEuro, oneWon);

        let expectedError = "Missing exchange rate(s): [USD->Kalganid,EUR->Kalganid,KRW->Kalganid]"
        assert.throws(() => portfolio.evaluate("Kalganid"), expectedError);
    }

    // refactor conversion key generator
    testConversion() {
        const tenEuros = new Money(10, "EUR");

        let actual = this.bank.convert(tenEuros, "USD");

        assert.deepStrictEqual(actual, new Money(12, "USD"));
    }

    testConversionWithMissingExchangeRates() {
        const tenEuros = new Money(10, "EUR");

        const expectedError = new Error("EUR->Kalganid");
        assert.throws(() => this.bank.convert(tenEuros, "Kalganid"), expectedError);
    }



    // allow exchange rates to be modified



    getAllTestMethods() {
        let proto = Object.getPrototypeOf(this);
        let members = Object.getOwnPropertyNames(proto);
        let testNames = members.filter(p => { return typeof proto[p] === "function" && p.startsWith("test") });
        return testNames;
    }

    runAllTests() {
        console.log();

        let tests = this.getAllTestMethods();
        console.log("Discovered %d test(s)", tests.length);

        let i = 0, failures = 0;
        tests.forEach((testName) => {
            let test = Reflect.get(this, testName);
            console.log("Running %d/%d: %s()", ++i, tests.length, testName);
            try {
                Reflect.apply(test, this, []);
            }
            catch (e) {
                failures++;
                if (e instanceof AssertionError) {
                    this.print(e, "red");
                }
                else {
                    this.print("Unhandled error", "red");
                    throw (e);
                }
            }
        });

        console.log();
        if (failures) {
            this.print(`${failures} test(s) failed`, "red")
        }
        this.print(`${i - failures} test(s) succeeded`, "green");
        console.log();

    }

    print(msg, color) {
        if (!color) {
            console.log(msg);
        }
        else {
            let hexColor = ""
            if (color === "red") {
                hexColor = "\x1b[31m"
            }
            else if (color === "green") {
                hexColor = "\x1b[32m";
            }

            console.log('%s%s\x1b[0m', hexColor, msg);
        }
    }
}



new MoneyTests().runAllTests();