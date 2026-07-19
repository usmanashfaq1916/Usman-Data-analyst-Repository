"""
Generate programs for all universities that currently have 0 programs.
Uses batch inserts for performance.
"""

import os
import hashlib
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

PROGRAM_TEMPLATES = {
    "engineering": [
        ("BS Computer Science", "BS", "Computer Science", 60, 4),
        ("BS Electrical Engineering", "BS", "Engineering", 55, 4),
        ("BS Mechanical Engineering", "BS", "Engineering", 55, 4),
    ],
    "medical": [
        ("MBBS", "MBBS", "Medical", 75, 5),
        ("BS Nursing", "BS", "Medical", 55, 4),
        ("BS Pharmacy", "BS", "Medical", 60, 4),
    ],
    "agriculture": [
        ("BS Agriculture", "BS", "Agriculture", 50, 4),
        ("BS Food Science", "BS", "Agriculture", 50, 4),
        ("BS Environmental Science", "BS", "Science", 50, 4),
    ],
    "business": [
        ("BBA", "BS", "Business", 50, 4),
        ("BS Accounting & Finance", "BS", "Business", 50, 4),
        ("BS Economics", "BS", "Business", 50, 4),
    ],
    "general": [
        ("BS Computer Science", "BS", "Computer Science", 50, 4),
        ("BS Business Administration", "BS", "Business", 50, 4),
        ("BS English", "BS", "Arts", 45, 4),
    ],
    "law": [
        ("LLB", "BS", "Law", 55, 5),
        ("BS Criminology", "BS", "Law", 45, 4),
    ],
    "arts": [
        ("BS Fine Arts", "BS", "Arts", 45, 4),
        ("BS Media Studies", "BS", "Arts", 45, 4),
        ("BS Psychology", "BS", "Arts", 50, 4),
    ],
}


def guess_template(name, uni_type):
    name_lower = name.lower()
    if any(k in name_lower for k in ["engineer", "technology", "tech", "uet", "nust", "ned", "giki", "fast"]):
        return "engineering"
    if any(k in name_lower for k in ["medical", "health", "dental", "nursing", "pharma", "hospital"]):
        return "medical"
    if any(k in name_lower for k in ["agriculture", "agricultural", "food"]):
        return "agriculture"
    if any(k in name_lower for k in ["business", "management", "commerce", "iba", "lums"]):
        return "business"
    if any(k in name_lower for k in ["law", "legal"]):
        return "law"
    if any(k in name_lower for k in ["art", "music", "design", "fashion", "culture"]):
        return "arts"
    if any(k in name_lower for k in ["education", "teacher", "training"]):
        return "general"
    return "business" if uni_type == "PRIVATE" else "general"


def make_program_slug(uni_slug, prog_name):
    h = hashlib.md5(f"{uni_slug}-{prog_name}".encode()).hexdigest()[:12]
    return f"{uni_slug[:30]}-{h}"


def main():
    print("Connecting...")
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cursor.execute("""
        SELECT u.id, u.name, u.slug, u.type
        FROM "University" u
        WHERE NOT EXISTS (SELECT 1 FROM "Program" p WHERE p."universityId" = u.id)
        ORDER BY u.name
    """)
    unis = cursor.fetchall()
    print(f"Universities needing programs: {len(unis)}")

    if not unis:
        print("All universities already have programs!")
        cursor.close()
        conn.close()
        return

    values = []
    for uni in unis:
        template_key = guess_template(uni["name"], uni["type"])
        for prog_name, degree, field, agg, dur in PROGRAM_TEMPLATES[template_key]:
            prog_slug = make_program_slug(uni["slug"], prog_name)
            prog_id = f"pr{hashlib.md5(prog_slug.encode()).hexdigest()[:24]}"
            values.append(
                f"('{prog_id}', '{uni['id']}', '{prog_name.replace(chr(39), chr(39)+chr(39))}', "
                f"'{prog_slug}', '{degree}', '{field}', {agg}, NULL, {dur}, TRUE, NOW(), NOW())"
            )

    print(f"Generating {len(values)} programs...")

    batch_size = 500
    for i in range(0, len(values), batch_size):
        batch = values[i:i + batch_size]
        sql = f"""
            INSERT INTO "Program"
                ("id", "universityId", "name", "slug", "degreeLevel", "field",
                 "minAggregate", "semesterFee", "duration", "isAvailable",
                 "createdAt", "updatedAt")
            VALUES {','.join(batch)}
            ON CONFLICT DO NOTHING;
        """
        cursor.execute(sql)
        conn.commit()
        print(f"  Inserted batch {i//batch_size + 1}/{(len(values)-1)//batch_size + 1}")

    cursor.execute('SELECT COUNT(*) as total FROM "Program"')
    print(f"Total programs: {cursor.fetchone()['total']}")

    cursor.execute("""
        SELECT COUNT(*) FROM "University" u
        WHERE NOT EXISTS (SELECT 1 FROM "Program" p WHERE p."universityId" = u.id)
    """)
    print(f"Still zero programs: {cursor.fetchone()['count']}")

    cursor.close()
    conn.close()
    print("Done!")


if __name__ == "__main__":
    main()
