# routes/search.py
from flask import Blueprint, request, jsonify
from storage import courses_data, users_data

search_bp = Blueprint('search', __name__)


@search_bp.route('/api/search/student', methods=['GET'])
def search_student():
    name = request.args.get('name', '').lower()
    if not name:
        return jsonify({"error": "Name required"}), 400
    
    results = []
    for uid, u in users_data.items():
        if name in u['name'].lower():
            results.append({
                "id": uid,
                "name": u['name'],
                "level": u.get('level'),
                "stream": u.get('stream'),
                "college": u.get('college')
            })
    
    return jsonify({"results": results, "count": len(results)}), 200


@search_bp.route('/api/search/subject', methods=['GET'])
def search_subject():
    subject = request.args.get('name', '').lower()
    if not subject:
        return jsonify({"error": "Subject required"}), 400
    
    results = []
    for c in courses_data:
        for s in c['subjects']:
            if subject in s.lower():
                results.append({
                    "course_name": c['course_name'],
                    "level": c['level'],
                    "college": c['college'],
                    "subject": s
                })
                break
    
    return jsonify({"results": results, "count": len(results)}), 200


@search_bp.route('/api/search/class', methods=['GET'])
def search_class():
    level = request.args.get('level', '').lower()
    stream = request.args.get('stream', '').lower()
    
    results = []
    for c in courses_data:
        if level and level not in c['level'].lower():
            continue
        if stream and stream not in c['stream'].lower():
            continue
        results.append(c)
    
    return jsonify({"results": results, "count": len(results)}), 200


@search_bp.route('/api/search/college', methods=['GET'])
def search_college():
    college = request.args.get('name', '').lower()
    if not college:
        return jsonify({"error": "College name required"}), 400
    
    results = []
    for c in courses_data:
        if college in c['college'].lower():
            results.append(c)
    
    return jsonify({"results": results, "count": len(results)}), 200