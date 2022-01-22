import unittest
from money import Money
from portfolio import Portfolio


class TestMoney(unittest.TestCase):

    def testMultiplication(self):
        tenEuros = Money(10, "EUR")
        twentyEuros = Money(20, "EUR")
        self.assertEqual(tenEuros.times(2), twentyEuros)

    def testDivision(self):
        originalMoney = Money(4002, "KRW")
        actualMoneyAfterDivision = originalMoney.divide(4)
        expectedMoneyAfterDivision = Money(1000.5, "KRW")
        self.assertEqual(expectedMoneyAfterDivision, actualMoneyAfterDivision)

    def testAddition(self):
        fiveDollars = Money(5, "USD")
        tenDollars = Money(10, "USD")
        fifteenDollars = Money(15, "USD")
        portfolio = Portfolio()
        portfolio.add(fiveDollars, tenDollars)
        self.assertEqual(fifteenDollars, portfolio.evaluate("USD"))

    def testAddingEurAndUsd(self):
        fiveDollars = Money(5, "USD")
        tenEuros = Money(10, "EUR")
        portfolio = Portfolio()
        portfolio.add(fiveDollars, tenEuros)
        expected = Money(17, "USD")
        actual = portfolio.evaluate("USD")
        self.assertEqual(actual, expected, "Expected %s, but got %s" % (expected, actual))

    # 1 USD + 1100 KRW = 2200 KRW
    def testAddingUsdAndWon(self):
        oneDollar = Money(1, "USD")
        elevenHundredWons = Money(1100, "KRW")
        portfolio = Portfolio()
        portfolio.add(oneDollar, elevenHundredWons)
        expected = Money(2200, "KRW")
        actual = portfolio.evaluate("KRW")
        self.assertEqual(actual, expected, "Expected %s, but got %s" % (expected, actual))

    # determine exchange rate based on the currencies involved (from -> to)
    # allow exchange rates to be modified
    # handle unknown exchange rates


if __name__ == '__main__':
    unittest.main()