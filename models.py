import datetime

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt


# SQLAlchemy is our ORM (Object-Relational Mapping) tool.
db = SQLAlchemy()

bcrypt = Bcrypt()

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    privilage = db.Column(db.String)

    def set_password(self, password):
        # I believe bcrypt also salts it. See documentation for further info, but I think this is fine.
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


class Transaction(db.Model):

    transaction_id = db.Column(
        db.Integer, primary_key=True, autoincrement=True)

    categorie = db.Column(db.String)
    amount = db.Column(db.Float, default=0)
    comment = db.Column(db.String, default="no_comment")
    time_of_transaction = db.Column(
        db.DateTime, server_default=datetime.datetime.utcnow)

    account_id = db.Column(
        db.Integer, db.Foreign_key("account.id"), autoincrement=True)
    account = db.relationship(
        "Account", back_populates="transaction")

    budgetbook_id = db.Column(db.Integer, db.ForeignKey('budgetbook.id'))
    budgetbook = db.relationship(
        "BudgetBook", back_populates="transaction")


class Account(db.Model):

    account_id = db.Column(db.Integer, primary_key=True, autoincrement=True)


class BudgetBook(db.Model):

    budgetbook_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    name = db.Column(db.String, default="no_name")

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship(
        "User", back_populates="budgetbook")


class BudgetPlan(db.Model):
    budgetplan_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    name = db.Column(db.String, default="no_name")

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship(
        "User", back_populates="budgetplan")

    budgetbook_id = db.Column(db.Integer, db.ForeignKey('budgetbook.id'))
    budgetbook = db.relationship(
        "BudgetBook", back_populates="transaction")
