// ==================== Tab Navigation ====================
const tabBtns = document.querySelectorAll('.tab-btn');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    if (!tabName) return;
    
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
    } else if (tabName === 'homepage') {
      loadCustomLinks();
    }

    // fade in ABG image if switching to that tab
    if (tabName === 'abg') {
      const abgImg = document.getElementById('abgImage');
      if (abgImg) {
        // ensure it starts at 0 before toggling
        abgImg.style.opacity = '0';
        // add error handler
        abgImg.onerror = () => {
          console.error('ABG image failed to load');
          abgImg.style.display = 'none';
          const errorMsg = document.createElement('p');
          errorMsg.textContent = 'Image could not be loaded.';
          abgImg.parentNode.appendChild(errorMsg);
        };
        requestAnimationFrame(() => { abgImg.style.opacity = '1'; });
      }
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

// toggle between calculator and graphing view
function toggleGraph() {
  const calcContainer = document.querySelector('.calculator-container');
  const graph = document.getElementById('graph-container');
  const btn = document.getElementById('toggleGraphBtn');
  if (!calcContainer || !graph || !btn) return;
  if (graph.style.display === 'none') {
    calcContainer.style.display = 'none';
    graph.style.display = 'block';
    btn.textContent = 'Calculator';
  } else {
    calcContainer.style.display = '';
    graph.style.display = 'none';
    btn.textContent = 'Graphing';
  }
}

// attach event listener when page loads
window.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleGraphBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleGraph);
  }
});

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
  updateMiniGameUnlock(); // refresh unlock state when tasks are removed
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
    updateMiniGameUnlock();
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
// and update any open mini-game with the initial count
updateMiniGameUnlock();

// Mini-game integration
let miniGameWindow = null;

function openMiniGame() {
  const completedCount = todos.filter(t => t.completed).length;
  miniGameWindow = window.open('minigame-unlock/index.html', '_blank');
  // send count once the new window has loaded
  if (miniGameWindow) {
    miniGameWindow.addEventListener('load', () => {
      if (typeof miniGameWindow.checkUnlock === 'function') {
        miniGameWindow.checkUnlock(completedCount);
      }
    });
  }
}

function updateMiniGameUnlock() {
  const count = todos.filter(t => t.completed).length;
  if (miniGameWindow && typeof miniGameWindow.checkUnlock === 'function') {
    miniGameWindow.checkUnlock(count);
  }
}

// Modal functionality for ABG will be initialised later


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

// ==================== Custom Links ====================
function loadCustomLinks() {
  const appsDiv = document.querySelector('.apps');
  if (!appsDiv) return;

  // Clear existing custom links (keep the hardcoded ones)
  const existingCustom = appsDiv.querySelectorAll('.custom-link');
  existingCustom.forEach(link => link.remove());

  // Load from localStorage
  const customLinks = JSON.parse(localStorage.getItem('customLinks') || '[]');
  customLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.textContent = link.name;
    a.className = 'custom-link';
    appsDiv.appendChild(a);
  });
}

function addCustomLink() {
  const form = document.getElementById('addLinkForm');
  form.style.display = 'block';
  document.getElementById('addLinkBtn').style.display = 'none';
}

function saveCustomLink() {
  const name = document.getElementById('linkName').value.trim();
  const url = document.getElementById('linkUrl').value.trim();

  if (!name || !url) {
    alert('Please enter both name and URL.');
    return;
  }

  // Ensure URL has protocol
  let fullUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    fullUrl = 'https://' + url;
  }

  const customLinks = JSON.parse(localStorage.getItem('customLinks') || '[]');
  customLinks.push({ name, url: fullUrl });
  localStorage.setItem('customLinks', JSON.stringify(customLinks));

  // Clear form
  document.getElementById('linkName').value = '';
  document.getElementById('linkUrl').value = '';

  // Hide form
  document.getElementById('addLinkForm').style.display = 'none';
  document.getElementById('addLinkBtn').style.display = 'inline-block';

  loadCustomLinks();
}

function cancelAddLink() {
  // Clear form
  document.getElementById('linkName').value = '';
  document.getElementById('linkUrl').value = '';

  // Hide form
  document.getElementById('addLinkForm').style.display = 'none';
  document.getElementById('addLinkBtn').style.display = 'inline-block';
}

// Add event listener for add link button
document.addEventListener('DOMContentLoaded', () => {
  const addLinkBtn = document.getElementById('addLinkBtn');
  if (addLinkBtn) {
    addLinkBtn.addEventListener('click', addCustomLink);
  }

  const saveLinkBtn = document.getElementById('saveLinkBtn');
  if (saveLinkBtn) {
    saveLinkBtn.addEventListener('click', saveCustomLink);
  }

  const cancelLinkBtn = document.getElementById('cancelLinkBtn');
  if (cancelLinkBtn) {
    cancelLinkBtn.addEventListener('click', cancelAddLink);
  }
});
