# routes/tasks.py
from flask import Blueprint, request, jsonify
from storage import users_data, level_tasks_data, touch_user, update_task_progress
import uuid
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)


# ⭐ Level onujayi task generate
@tasks_bp.route('/api/level-tasks', methods=['GET'])
def get_level_tasks():
    level = request.args.get('level', '').lower()
    difficulty = request.args.get('difficulty', '').lower()
    
    if not level:
        return jsonify({"error": "Level required"}), 400
    
    results = []
    for t in level_tasks_data:
        if level not in t['level'].lower():
            continue
        if difficulty and difficulty != t['difficulty']:
            continue
        results.append(t)
    
    return jsonify({
        "level": level,
        "difficulty": difficulty or "all",
        "tasks": results,
        "count": len(results)
    }), 200


# ⭐ Auto generate tasks for user
@tasks_bp.route('/api/generate-tasks', methods=['POST'])
def generate_tasks():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    user_id = data.get('user_id')
    difficulty = data.get('difficulty', 'medium').lower()
    
    if not user_id or user_id not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    user = users_data[user_id]
    user_level = user.get('level')
    
    if not user_level:
        return jsonify({"error": "Set your profile first (level)"}), 400
    
    generated = []
    for t in level_tasks_data:
        if user_level.lower() not in t['level'].lower():
            continue
        if t['difficulty'] != difficulty:
            continue
        
        new_task = {
            "id": str(uuid.uuid4()),
            "subject": t['subject'],
            "target": t['task'],
            "difficulty": t['difficulty'],
            "time": t['time'],
            "completed": False,
            "progress": 0,
            "practice_score": 0,
            "final_score": 0,
            "created_at": datetime.now().isoformat()
        }
        user['tasks'].append(new_task)
        generated.append(new_task)
    
    touch_user(user_id)
    
    return jsonify({
        "message": f"Generated {len(generated)} tasks",
        "tasks": generated
    }), 201


# ⭐ Get all tasks
@tasks_bp.route('/api/tasks', methods=['GET'])
def get_tasks():
    user_id = request.args.get('user_id')
    if not user_id or user_id not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    touch_user(user_id)
    return jsonify({
        "tasks": users_data[user_id]['tasks'],
        "count": len(users_data[user_id]['tasks'])
    }), 200


# ⭐ Add custom task
@tasks_bp.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    user_id = data.get('user_id')
    if not user_id or user_id not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    subject = data.get('subject')
    target = data.get('target')
    difficulty = data.get('difficulty', 'medium')
    
    if not subject or not target:
        return jsonify({"error": "Subject and target required"}), 400
    
    new_task = {
        "id": str(uuid.uuid4()),
        "subject": subject,
        "target": target,
        "difficulty": difficulty,
        "completed": False,
        "progress": 0,
        "practice_score": 0,
        "final_score": 0,
        "created_at": datetime.now().isoformat()
    }
    users_data[user_id]['tasks'].append(new_task)
    touch_user(user_id)
    
    return jsonify({
        "message": "Task added",
        "task": new_task
    }), 201


# ⭐ Toggle complete
@tasks_bp.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    user_id = data.get('user_id')
    if not user_id or user_id not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    for t in users_data[user_id]['tasks']:
        if t['id'] == task_id:
            t['completed'] = data.get('completed', t['completed'])
            touch_user(user_id)
            return jsonify({"message": "Task updated", "task": t}), 200
    
    return jsonify({"error": "Task not found"}), 404


# ⭐ Delete task
@tasks_bp.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    user_id = request.args.get('user_id')
    if not user_id or user_id not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    tasks = users_data[user_id]['tasks']
    for i, t in enumerate(tasks):
        if t['id'] == task_id:
            del tasks[i]
            touch_user(user_id)
            return jsonify({"message": "Task deleted"}), 200
    
    return jsonify({"error": "Task not found"}), 404


# ⭐ UPDATE TASK PROGRESS (Practice/Final) — NEW!
@tasks_bp.route('/api/tasks/<task_id>/progress', methods=['PUT', 'OPTIONS'])
def update_progress(task_id):
    if request.method == 'OPTIONS':
        return jsonify({"message": "OK"}), 200
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    user_id = data.get('user_id')
    practice_score = data.get('practice_score')
    final_score = data.get('final_score')
    
    if not user_id:
        return jsonify({"error": "user_id required"}), 400
    
    print(f"🔍 Progress: task={task_id}, user={user_id}, practice={practice_score}, final={final_score}")
    
    task = update_task_progress(user_id, task_id, practice_score, final_score)
    
    if not task:
        print(f"❌ Task not found: {task_id}")
        return jsonify({"error": "Task not found"}), 404
    
    print(f"✅ Updated: {task}")
    return jsonify({"message": "Progress updated", "task": task}), 200


# ⭐ Overall Progress
@tasks_bp.route('/api/progress', methods=['GET'])
def progress():
    user_id = request.args.get('user_id')
    if not user_id or user_id not in users_data:
        return jsonify({"error": "User not found"}), 404
    
    tasks = users_data[user_id]['tasks']
    total = len(tasks)
    done = sum(1 for t in tasks if t['completed'])
    percent = round((done / total * 100), 2) if total > 0 else 0
    
    return jsonify({
        "total": total,
        "completed": done,
        "pending": total - done,
        "progress_percent": percent
    }), 200