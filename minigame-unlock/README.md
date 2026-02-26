# Mini-game Unlock — Memory Match

Files in this folder provide a small memory match mini-game that stays hidden until unlocked.

How it works
- Call `checkUnlock(count)` from your app where `count` is the number of completed tasks.
- If `count >= 5`, the game UI becomes visible and a new memory match game starts.

Quick test
1. Open [minigame-unlock/index.html](minigame-unlock/index.html) in your browser (or click the "Mini-game" card on the app's homepage).
2. The parent app will automatically send the current completed‑task count when the window opens and whenever it changes; there is no need to enter a number manually.

Integrating into your app
- Option A — Open as standalone window: when tasks reach 5, call `window.open('minigame-unlock/index.html')`.
- Option B — If you serve files from the same origin, you can embed the HTML in an iframe and call its `checkUnlock(count)` via `iframe.contentWindow.checkUnlock(count)`.

Notes
- This folder is intentionally standalone. Copy it into your project or host the folder where your app can access it.
