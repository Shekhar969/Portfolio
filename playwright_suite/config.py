import os 
from dotenv import load_dotenv

load_dotenv()


BASE_URL = os.environ.get("BASE_URL", "https://shekharrawal.com.np")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")

DEFAULT_TIMEOUT_MS = 10000