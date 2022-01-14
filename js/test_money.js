const { AssertionError } = require("assert");
const assert = require("assert");
const Money = require("./money");
const Portfolio = require("./portfolio");

class MoneyTests {
    testMultiplication() {
        let tenEuros = new Money(10, "EUR");
        let twentyEuros = new Money(20, "EUR");
        assert.deepStrictEqual(tenEuros.times(2), twentyEuros);
    }
    testDivision() {
        let originalMoney = new Money(4002, "KRW");
        let actualMoneyAfterDivision = originalMoney.divide(4);
        let expectedMoneyAfterDivision = new Money(1000.5, "KRW");
        assert.deepStrictEqual(actualMoneyAfterDivision, expectedMoneyAfterDivision);
    }
    testAddition() {
        let fiveDollars = new Money(5, "USD");
        let tenDollars = new Money(10, "USD");
        let fifteenDollars = new Money(15, "USD");
        let portfolio = new Portfolio();
        portfolio.add(fiveDollars, tenDollars);
        assert.deepStrictEqual(portfolio.evaluate("USD"), fifteenDollars);
    }

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
                    throw(e);
                }
            }
        });

        console.log();
        if (failures) {
            this.print(`${failures} test(s) failed`, "red")
        }
        this.print(`${i-failures} test(s) succeeded`, "green");
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