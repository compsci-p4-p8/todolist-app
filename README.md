# Todo List App

This repository contains a **static front‑end** for a to‑do list collection of mini‑tools. There is no backend server required; all data is saved in the browser's `localStorage`.

## What’s Included

- Calculator, notepad, stopwatch, and to‑do list UI
- Mini‑game that unlocks after completing tasks
- Fully client‑side JavaScript; no database or server code is used

## Running the App

You have two simple options:

1. **Open the HTML file directly**
   - Double‑click `index.html` or drag it into a browser window.
   - This uses the `file://` protocol and works immediately.
   - *Note*: some browsers enforce stricter security for `file://` (e.g. cross‑window messaging), so features like the mini‑game may require the next option.

2. **Serve it over HTTP (recommended)**
   - From a terminal in the project root run one of the following commands:
     ```powershell
     # Python 3 (any platform)
     python -m http.server 8000
     # or using Node if installed
     npx http-server -p 8000
     ```
   - Then open your browser to `http://localhost:8000`.
   - This mimics a real web host and avoids any `file://` restrictions.

> 🔧 You do **not** need to run `python app.py` or install any dependencies; the Python script currently just prints a greeting and is unrelated to the UI.

## Tips

- The mini‑game opens in a new window/tab and automatically receives the count of completed tasks.
- All state (todos, notepad text) is stored locally and persists between reloads.

Feel free to copy the `minigame-unlock/` folder for use in other projects.