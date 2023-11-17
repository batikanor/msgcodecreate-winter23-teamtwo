from src.transaction import Transaction
import sqlite3


class budget_book:
    
    Transactions:list[Transaction]

    def __init__(self) -> None:
        