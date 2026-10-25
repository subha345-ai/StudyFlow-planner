from datetime import datetime, timedelta

# ═══════════════════════════════════════════════
# MAIN IN-MEMORY STORAGE
# ═══════════════════════════════════════════════
users_data = {}

# ═══════════════════════════════════════════════
# DEMO COURSES — School Students Only (Class 1-12)
# ═══════════════════════════════════════════════
courses_data = [
    # ═══ CLASS 1-5 (Primary) ═══
    {
        "id": 1,
        "course_name": "Class 1",
        "level": "Class 1",
        "stream": "General",
        "school": "Primary School",
        "subjects": ["Bangla", "English", "Mathematics", "General Knowledge"]
    },
    {
        "id": 2,
        "course_name": "Class 2",
        "level": "Class 2",
        "stream": "General",
        "school": "Primary School",
        "subjects": ["Bangla", "English", "Mathematics", "General Knowledge"]
    },
    {
        "id": 3,
        "course_name": "Class 3",
        "level": "Class 3",
        "stream": "General",
        "school": "Primary School",
        "subjects": ["Bangla", "English", "Mathematics", "Science", "General Knowledge"]
    },
    {
        "id": 4,
        "course_name": "Class 4",
        "level": "Class 4",
        "stream": "General",
        "school": "Primary School",
        "subjects": ["Bangla", "English", "Mathematics", "Science", "General Knowledge"]
    },
    {
        "id": 5,
        "course_name": "Class 5",
        "level": "Class 5",
        "stream": "General",
        "school": "Primary School",
        "subjects": ["Bangla", "English", "Mathematics", "Science", "General Knowledge"]
    },

    # ═══ CLASS 6-8 (Junior Secondary) ═══
    {
        "id": 6,
        "course_name": "Class 6",
        "level": "Class 6",
        "stream": "General",
        "school": "High School",
        "subjects": ["Bangla", "English", "Mathematics", "Science", "ICT", "History", "Geography"]
    },
    {
        "id": 7,
        "course_name": "Class 7",
        "level": "Class 7",
        "stream": "General",
        "school": "High School",
        "subjects": ["Bangla", "English", "Mathematics", "Science", "ICT", "History", "Geography"]
    },
    {
        "id": 8,
        "course_name": "Class 8",
        "level": "Class 8",
        "stream": "General",
        "school": "High School",
        "subjects": ["Bangla", "English", "Mathematics", "Science", "ICT", "History", "Geography"]
    },

    # ═══ CLASS 9-10 (Secondary) ═══
    {
        "id": 9,
        "course_name": "Class 9-10 — Science",
        "level": "Class 9",
        "stream": "Science",
        "school": "High School",
        "subjects": ["Bangla", "English", "Mathematics", "Physics", "Chemistry", "Biology", "ICT"]
    },
    {
        "id": 10,
        "course_name": "Class 9-10 — Commerce",
        "level": "Class 9",
        "stream": "Commerce",
        "school": "High School",
        "subjects": ["Bangla", "English", "Mathematics", "Accounting", "Business", "Economics", "ICT"]
    },
    {
        "id": 11,
        "course_name": "Class 9-10 — Arts",
        "level": "Class 9",
        "stream": "Arts",
        "school": "High School",
        "subjects": ["Bangla", "English", "Mathematics", "History", "Geography", "Civics", "ICT"]
    },
    {
        "id": 12,
        "course_name": "Class 10 — Science",
        "level": "Class 10",
        "stream": "Science",
        "school": "High School",
        "subjects": ["Bangla", "English", "Mathematics", "Physics", "Chemistry", "Biology", "ICT"]
    },
    {
        "id": 13,
        "course_name": "Class 10 — Commerce",
        "level": "Class 10",
        "stream": "Commerce",
        "school": "High School",
        "subjects": ["Bangla", "English", "Mathematics", "Accounting", "Business", "Economics", "ICT"]
    },
    {
        "id": 14,
        "course_name": "Class 10 — Arts",
        "level": "Class 10",
        "stream": "Arts",
        "school": "High School",
        "subjects": ["Bangla", "English", "Mathematics", "History", "Geography", "Civics", "ICT"]
    },

    # ═══ CLASS 11-12 (Higher Secondary) ═══
    {
        "id": 15,
        "course_name": "Class 11 — Science",
        "level": "Class 11",
        "stream": "Science",
        "school": "College",
        "subjects": ["Bangla", "English", "Mathematics", "Physics", "Chemistry", "Biology", "ICT"]
    },
    {
        "id": 16,
        "course_name": "Class 11 — Commerce",
        "level": "Class 11",
        "stream": "Commerce",
        "school": "College",
        "subjects": ["Bangla", "English", "Accounting", "Business", "Economics", "ICT"]
    },
    {
        "id": 17,
        "course_name": "Class 11 — Arts",
        "level": "Class 11",
        "stream": "Arts",
        "school": "College",
        "subjects": ["Bangla", "English", "History", "Geography", "Civics", "ICT"]
    },
    {
        "id": 18,
        "course_name": "Class 12 — Science",
        "level": "Class 12",
        "stream": "Science",
        "school": "College",
        "subjects": ["Bangla", "English", "Mathematics", "Physics", "Chemistry", "Biology", "ICT"]
    },
    {
        "id": 19,
        "course_name": "Class 12 — Commerce",
        "level": "Class 12",
        "stream": "Commerce",
        "school": "College",
        "subjects": ["Bangla", "English", "Accounting", "Business", "Economics", "ICT"]
    },
    {
        "id": 20,
        "course_name": "Class 12 — Arts",
        "level": "Class 12",
        "stream": "Arts",
        "school": "College",
        "subjects": ["Bangla", "English", "History", "Geography", "Civics", "ICT"]
    },
]

# ═══════════════════════════════════════════════
# LEVEL-BASED TASK TEMPLATES — Class 1-12
# ═══════════════════════════════════════════════
level_tasks_data = [
    # ═══ CLASS 1-5 (Primary) ═══
    {"level": "Class 1", "subject": "Bangla", "task": "Read + write bornomala", "difficulty": "easy", "time": "20 min"},
    {"level": "Class 1", "subject": "English", "task": "Learn A-Z alphabet", "difficulty": "easy", "time": "20 min"},
    {"level": "Class 1", "subject": "Mathematics", "task": "Count 1-100", "difficulty": "easy", "time": "20 min"},
    
    {"level": "Class 2", "subject": "Bangla", "task": "Read short stories", "difficulty": "easy", "time": "20 min"},
    {"level": "Class 2", "subject": "English", "task": "Learn 50 words", "difficulty": "easy", "time": "25 min"},
    {"level": "Class 2", "subject": "Mathematics", "task": "Addition + subtraction", "difficulty": "easy", "time": "30 min"},
    
    {"level": "Class 3", "subject": "Bangla", "task": "Write composition", "difficulty": "easy", "time": "30 min"},
    {"level": "Class 3", "subject": "English", "task": "Learn grammar basics", "difficulty": "easy", "time": "30 min"},
    {"level": "Class 3", "subject": "Mathematics", "task": "Multiplication tables", "difficulty": "easy", "time": "30 min"},
    {"level": "Class 3", "subject": "Science", "task": "Read chapter + notes", "difficulty": "easy", "time": "30 min"},
    
    {"level": "Class 4", "subject": "Bangla", "task": "Read + write essay", "difficulty": "easy", "time": "40 min"},
    {"level": "Class 4", "subject": "English", "task": "Practice grammar", "difficulty": "medium", "time": "40 min"},
    {"level": "Class 4", "subject": "Mathematics", "task": "Solve 20 problems", "difficulty": "medium", "time": "45 min"},
    {"level": "Class 4", "subject": "Science", "task": "Read + diagram practice", "difficulty": "easy", "time": "30 min"},
    
    {"level": "Class 5", "subject": "Bangla", "task": "Read + summary writing", "difficulty": "medium", "time": "40 min"},
    {"level": "Class 5", "subject": "English", "task": "Essay + comprehension", "difficulty": "medium", "time": "45 min"},
    {"level": "Class 5", "subject": "Mathematics", "task": "Solve chapter exercises", "difficulty": "medium", "time": "45 min"},
    {"level": "Class 5", "subject": "Science", "task": "Read chapter + notes", "difficulty": "easy", "time": "30 min"},

    # ═══ CLASS 6-8 ═══
    {"level": "Class 6", "subject": "Mathematics", "task": "Solve chapter exercises", "difficulty": "medium", "time": "45 min"},
    {"level": "Class 6", "subject": "Science", "task": "Read + make notes", "difficulty": "easy", "time": "40 min"},
    {"level": "Class 6", "subject": "English", "task": "Grammar practice", "difficulty": "medium", "time": "40 min"},
    {"level": "Class 6", "subject": "Bangla", "task": "Read + write", "difficulty": "easy", "time": "40 min"},
    {"level": "Class 6", "subject": "ICT", "task": "Basic computer concepts", "difficulty": "easy", "time": "30 min"},
    
    {"level": "Class 7", "subject": "Mathematics", "task": "Solve chapter exercises", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 7", "subject": "Science", "task": "Read + diagram practice", "difficulty": "medium", "time": "45 min"},
    {"level": "Class 7", "subject": "English", "task": "Grammar + vocabulary", "difficulty": "medium", "time": "45 min"},
    {"level": "Class 7", "subject": "ICT", "task": "MS Office practice", "difficulty": "easy", "time": "40 min"},
    
    {"level": "Class 8", "subject": "Mathematics", "task": "Solve hard problems", "difficulty": "hard", "time": "1.5 hours"},
    {"level": "Class 8", "subject": "Science", "task": "Read + notes + practice", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 8", "subject": "English", "task": "Essay + grammar", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 8", "subject": "ICT", "task": "Programming basics", "difficulty": "medium", "time": "1 hour"},

    # ═══ CLASS 9-10 — SCIENCE ═══
    {"level": "Class 9", "subject": "Mathematics", "task": "Solve Chapter 5 exercises", "difficulty": "medium", "time": "1.5 hours"},
    {"level": "Class 9", "subject": "Physics", "task": "Read chapter + make notes", "difficulty": "easy", "time": "45 min"},
    {"level": "Class 9", "subject": "Physics", "task": "Solve numericals", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 9", "subject": "Chemistry", "task": "Memorize reactions", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 9", "subject": "Biology", "task": "Read diagram-based topics", "difficulty": "easy", "time": "40 min"},
    {"level": "Class 9", "subject": "English", "task": "Write an essay", "difficulty": "easy", "time": "40 min"},
    {"level": "Class 9", "subject": "ICT", "task": "Practice concepts", "difficulty": "easy", "time": "30 min"},

    {"level": "Class 10", "subject": "Mathematics", "task": "Solve previous year questions", "difficulty": "hard", "time": "2 hours"},
    {"level": "Class 10", "subject": "Physics", "task": "Solve numericals + derivations", "difficulty": "hard", "time": "2 hours"},
    {"level": "Class 10", "subject": "Chemistry", "task": "Solve organic problems", "difficulty": "hard", "time": "1.5 hours"},
    {"level": "Class 10", "subject": "Biology", "task": "Read + diagram practice", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 10", "subject": "English", "task": "Essay + comprehension", "difficulty": "medium", "time": "1 hour"},

    # ═══ CLASS 9-10 — COMMERCE ═══
    {"level": "Class 9", "subject": "Accounting", "task": "Solve journal entries", "difficulty": "medium", "time": "1.5 hours"},
    {"level": "Class 9", "subject": "Business", "task": "Read and summarize", "difficulty": "easy", "time": "45 min"},
    {"level": "Class 9", "subject": "Economics", "task": "Practice graphs + concepts", "difficulty": "medium", "time": "1 hour"},

    {"level": "Class 10", "subject": "Accounting", "task": "Solve financial statements", "difficulty": "hard", "time": "2 hours"},
    {"level": "Class 10", "subject": "Business", "task": "Read + notes", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 10", "subject": "Economics", "task": "Practice problems", "difficulty": "medium", "time": "1 hour"},

    # ═══ CLASS 9-10 — ARTS ═══
    {"level": "Class 9", "subject": "History", "task": "Read historical events", "difficulty": "easy", "time": "45 min"},
    {"level": "Class 9", "subject": "Geography", "task": "Practice maps + diagrams", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 9", "subject": "Civics", "task": "Memorize key points", "difficulty": "easy", "time": "30 min"},

    {"level": "Class 10", "subject": "History", "task": "Read + summarize", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 10", "subject": "Geography", "task": "Practice maps", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 10", "subject": "Civics", "task": "Memorize + practice", "difficulty": "medium", "time": "45 min"},

    # ═══ CLASS 11-12 — SCIENCE ═══
    {"level": "Class 11", "subject": "Mathematics", "task": "Solve calculus problems", "difficulty": "hard", "time": "2.5 hours"},
    {"level": "Class 11", "subject": "Physics", "task": "Solve numericals + derivations", "difficulty": "hard", "time": "2 hours"},
    {"level": "Class 11", "subject": "Chemistry", "task": "Memorize reactions", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 11", "subject": "Biology", "task": "Read diagram-based topics", "difficulty": "medium", "time": "1 hour"},

    {"level": "Class 12", "subject": "Mathematics", "task": "Solve calculus problems", "difficulty": "hard", "time": "2.5 hours"},
    {"level": "Class 12", "subject": "Mathematics", "task": "Practice previous year questions", "difficulty": "medium", "time": "1.5 hours"},
    {"level": "Class 12", "subject": "Physics", "task": "Solve numericals + derivations", "difficulty": "hard", "time": "2 hours"},
    {"level": "Class 12", "subject": "Chemistry", "task": "Solve organic problems", "difficulty": "hard", "time": "2 hours"},
    {"level": "Class 12", "subject": "Biology", "task": "Read + diagram practice", "difficulty": "medium", "time": "1 hour"},

    # ═══ CLASS 11-12 — COMMERCE ═══
    {"level": "Class 11", "subject": "Accounting", "task": "Solve financial statements", "difficulty": "medium", "time": "1.5 hours"},
    {"level": "Class 11", "subject": "Business", "task": "Read and summarize", "difficulty": "easy", "time": "45 min"},
    {"level": "Class 11", "subject": "Economics", "task": "Practice graphs", "difficulty": "medium", "time": "1 hour"},

    {"level": "Class 12", "subject": "Accounting", "task": "Solve complex entries", "difficulty": "hard", "time": "2 hours"},
    {"level": "Class 12", "subject": "Business", "task": "Read case studies", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 12", "subject": "Economics", "task": "Practice problems", "difficulty": "medium", "time": "1 hour"},

    # ═══ CLASS 11-12 — ARTS ═══
    {"level": "Class 11", "subject": "History", "task": "Read historical events", "difficulty": "easy", "time": "45 min"},
    {"level": "Class 11", "subject": "Geography", "task": "Practice maps", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 11", "subject": "Civics", "task": "Memorize key points", "difficulty": "easy", "time": "30 min"},

    {"level": "Class 12", "subject": "History", "task": "Read + summarize", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 12", "subject": "Geography", "task": "Practice maps + diagrams", "difficulty": "medium", "time": "1 hour"},
    {"level": "Class 12", "subject": "Civics", "task": "Memorize + practice", "difficulty": "medium", "time": "45 min"},
]


# ═══════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════
def is_user_active(user_id):
    if user_id not in users_data:
        return False
    last = datetime.fromisoformat(users_data[user_id]["last_active"])
    return datetime.now() - last < timedelta(minutes=30)


def clean_inactive_users():
    to_delete = []
    for user_id, data in users_data.items():
        last = datetime.fromisoformat(data["last_active"])
        if datetime.now() - last > timedelta(minutes=30):
            to_delete.append(user_id)
    for user_id in to_delete:
        del users_data[user_id]
    return len(to_delete)


def touch_user(user_id):
    if user_id in users_data:
        users_data[user_id]["last_active"] = datetime.now().isoformat()


# ═══════════════════════════════════════════════
# CHAPTER DATA — Class 1-12
# ═══════════════════════════════════════════════
chapters_data = [
    # ═══ CLASS 1 ═══
    {
        "id": 1, "subject": "Bangla", "level": "Class 1", "chapter": "Chapter 1 — Bornomala",
        "difficulty": "easy",
        "topics": [
            {"id": "swarabarna", "name": "Swarabarna", "tasks": ["Learn 11 swarabarna", "Write each letter 5 times"], "test": [
                {"question": "Koto ti swarabarna ache?", "options": ["10", "11", "12", "13"], "answer": 1}
            ]}
        ]
    },
    {
        "id": 2, "subject": "Mathematics", "level": "Class 1", "chapter": "Chapter 1 — Numbers",
        "difficulty": "easy",
        "topics": [
            {"id": "counting", "name": "Counting 1-100", "tasks": ["Count 1-50 aloud", "Write 1-100"], "test": [
                {"question": "10 er por koto?", "options": ["9", "11", "12", "20"], "answer": 1}
            ]}
        ]
    },
    {
        "id": 3, "subject": "English", "level": "Class 1", "chapter": "Chapter 1 — Alphabet",
        "difficulty": "easy",
        "topics": [
            {"id": "abc", "name": "A-Z Letters", "tasks": ["Learn A-Z", "Write A-Z 5 times"], "test": [
                {"question": "How many letters in English?", "options": ["24", "25", "26", "27"], "answer": 2}
            ]}
        ]
    },

    # ═══ CLASS 2 ═══
    {
        "id": 4, "subject": "Mathematics", "level": "Class 2", "chapter": "Chapter 1 — Addition",
        "difficulty": "easy",
        "topics": [
            {"id": "add", "name": "Addition 1-100", "tasks": ["Add 2-digit numbers", "Solve 20 problems"], "test": [
                {"question": "5 + 7 = ?", "options": ["10", "11", "12", "13"], "answer": 2}
            ]}
        ]
    },

    # ═══ CLASS 6 ═══
    {
        "id": 5, "subject": "Mathematics", "level": "Class 6", "chapter": "Chapter 1 — Integers",
        "difficulty": "medium",
        "topics": [
            {"id": "int", "name": "Positive & Negative Numbers", "tasks": ["Learn integer rules", "Solve 15 problems"], "test": [
                {"question": "-5 + 3 = ?", "options": ["-8", "-2", "2", "8"], "answer": 1}
            ]}
        ]
    },
    {
        "id": 6, "subject": "Science", "level": "Class 6", "chapter": "Chapter 1 — Living Things",
        "difficulty": "easy",
        "topics": [
            {"id": "living", "name": "Characteristics of Life", "tasks": ["Read chapter", "Make notes"], "test": [
                {"question": "Which is a living thing?", "options": ["Rock", "Tree", "Water", "Air"], "answer": 1}
            ]}
        ]
    },

    # ═══ CLASS 9 ═══
    {
        "id": 7, "subject": "Physics", "level": "Class 9", "chapter": "Chapter 1 — Motion",
        "difficulty": "medium",
        "topics": [
            {"id": "speed", "name": "Speed & Velocity", "tasks": ["Learn formulas", "Solve 10 numericals"], "test": [
                {"question": "Unit of speed?", "options": ["m/s", "kg", "N", "J"], "answer": 0}
            ]}
        ]
    },
    {
        "id": 8, "subject": "Chemistry", "level": "Class 9", "chapter": "Chapter 1 — Matter",
        "difficulty": "easy",
        "topics": [
            {"id": "states", "name": "States of Matter", "tasks": ["Learn 3 states", "Draw diagrams"], "test": [
                {"question": "How many states of matter?", "options": ["2", "3", "4", "5"], "answer": 1}
            ]}
        ]
    },
    {
        "id": 9, "subject": "Mathematics", "level": "Class 9", "chapter": "Chapter 1 — Real Numbers",
        "difficulty": "medium",
        "topics": [
            {"id": "real", "name": "Rational & Irrational", "tasks": ["Learn types", "Solve problems"], "test": [
                {"question": "√2 is?", "options": ["Rational", "Irrational", "Integer", "Natural"], "answer": 1}
            ]}
        ]
    },

    # ═══ CLASS 10 ═══
    {
        "id": 10, "subject": "Physics", "level": "Class 10", "chapter": "Chapter 1 — Electricity",
        "difficulty": "medium",
        "topics": [
            {"id": "ohm", "name": "Ohm's Law", "tasks": ["Learn V=IR", "Solve 15 problems"], "test": [
                {"question": "Ohm's law formula?", "options": ["V=IR", "V=I/R", "V=R/I", "I=VR"], "answer": 0}
            ]}
        ]
    },
    {
        "id": 11, "subject": "Mathematics", "level": "Class 10", "chapter": "Chapter 1 — Quadratic Equations",
        "difficulty": "hard",
        "topics": [
            {"id": "quad", "name": "Solving Quadratics", "tasks": ["Learn formula", "Solve 10 equations"], "test": [
                {"question": "Quadratic formula?", "options": ["x=(-b±√(b²-4ac))/2a", "x=b/2a", "x=-b/2a", "None"], "answer": 0}
            ]}
        ]
    },

    # ═══ CLASS 11-12 — SCIENCE ═══
    {
        "id": 12, "subject": "Mathematics", "level": "Class 11", "chapter": "Chapter 3 — Trigonometry",
        "difficulty": "medium",
        "topics": [
            {"id": "ratios", "name": "Trigonometric Ratios", "tasks": ["Learn sin/cos/tan", "Memorize unit circle", "Solve 10 problems"], "test": [
                {"question": "sin(90°) = ?", "options": ["0", "1", "-1", "1/2"], "answer": 1},
                {"question": "cos(0°) = ?", "options": ["0", "1", "-1", "1/2"], "answer": 1}
            ]},
            {"id": "identities", "name": "Identities", "tasks": ["Learn identities", "Prove sin²+cos²=1"], "test": [
                {"question": "sin²θ + cos²θ = ?", "options": ["0", "1", "2", "sin θ"], "answer": 1}
            ]}
        ]
    },
    {
        "id": 13, "subject": "Physics", "level": "Class 11", "chapter": "Chapter 1 — Vectors",
        "difficulty": "medium",
        "topics": [
            {"id": "vec", "name": "Vector Basics", "tasks": ["Learn vector addition", "Solve 10 problems"], "test": [
                {"question": "Vector has?", "options": ["Only magnitude", "Only direction", "Both", "None"], "answer": 2}
            ]}
        ]
    },
    {
        "id": 14, "subject": "Chemistry", "level": "Class 11", "chapter": "Chapter 2 — Periodic Table",
        "difficulty": "medium",
        "topics": [
            {"id": "groups", "name": "Groups & Periods", "tasks": ["Learn groups", "Memorize 20 elements"], "test": [
                {"question": "How many groups?", "options": ["16", "17", "18", "20"], "answer": 2},
                {"question": "Group 1 = ?", "options": ["Alkali metals", "Halogens", "Noble gases", "None"], "answer": 0}
            ]}
        ]
    },
    {
        "id": 15, "subject": "Biology", "level": "Class 11", "chapter": "Chapter 1 — Cell",
        "difficulty": "easy",
        "topics": [
            {"id": "cell", "name": "Cell Structure", "tasks": ["Read chapter", "Draw cell diagram"], "test": [
                {"question": "Powerhouse of cell?", "options": ["Nucleus", "Mitochondria", "Ribosome", "None"], "answer": 1}
            ]}
        ]
    },
    {
        "id": 16, "subject": "Mathematics", "level": "Class 12", "chapter": "Chapter 5 — Calculus",
        "difficulty": "hard",
        "topics": [
            {"id": "limits", "name": "Limits", "tasks": ["Read theory", "Solve 5 examples"], "test": [
                {"question": "lim(x→2) x² = ?", "options": ["2", "4", "8", "1"], "answer": 1}
            ]},
            {"id": "derivatives", "name": "Derivatives", "tasks": ["Learn rules", "Solve 10 problems"], "test": [
                {"question": "d/dx (x²) = ?", "options": ["x", "2x", "x²", "2"], "answer": 1}
            ]},
            {"id": "integration", "name": "Integration", "tasks": ["Learn basics", "Solve 10 integrals"], "test": [
                {"question": "∫ x dx = ?", "options": ["x²", "x²/2 + C", "2x + C", "x + C"], "answer": 1}
            ]}
        ]
    },
    {
        "id": 17, "subject": "Physics", "level": "Class 12", "chapter": "Chapter 1 — Electrostatics",
        "difficulty": "hard",
        "topics": [
            {"id": "charge", "name": "Electric Charge", "tasks": ["Read about charges", "Learn Coulomb's law"], "test": [
                {"question": "Unit of charge?", "options": ["Volt", "Coulomb", "Ampere", "Ohm"], "answer": 1}
            ]},
            {"id": "field", "name": "Electric Field", "tasks": ["Understand field", "Learn formulas"], "test": [
                {"question": "E = ?", "options": ["F/q", "F·q", "q/F", "F+q"], "answer": 0}
            ]}
        ]
    },
    {
        "id": 18, "subject": "Chemistry", "level": "Class 12", "chapter": "Chapter 1 — Organic Chemistry",
        "difficulty": "hard",
        "topics": [
            {"id": "hydro", "name": "Hydrocarbons", "tasks": ["Learn types", "Memorize reactions"], "test": [
                {"question": "CH₄ is?", "options": ["Methane", "Ethane", "Propane", "Butane"], "answer": 0}
            ]}
        ]
    },
    {
        "id": 19, "subject": "Biology", "level": "Class 12", "chapter": "Chapter 1 — Reproduction",
        "difficulty": "medium",
        "topics": [
            {"id": "repro", "name": "Human Reproduction", "tasks": ["Read chapter", "Draw diagrams"], "test": [
                {"question": "Male gamete?", "options": ["Egg", "Sperm", "Zygote", "None"], "answer": 1}
            ]}
        ]
    },

    # ═══ CLASS 11-12 — COMMERCE ═══
    {
        "id": 20, "subject": "Accounting", "level": "Class 11", "chapter": "Chapter 1 — Journal Entries",
        "difficulty": "medium",
        "topics": [
            {"id": "dc", "name": "Debit & Credit", "tasks": ["Learn rules", "Practice 10 entries"], "test": [
                {"question": "Debit increases?", "options": ["Assets", "Liabilities", "Capital", "None"], "answer": 0}
            ]}
        ]
    },
    {
        "id": 21, "subject": "Business", "level": "Class 11", "chapter": "Chapter 1 — Business Basics",
        "difficulty": "easy",
        "topics": [
            {"id": "biz", "name": "Types of Business", "tasks": ["Read chapter", "Make notes"], "test": [
                {"question": "Sole proprietorship has how many owners?", "options": ["1", "2", "3", "Many"], "answer": 0}
            ]}
        ]
    },
    {
        "id": 22, "subject": "Economics", "level": "Class 11", "chapter": "Chapter 1 — Demand & Supply",
        "difficulty": "medium",
        "topics": [
            {"id": "ds", "name": "Demand Curve", "tasks": ["Learn law of demand", "Draw graphs"], "test": [
                {"question": "Demand curve slopes?", "options": ["Upward", "Downward", "Flat", "Vertical"], "answer": 1}
            ]}
        ]
    },

    # ═══ CLASS 11-12 — ARTS ═══
    {
        "id": 23, "subject": "History", "level": "Class 11", "chapter": "Chapter 1 — Ancient History",
        "difficulty": "easy",
        "topics": [
            {"id": "ancient", "name": "Indus Valley", "tasks": ["Read chapter", "Make timeline"], "test": [
                {"question": "Indus Valley civilization was in?", "options": ["India/Pakistan", "China", "Egypt", "None"], "answer": 0}
            ]}
        ]
    },
    {
        "id": 24, "subject": "Geography", "level": "Class 11", "chapter": "Chapter 1 — Earth",
        "difficulty": "easy",
        "topics": [
            {"id": "earth", "name": "Structure of Earth", "tasks": ["Read chapter", "Draw diagram"], "test": [
                {"question": "How many layers of Earth?", "options": ["2", "3", "4", "5"], "answer": 1}
            ]}
        ]
    },
    {
        "id": 25, "subject": "Civics", "level": "Class 11", "chapter": "Chapter 1 — Government",
        "difficulty": "easy",
        "topics": [
            {"id": "gov", "name": "Types of Government", "tasks": ["Read chapter", "Make notes"], "test": [
                {"question": "Democracy means?", "options": ["Rule by king", "Rule by people", "Rule by army", "None"], "answer": 1}
            ]}
        ]
    },
]


# ═══════════════════════════════════════════════
# QUESTIONS BANK (Optional — for pre-defined)
# ═══════════════════════════════════════════════
questions_bank = {}


def get_questions(subject, level, chapter, topic):
    key = f"{subject}-{level}-{chapter}"
    if key in questions_bank:
        return questions_bank[key].get(topic, [])
    return []


# ═══════════════════════════════════════════════
# TASK PROGRESS TRACKING
# ═══════════════════════════════════════════════
def update_task_progress(user_id, task_id, practice_score=None, final_score=None):
    if user_id not in users_data:
        return None

    user = users_data[user_id]
    for task in user.get('tasks', []):
        if task['id'] == task_id:
            if 'practice_score' not in task:
                task['practice_score'] = 0
            if 'final_score' not in task:
                task['final_score'] = 0
            if 'progress' not in task:
                task['progress'] = 0

            if practice_score is not None:
                task['practice_score'] = practice_score
                if practice_score >= 90:
                    task['progress'] = 90
                else:
                    task['progress'] = round(practice_score * 0.9, 2)

            if final_score is not None:
                task['final_score'] = final_score
                if final_score >= 70:
                    task['progress'] = 100
                    task['completed'] = True

            return task
    return None


# ═══════════════════════════════════════════════
# ADMIN USER — Fixed credentials
# ═══════════════════════════════════════════════
#  not fixed#
# ═══════════════════════════════════════════════
# ADMIN CREDENTIALS
# ═══════════════════════════════════════════════
admin_data = {
    "email": "admin@studyflow.com",
    "password": "#subha@",
    "name": "Admin",
    "role": "super_admin"
}