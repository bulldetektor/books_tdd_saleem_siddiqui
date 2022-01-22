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
        for m in self.moneys:
            sum += self.__convert(m, currency)
        return Money(sum, currency)

    def __convert(self, money: Money, currency):
        if(money.currency == currency):
            return money.amount
        return money.amount * self._eur_to_usd
