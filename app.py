import os
import sqlite3
from functools import wraps
from flask import Flask, g, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash


def create_app():
    app = Flask(__name__)
    app.config.update(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev-key-change-me"),
        DATABASE=os.path.join(app.instance_path, "todos.db"),
    )

    # Ensure the instance folder exists
    os.makedirs(app.instance_path, exist_ok=True)

    def get_db():
        if "db" not in g:
            conn = sqlite3.connect(app.config["DATABASE"], detect_types=sqlite3.PARSE_DECLTYPES)
            conn.row_factory = sqlite3.Row
            g.db = conn
            # Initialize schema if not present
            g.db.execute(
                """
                CREATE TABLE IF NOT EXISTS user (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            g.db.execute(
                """
                CREATE TABLE IF NOT EXISTS todo (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    completed INTEGER NOT NULL DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    user_id INTEGER
                )
                """
            )
            # Ensure user_id column exists on existing DBs
            cols = [r[1] for r in g.db.execute("PRAGMA table_info(todo)").fetchall()]
            if "user_id" not in cols:
                g.db.execute("ALTER TABLE todo ADD COLUMN user_id INTEGER")
            g.db.commit()
        return g.db

    @app.teardown_appcontext
    def close_db(_):
        db = g.pop("db", None)
        if db is not None:
            db.close()

    @app.before_request
    def load_logged_in_user():
        user_id = session.get("user_id")
        if user_id is None:
            g.user = None
        else:
            g.user = get_db().execute("SELECT id, username FROM user WHERE id = ?", (user_id,)).fetchone()

    def login_required(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            if g.get("user") is None:
                return redirect(url_for("login"))
            return view(*args, **kwargs)
        return wrapped

    @app.route("/")
    @login_required
    def index():
        db = get_db()
        todos = db.execute(
            "SELECT id, title, completed, created_at FROM todo WHERE user_id = ? ORDER BY completed ASC, id DESC",
            (g.user["id"],),
        ).fetchall()
        return render_template("index.html", todos=todos, user=g.user)

    @app.route("/add", methods=["POST"])
    @login_required
    def add():
        title = (request.form.get("title") or "").strip()
        if not title:
            flash("Please enter a todo title.")
            return redirect(url_for("index"))
        db = get_db()
        db.execute("INSERT INTO todo (title, user_id) VALUES (?, ?)", (title, g.user["id"]))
        db.commit()
        return redirect(url_for("index"))

    @app.route("/toggle/<int:todo_id>", methods=["POST"])
    @login_required
    def toggle(todo_id: int):
        db = get_db()
        row = db.execute(
            "SELECT completed FROM todo WHERE id = ? AND user_id = ?",
            (todo_id, g.user["id"]),
        ).fetchone()
        if row is not None:
            new_val = 0 if row["completed"] else 1
            db.execute(
                "UPDATE todo SET completed = ? WHERE id = ? AND user_id = ?",
                (new_val, todo_id, g.user["id"]),
            )
            db.commit()
        return redirect(url_for("index"))

    @app.route("/delete/<int:todo_id>", methods=["POST"])
    @login_required
    def delete(todo_id: int):
        db = get_db()
        db.execute("DELETE FROM todo WHERE id = ? AND user_id = ?", (todo_id, g.user["id"]))
        db.commit()
        return redirect(url_for("index"))

    @app.route("/clear-completed", methods=["POST"])
    @login_required
    def clear_completed():
        db = get_db()
        db.execute("DELETE FROM todo WHERE completed = 1 AND user_id = ?", (g.user["id"],))
        db.commit()
        return redirect(url_for("index"))

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if request.method == "POST":
            username = (request.form.get("username") or "").strip()
            password = request.form.get("password") or ""
            if not username or not password:
                flash("Username and password required.")
                return redirect(url_for("login"))
            db = get_db()
            user = db.execute("SELECT id, username, password_hash FROM user WHERE username = ?", (username,)).fetchone()
            if user and check_password_hash(user["password_hash"], password):
                session.clear()
                session["user_id"] = user["id"]
                return redirect(url_for("index"))
            flash("Invalid credentials.")
            return redirect(url_for("login"))
        return render_template("login.html")

    @app.route("/register", methods=["GET", "POST"])
    def register():
        if request.method == "POST":
            username = (request.form.get("username") or "").strip()
            password = request.form.get("password") or ""
            if not username or not password:
                flash("Username and password required.")
                return redirect(url_for("register"))
            db = get_db()
            existing = db.execute("SELECT id FROM user WHERE username = ?", (username,)).fetchone()
            if existing:
                flash("Username already taken.")
                return redirect(url_for("register"))
            db.execute(
                "INSERT INTO user (username, password_hash) VALUES (?, ?)",
                (username, generate_password_hash(password)),
            )
            db.commit()
            # Auto login after registration
            user = db.execute("SELECT id FROM user WHERE username = ?", (username,)).fetchone()
            session.clear()
            session["user_id"] = user["id"]
            return redirect(url_for("index"))
        return render_template("register.html")

    @app.route("/logout", methods=["POST"])  # simple logout; no CSRF for MVP
    def logout():
        session.clear()
        return redirect(url_for("login"))

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
