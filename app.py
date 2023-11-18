from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, login_user
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

# Read somewhere on stackoverflow this might be good to add for performance reasons, for now I'm leaving it commented out
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

# TODO: Get this secret key from the environment instead. Its just a further security feature for the tokens to be hard to recreate.
app.config['SECRET_KEY'] = 'your-secret-key'  # Flask-Login needs a secret key
app.config['JWT_SECRET_KEY'] = 'another-secret-key' 

# Following line enables connections from the frontend.
CORS(app)

# initialize Flask extensions

login_manager = LoginManager()
login_manager.init_app(app)
jwt = JWTManager(app)
    
# Import models afteer  initializing login manager
from models import db, User, bcrypt, Account, Budgetbook, Transaction

db.init_app(app) 
bcrypt.init_app(app) 

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Define the basic index route
@app.route('/', methods=['GET'])
def get_hello():
    return jsonify({'status': 'developing'})

# user registration route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(f"{data=}") # Temporary debug printing
    username = data.get('username')
    password = data.get('password')

    # Check user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists'}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

# user login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()

    if user and user.check_password(data.get('password')):
        # login_user(user)
        access_token = create_access_token(identity=user.id)
        # return jsonify({'message': 'Login successful'}), 200
        print(f"{access_token=}")
        print(f"{jsonify(access_token=access_token)=}")
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
# TODO 2: This route constitutes a vulnerability, and is only here for easy debugging and demonstration purposes. Thus, this route would be removed in an end application.
# TODO 1: We can extend this and display all db objects with this for hackathon demonstration purposes somewhere 
@app.route('/users', methods=['GET'])   
def get_users():
    users = User.query.all()
    users_data = [{'id': user.id, 'username': user.username, 'password': user.password} for user in users]
    return jsonify(users_data)


# @app.route('/transactions', methods=['GET'])
# def add_and_print_transactions():
#     user= User(username="main user")

#     account = Account(name="main ccount", user_id=user.id)
#     budget_book = Budgetbook(user_id = user.id, name="main budget book")
#     transaction = Transaction(categorie="Bill", amount=-200.10, comment="electrecity",
#                               Account=account.id,
#                               budgetbook_id = budget_book.id)
    
    
#     account.transactions.append(transaction)


#     db.session.add(user)
#     db.session.add(account)
#     db.session.add(budget_book)
#     db.session.add(transaction)

#     db.session.commit()

#     transactions = Transaction.query.all()
#     data = [{'transaction': transaction.id}  for t in transactions]
#     jsonify(data)

@app.route('/accounts', methods=['GET'])
def add_and_print_transactions():
    user= User(username="main user", privilege="normal", password="password" )
    account = Account(name="main ccount", user=user)
    budget_book = Budgetbook(name="main budget book", user=user)
    transaction = Transaction(category="bill", comment="netflix", amount = -100.123,
                              budgetbook =budget_book, account = account )

    db.session.add(user)
    db.session.add(account)
    db.session.add(budget_book)
    db.session.add(transaction)

    db.session.commit()

    accounts = Account.query.all()
    data = [{'accountId': account.id, 'the accounts user':account.user.username}
                 for account in accounts]
    data.append([{'budget_book in user:': bb.name, "its user id:": bb.user_id} 
                 for bb in user.budgetbooks][0])
    data.append([{'in the account we got a transaction with this amount:': t.amount, "its saved in this budget book": t.budgetbook.name} 
                 for t in account.transactions][0])
    
    db.session.delete(user)
    db.session.delete(account)
    db.session.delete(budget_book)
    db.session.delete(transaction)

    db.session.commit()
    return jsonify(data)

# for now, set up dataset everytime the app starts
# so it'll check database and create tables for those we don't have tables yet.
# TODO: Check its effects on 'changed' tables. does it cause some unexpected thing? 
with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(debug=True)