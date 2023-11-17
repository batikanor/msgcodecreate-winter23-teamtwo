import datetime
import sqlite3


class Transaction:

    date_of_transaction: datetime
    money_amount: float
    categorie: str
    comment: str

    def __init__(self, money_amount_: float, categorie_: str, comment_: str = "", date_of_transaction: datetime = None) -> None:
        self.money_amount = money_amount_
        self.categorie = categorie_
        self.comment = comment_

        if not date_of_transaction_:
            date_of_transaction_ = datetime.datetime.now()
        self.date_of_transaction = date_of_transaction_


