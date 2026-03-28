from flask import Blueprint, request, jsonify
import requests
from extensions import mongo

github_bp = Blueprint("github", __name__)

users_collection = mongo.db.users


@github_bp.route("/save-github", methods=["POST"])
def save_github():
    data = request.json

    github_username = data.get("github_username")
    github_token = data.get("github_token")
    email = data.get("email")

    if not github_username or not github_token or not email:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        res = requests.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"token {github_token}",
                "Accept": "application/vnd.github+json"
            },
            timeout=10
        )
    except requests.exceptions.Timeout:
        return jsonify({"message": "GitHub API timeout"}), 500
    except Exception as e:
        print("GitHub error:", e)
        return jsonify({"message": "GitHub connection failed"}), 500

    if res.status_code != 200:
        return jsonify({"message": "Invalid GitHub token"}), 400

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"message": "User not found"}), 404

    accounts = user.get("github_accounts", [])

    if len(accounts) >= 1:
        return jsonify({"message": "Only one GitHub allowed"}), 400

    accounts.append({
        "username": github_username,
        "token": github_token
    })

    users_collection.update_one(
        {"email": email},
        {"$set": {"github_accounts": accounts}}
    )

    return jsonify({"message": "GitHub connected successfully"})


@github_bp.route("/get-github", methods=["GET"])
def get_github():
    email = request.args.get("email")

    user = users_collection.find_one({"email": email}, {"_id": 0})

    if not user:
        return jsonify({"accounts": []})

    return jsonify({
        "accounts": user.get("github_accounts", [])
    })


@github_bp.route("/delete-github", methods=["POST"])
def delete_github():
    data = request.json
    email = data.get("email")
    username = data.get("username")

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"message": "User not found"}), 404

    accounts = user.get("github_accounts", [])

    accounts = [acc for acc in accounts if acc["username"] != username]

    users_collection.update_one(
        {"email": email},
        {"$set": {"github_accounts": accounts}}
    )

    return jsonify({"message": "GitHub removed"})


@github_bp.route("/get-repos", methods=["GET"])
def get_repos():
    email = request.args.get("email")

    user = users_collection.find_one({"email": email})

    if not user or "github_accounts" not in user or len(user["github_accounts"]) == 0:
        return jsonify({"message": "GitHub not connected"}), 400

    account = user["github_accounts"][0]

    try:
        res = requests.get(
            "https://api.github.com/user/repos",
            headers={"Authorization": f"token {account['token']}"},
            timeout=5
        )
    except Exception as e:
        print("Repo fetch error:", e)
        return jsonify({"message": "GitHub timeout"}), 500

    if res.status_code != 200:
        return jsonify({"message": res.text}), 500

    return jsonify(res.json())