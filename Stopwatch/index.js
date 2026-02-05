const start = document.getElementById("start");
const time = document.getElementById("time");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");

let seconds = 0.0;
let timerId= null;

function count(){
    time.textContent = seconds;
    seconds++
}
stop.addEventListener("click", () => {
    clearInterval(timerId);
    timerId = null
})
reset.addEventListener("click", () => {
    clearInterval(timerId);
    timerId = null;
    seconds = 0;
    time.textContent = 0;

    }
);
start.addEventListener("click", () => {
    if (timerId === null) {      
        timerId = setInterval(count, 1000);
    }
});
