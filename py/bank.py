from money import Money


class Bank:
    def __init__(self):
        self.exchangeRates = {}

    def addExchangeRate(self, fromCurrency, toCurrency, rate):
        conversionKey = "%s->%s" % (fromCurrency, toCurrency)
        self.exchangeRates[conversionKey] = rate

    def convert(self, money, currency):
        if money.currency == currency:
            return Money(money.amount, currency)

        conversionKey = "%s->%s" % (money.currency, currency)
        if conversionKey not in self.exchangeRates:
            raise Exception(conversionKey)

        convertedAmount = money.amount * self.exchangeRates[conversionKey]
        return Money(convertedAmount, currency)
