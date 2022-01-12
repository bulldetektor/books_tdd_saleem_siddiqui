import unittest

class Money:
    def __init__(self, amount, currency):
        self.amount = amount
        self.currency = currency

    def times(self, multiplier):
        return Money(self.amount * multiplier, self.currency)

    def divide(self, divisor):
        return Money(self.amount / divisor, self.currency)

    def __eq__(self, other) -> bool:
        return self.amount == other.amount and self.currency == other.currency


class TestMoney(unittest.TestCase):
    def testMultiplicationInDollars(self):
        fiver = Money(5, "USD")
        tenner = Money(10, "USD")
        self.assertEqual(fiver.times(2), tenner)

    def testMultiplicationInEuros(self):
        tenEuros = Money(10, "EUR")
        twentyEuros = Money(20, "EUR")
        self.assertEqual(tenEuros.times(2), twentyEuros)

    def testDivision(self):
        originalMoney = Money(4002, "KRW")
        actualMoneyAfterDivision = originalMoney.divide(4)
        expectedMoneyAfterDivision = Money(1000.5, "KRW")
        self.assertEqual(expectedMoneyAfterDivision, actualMoneyAfterDivision)



if __name__ == '__main__':
    unittest.main()