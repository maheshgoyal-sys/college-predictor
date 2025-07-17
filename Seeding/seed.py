import random
import json
from faker import Faker
from datetime import datetime, timedelta
import os

fake = Faker()
Faker.seed(42)
random.seed(42)

# Constants for enums
EXAMS = ['JEE Main', 'JEE Advanced', 'CUET', 'WBJEE']
CATEGORIES = ['GEN', 'EWS', 'OBC', 'SC', 'ST']
GENDERS = ['Male', 'Female', 'Other']
COLLEGE_TYPES = ['IIT', 'NIT', 'IIIT', 'GFTI', 'Private']
DEGREES = ['B.Tech', 'B.E', 'B.Arch', 'B.Plan']
QUOTAS = ['AI', 'HS', 'OS', 'GO']
SEAT_TYPES = ['Gender-Neutral', 'Female-Only']
ROLES = ['superadmin', 'moderator']

# Dummy ObjectId generator
def fake_object_id():
    return fake.sha1(raw_output=False)[:24]

# Generate Admins
admins = [{
    "_id": fake_object_id(),
    "username": fake.user_name(),
    "password": fake.password(),
    "role": random.choice(ROLES),
    "createdAt": fake.date_time_this_decade().isoformat()
} for _ in range(100)]

# Generate Students
students = [{
    "_id": fake_object_id(),
    "name": fake.name(),
    "email": fake.email(),
    "phone": f"{random.randint(6, 9)}{random.randint(100000000, 999999999)}",
    "exam": random.choice(EXAMS),
    "rank": random.randint(1, 100000),
    "category": random.choice(CATEGORIES),
    "homeState": fake.state(),
    "gender": random.choice(GENDERS),
    "isActive": random.choice([True, False]),
    "lastLoginAt": fake.date_time_this_year().isoformat(),
    "lastLogoutAt": fake.date_time_this_year().isoformat(),
} for _ in range(100)]

# Generate Counsellings
counsellings = [{
    "_id": fake_object_id(),
    "name": f"{exam} Counselling {year}",
    "year": year,
    "exam": exam,
    "description": fake.sentence()
} for exam in EXAMS for year in range(2023, 2024)]

# Generate Colleges
colleges = [{
    "_id": fake_object_id(),
    "name": f"{fake.city()} Institute of Technology",
    "code": fake.bothify(text='COL###'),
    "city": fake.city(),
    "state": fake.state(),
    "type": random.choice(COLLEGE_TYPES),
    "university": f"{fake.company()} University",
    "isAutonomous": fake.boolean()
} for _ in range(100)]

# Generate Branches
branches = [{
    "_id": fake_object_id(),
    "name": f"{random.choice(['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'ECE'])} Engineering",
    "code": fake.bothify(text='BR###'),
    "degree": random.choice(DEGREES),
    "duration": random.choice([4, 5])
} for _ in range(100)]

# Generate Cutoffs
cutoffs = [{
    "_id": fake_object_id(),
    "counsellingId": random.choice(counsellings)["_id"],
    "year": 2023,
    "round": random.randint(1, 6),
    "collegeId": random.choice(colleges)["_id"],
    "branchId": random.choice(branches)["_id"],
    "category": random.choice(CATEGORIES),
    "quota": random.choice(QUOTAS),
    "seatType": random.choice(SEAT_TYPES),
    "openingRank": random.randint(1, 50000),
    "closingRank": random.randint(50001, 100000)
} for _ in range(100)]

# Generate Predictions
predictions = [{
    "_id": fake_object_id(),
    "studentId": random.choice(students)["_id"],
    "counsellingId": random.choice(counsellings)["_id"],
    "predictionDate": fake.date_time_this_year().isoformat(),
    "predictedColleges": [{
        "collegeId": random.choice(colleges)["_id"],
        "branchId": random.choice(branches)["_id"],
        "round": random.randint(1, 6),
        "category": random.choice(CATEGORIES),
        "closingRank": random.randint(5000, 100000),
        "predictedChance": round(random.uniform(0, 1), 2)
    } for _ in range(random.randint(1, 5))]
} for _ in range(100)]

# Prepare final JSON object
seed_data = {
    "admins": admins,
    "students": students,
    "counsellings": counsellings,
    "colleges": colleges,
    "branches": branches,
    "cutoffs": cutoffs,
    "predictions": predictions
}

# Create the directory if it doesn't exist
output_dir = r"E:\College Predictor\Seeding"
os.makedirs(output_dir, exist_ok=True)

# Define full path
output_path = os.path.join(output_dir, "college_predictor_seed_data.json")

# Write to file
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(seed_data, f, indent=2)

print(f"✅ Seed file saved to: {output_path}")




################################

