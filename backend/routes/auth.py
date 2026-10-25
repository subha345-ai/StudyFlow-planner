# routes/auth.py
from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from storage import users_data, touch_user, clean_inactive_users
import uuid
from datetime import datetime

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({"error": "Name, email, password required"}), 400
    
    for uid, u in users_data.items():
        if u['email'] == email:
            return jsonify({"error": "Email already registered"}), 400
    
    user_id = str(uuid.uuid4())
    users_data[user_id] = {
        "id": user_id,
        "name": name,
        "email": email,
        "password": generate_password_hash(password),
        "level": None,
        "stream": None,
        "college": None,
        "tasks": [],
        "last_active": datetime.now().isoformat()
    }
    
    return jsonify({
        "message": "Registered successfully",
        "user_id": user_id,
        "name": name
    }), 201


@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    
    for uid, u in users_data.items():
        if u['email'] == email:
            if check_password_hash(u['password'], password):
                session['user_id'] = uid
                touch_user(uid)
                return jsonify({
                    "message": "Login successful",
                    "user_id": uid,
                    "name": u['name'],
                    "level": u.get('level'),
                    "stream": u.get('stream'),
                    "college": u.get('college')
                }), 200
            else:
                return jsonify({"error": "Wrong password"}), 401
    
    # ⭐ AUTO REGISTER — user nei, notun create koro
    user_id = str(uuid.uuid4())
    auto_name = email.split('@')[0].capitalize()   # subha@gmail.com → "Subha"
    
    users_data[user_id] = {
        "id": user_id,
        "name": auto_name,
        "email": email,
        "password": generate_password_hash(password),
        "level": None,
        "stream": None,
        "college": None,
        "tasks": [],
        "last_active": datetime.now().isoformat()
    }
    
    session['user_id'] = user_id
    
    return jsonify({
        "message": "Login successful",
        "user_id": user_id,
        "name": auto_name,
        "level": None,
        "stream": None,
        "college": None
    }), 200


@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    user_id = session.get('user_id')
    if user_id and user_id in users_data:
        del users_data[user_id]
    session.clear()
    return jsonify({"message": "Logged out, data cleared"}), 200


@auth_bp.route('/api/profile', methods=['POST'])
def profile():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    user_id = data.get('user_id')
    
    if not user_id or user_id not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    users_data[user_id]['level'] = data.get('level')
    users_data[user_id]['stream'] = data.get('stream')
    users_data[user_id]['college'] = data.get('college')
    touch_user(user_id)
    
    return jsonify({
        "message": "Profile updated",
        "user": {
            "name": users_data[user_id]['name'],
            "level": users_data[user_id]['level'],
            "stream": users_data[user_id]['stream'],
            "college": users_data[user_id]['college']
        }
    }), 200


@auth_bp.route('/api/me', methods=['GET'])
def me():
    user_id = session.get('user_id')
    if not user_id or user_id not in users_data:
        return jsonify({"error": "Not logged in"}), 401
    
    touch_user(user_id)
    u = users_data[user_id]
    return jsonify({
        "id": u['id'],
        "name": u['name'],
        "email": u['email'],
        "level": u.get('level'),
        "stream": u.get('stream'),
        "college": u.get('college')
    }), 200


@auth_bp.route('/api/clean', methods=['POST'])
def clean():
    deleted = clean_inactive_users()
    return jsonify({"message": f"Cleaned {deleted} inactive users"}), 200