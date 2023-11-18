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
    def set_password(self, password):
        # I believe bcrypt also salts it. See documentation for further info, but I think this is fine.
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
