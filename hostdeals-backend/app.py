from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from extensions import mongo

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["JSON_SORT_KEYS"] = False

app.config["MONGO_URI"] = os.getenv("MONGO_URI")

# Initialize Mongo
mongo.init_app(app)

# Import blueprints AFTER app creation
from routes.auth import auth_bp
from routes.upload import upload_bp
from routes.github import github_bp
from routes.site import site_bp
from routes.profile import profile_bp
from routes.contact import contact_bp

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(github_bp)
app.register_blueprint(site_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(contact_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)