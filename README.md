# Todo List App

This is a todo list application with user authentication. Tasks are saved per user and are only accessible when logged in.

## Features

- User registration and login
- Add, toggle, and delete todos
- Tasks are stored in a database per user
- When logged out, tasks are not accessible

## Setup

1. Install dependencies:
   ```
   pip install -e .
   ```

2. Run the app:
   ```
   python app.py
   ```

3. Open your browser to `http://127.0.0.1:5000/`

4. Register a new account or login.

## Static Version

The static version without login is in `index.html` and uses localStorage.