from flask import Blueprint, jsonify, request
from extensions import mongo

import os
import time
import tempfile
import shutil
import base64
import requests
import traceback

from urllib.parse import quote


upload_bp = Blueprint("upload", __name__)

users_collection = mongo.db.users
sites_collection = mongo.db.sites

IGNORE_FILES = ["node_modules", ".git", "__pycache__"]


# ✅ ADD THIS (was missing)
def generate_repo_name(domain):
    return domain.replace(" ", "-").lower() + "-" + str(int(time.time()))


@upload_bp.route("/api/upload", methods=["POST"])
def upload():
    try:
        domain = request.form.get("domain")
        email = request.form.get("email")

        index_file = request.files.get("index")
        css_files = request.files.getlist("css") or []
        js_files = request.files.getlist("js") or []
        image_files = request.files.getlist("images") or []

        if not domain or not email or not index_file:
            return jsonify({"message": "Missing required fields"}), 400

        user = users_collection.find_one({"email": email})

        if not user or "github_accounts" not in user or len(user["github_accounts"]) == 0:
            return jsonify({"message": "Please connect GitHub"}), 400

        account = user["github_accounts"][0]

        headers = {
            "Authorization": f"token {account['token']}",
            "Accept": "application/vnd.github+json"
        }

        repo_name = generate_repo_name(domain)

        # CREATE REPO
        repo_res = requests.post(
            "https://api.github.com/user/repos",
            json={"name": repo_name, "private": False, "auto_init": True},
            headers=headers
        )

        if repo_res.status_code != 201:
            print("Repo creation error:", repo_res.text)
            return jsonify({"message": repo_res.text}), 500

        # ✅ FIX: get actual repo owner safely
        repo_data = repo_res.json()
        repo_owner = repo_data.get("owner", {}).get("login", account["username"])

        time.sleep(5)

        # =========================
        # 📁 TEMP STRUCTURE
        # =========================
        temp_dir = tempfile.mkdtemp()

        # ✅ HTML → ROOT
        index_path = os.path.join(temp_dir, "index.html")
        index_file.save(index_path)

        # ✅ CSS → ROOT
        for file in css_files:
            if file and file.filename:
                file.save(os.path.join(temp_dir, file.filename))

        # ✅ JS → ROOT
        for file in js_files:
            if file and file.filename:
                file.save(os.path.join(temp_dir, file.filename))

        # ✅ IMAGES → /images folder
        img_dir = os.path.join(temp_dir, "images")
        os.makedirs(img_dir, exist_ok=True)

        for file in image_files:
            if file and file.filename:
                file.save(os.path.join(img_dir, file.filename))

        # =========================
        # 🚀 UPLOAD TO GITHUB
        # =========================
        for root, dirs, files in os.walk(temp_dir):
            dirs[:] = [d for d in dirs if d not in IGNORE_FILES]

            for f in files:
                if f in IGNORE_FILES:
                    continue

                file_path = os.path.join(root, f)

                if os.path.getsize(file_path) == 0:
                    continue

                relative_path = os.path.relpath(file_path, temp_dir).replace("\\", "/")

                print("Uploading:", relative_path)

                with open(file_path, "rb") as content_file:
                    content = base64.b64encode(content_file.read()).decode()

                res = requests.put(
                    f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents/{quote(relative_path)}",
                    headers=headers,
                    json={
                        "message": f"Add {relative_path}",
                        "content": content,
                        "branch": "main"
                    }
                )

                if res.status_code not in [200, 201]:
                    print("❌ Upload error:", res.text)

        shutil.rmtree(temp_dir, ignore_errors=True)


        # =========================
# 🌐 ENABLE GITHUB PAGES (FIX)
# =========================
        pages_res = requests.post(
        f"https://api.github.com/repos/{repo_owner}/{repo_name}/pages",
        headers=headers,
        json={"source": {"branch": "main", "path": "/"}}
        )

        print("Pages response:", pages_res.status_code, pages_res.text)

        # Give GitHub time to deploy
        time.sleep(10)

        site_url = f"https://{repo_owner}.github.io/{repo_name}/"

        sites_collection.insert_one({
            "email": email,
            "domain": domain,
            "repo": repo_name,
            "url": site_url,
            "status": "Running"
        })

        return jsonify({
            "message": "Deployed successfully",
            "url": site_url
        })

    except Exception as e:
        print("UPLOAD ERROR:", str(e))
        traceback.print_exc()
        return jsonify({
            "message": "Upload failed",
            "error": str(e)
        }), 500