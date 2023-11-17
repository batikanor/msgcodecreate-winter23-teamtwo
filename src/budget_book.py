from src.transaction import Transaction
import sqlite3


class budget_book:
    
    db_connection: sqlite3

    def __init__(self) -> None:
        self.db_connection = sqlite3.connect('budget_book.db')
