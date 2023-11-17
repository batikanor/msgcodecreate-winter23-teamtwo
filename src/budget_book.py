from src.transaction import Transaction
import sqlite3


class budget_book:
    
    db_connection: sqlite3

    def __init__(self, money_amount_: float, categorie_: str, comment_: str = "", date_of_transaction: datetime = N) -> None:
        self.db_connection = sqlite3.connect('budget_book.db')
        