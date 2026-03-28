from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import smtplib
import os
import zipfile
import requests
import base64
import tempfile
import time
import shutil
import random
import string
from requests.utils import quote
from dotenv import load_dotenv
load_dotenv()


# ==============================
# 🔐 CREATE APP & CONFIG
# ==============================
app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

users_collection = mongo.db.users
sites_collection = mongo.db.sites

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

IGNORE_FILES = ['.pyc', '__pycache__', '.git', '.idea', '.vscode', 'venv', 'Lib', 'site-packages']

# ==============================
# 🧑 REGISTER
# ==============================
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    if users_collection.find_one({"email": data.get("email")}):
        return jsonify({"success": False, "message": "Email already exists"}), 400

    users_collection.insert_one({
        "name": data.get("name"),
        "email": data.get("email").strip().lower(),
        "phone": data.get("phone"),
        "type": data.get("type"),
        "org": data.get("org"),
        "source": data.get("source"),
        "password": generate_password_hash(data.get("password"))
    })

    return jsonify({"success": True, "message": "Registered successfully"})

# ==============================
# 🔑 LOGIN
# ==============================
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user = users_collection.find_one({"email": data.get("email")})

    if user and check_password_hash(user["password"], data.get("password")):
        return jsonify({
            "success": True,
            "message": "Login successful",
            "email": user["email"]
        })

    return jsonify({"success": False, "message": "Invalid credentials"}), 401

# ==============================
# 📩 CONTACT
# ==============================
@app.route("/contact", methods=["POST"])
def contact():
    data = request.json

    text = f"""Subject: HostDeals Contact

Name: {data.get("name")}
Email: {data.get("email")}

Message:
{data.get("message")}
"""

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, SENDER_EMAIL, text)
        server.quit()

        return jsonify({"message": "Message sent successfully"})

    except Exception as e:
        print(e)
        return jsonify({"message": "Error sending mail"}), 500

# ==============================
# 🔗 SAVE GITHUB
# ==============================
@app.route("/save-github", methods=["POST"])
def save_github():
    data = request.json

    github_username = data.get("github_username")
    github_token = data.get("github_token")
    email = data.get("email")

    if not github_username or not github_token or not email:
        return jsonify({"message": "Missing required fields"}), 400

    # 🔍 Validate token (SAFE)
    try:
        res = requests.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"token {github_token}",
                "Accept": "application/vnd.github+json"
            },
            timeout=10   # ✅ FIXED
        )
    except requests.exceptions.Timeout:
        return jsonify({"message": "GitHub API timeout"}), 500
    except Exception as e:
        print("GitHub error:", e)
        return jsonify({"message": "GitHub connection failed"}), 500

    if res.status_code != 200:
        print("GitHub response:", res.text)
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


# ==============================
# 🚀 UPLOAD
# ==============================
def generate_repo_name(domain):
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
    timestamp = int(time.time() * 1000)
    return f"{domain}-hostdeals-{timestamp}-{rand}"

@app.route("/upload", methods=["POST"])
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

# ==============================
# ❌ DELETE SITE
# ==============================
@app.route("/delete-site", methods=["POST"])
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

# ==============================
# 📄 GET GITHUB
# ==============================
@app.route("/get-github", methods=["GET"])
def get_github():
    email = request.args.get("email")

    user = users_collection.find_one({"email": email}, {"_id": 0})

    if not user:
        return jsonify({"accounts": []})

    return jsonify({
        "accounts": user.get("github_accounts", [])
    })

# ==============================
# ❌ DELETE GITHUB
# ==============================
@app.route("/delete-github", methods=["POST"])
def delete_github():
    data = request.json
    email = data.get("email")
    username = data.get("username")

    user = users_collection.find_one({"email": email})

    accounts = user.get("github_accounts", [])
    accounts = [acc for acc in accounts if acc["username"] != username]

    users_collection.update_one(
        {"email": email},
        {"$set": {"github_accounts": accounts}}
    )

    return jsonify({"message": "GitHub removed"})

# ==============================
# 📄 GET REPOS
# ==============================
@app.route("/get-repos", methods=["GET"])
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


# ==============================
# 👤 GET PROFILE
# ==============================
@app.route("/get-profile", methods=["GET"])
def get_profile():
    email = request.args.get("email", "").strip().lower()   # ✅ FIX

    print("Fetching profile for:", email)   # ✅ DEBUG

    user = users_collection.find_one(
        {"email": email},
        {"_id": 0, "password": 0}
    )

    if not user:
        print("User NOT FOUND")   # ✅ DEBUG
        return jsonify({"message": "User not found"}), 404

    return jsonify(user)

# ==============================
# 🔹 RUN
# ==============================
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)