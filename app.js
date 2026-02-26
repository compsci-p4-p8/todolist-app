// ==================== Tab Navigation ====================
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    
    // Remove active class from all buttons and panes
    tabBtns.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
    // Add active class to clicked button and corresponding pane
    btn.classList.add('active');
    
    // If the Stopwatch tab is requested, ensure its pane and assets exist first
    if (tabName === 'Stopwatch') {
      loadStopwatch();
    }
    
    const targetPane = document.getElementById(tabName);
    if (targetPane) {
      targetPane.classList.add('active');
    }
    
    // Load data when switching tabs
    if (tabName === 'notepad') {
      loadNotepad();
    } else if (tabName === 'todolist') {
      loadTodolist();
    }
  });
});

// Function to switch tabs programmatically (used by tool cards)
function switchToTab(tabName) {
  const btn = document.querySelector(`[data-tab="${tabName}"]`);
  if (btn) {
    btn.click();
  }
}

// ABG Button functionality
document.getElementById('abgBtn').addEventListener('click', () => {
  showImagePopup();
});

// ==================== Calculator ====================
let display = document.getElementById('display');

function appendToDisplay(value) {
  if (display.value === '0' && value !== '.') {
    display.value = value;
  } else {
    display.value += value;
  }
}

function clearDisplay() {
  display.value = '0';
}

function calculateResult() {
  try {
    display.value = eval(display.value);
  } catch (error) {
    display.value = 'Error';
    setTimeout(() => clearDisplay(), 1500);
  }
}

// Initialize display
clearDisplay();

// ==================== Notepad ====================
const notepadText = document.getElementById('notepadText');
const NOTEPAD_STORAGE_KEY = 'notepad_content';
const NOTEPAD_FONTS_KEY = 'notepad_fontSize';

function loadNotepad() {
  const saved = localStorage.getItem(NOTEPAD_STORAGE_KEY);
  if (saved) {
    notepadText.value = saved;
  }
}

function saveNotepad() {
  localStorage.setItem(NOTEPAD_STORAGE_KEY, notepadText.value);
  alert('Notepad saved!');
}

function clearNotepad() {
  if (confirm('Are you sure you want to clear the notepad?')) {
    notepadText.value = '';
    localStorage.removeItem(NOTEPAD_STORAGE_KEY);
  }
}

function downloadNotepad() {
  const text = notepadText.value;
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', 'notepad_' + new Date().getTime() + '.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function formatText(command) {
  document.execCommand(command, false, null);
  notepadText.focus();
}

function changeFontSize(size) {
  notepadText.style.fontSize = size;
  localStorage.setItem(NOTEPAD_FONTS_KEY, size);
}

// Load notepad data on page load
loadNotepad();

// Restore font size preference
const savedFontSize = localStorage.getItem(NOTEPAD_FONTS_KEY);
if (savedFontSize) {
  document.getElementById('fontSize').value = savedFontSize;
  notepadText.style.fontSize = savedFontSize;
}

// Auto-save notepad every 30 seconds
setInterval(() => {
  if (notepadText.value.trim()) {
    localStorage.setItem(NOTEPAD_STORAGE_KEY, notepadText.value);
  }
}, 30000);

// ==================== Todo List ====================
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const TODO_STORAGE_KEY = 'todos';

let todos = [];

function loadTodolist() {
  const saved = localStorage.getItem(TODO_STORAGE_KEY);
  if (saved) {
    todos = JSON.parse(saved);
    renderTodos();
  }
}

function saveTodos() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

function addTodo() {
  const text = todoInput.value.trim();
  
  if (text === '') {
    alert('Please enter a task');
    return;
  }
  
  const todo = {
    id: Date.now(),
    text: text,
    completed: false
  };
  
  todos.push(todo);
  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
  
 
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

function renderTodos() {
  todoList.innerHTML = '';
  
  todos.forEach(todo => {
    const li = document.createElement('li');
    if (todo.completed) {
      li.classList.add('completed');
    }
    
    li.innerHTML = `
      <span onclick="toggleTodo(${todo.id})" style="cursor: pointer; flex: 1;">${todo.text}</span>
      <button onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    
    todoList.appendChild(li);
  });
}

// Add todo event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

// Load todos on page load
loadTodolist();

// Modal functionality
const modal = document.getElementById('imageModal');
const closeBtn = document.getElementsByClassName('close')[0];

// Login functionality
function loginUser() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  // This is just a placeholder; real authentication would require a server.
  if (user.trim() === '') {
    alert('Please enter a username');
    return;
  }
  alert(`You typed username: ${user}`);
}

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', loginUser);
  }
});

function showImagePopup() {
  modal.style.display = 'flex';
  const img = document.getElementById('popupImage');
  setTimeout(() => {
    img.style.opacity = '1';
  }, 100); // Small delay to ensure modal is displayed
}

closeBtn.onclick = function() {
  modal.style.display = 'none';
  document.getElementById('popupImage').style.opacity = '0';
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    document.getElementById('popupImage').style.opacity = '0';
  }
}

// ========= Stopwatch Dynamic Loader =========
function loadStopwatch() {
  // Create pane if it doesn't exist
  if (!document.getElementById('Stopwatch')) {
    const pane = document.createElement('div');
    pane.id = 'Stopwatch';
    pane.className = 'tab-pane';
    pane.innerHTML = `
      <div class="stopwatch-container">
        <h1 id="title">Stopwatch</h1>
        <h1 id="time">00:00:00</h1>
        <div class="buttons">
          <button id="start">Start</button>
          <button id="stop">Stop</button>
          <button id="reset">Reset</button>
        </div>
        
      </div>
    `;
    const tabContent = document.querySelector('.tab-content');
    if (tabContent) tabContent.appendChild(pane);

    // Load stylesheet if not already loaded
    if (!document.querySelector('link[href="Stopwatch/style.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'Stopwatch/style.css';
      document.head.appendChild(link);
    }

    // Load script if not already loaded
    if (!document.querySelector('script[src="Stopwatch/index.js"]')) {
      const script = document.createElement('script');
      script.src = 'Stopwatch/index.js';
      document.body.appendChild(script);
    }
  }
}

// ==================== Login ====================
// Fake stored user (for demo only)
const correctUsername = "admin";
const correctPassword = "Luvbensontech";

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
      e.preventDefault(); // stop page reload
      
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const message = document.getElementById("message");

      if (username === correctUsername && password === correctPassword) {
          message.style.color = "green";
          message.textContent = "Login successful!";
          
          // Redirect after login
          setTimeout(() => {
              window.location.href = "http://127.0.0.1:5501";
          }, 1000);
      } else {
          message.style.color = "red";
          message.textContent = "Invalid username or password.";
      }
  });
}
