from flask import Blueprint, request, jsonify
from storage import admin_data, users_data, courses_data, chapters_data

admin_bp = Blueprint('admin', __name__)


# ═══════════════════════════════════════════════
# ADMIN LOGIN
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if email == admin_data['email'] and password == admin_data['password']:
        return jsonify({
            "message": "Admin login successful",
            "admin": {
                "name": admin_data['name'],
                "email": admin_data['email'],
                "role": admin_data['role']
            }
        }), 200

    return jsonify({"error": "Invalid admin credentials"}), 401


# ═══════════════════════════════════════════════
# DASHBOARD STATS
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/stats', methods=['GET'])
def admin_stats():
    total_users = len(users_data)
    total_courses = len(courses_data)
    total_chapters = len(chapters_data)

    total_topics = 0
    total_questions = 0
    for c in chapters_data:
        for t in c.get('topics', []):
            total_topics += 1
            total_questions += len(t.get('test', []))

    recent_users = []
    for uid, u in list(users_data.items())[-5:]:
        recent_users.append({
            "id": uid,
            "name": u.get('name', 'Unknown'),
            "email": u.get('email', ''),
            "level": u.get('level'),
            "stream": u.get('stream'),
            "college": u.get('college'),
            "tasks": len(u.get('tasks', []))
        })

    return jsonify({
        "stats": {
            "total_users": total_users,
            "total_courses": total_courses,
            "total_chapters": total_chapters,
            "total_topics": total_topics,
            "total_questions": total_questions
        },
        "recent_users": recent_users
    }), 200


# ═══════════════════════════════════════════════
# GET ALL USERS
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/users', methods=['GET'])
def admin_users():
    users_list = []
    for uid, u in users_data.items():
        users_list.append({
            "id": uid,
            "name": u.get('name', 'Unknown'),
            "email": u.get('email', ''),
            "level": u.get('level'),
            "stream": u.get('stream'),
            "college": u.get('college'),
            "tasks_count": len(u.get('tasks', [])),
            "test_results": len(u.get('test_results', []))
        })

    return jsonify({
        "users": users_list,
        "count": len(users_list)
    }), 200


# ═══════════════════════════════════════════════
# GET ALL COURSES
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/courses', methods=['GET'])
def admin_courses():
    return jsonify({
        "courses": courses_data,
        "count": len(courses_data)
    }), 200


# ═══════════════════════════════════════════════
# ADD NEW COURSE
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/courses', methods=['POST'])
def admin_add_course():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    course_name = data.get('course_name', '').strip()
    level = data.get('level', '').strip()
    stream = data.get('stream', '').strip()
    school = data.get('school', '').strip()
    subjects = data.get('subjects', [])

    if not course_name or not level:
        return jsonify({"error": "Course name and level required"}), 400

    new_id = max([c['id'] for c in courses_data], default=0) + 1

    new_course = {
        "id": new_id,
        "course_name": course_name,
        "level": level,
        "stream": stream,
        "school": school,
        "subjects": subjects if isinstance(subjects, list) else []
    }

    courses_data.append(new_course)

    return jsonify({
        "message": "Course added",
        "course": new_course
    }), 201


# ═══════════════════════════════════════════════
# DELETE COURSE
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/courses/<int:course_id>', methods=['DELETE'])
def admin_delete_course(course_id):
    for i, c in enumerate(courses_data):
        if c['id'] == course_id:
            del courses_data[i]
            return jsonify({"message": "Course deleted"}), 200

    return jsonify({"error": "Course not found"}), 404


# ═══════════════════════════════════════════════
# GET ALL CHAPTERS
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/chapters', methods=['GET'])
def admin_chapters():
    chapters_summary = []
    for c in chapters_data:
        chapters_summary.append({
            "id": c['id'],
            "subject": c['subject'],
            "level": c['level'],
            "chapter": c['chapter'],
            "difficulty": c.get('difficulty', 'medium'),
            "topics_count": len(c.get('topics', []))
        })

    return jsonify({
        "chapters": chapters_summary,
        "count": len(chapters_summary)
    }), 200


# ═══════════════════════════════════════════════
# ADD NEW CHAPTER
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/chapters', methods=['POST'])
def admin_add_chapter():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    subject = data.get('subject', '').strip()
    level = data.get('level', '').strip()
    chapter_name = data.get('chapter', '').strip()
    difficulty = data.get('difficulty', 'medium')
    topics = data.get('topics', [])

    if not subject or not level or not chapter_name:
        return jsonify({"error": "Subject, level, chapter required"}), 400

    new_id = max([c['id'] for c in chapters_data], default=0) + 1

    new_chapter = {
        "id": new_id,
        "subject": subject,
        "level": level,
        "chapter": chapter_name,
        "difficulty": difficulty,
        "topics": topics if isinstance(topics, list) else []
    }

    chapters_data.append(new_chapter)

    return jsonify({
        "message": "Chapter added",
        "chapter": new_chapter
    }), 201


# ═══════════════════════════════════════════════
# DELETE CHAPTER
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/chapters/<int:chapter_id>', methods=['DELETE'])
def admin_delete_chapter(chapter_id):
    for i, c in enumerate(chapters_data):
        if c['id'] == chapter_id:
            del chapters_data[i]
            return jsonify({"message": "Chapter deleted"}), 200

    return jsonify({"error": "Chapter not found"}), 404


# ═══════════════════════════════════════════════
# ADD QUESTION TO TOPIC
# ═══════════════════════════════════════════════
@admin_bp.route('/api/admin/chapters/<int:chapter_id>/topics/<topic_id>/questions', methods=['POST'])
def admin_add_question(chapter_id, topic_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    question = data.get('question', '').strip()
    options = data.get('options', [])
    answer = data.get('answer', 0)

    if not question or len(options) < 2:
        return jsonify({"error": "Question + at least 2 options required"}), 400

    for c in chapters_data:
        if c['id'] == chapter_id:
            for t in c.get('topics', []):
                if t['id'] == topic_id:
                    if 'test' not in t:
                        t['test'] = []
                    new_q = {
                        "question": question,
                        "options": options,
                        "answer": answer
                    }
                    t['test'].append(new_q)
                    return jsonify({"message": "Question added", "question": new_q}), 201

    return jsonify({"error": "Chapter or topic not found"}), 404