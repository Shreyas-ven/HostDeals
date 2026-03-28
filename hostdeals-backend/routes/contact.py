from flask import Blueprint, request, jsonify
import smtplib
import os

contact_bp = Blueprint("contact", __name__)

# Load from environment (IMPORTANT)
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")


# ==============================
# 📩 CONTACT
# ==============================
@contact_bp.route("/contact", methods=["POST"])
def contact():
    data = request.json

    if not SENDER_EMAIL or not SENDER_PASSWORD:
        return jsonify({"message": "Email credentials not configured"}), 500

    text = f"""Subject: HostDeals Contact

Name: {data.get("name")}
Email: {data.get("email")}

Message:
{data.get("message")}
"""

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        server.login(str(SENDER_EMAIL), str(SENDER_PASSWORD))
        server.sendmail(SENDER_EMAIL, SENDER_EMAIL, text)
        server.quit()

        return jsonify({"message": "Message sent successfully"})

    except Exception as e:
        print("MAIL ERROR:", e)
        return jsonify({"message": "Error sending mail"}), 500