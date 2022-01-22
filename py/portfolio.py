import functools
from money import Money

class Portfolio:
    def __init__(self):
        self.moneys = []

    def add(self, *moneys):
        self.moneys.extend(moneys)

    def evaluate(self, currency):
        sum = 0
        for m in self.moneys:
            sum += m.amount
        return Money(sum, currency)
