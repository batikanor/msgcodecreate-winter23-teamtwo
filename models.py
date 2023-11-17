from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

# SQLAlchemy is our ORM (Object-Relational Mapping) tool.
db = SQLAlchemy()

bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    def set_password(self, password):
        # I believe bcrypt also salts it. See documentation for further info, but I think this is fine.
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
