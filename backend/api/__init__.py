import os

from dotenv import load_dotenv

from api.app import app, db
from api.settings import BASE_DIR
from api import routes, models

load_dotenv(os.path.join(BASE_DIR, '.env'))