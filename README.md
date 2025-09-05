# Todo List (Flask + SQLite + uv)

Minimal MVP todo list web app built with Flask and SQLite. Uses `uv` for dependency management and running.

## Features
- Add, list, toggle, delete todos
- Clear all completed
- SQLite file lives under `instance/todos.db`

## Quickstart (with uv)

Prerequisites: Python 3.9+ and `uv` installed. If you need uv:
- Windows (PowerShell): `pipx install uv` (or `pip install --user uv`)
- Docs: https://docs.astral.sh/uv/

Install deps and run the dev server:

```
uv sync
uv run python app.py
```

Or run via Flask CLI:

```
uv run flask --app app run --debug --port 5000
```

Then open http://127.0.0.1:5000

## Project layout
- `app.py` — Flask app + routes and on-demand DB init
- `templates/index.html` — Single page UI (Jinja2)
- `static/styles.css` — Minimal styling
- `pyproject.toml` — Project metadata and dependencies
- `instance/` — Created at runtime, contains `todos.db`

## Notes
- This is a simple MVP (no auth, no CSRF). For production, add CSRF protection and a proper secret.
- The database is auto-initialized on first run; delete `instance/todos.db` to reset.

## Common commands
- Install/update deps: `uv sync`
- Run app (dev): `uv run python app.py`
- Freeze env (optional lock): `uv lock`

Enjoy!
