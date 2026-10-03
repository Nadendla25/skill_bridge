
import os
import logging
from functools import wraps

import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS

# The OpenAI package is optional at runtime; it's only required when
# the AI assistant feature is enabled in a configured environment.
try:
    from openai import OpenAI  # type: ignore[import-not-found]
except ImportError:
    OpenAI = None


app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)


# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

def get_db_connection():
    """
    Configure these environment variables to match
    your SQL Server Express installation.
    """
    server = os.getenv("DB_SERVER", r".\SQLEXPRESS")
    database = os.getenv("DB_NAME", "SkillBridge")
    username = os.getenv("DB_USERNAME")
    password = os.getenv("DB_PASSWORD")

    if username and password:
        connection_string = (
            "DRIVER={ODBC Driver 17 for SQL Server};"
            f"SERVER={server};DATABASE={database};"
            f"UID={username};PWD={password};"
            "TrustServerCertificate=yes;"
        )
    else:
        connection_string = (
            "DRIVER={ODBC Driver 17 for SQL Server};"
            f"SERVER={server};DATABASE={database};"
            "Trusted_Connection=yes;"
            "TrustServerCertificate=yes;"
        )

    return pyodbc.connect(connection_string, timeout=5)


def query_database(sql, params=(), fetch="all"):
    """Run a parameterized SQL query."""
    connection = get_db_connection()

    try:
        cursor = connection.cursor()
        cursor.execute(sql, params)

        if fetch == "one":
            row = cursor.fetchone()
            return dict(row) if row else None

        if fetch == "all":
            columns = [column[0] for column in cursor.description]
            return [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]

        connection.commit()
        return True

    finally:
        connection.close()


def error_response(message, status=500):
    return jsonify({"error": message}), status


# --------------------------------------------------
# BASIC ROUTES
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to SkillBridge API",
        "status": "running"
    })


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({
        "message": "Hello from SkillBridge backend!"
    })


@app.route("/api/test-db", methods=["GET"])
def test_db():
    try:
        query_database("SELECT 1 AS result", fetch="one")
        return jsonify({
            "message": "Database connection successful"
        })
    except Exception:
        app.logger.exception("Database connection failed")
        return error_response(
            "Database connection failed. Check SQL Server configuration.",
            503
        )


# --------------------------------------------------
# REGISTER
# IMPORTANT:
# Adjust Users and column names to match your schema.
# Passwords should be stored as hashes in production.
# --------------------------------------------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not name or not email or not password:
        return error_response(
            "Name, email and password are required.", 400
        )

    try:
        from werkzeug.security import generate_password_hash

        password_hash = generate_password_hash(password)

        query_database(
            """
            INSERT INTO Users (name, email, password)
            VALUES (?, ?, ?)
            """,
            (name, email, password_hash),
            fetch="none"
        )

        return jsonify({
            "message": "Registration successful"
        }), 201

    except pyodbc.IntegrityError:
        return error_response("This email may already be registered.", 409)
    except Exception:
        app.logger.exception("Registration failed")
        return error_response(
            "Registration failed. Check Users table and its column names."
        )


# --------------------------------------------------
# LOGIN
# --------------------------------------------------

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not email or not password:
        return error_response("Email and password are required.", 400)

    try:
        from werkzeug.security import check_password_hash

        user = query_database(
            """
            SELECT id, name, email, password
            FROM Users
            WHERE email = ?
            """,
            (email,),
            fetch="one"
        )

        if not user or not check_password_hash(
            user["password"], password
        ):
            return error_response("Invalid email or password.", 401)

        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        })

    except Exception:
        app.logger.exception("Login failed")
        return error_response(
            "Login failed. Check Users table and column names."
        )


# --------------------------------------------------
# TECHNOLOGIES
# --------------------------------------------------

@app.route("/api/technologies", methods=["GET"])
def technologies():
    try:
        rows = query_database(
            "SELECT * FROM Technologies",
            fetch="all"
        )
        return jsonify(rows)
    except Exception:
        app.logger.exception("Could not load technologies")
        return error_response("Could not load technologies.")


# --------------------------------------------------
# LEARNING LEVELS
# --------------------------------------------------

@app.route("/api/levels", methods=["GET"])
def levels():
    try:
        rows = query_database(
            "SELECT * FROM Levels",
            fetch="all"
        )
        return jsonify(rows)
    except Exception:
        app.logger.exception("Could not load levels")
        return error_response("Could not load levels.")


# --------------------------------------------------
# NOTES
# --------------------------------------------------

@app.route("/api/notes", methods=["GET"])
def notes():
    technology_id = request.args.get("technology_id")
    level_id = request.args.get("level_id")

    sql = "SELECT * FROM Notes WHERE 1=1"
    params = []

    if technology_id:
        sql += " AND technology_id = ?"
        params.append(technology_id)

    if level_id:
        sql += " AND level_id = ?"
        params.append(level_id)

    try:
        rows = query_database(sql, tuple(params), fetch="all")
        return jsonify(rows)
    except Exception:
        app.logger.exception("Could not load notes")
        return error_response("Could not load notes.")


# --------------------------------------------------
# PROJECTS
# --------------------------------------------------

@app.route("/api/projects", methods=["GET"])
def projects():
    try:
        rows = query_database(
            "SELECT * FROM Projects",
            fetch="all"
        )
        return jsonify(rows)
    except Exception:
        app.logger.exception("Could not load projects")
        return error_response("Could not load projects.")


# --------------------------------------------------
# ROADMAPS
# --------------------------------------------------

@app.route("/api/roadmaps", methods=["GET"])
def roadmaps():
    try:
        rows = query_database(
            "SELECT * FROM Roadmaps",
            fetch="all"
        )
        return jsonify(rows)
    except Exception:
        app.logger.exception("Could not load roadmaps")
        return error_response("Could not load roadmaps.")


# --------------------------------------------------
# PRACTICE QUESTIONS
# --------------------------------------------------

@app.route("/api/practice", methods=["GET"])
def practice():
    technology_id = request.args.get("technology_id")
    level_id = request.args.get("level_id")

    sql = "SELECT * FROM Practice WHERE 1=1"
    params = []

    if technology_id:
        sql += " AND technology_id = ?"
        params.append(technology_id)

    if level_id:
        sql += " AND level_id = ?"
        params.append(level_id)

    try:
        rows = query_database(sql, tuple(params), fetch="all")
        return jsonify(rows)
    except Exception:
        app.logger.exception("Could not load practice questions")
        return error_response("Could not load practice questions.")


# --------------------------------------------------
# USER PROFILE
# --------------------------------------------------

@app.route("/api/profile/<int:user_id>", methods=["GET"])
def profile(user_id):
    try:
        user = query_database(
            """
            SELECT id, name, email
            FROM Users
            WHERE id = ?
            """,
            (user_id,),
            fetch="one"
        )

        if not user:
            return error_response("User not found.", 404)

        return jsonify(user)

    except Exception:
        app.logger.exception("Could not load profile")
        return error_response("Could not load profile.")


# --------------------------------------------------
# AI LEARNING ASSISTANT
# --------------------------------------------------

@app.route("/api/ai-assistant", methods=["POST"])
def ai_assistant():
    data = request.get_json(silent=True) or {}

    # Accept common message field names.
    message = (
        data.get("message")
        or data.get("question")
        or data.get("prompt")
        or ""
    )

    message = str(message).strip()

    if not message:
        return error_response("Please enter a question.", 400)

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        return error_response(
            "AI is not configured. Set OPENAI_API_KEY in your terminal.",
            503
        )

    if OpenAI is None:
        return error_response(
            "The OpenAI Python package is not installed.",
            503
        )

    try:
        client = OpenAI(api_key=api_key)

        response = client.responses.create(
            model="gpt-4o-mini",
            instructions=(
                "You are SkillBridge's friendly learning assistant. "
                "Teach programming, computer science, AI and technology "
                "to beginners using clear explanations and examples. "
                "Be supportive and concise."
            ),
            input=message
        )

        reply = response.output_text

        # Return both common response keys for frontend compatibility.
        return jsonify({
            "reply": reply,
            "response": reply,
            "message": reply
        }), 200

    except Exception:
        app.logger.exception("AI assistant request failed")
        return error_response(
            "The AI service failed. Check the backend terminal and API access.",
            500
        )


# --------------------------------------------------
# RUN FLASK SERVER
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )