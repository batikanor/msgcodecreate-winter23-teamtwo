from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, login_user
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from dotenv import load_dotenv
import os
from plot import plot_pie_chart_for_budgetbook_by_category

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///moneymonitor.db'

# Read somewhere on stackoverflow this might be good to add for performance reasons, for now I'm leaving it commented out
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

# TODO: Get this secret key from the environment instead. Its just a further security feature for the tokens to be hard to recreate.
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')  # Flask-Login needs a secret key
app.config['JWT_SECRET_KEY'] =  os.getenv('JWT_SECRET_KEY')

print(f"{app.config['SECRET_KEY']=}")
# Following line enables connections from the frontend.
CORS(app)

# initialize Flask extensions

login_manager = LoginManager()
login_manager.init_app(app)
jwt = JWTManager(app)
    
# Import models afteer  initializing login manager
from models import db, User, bcrypt, Account, Budgetbook, Transaction, Budgetplan

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

@app.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions_from_budgetbook_id():
    user_id = get_jwt_identity()
    data = request.get_json()
    budgetbook_id = data["budgetbook_id"]
    
    if not check_admin_privileges(budgetbook_id, user_id):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    budgetbook = get_element_instance_from_id(budgetbook_id, Budgetbook)

    return jsonify([transaction.get_dict_of_transaction() for transaction in budgetbook.transactions])

@app.route('/transactions', methods=['POST'])
#@jwt_required()
def add_transaction_to_budgetbook_and_budgetplan(data=None):
    #current_user_id = get_jwt_identity()
    current_user_id = 1#mock
    if data is None:
        data = request.get_json()

    try:
        if not check_admin_privileges(data["budgetbook_id"], current_user_id):
            return jsonify({'message': 'Access Denied'}), 401
        
        transaction = Transaction(category=data["category"], comment=data["comment"],
                              amount =data["amount"],
                              budgetbook = get_element_instance_from_id(data["budgetbook_id"], Budgetbook),
                              account = get_element_instance_from_id(data["account_id"], Account))
        db.session.add(transaction)
        db.session.commit()
        updated_budget_plan_id = update_budget_plans(data["budgetbook_id"],
                                                  data["amount"], data["category"])
        if updated_budget_plan_id:
            return jsonify({'budget_plan_id': updated_budget_plan_id}), 201
        else:
            return 201
            
    except ValueError:
        return jsonify({'message': "no budgetbook or account found"}), 400
    
@app.route('/transactions', methods=['DELETE'])
#@jwt_required()
def delete_transaction_from_budgetbook_and_budgetplan(data=None):
    #current_user_id = get_jwt_identity()
    current_user_id = 1#mock
    if data is None:
        data = request.get_json()
    
    if not data['transaction_id']:
        return jsonify({'message': "no transaction_id"}), 400
    
    transaction_id = data['transaction_id']

    try:
        if not check_admin_privileges(data["budgetbook_id"], current_user_id):
            return jsonify({'message': 'Access Denied'}), 401
        
        transaction = db.session.query(Transaction).filter(Transaction.id==transaction_id)
        amount = transaction.amount
        budgetbook_id = transaction.budgetbook_id
        category = transaction.category
        transaction.delete()
        db.session.commit()

        updated_budget_plan_id = update_budget_plans_after_deleted_transaction(budgetbook_id, amount, category)
        if updated_budget_plan_id:
            return jsonify({'budget_plan_id': updated_budget_plan_id}), 201
        else:
            return 201
        
    except ValueError:
        return jsonify({'message': "no budgetbook or account found"}), 400
    
def update_budget_plans_after_deleted_transaction(budgetbook_id, amount, category):
    if amount > -0.01:
        return False
    
    budget_plans = db.session.query(Budgetplan).filter(Budgetplan.budgetbook_id==budgetbook_id).\
           filter(Budgetplan.category==category).all()
    
    if len(budget_plans) == 0: 
        return False
    
    budget_plan = budget_plans[0]
    budget_plan.amount_already_spent -= abs(amount)
    db.session.commit()
    return budget_plan.id

@app.route('/budgetplans', methods=['GET'])
@jwt_required()
def get_budgetplans_from_budgetbook_id():
    user_id = get_jwt_identity()
    user_id = 1 #mock
    data = request.get_json()
    budgetbook_id = data["budgetbook_id"]

    if not check_admin_privileges(budgetbook_id, user_id):
        return jsonify({'message': 'Access Denied'}), 401

    budgetbook = get_element_instance_from_id(budgetbook_id, Budgetbook)

    return jsonify([budgetplan.get_dict_of_budgetplan() for budgetplan in budgetbook.budgetplans])

def check_admin_privileges(budgetbook_id, user_id):
      
    budgetbook = get_element_instance_from_id(budgetbook_id, Budgetbook)
    user = get_element_instance_from_id(user_id, User)
    if user_id != budgetbook.user_id and user.privilege != "admin":
        return False
    else:
        return True

@app.route('/budgetplans', methods=['POST'])
@jwt_required()
def add_budgetplan_to_budgetbook():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not check_admin_privileges(data['budgetbook_id'], user_id):
        return jsonify({'message': 'Access Denied'}), 401
    if len(db.session.query(Budgetplan).filter(Budgetplan.budgetbook_id==data['budgetbook_id']).\
           filter(Budgetplan.category==data['category']).all()) != 0:
        return jsonify({'message': f"There already exists a budgetplan for category {data['category']}"}), 400
    try:
        budgetplan = Budgetplan(category=data["category"],
                                budget=data["budget"],
                                amount_already_spent=data["amount_already_spent"],
                                budgetbook = get_element_instance_from_id(data["budgetbook_id"], Budgetbook),)
        db.session.add(budgetplan)
        db.session.commit()
    
    except ValueError:
        return jsonify({'message': "no budgetbook"}), 400
    return 201

def update_budget_plans(budgetbook_id, amount, category ):
    if amount > -0.01:
        return False
    
    budget_plans = db.session.query(Budgetplan).filter(Budgetplan.budgetbook_id==budgetbook_id).\
           filter(Budgetplan.category==category).all()
    
    if len(budget_plans) == 0: 
        return False
    
    budget_plan = budget_plans[0]
    budget_plan.amount_already_spent += abs(amount)
    db.session.commit()
    return budget_plan.id

def get_element_instance_from_id(id, Type):#this gives an error if more than one elements is in the database
    element = db.session.query(Type).filter(Type.id==id).all()
    if len(element) > 1:
        raise ValueError("multiple "+ str(Type) +" with the same id found") 
    elif len(element) < 1:
        raise ValueError("no " + str(Type) + " found") 
    else:
        element = element[0]
    return element

@app.route('/budgetbooks', methods=['GET'])
@jwt_required()
def get_budgetbook_ids_from_user_id():
    user_id = get_jwt_identity()
    user_id = 0
    user = get_element_instance_from_id(user_id, User)

    if user.privilege =="admin":
        budget_books = db.session.query(Budgetbook).all()
    else:
        budget_books = db.session.query(Budgetbook).filter(Budgetbook.user_id==user_id).all()

    return jsonify([budget_book.get_dict_of_budgetbooks() for budget_book in budget_books]), 201

@app.route('/accounts', methods=['GET'])
@jwt_required()
def get_accounts_from_user_id():
    user_id = get_jwt_identity()
    user = get_element_instance_from_id(user_id, User)
    accounts = user.accounts
    return jsonify([account.get_dict_of_account() for account in accounts]), 201

@app.route('/accounts', methods=['POST'])
@jwt_required()
def add_account_to_user():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not db.session.query(User).filter(User.id==user_id).all():
        return {"message": "User doesn't exits"}, 400

    account = Budgetplan(name=data["name"],
                            user_id=user_id)
    db.session.add(account)
    db.session.commit()
    return 201

@app.route('/plot', methods=['GET']) 
@jwt_required()
def get_plot_of_expenses_per_category_for_budgetbook():
    user_id = get_jwt_identity()
    data = request.get_json()
    budgetbook_id = data['budgetbook_id']
    return plot_pie_chart_for_budgetbook_by_category(budgetbook_id, user_id), 201


@app.route('/test', methods=['GET'])
def test_function():
    user = User(username="main user", privilege="normal", password="password" )
    account = Account(name="main ccount", user=user)
    budgetbook = Budgetbook(name="main budget book", user=user)
    transaction = Transaction(category="bill", comment="netflix", amount = -100.123,
                              budgetbook =budgetbook, account = account )
    budgetplan = Budgetplan(category="main plan", budget=500 , budgetbook=budgetbook)

    db.session.add(user)
    db.session.add(account)
    db.session.add(budgetbook)
    db.session.add(transaction)
    db.session.add(budgetplan)
    db.session.commit()


    amounts = [-123, -34,-231,-6,-2,-5]
    categories = ["bill", "entertainment","bill", "transport","bill", "food"]
    # test function here:
    # ------------:------------:------------:
    ts = [{"amount":amount, "category":category, "budgetbook_id":budgetbook.id, "comment":"no_comment", "account_id":account.id} for amount, category in zip(amounts, categories)]
    [ add_transaction_to_budgetbook_and_budgetplan(t) for t in ts ]
    html_plot = plot_pie_chart_for_budgetbook_by_category(budgetbook.id, user.id)

    #:------------:------------:------------:------------:
    db.session.delete(user)
    db.session.delete(account)
    db.session.delete(budgetbook)
    db.session.delete(transaction)
    db.session.delete(budgetplan)

    db.session.commit()
    return html_plot


# for now, set up dataset everytime the app starts
# so it'll check database and create tables for those we don't have tables yet.
# TODO: Check its effects on 'changed' tables. does it cause some unexpected thing? 
with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(debug=True)