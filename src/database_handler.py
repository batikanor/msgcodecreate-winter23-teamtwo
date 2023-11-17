import sqlite3


class database_handler:

    conn = None

    def __init__(self) -> None:
        self.conn = sqlite3.connect('budget-database-sql.db')

    def get_table(table_name):
        pass

