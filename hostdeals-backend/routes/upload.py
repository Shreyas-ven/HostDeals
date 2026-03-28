
from flask import Blueprint, jsonify, request
from extensions import mongo

import os
import time
import tempfile
import shutil
import base64
import requests

from urllib.parse import quote


upload_bp = Blueprint("upload", __name__)

upload_bp = Blueprint("upload", __name__)

users_collection = mongo.db.users
sites_collection = mongo.db.sites

IGNORE_FILES = ["node_modules", ".git", "__pycache__"]


@upload_bp.route("/upload", methods=["GET"])
def upload():
    try:
        domain = request.form.get("domain")
        email = request.form.get("email")

        index_file = request.files.get("index")
        css_files = request.files.getlist("css")
        js_files = request.files.getlist("js")
        image_files = request.files.getlist("images")

        if not domain or not email or not index_file:
            return jsonify({"message": "Missing required fields"}), 400

        user = users_collection.find_one({"email": email})

        if not user or "github_accounts" not in user or len(user["github_accounts"]) == 0:
            return jsonify({"message": "Please connect GitHub"}), 400

        account = user["github_accounts"][0]

        headers = {
            "Authorization": f"token {account['token']}",   # ✅ FIXED
            "Accept": "application/vnd.github+json"
            }

        repo_name = generate_repo_name(domain)

        # ✅ CREATE REPO
        repo_res = requests.post(
            "https://api.github.com/user/repos",
            json={"name": repo_name, "private": False, "auto_init": True},
            headers=headers
        )

        
        # ✅ CHECK REPO CREATION
        if repo_res.status_code != 201:
            print("Repo creation error:", repo_res.text)
            return jsonify({"message": repo_res.text}), 500

        # ENABLE PAGES
        pages_res = requests.post(
            f"https://api.github.com/repos/{account['username']}/{repo_name}/pages",
            headers=headers,
            json={"source": {"branch": "main", "path": "/"}}
        )

        if pages_res.status_code not in [201, 202]:
            print("Pages error:", pages_res.text)

        time.sleep(10)

        # =========================
        # 📁 CREATE TEMP STRUCTURE
        # =========================
        temp_dir = tempfile.mkdtemp()

        # index.html
        index_path = os.path.join(temp_dir, "index.html")
        index_file.save(index_path)

        # CSS
        css_dir = os.path.join(temp_dir, "css")
        os.makedirs(css_dir, exist_ok=True)
        for file in css_files:
            file.save(os.path.join(css_dir, file.filename))

        # JS
        js_dir = os.path.join(temp_dir, "js")
        os.makedirs(js_dir, exist_ok=True)
        for file in js_files:
            file.save(os.path.join(js_dir, file.filename))

        # IMAGES
        img_dir = os.path.join(temp_dir, "images")
        os.makedirs(img_dir, exist_ok=True)
        for file in image_files:
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

                relative_path = os.path.relpath(file_path, temp_dir)\
                    .replace("\\", "/")\
                    .lstrip("./")

                print("Uploading:", relative_path)

                with open(file_path, "rb") as content_file:
                    content = base64.b64encode(content_file.read()).decode()

                res = requests.put(
                    f"https://api.github.com/repos/{account['username']}/{repo_name}/contents/{quote(relative_path)}",
                    headers=headers,
                    json={
                        "message": f"Add {relative_path}",
                        "content": content,
                        "branch": "main"
                    }
                )

                if res.status_code not in [200, 201]:
                    print("❌ Upload error:", res.text)

        # cleanup
        shutil.rmtree(temp_dir, ignore_errors=True)

        site_url = f"https://{account['username']}.github.io/{repo_name}/"

        sites_collection.insert_one({
            "email": email,
            "domain": domain,
            "repo": repo_name,
            "url": site_url,
            "status": "Running"
        })

        return jsonify({"message": "Deployed successfully", "url": site_url})

    except Exception as e:
        print("UPLOAD ERROR:", e)
        return jsonify({"message": "Upload failed"}), 500
