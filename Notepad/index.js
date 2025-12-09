const notepad = document.getElementById("notepad");
const saveBtn = document.getElementById("save");
const clearBtn = document.getElementById("clear")
const downloadBtn = document.getElementById("download");
// Load saved note on page load
window.addEventListener("load", () => {
  const savedNote = localStorage.getItem("myNote");
  if (savedNote) {
    notepad.value = savedNote;
  }
});

// Save note locally
saveBtn.addEventListener("click", () => {
  localStorage.setItem("myNote", notepad.value);
  alert("Note saved!");
});

// Clear textarea
clearBtn.addEventListener("click", () => {
  notepad.value = "";
  localStorage.removeItem("myNote");
});

// Download note as a text file
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([notepad.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "note.txt";
  a.click();
  URL.revokeObjectURL(url);
});
function formatText(style) {
  let txt = document.getElementById("notepad");

  let start = txt.selectionStart;
  let end = txt.selectionEnd;
  let selected = txt.value.substring(start, end);

  let formatted;

  if (style === "bold") {
    formatted = `**${selected}**`;
  } else if (style === "italic") {
    formatted = `*${selected}*`;
  } else if (style === "underline") {
    formatted = `__${selected}__`;
  }

  txt.value = txt.value.substring(0, start) + formatted + txt.value.substring(end);
}

function changeFontSize(size) {
  document.getElementById("notepad").style.fontSize = size;
}

function changeColor(color) {
  document.getElementById("notepad").style.color = color;
}