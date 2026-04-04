from flask import Blueprint, request, jsonify
from extensions import mongo

profile_bp = Blueprint("profile", __name__)

users_collection = mongo.db.users


# ==============================
# 👤 GET PROFILE
# ==============================
@profile_bp.route("/api/get-profile", methods=["GET"])
def get_profile():
    try:
        email = request.args.get("email")

        if not email:
            return jsonify({"message": "Email is required"}), 400

        email = email.strip().lower()

        print("Fetching profile for:", email)

        user = users_collection.find_one(
            {"email": email},
            {"_id": 0, "password": 0}
        )

        if not user:
            return jsonify({"message": "User not found"}), 404

        return jsonify({
            "message": "Profile fetched successfully",
            "user": user
        }), 200

    except Exception as e:
        print("GET PROFILE ERROR:", e)
        return jsonify({"message": "Internal server error"}), 500