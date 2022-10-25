import redis
from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))


class Config:
    """Base config."""
    SECRET_KEY = environ.get('SECRET_KEY')
    MAIL_USERNAME = environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = environ.get('MAIL_PASSWORD')
    SQLALCHEMY_DATABASE_URI = r"sqlite:///.//db.sqlite"

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://redis:6379")

class ProdConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False
    TESTING = False
    FIREFLY_DATA_REFRESH_INTERVAL = 50 # Note that firefly ASP.NET Session IDs are invalidated after 1 hour of inactivity (unconfirmed but is default behaviour) 


class DevConfig(Config):
    FLASK_ENV = 'development'
    DEBUG = True
    TESTING = True
    FIREFLY_DATA_REFRESH_INTERVAL = 99999999
    SQLALCHEMY_ECHO = True
