"""
Study Planner API — Final Working Version
Backend: Flask + CORS
Storage: In-memory (users_data, chapters_data)
AI: Groq (Llama 3)
"""

from flask import Flask, jsonify
from flask_cors import CORS

# ═══════════════════════════════════════════════
# IMPORT BLUEPRINTS
# ═══════════════════════════════════════════════
from routes.auth import auth_bp
from routes.search import search_bp
from routes.tasks import tasks_bp
from routes.courses import courses_bp
from routes.chapters import chapters_bp
from routes.tests import tests_bp
from routes.ai_questions import ai_bp
from routes.admin import admin_bp

# ═══════════════════════════════════════════════
# CREATE FLASK APP
# ═══════════════════════════════════════════════
app = Flask(__name__)
app.secret_key = "study-planner-secret-key-2026"

# ═══════════════════════════════════════════════
# CORS CONFIGURATION
# ═══════════════════════════════════════════════
CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    expose_headers=["Content-Type"],
)

# ═══════════════════════════════════════════════
# REGISTER BLUEPRINTS
# ═══════════════════════════════════════════════
app.register_blueprint(auth_bp)
app.register_blueprint(search_bp)
app.register_blueprint(tasks_bp)
app.register_blueprint(courses_bp)
app.register_blueprint(chapters_bp)
app.register_blueprint(tests_bp)
app.register_blueprint(ai_bp)
app.register_blueprint(admin_bp)   # 👈 ADMIN BP REGISTERED

# ═══════════════════════════════════════════════
# HOME ROUTE
# ═══════════════════════════════════════════════
@app.route('/')
def home():
    return jsonify({
        "message": "Study Planner API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "auth": [
                "/api/register",
                "/api/login",
                "/api/logout",
                "/api/profile",
                "/api/me"
            ],
            "search": [
                "/api/search/student",
                "/api/search/subject",
                "/api/search/class",
                "/api/search/college"
            ],
            "tasks": [
                "/api/tasks",
                "/api/tasks/<id>",
                "/api/tasks/<id>/progress",
                "/api/level-tasks",
                "/api/generate-tasks",
                "/api/progress"
            ],
            "courses": [
                "/api/courses",
                "/api/courses/<id>"
            ],
            "chapters": [
                "/api/chapters/subjects",
                "/api/chapters",
                "/api/chapters/<id>",
                "/api/chapters/<id>/topics/<topic_id>"
            ],
            "tests": [
                "/api/tests/submit",
                "/api/tests/results"
            ],
            "ai": [
                "/api/ai/generate-questions"
            ],
            "admin": [
                "/api/admin/login",
                "/api/admin/stats",
                "/api/admin/users",
                "/api/admin/courses",
                "/api/admin/chapters"
            ]
        }
    }), 200

# ═══════════════════════════════════════════════
# 404 HANDLER
# ═══════════════════════════════════════════════
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

# ═══════════════════════════════════════════════
# 500 HANDLER
# ═══════════════════════════════════════════════
@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ═══════════════════════════════════════════════
# RUN
# ═══════════════════════════════════════════════
if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')