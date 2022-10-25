from flask import Flask, request, jsonify, send_from_directory, session, redirect
from apscheduler.schedulers.background import BackgroundScheduler
from flask_session import Session
from flask_bcrypt import Bcrypt
from redmail import gmail
from email.utils import formataddr
from models import db, User, FireflyData
from refresh_firefly_data import *
import jwt
import time
import re
import json

app = Flask(__name__)
app.config.from_object("config.DevConfig")

bcrypt = Bcrypt(app)
server_session = Session(app)

db.init_app(app)

gmail.username = app.config["MAIL_USERNAME"]
gmail.password = app.config["MAIL_PASSWORD"]

scheduler = BackgroundScheduler({'apscheduler.job_defaults.max_instances': 2})
scheduler.add_job(refresh_all_firefly_data, "interval",
              minutes=app.config["FIREFLY_DATA_REFRESH_INTERVAL"])
scheduler.start()


def register_user(email, name, password):
    token = jwt.encode({"email": email, "expiresAt": int(
        time.time()) + 60*60}, app.config["SECRET_KEY"], algorithm="HS256")

    gmail.send(
        subject="Verify your email",
        receivers=[email],
        sender=formataddr(("CryoFly", gmail.username)),
        html="""
            <p>Hello {{ name }},</p>
            <p>Follow this link to verify your email address.</p>
            <a href="{{ verification_url }}">{{ verification_url }}</a>
            <p>This email was sent automatically, if you did not sign up to CryoFly, you may ignore this email.</p>
        """,
        body_params={
            "name": name,
            "verification_url": f'http://localhost:5000/verify?token={token}'
        }
    )

    hashed_password = bcrypt.generate_password_hash(password)

    new_user = User(email=email, name=name, password=hashed_password,
                    is_validated=False, is_admin=False)

    with app.app_context():
        db.session.add(new_user)
        db.session.commit()


# Send a non-react, SEO friendly landing page for the root path if the user isn't logged in
@app.route("/", methods=["GET"])
def root_page():
    user_id = session.get("user_id")

    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return send_from_directory("./pages/landing", "index.html")
    else:
        return redirect("/timetable")


@app.route("/api/firefly/session", methods=["PATCH"])
def set_firefly_session():
    user_id = session.get("user_id")

    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": True, "message": "Unauthorized"}), 401

    content = request.json

    if not content:
        return jsonify({"error": True, "message": "No data was provided in the request"}), 400

    if not content["session"] or type(content["session"]) != str or len(content["session"]) != 24:
        return jsonify({"error": True, "message": "Firefly Session ID provided was invalid"}), 400

    firefly_data = FireflyData.query.filter_by(id=user_id).first()

    firefly_data.firefly_session_id = content["session"]

    db.session.commit()

    refresh_firefly_data(user.id)

    return jsonify({"error": False, "message": "Successfully updated Firefly session ID"})


@app.route("/api/users/@me", methods=["GET"])
def get_self():
    user_id = session.get("user_id")

    user = User.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"error": True, "message": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()

    return jsonify({
        "error": False,
        "content": {
            "email": user.email,
            "name": user.name,
            "is_validated": user.is_validated,
            "is_admin": user.is_admin
        }
    }), 200


@app.route("/api/lessons", methods=["GET"])
def api_get_lessons():
    user_id = session.get("user_id")

    firefly_data = FireflyData.query.filter_by(id=user_id).first()

    if firefly_data is None:
        return jsonify({"error": True, "message": "Unauthorized"}), 401

    if firefly_data.timetable_json is None:
        return jsonify({"error": True, "message": "No saved timetable data on the server"}), 400

    return jsonify({
        "error": False,
        "id": user_id,
        "content": json.loads(firefly_data.timetable_json)
    })


@app.route("/api/register", methods=["POST"])
def signup():
    content = request.json

    if not content:
        return jsonify({"error": True, "message": "No data was provided in the request"}), 400

    email = str(content.get("email"))
    name = str(content.get("name"))
    password = str(content.get("password"))

    if email is None or not re.match(r"^[A-Za-z0-9]+(.|_)+[A-Za-z0-9]+@+gordanoschool.org.uk$", email) or len(email) > 32:
        return jsonify({"error": True, "message": "Valid email not provided in the request"}), 400

    if name is None or not re.match(r"^\S.{1,28}\S$", name):
        return jsonify({"error": True, "message": "Valid display name not provided in the request"}), 400

    if password is None or not re.match(r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$", password):
        return jsonify({"error": True, "message": "Valid password not provided in the request"}), 400

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": True, "message": "Account already exists with this email address"}), 409

    scheduler.add_job(lambda: register_user(email, name, password))

    return jsonify({"error": False, "message": "Account created - verfication email sent"}), 201


@app.route("/api/verify", methods=["POST"])
def verify_email():
    content = request.json

    if not content:
        return jsonify({"error": True, "message": "No data was provided in the request"}), 400

    token = str(content.get("token"))

    if token is None:
        return jsonify({"error": True, "message": "Verification token not given"}), 400

    try:
        data = jwt.decode(
            token, app.config["SECRET_KEY"], algorithms=["HS256"])
    except jwt.exceptions.InvalidSignatureError:
        return jsonify({"error": True, "message": "Invalid verification code"}), 401

    email = data.get("email")

    if email is None:
        return jsonify({"error": True, "message": "Invalid verification code"}), 401

    user = User.query.filter_by(email=email).first()

    token_is_valid = int(time.time()) < data["expiresAt"]

    if user is None:
        return jsonify({"error": True, "message": "Invalid verification code"}), 401

    if user.is_validated:
        return jsonify({"error": True, "message": "User is already validated"}), 400

    if token_is_valid:
        user.is_validated = True
        firefly_data = FireflyData(id=user.id)

        db.session.add(firefly_data)
        db.session.commit()

        return jsonify({"error": False, "message": "User successfully validated"}), 200
    else:
        return jsonify({"error": True, "message": "Invalid verification code"}), 401


@app.route("/api/login", methods=["POST"])
def login():
    content = request.json

    if not content:
        return jsonify({"error": True, "message": "No data was provided in the request"}), 400

    email = str(content.get("email"))
    password = str(content.get("password"))

    if email is None:
        return jsonify({"error": True, "message": "Email not provided in the request"}), 400

    if password is None:
        return jsonify({"error": True, "message": "Password not provided in the request"}), 400

    user = User.query.filter_by(email=email).first()

    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": True, "message": "The credentials provided were invalid"}), 401

    if not user.is_validated:
        return jsonify({"error": True, "message": "This account hasn't been validated, please follow the link sent to your email"}), 401

    session["user_id"] = user.id

    return jsonify({"error": False, "message": "Successfully logged in"}), 200
