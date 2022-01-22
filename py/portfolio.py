import functools
from money import Money
from bank import Bank


class Portfolio:
    def __init__(self):
        self.moneys = []
        self._eur_to_usd = 1.2

    def add(self, *moneys):
        self.moneys.extend(moneys)

    def evaluate(self, bank, currency):
        sum = 0
        conversionFailures = []
        for m in self.moneys:
            try:
                sum += bank.convert(m, currency).amount
            except Exception as ex:
                conversionFailures.append(ex.args[0])

        if(len(conversionFailures) > 0):
            raise Exception("Missing exchange rate(s):[%s]" % (
                ",".join(conversionFailures)))

        return Money(sum, currency)
