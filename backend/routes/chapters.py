from flask import Blueprint, request, jsonify
from storage import chapters_data

chapters_bp = Blueprint('chapters', __name__)


# ⭐ Get all subjects
@chapters_bp.route('/api/chapters/subjects', methods=['GET'])
def get_subjects():
    subjects = list(set(c['subject'] for c in chapters_data))
    return jsonify({"subjects": subjects}), 200


# ⭐ Get chapters by subject + level
@chapters_bp.route('/api/chapters', methods=['GET'])
def get_chapters():
    subject = request.args.get('subject', '').lower()
    level = request.args.get('level', '').lower()
    difficulty = request.args.get('difficulty', '').lower()

    results = []
    for c in chapters_data:
        if subject and subject not in c['subject'].lower():
            continue
        if level and level not in c['level'].lower():
            continue
        if difficulty and difficulty != c.get('difficulty', ''):
            continue

        chapter_summary = {
            "id": c['id'],
            "subject": c['subject'],
            "level": c['level'],
            "chapter": c['chapter'],
            "difficulty": c.get('difficulty'),
            "topics_count": len(c['topics']),
            "topics": [{"id": t['id'], "name": t['name']} for t in c['topics']]
        }
        results.append(chapter_summary)

    return jsonify({"chapters": results, "count": len(results)}), 200


# ⭐ Get single chapter details
@chapters_bp.route('/api/chapters/<int:chapter_id>', methods=['GET'])
def get_chapter_detail(chapter_id):
    for c in chapters_data:
        if c['id'] == chapter_id:
            return jsonify(c), 200
    return jsonify({"error": "Chapter not found"}), 404


# ⭐ Get topic details (with tasks + test)
@chapters_bp.route('/api/chapters/<int:chapter_id>/topics/<topic_id>', methods=['GET'])
def get_topic(chapter_id, topic_id):
    for c in chapters_data:
        if c['id'] == chapter_id:
            for t in c['topics']:
                if t['id'] == topic_id:
                    return jsonify({
                        "chapter": c['chapter'],
                        "subject": c['subject'],
                        "level": c['level'],
                        "topic": t
                    }), 200
    return jsonify({"error": "Topic not found"}), 404