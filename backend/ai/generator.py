import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv('GROQ_API_KEY'))


def generate_questions(subject, level, chapter, topic, num_questions=5):
    """Generate MCQ questions using Groq AI"""
    text = ""
    try:
        prompt = f"""Generate exactly {num_questions} multiple choice questions (MCQs) for:
Subject: {subject}
Level: {level}
Chapter: {chapter}
Topic: {topic}

Return ONLY a valid JSON array. No explanation, no markdown, no code blocks.
Format:
[
  {{
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Brief explanation why this is correct"
  }}
]

Note: "answer" is the index (0-3) of the correct option.
Make questions appropriate for {level} level.
Return ONLY the JSON array, nothing else.
"""

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a quiz generator. You ONLY return valid JSON arrays. No markdown, no explanations, just pure JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="openai/gpt-oss-120b",
            temperature=0.7,
            max_tokens=2000,
        )

        text = response.choices[0].message.content.strip()

        # Clean markdown if present
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()

        # Find JSON array
        start = text.find('[')
        end = text.rfind(']') + 1
        if start != -1 and end > start:
            text = text[start:end]

        questions = json.loads(text)
        return questions

    except json.JSONDecodeError as e:
        print(f"❌ JSON Error: {e}")
        print(f"Raw response: {text[:500]}")
        return []
    except Exception as e:
        print(f"❌ AI Error type: {type(e).__name__}")
        print(f"❌ AI Error: {e}")
        return []