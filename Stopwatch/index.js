// Prevent duplicate initialization
if (!window.stopwatchInitialized) {
    window.stopwatchInitialized = true;
    
    const start = document.getElementById("start");
    const time = document.getElementById("time");
    const stop = document.getElementById("stop");
    const reset = document.getElementById("reset");

    let seconds = 0;
    let timerId = null;
    const STOPWATCH_KEY = 'stopwatch_seconds';

    // Load saved stopwatch value
    function loadStopwatchState() {
        const saved = localStorage.getItem(STOPWATCH_KEY);
        if (saved) {
            seconds = parseInt(saved);
            updateDisplay();
        }
    }

    // Format seconds to MM:SS:MS
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function updateDisplay() {
        time.textContent = formatTime(seconds);
        localStorage.setItem(STOPWATCH_KEY, seconds);
    }

    function count() {
        seconds++;
        updateDisplay();
    }

    if (stop) {
        stop.addEventListener("click", () => {
            clearInterval(timerId);
            timerId = null;
            localStorage.setItem(STOPWATCH_KEY, seconds);
        });
    }

    if (reset) {
        reset.addEventListener("click", () => {
            clearInterval(timerId);
            timerId = null;
            seconds = 0;
            updateDisplay();
        });
    }

    if (start) {
        start.addEventListener("click", () => {
            if (timerId === null) {
                timerId = setInterval(count, 1000);
            }
        });
    }

    // Load state when script runs
    loadStopwatchState();
}
