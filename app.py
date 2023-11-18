from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, bcrypt 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

# Read somewhere on stackoverflow this might be good to add for performance reasons, for now I'm leaving it commented out
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

# Following line enables connections from the frontend.
CORS(app)

# initialize Flask extensions
db.init_app(app) 
bcrypt.init_app(app) 

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
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
# TODO 2: This route constitutes a vulnerability, and is only here for easy debugging and demonstration purposes. Thus, this route would be removed in an end application.
# TODO 1: We can extend this and display all db objects with this for hackathon demonstration purposes somewhere 
@app.route('/users', methods=['GET'])   
def get_users():
    users = User.query.all()
    users_data = [{'id': user.id, 'username': user.username, 'password': user.password} for user in users]
    return jsonify(users_data)


# for now, set up dataset everytime the app starts
# so it'll check database and create tables for those we don't have tables yet.
# TODO: Check its effects on 'changed' tables. does it cause some unexpected thing? 
with app.app_context():
    db.create_all()