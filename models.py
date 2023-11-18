import datetime
from flask import jsonify

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import UserMixin

# SQLAlchemy is our ORM (Object-Relational Mapping) tool.
db = SQLAlchemy()

bcrypt = Bcrypt()

# UserMixin has some preexisting implementations (for methods and attr) related to flask-login such as is_authenticated, is_active, is_anonymous, get_id() method
class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    privilege = db.Column(db.String)

    def set_password(self, password):
        # I believe bcrypt also salts it. See documentation for further info, but I think this is fine.
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    accounts = db.relationship("Account", back_populates="user")
    budgetbooks = db.relationship("Budgetbook", back_populates="user")
    
    # transactions = db.relationship(
    #     "Transaction", back_populates="account")
    
class Account(db.Model):
    __tablename__ = 'account'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, default="no_name")

    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'))
    user = db.relationship("User")

    transactions = db.relationship("Transaction", back_populates="account")

class Budgetbook(db.Model):
    __tablename__ = 'budgetbook'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    name = db.Column(db.String, default="no_name")

    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'))
    user = db.relationship("User")

    transactions = db.relationship("Transaction", back_populates="budgetbook")


class Transaction(db.Model):
    __tablename__ = 'transaction'
    id = db.Column(
        db.Integer, primary_key=True, autoincrement=True)

    category = db.Column(db.String)
    amount = db.Column(db.Float, default=0)
    comment = db.Column(db.String, default="no_comment")
    time_of_transaction = db.Column(
        db.DateTime, default=datetime.datetime.utcnow)

    account_id = db.Column(
        db.Integer, db.ForeignKey("account.id"))
    account = db.relationship("Account")

    budgetbook_id = db.Column(db.Integer, db.ForeignKey('budgetbook.id'))
    budgetbook = db.relationship("Budgetbook")

    def get_json_of_transaction(self) :
        transaction_data = {'id': self.id,
                            'category': self.category,
                            'amount' : self.amount,
                            'comment': self.comment,
                            'time of transaction' : self.time_of_transaction,
                            'account id' : self.account_id,
                            'user': self.account.user.username}
        
        return jsonify(transaction_data)
    
# class BudgetPlan(db.Model):
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)

#     name = db.Column(db.String, default="no_name")

#     budgetbook_id = db.Column(db.Integer, db.ForeignKey(
#         'budgetbook.id', ondelete='CASCADE'))
#     budgetbook = db.relationship(
#         "Budgetbook", back_populates="budgetplan")
