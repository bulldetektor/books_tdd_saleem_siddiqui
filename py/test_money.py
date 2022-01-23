from shutil import ExecError
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
import unittest
from money import Money
from portfolio import Portfolio
from bank import Bank


class TestMoney(unittest.TestCase):

    def setUp(self) -> None:
        self.bank = Bank()
        self.bank.addExchangeRate("EUR", "USD", 1.2)
        self.bank.addExchangeRate("USD", "KRW", 1100)

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
        self.assertEqual(fifteenDollars, portfolio.evaluate(self.bank, "USD"))

    def testAddingEurAndUsd(self):
        fiveDollars = Money(5, "USD")
        tenEuros = Money(10, "EUR")
        portfolio = Portfolio()
        portfolio.add(fiveDollars, tenEuros)
        expected = Money(17, "USD")
        actual = portfolio.evaluate(self.bank, "USD")
        self.assertEqual(actual, expected,
                         "Expected %s, but got %s" % (expected, actual))

    # 1 USD + 1100 KRW = 2200 KRW
    def testAddingUsdAndWon(self):
        oneDollar = Money(1, "USD")
        elevenHundredWons = Money(1100, "KRW")
        portfolio = Portfolio()
        portfolio.add(oneDollar, elevenHundredWons)
        expected = Money(2200, "KRW")
        actual = portfolio.evaluate(self.bank, "KRW")
        self.assertEqual(actual, expected,
                         "Expected %s, but got %s" % (expected, actual))

    # handle unknown exchange rates
    def testAdditionOfMultipleMissingExchangeRates(self):
        oneDollar = Money(1, "USD")
        oneEuro = Money(1, "EUR")
        oneWon = Money(1, "KRW")
        portfolio = Portfolio()
        portfolio.add(oneDollar, oneEuro, oneWon)
        with self.assertRaisesRegex(
            Exception,
            r"Missing exchange rate\(s\):\[USD\->Kalganid,EUR\->Kalganid,KRW\->Kalganid\]",
        ):
            portfolio.evaluate(self.bank, "Kalganid")

    def testConversionWitDifferentRatesBetweenTwoCurrencies(self):
        tenEuros = Money(10, "EUR")
        actual = self.bank.convert(tenEuros, "USD")
        self.assertEqual(actual, Money(12, "USD"))

        self.bank.addExchangeRate("EUR", "USD", 1.3)
        actual = self.bank.convert(tenEuros, "USD")
        self.assertEqual(actual, Money(13, "USD"))

    def testConversionWithMissingExchangeRates(self):
        tenEuros = Money(10, "EUR")
        with self.assertRaisesRegex(
            Exception,
            r"EUR\->Kalganid"
        ):
            self.bank.convert(tenEuros, "Kalganid")

    # allow exchange rates to be modified


if __name__ == '__main__':
    unittest.main()
