import datetime

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin

# SQLAlchemy is our ORM (Object-Relational Mapping) tool.
db = SQLAlchemy()

bcrypt = Bcrypt()

# UserMixin has some preexisting implementations (for methods and attr) related to flask-login such as is_authenticated, is_active, is_anonymous, get_id() method
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    privilage = db.Column(db.String)

    def set_password(self, password):
        # I believe bcrypt also salts it. See documentation for further info, but I think this is fine.
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


class Transaction(db.Model):
    id = db.Column(
        db.Integer, primary_key=True, autoincrement=True)

    categorie = db.Column(db.String)
    amount = db.Column(db.Float, default=0)
    comment = db.Column(db.String, default="no_comment")
    time_of_transaction = db.Column(
        db.DateTime, default=datetime.datetime.utcnow)

    account_id = db.Column(
        db.Integer, db.ForeignKey("account.id", ondelete='CASCADE'))
    account = db.relationship(
        "Account", back_populates="transaction")

    budgetbook_id = db.Column(db.Integer, db.ForeignKey(
        'budgetbook.id', ondelete='CASCADE'))
    budgetbook = db.relationship(
        "BudgetBook", back_populates="transaction")


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, default="no_name")


class Budgetbook(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    name = db.Column(db.String, default="no_name")

    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete='CASCADE'))
    user = db.relationship(
        "User", back_populates="budgetbook")

class BudgetPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    name = db.Column(db.String, default="no_name")

    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete='CASCADE'))
    user = db.relationship(
        "User", back_populates="budgetplan")

    budgetbook_id = db.Column(db.Integer, db.ForeignKey(
        'budgetbook.id', ondelete='CASCADE'))
    budgetbook = db.relationship(
        "BudgetBook", back_populates="transaction")
