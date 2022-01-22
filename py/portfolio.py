import functools
from money import Money


class Portfolio:
    def __init__(self):
        self.moneys = []
        self._eur_to_usd = 1.2

    def add(self, *moneys):
        self.moneys.extend(moneys)

    def evaluate(self, currency):
        sum = 0
        conversionFailures = []
        for m in self.moneys:
            try:
                sum += self.__convert(m, currency)
            except KeyError as ke:
                conversionFailures.append(ke)

        if(len(conversionFailures) > 0):
            raise Exception("Missing exchange rate(s):[%s]" % (
                ",".join(f.args[0] for f in conversionFailures)))

        return Money(sum, currency)

    def __convert(self, money: Money, currency):
        if(money.currency == currency):
            return money.amount

        exchangeRates = {"EUR->USD": 1.2, "USD->KRW": 1100}
        conversionKey = "%s->%s" % (money.currency, currency)
        return money.amount * exchangeRates[conversionKey]
