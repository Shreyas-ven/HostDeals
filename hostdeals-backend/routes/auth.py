from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import mongo   # ✅ FIXED

auth_bp = Blueprint("auth", __name__)

users_collection = mongo.db.users

@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.json

    email = data.get("email", "").strip().lower()

    if users_collection.find_one({"email": email}):
        return jsonify({"success": False, "message": "Email already exists"}), 400

    users_collection.insert_one({
        "name": data.get("name"),
        "email": email,
        "phone": data.get("phone"),
        "type": data.get("type"),
        "org": data.get("org"),
        "source": data.get("source"),
        "password": generate_password_hash(data.get("password"))
    })

    return jsonify({"success": True, "message": "Registered successfully"})


@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json

    user = users_collection.find_one({"email": data.get("email")})

    if user and check_password_hash(user["password"], data.get("password")):
        return jsonify({
            "success": True,
            "message": "Login successful",
            "email": user["email"]
        })

    return jsonify({
        "success": False,
        "message": "Invalid credentials"
    }), 401