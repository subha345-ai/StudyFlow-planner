from flask import Blueprint, request, jsonify
from storage import chapters_data, users_data
import uuid
from datetime import datetime

tests_bp = Blueprint('tests', __name__)


@tests_bp.route('/api/tests/submit', methods=['POST'])
def submit_test():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    user_id = data.get('user_id')
    chapter_id = data.get('chapter_id')
    topic_id = data.get('topic_id')
    answers = data.get('answers', [])

    if not user_id or user_id not in users_data:
        return jsonify({"error": "User not found"}), 404

    topic_data = None
    for c in chapters_data:
        if c['id'] == chapter_id:
            for t in c['topics']:
                if t['id'] == topic_id:
                    topic_data = t
                    break

    if not topic_data:
        return jsonify({"error": "Topic not found"}), 404

    questions = topic_data.get('test', [])
    correct = 0
    results = []

    for i, q in enumerate(questions):
        user_ans = answers[i] if i < len(answers) else -1
        is_correct = user_ans == q['answer']
        if is_correct:
            correct += 1
        results.append({
            "question": q['question'],
            "your_answer": user_ans,
            "correct_answer": q['answer'],
            "is_correct": is_correct
        })

    total = len(questions)
    score_percent = round((correct / total * 100), 2) if total > 0 else 0

    if 'test_results' not in users_data[user_id]:
        users_data[user_id]['test_results'] = []

    users_data[user_id]['test_results'].append({
        "id": str(uuid.uuid4()),
        "chapter_id": chapter_id,
        "topic_id": topic_id,
        "topic_name": topic_data['name'],
        "score": score_percent,
        "correct": correct,
        "total": total,
        "taken_at": datetime.now().isoformat()
    })

    return jsonify({
        "message": "Test submitted",
        "score": score_percent,
        "correct": correct,
        "total": total,
        "results": results
    }), 200


@tests_bp.route('/api/tests/results', methods=['GET'])
def get_results():
    user_id = request.args.get('user_id')
    if not user_id or user_id not in users_data:
        return jsonify({"error": "User not found"}), 404

    results = users_data[user_id].get('test_results', [])
    return jsonify({"results": results, "count": len(results)}), 200