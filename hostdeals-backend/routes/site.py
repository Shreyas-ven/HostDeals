from flask import Blueprint, request, jsonify
import requests
from extensions import mongo

site_bp = Blueprint("site", __name__)

users_collection = mongo.db.users
sites_collection = mongo.db.sites

from flask import Blueprint, request, jsonify
import requests
from extensions import mongo

site_bp = Blueprint("site", __name__)

users_collection = mongo.db.users
sites_collection = mongo.db.sites


@site_bp.route("/start-site", methods=["POST"])
def start_site():
    data = request.json
    repo = data.get("repo")
    email = data.get("email")

    user = users_collection.find_one({"email": email})

    if not user or "github_accounts" not in user or len(user["github_accounts"]) == 0:
        return jsonify({"message": "GitHub not connected"}), 400

    account = user["github_accounts"][0]

    headers = {
        "Authorization": f"token {account['token']}",
        "Accept": "application/vnd.github+json"
    }

    res = requests.post(
        f"https://api.github.com/repos/{account['username']}/{repo}/pages",
        headers=headers,
        json={"source": {"branch": "main", "path": "/"}}
    )

    if res.status_code in [201, 202]:
        sites_collection.update_one(
            {"repo": repo},
            {"$set": {"status": "Running"}},
            upsert=True
        )
        return jsonify({"message": "Site started"})

    return jsonify({"message": res.text}), 500


@site_bp.route("/stop-site", methods=["POST"])
def stop_site():
    data = request.json
    repo = data.get("repo")
    email = data.get("email")

    user = users_collection.find_one({"email": email})

    if not user or "github_accounts" not in user:
        return jsonify({"message": "GitHub not connected"}), 400

    account = user["github_accounts"][0]

    res = requests.delete(
        f"https://api.github.com/repos/{account['username']}/{repo}/pages",
        headers={
            "Authorization": f"token {account['token']}",
            "Accept": "application/vnd.github+json"
        }
    )

    if res.status_code == 204:
        sites_collection.update_one(
            {"repo": repo},
            {"$set": {"status": "Stopped"}}
        )
        return jsonify({"message": "Site stopped"})

    return jsonify({"message": res.text}), 500


@site_bp.route("/delete-site", methods=["POST"])
def delete_site():
    data = request.json
    repo = data.get("repo")
    email = data.get("email")

    user = users_collection.find_one({"email": email})

    if not user or "github_accounts" not in user or len(user["github_accounts"]) == 0:
        return jsonify({"message": "GitHub not connected"}), 400

    account = user["github_accounts"][0]

    res = requests.delete(
        f"https://api.github.com/repos/{account['username']}/{repo}",
        headers={"Authorization": f"token {account['token']}"}
    )

    if res.status_code == 204:
        sites_collection.delete_one({"repo": repo})
        return jsonify({"message": "Deleted successfully"})

    return jsonify({"message": res.text}), 500


@site_bp.route("/my-sites", methods=["GET"])
def get_my_sites():
    email = request.args.get("email")

    if not email:
        return jsonify([])

    sites = list(sites_collection.find({"email": email}, {"_id": 0}))
    return jsonify(sites)