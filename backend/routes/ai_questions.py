from flask import Blueprint, request, jsonify
from ai.generator import generate_questions

ai_bp = Blueprint('ai', __name__)


@ai_bp.route('/api/ai/generate-questions', methods=['POST'])
def generate():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    subject = data.get('subject', '')
    level = data.get('level', '')
    chapter = data.get('chapter', '')
    topic = data.get('topic', '')
    num = data.get('num_questions', 5)

    if not subject or not topic:
        return jsonify({"error": "Subject and topic required"}), 400

    questions = generate_questions(subject, level, chapter, topic, num)

    if not questions:
        return jsonify({"error": "Failed to generate questions. Try again."}), 500

    return jsonify({
        "questions": questions,
        "count": len(questions),
        "topic": topic
    }), 200