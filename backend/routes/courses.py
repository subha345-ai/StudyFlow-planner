# routes/courses.py
from flask import Blueprint, request, jsonify
from storage import courses_data

courses_bp = Blueprint('courses', __name__)


# ⭐ Get all courses
@courses_bp.route('/api/courses', methods=['GET'])
def get_all_courses():
    return jsonify({
        "courses": courses_data,
        "count": len(courses_data)
    }), 200


# ⭐ Get single course
@courses_bp.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    for c in courses_data:
        if c['id'] == course_id:
            return jsonify(c), 200
    return jsonify({"error": "Course not found"}), 404