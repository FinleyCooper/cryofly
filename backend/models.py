from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "Users"

    id = db.Column(db.String(32), primary_key=True, unique=True, default=lambda:uuid4().hex)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    name = db.Column(db.String(32))
    is_validated = db.Column(db.Boolean)
    is_admin = db.Column(db.Boolean)

class FireflyData(db.Model):
    __tablename__ = "FireflyData"

    id = db.Column(db.String(32), primary_key=True, unique=True)
    firefly_session_id = db.Column(db.String(24))
    timetable_json = db.Column(db.Text)
