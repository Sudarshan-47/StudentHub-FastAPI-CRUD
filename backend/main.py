
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI(
    title="StudentHub API",
    description="Student Management REST API",
    version="1.0.0"
)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE = "students.db"


# -----------------------------
# Database connection
# -----------------------------

def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            course TEXT NOT NULL,
            year INTEGER NOT NULL
        )
    """)

    connection.commit()
    connection.close()


init_db()


# -----------------------------
# Request data validation
# -----------------------------

class StudentCreate(BaseModel):
    name: str
    email: str
    course: str
    year: int


class StudentUpdate(BaseModel):
    name: str
    email: str
    course: str
    year: int


# -----------------------------
# GET: Read all students
# -----------------------------

@app.get("/students")
def get_students():
    connection = get_connection()

    students = connection.execute(
        "SELECT * FROM students ORDER BY id DESC"
    ).fetchall()

    connection.close()

    return [dict(student) for student in students]


# -----------------------------
# GET: Read one student
# -----------------------------

@app.get("/students/{student_id}")
def get_student(student_id: int):
    connection = get_connection()

    student = connection.execute(
        "SELECT * FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()

    connection.close()

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return dict(student)


# -----------------------------
# POST: Create student
# -----------------------------

@app.post("/students", status_code=201)
def create_student(student: StudentCreate):
    connection = get_connection()

    try:
        cursor = connection.execute(
            """
            INSERT INTO students
            (name, email, course, year)
            VALUES (?, ?, ?, ?)
            """,
            (
                student.name,
                student.email,
                student.course,
                student.year
            )
        )

        connection.commit()

        new_student = connection.execute(
            "SELECT * FROM students WHERE id = ?",
            (cursor.lastrowid,)
        ).fetchone()

        return {
            "message": "Student created successfully",
            "student": dict(new_student)
        }

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    finally:
        connection.close()


# -----------------------------
# PUT: Update student
# -----------------------------

@app.put("/students/{student_id}")
def update_student(
    student_id: int,
    student: StudentUpdate
):
    connection = get_connection()

    existing = connection.execute(
        "SELECT * FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()

    if existing is None:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    try:
        connection.execute(
            """
            UPDATE students
            SET name = ?,
                email = ?,
                course = ?,
                year = ?
            WHERE id = ?
            """,
            (
                student.name,
                student.email,
                student.course,
                student.year,
                student_id
            )
        )

        connection.commit()

        updated = connection.execute(
            "SELECT * FROM students WHERE id = ?",
            (student_id,)
        ).fetchone()

        return {
            "message": "Student updated successfully",
            "student": dict(updated)
        }

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    finally:
        connection.close()


# -----------------------------
# DELETE: Delete student
# -----------------------------

@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    connection = get_connection()

    cursor = connection.execute(
        "DELETE FROM students WHERE id = ?",
        (student_id,)
    )

    connection.commit()
    connection.close()

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student deleted successfully"
    }


# -----------------------------
# Root endpoint
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to StudentHub API"
    }