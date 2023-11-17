import sqlite3


from src.singleton import Singleton


class database_handler(object):
    __metaclass__ = Singleton
    conn = None

    def __init__(self) -> None:
        self.conn = sqlite3.connect('budget-database-sql.db')

    def get_table(table_name):
        pass

    def execute(self, query, data):
        self.cur.execute(query, data)
        self.conn.commit()
        return self.cur

    def add_user(self, user_name, team_name):
        """ Creates a new orphan user in system with no league id assigned. """
        return self.execute("INSERT INTO users (user_name, team_name VALUES (?, ?)", (user_name, team_name))

    def assign_user_to_league(self, user_id, league_id):
        """ Assigns a league_id to a user which is a foreign key """
        return self.execute("UPDATE users SET league_id = ? WHERE user_id = ?", (league_id, user_id))

    def add_player_to_game(self, player_name, team):
        """ This function is only called  during initial set up of game, populates the player db with players. """
        return self.execute("INSERT INTO players (name, team) VALUES(?, ?)", (player_name, team))

    def _del_(self):
        """ Destroys instance and connection on completion of called method """
        self.conn.close()
