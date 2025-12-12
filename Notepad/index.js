const notepad = document.getElementById("notepad");
const saveBtn = document.getElementById("save");
const clearBtn = document.getElementById("clear")
const downloadBtn = document.getElementById("download");

// Load saved note on page load
window.addEventListener("load", () => {
  const savedNote = localStorage.getItem("myNote");
  if (savedNote) {
    notepad.innerHTML = savedNote;
  }
});

// Save note locally
saveBtn.addEventListener("click", () => {
  localStorage.setItem("myNote", notepad.innerHTML);
  alert("Note saved!");
});

// Clear textarea
clearBtn.addEventListener("click", () => {
  notepad.innerHTML = "";
  localStorage.removeItem("myNote");
});

// Download note as a text file
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([notepad.innerText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "note.txt";
  a.click();
  URL.revokeObjectURL(url);
});

function formatText(style) {
  document.execCommand(style, false, null);
  notepad.focus();
}

function changeFontSize(size) {
  document.execCommand("fontSize", false, size.replace("px", ""));
  notepad.focus();
}

function changeColor(color) {
  document.execCommand("foreColor", false, color);
  notepad.focus();
}