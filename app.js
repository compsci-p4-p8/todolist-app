// ==================== Tab Navigation ====================
const tabBtns = document.querySelectorAll('.tab-btn');
const SAVED_LINKS_KEY = 'savedLinks';

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    if (!tabName) return;

    console.log('Switching to tab:', tabName);
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
      console.log('Activated pane:', tabName, 'Display:', window.getComputedStyle(targetPane).display);
    } else {
      console.error('Pane not found:', tabName);
    }

    // Load data when switching tabs
    if (tabName === 'notepad') {
      loadNotepad();
    } else if (tabName === 'todolist') {
      loadTodolist();
    } else if (tabName === 'homepage') {
      loadCustomLinks();
      initHomepageLinks();
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
const editTodoDialog = document.getElementById('editTodoDialog');
const editTodoForm = document.getElementById('editTodoForm');
const editTodoText = document.getElementById('editTodoText');
const editTodoDue = document.getElementById('editTodoDue');
const editTodoNotes = document.getElementById('editTodoNotes');
const cancelTodoBtn = document.getElementById('cancelTodoBtn');
const TODO_STORAGE_KEY = 'todos';

let todos = [];
let editingTodoId = null;

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
  if (!todoInput) return;

  const text = todoInput.value.trim();

  if (text === '') {
    alert('Please enter a task');
    return;
  }

  const todo = {
    id: Date.now(),
    text: text,
    completed: false,
    dueDate: '',
    notes: ''
  };

  todos.push(todo);
  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

function openEditDialog(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  editingTodoId = id;
  editTodoText.value = todo.text;
  editTodoDue.value = todo.dueDate || '';
  editTodoNotes.value = todo.notes || '';

  if (editTodoDialog) {
    if (typeof editTodoDialog.showModal === 'function') {
      editTodoDialog.showModal();
    } else {
      // Fallback for browsers that don't support <dialog>
      editTodoDialog.setAttribute('open', '');
    }
  }
}

function closeEditDialog() {
  editingTodoId = null;
  if (editTodoDialog) {
    if (typeof editTodoDialog.close === 'function') {
      editTodoDialog.close();
    } else {
      editTodoDialog.removeAttribute('open');
    }
  }
}

function saveEditedTodo() {
  if (editingTodoId === null) return;

  const todo = todos.find(t => t.id === editingTodoId);
  if (!todo) return;

  const newText = editTodoText.value.trim();
  if (!newText) {
    alert('Task text cannot be empty.');
    return;
  }

  todo.text = newText;
  todo.dueDate = editTodoDue.value;
  todo.notes = editTodoNotes.value;

  saveTodos();
  renderTodos();
  closeEditDialog();
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
  if (!todoList) return;
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    if (todo.completed) {
      li.classList.add('completed');
    }

    const dueText = todo.dueDate ? `<span class="todo-due">Due: ${todo.dueDate}</span>` : '';
    const notesText = todo.notes ? `<div class="todo-notes">${todo.notes}</div>` : '';

    li.innerHTML = `
      <div class="todo-main" onclick="openEditDialog(${todo.id})">
        <span class="todo-text">${todo.text}</span>
        ${dueText}
      </div>
      ${notesText}
      <div class="todo-actions">
        <button class="complete-btn" onclick="toggleTodo(${todo.id})">${todo.completed ? 'Undo' : 'Done'}</button>
        <button class="edit-btn" onclick="openEditDialog(${todo.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

// Add todo event listeners
if (addBtn) {
  addBtn.addEventListener('click', addTodo);
}

if (todoInput) {
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });
}

if (editTodoForm) {
  editTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveEditedTodo();
  });
}

if (cancelTodoBtn) {
  cancelTodoBtn.addEventListener('click', closeEditDialog);
}

if (editTodoDialog) {
  // Close dialog on Esc key or when user clicks outside in browsers that support it
  editTodoDialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeEditDialog();
  });
}

// Load todos on page load only when todo list exists
if (todoList) {
  loadTodolist();
}
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

function getSavedLinks() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_LINKS_KEY) || '[]');
  } catch (error) {
    console.error('Failed to parse saved links', error);
    return [];
  }
}

function saveLinks(links) {
  localStorage.setItem(SAVED_LINKS_KEY, JSON.stringify(links));
}

function loadCustomLinks() {
  const appsDiv = document.querySelector('.apps');
  if (!appsDiv) {
    console.log('ERROR: .apps div not found');
    return;
  }

  // Remove any previously rendered custom link wrappers without touching hardcoded links
  appsDiv.querySelectorAll('.custom-link-wrapper').forEach(wrapper => wrapper.remove());

  const customLinks = getSavedLinks();
  customLinks.forEach(link => appendCustomLink(appsDiv, link.name, link.url));
}

function appendCustomLink(appsDiv, name, href) {
  const wrapper = document.createElement('div');
  wrapper.className = 'custom-link-wrapper';

  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.textContent = name;
  a.className = 'custom-link';
  a.rel = 'noopener noreferrer';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-link-btn';
  removeBtn.title = 'Remove link';
  removeBtn.textContent = '×';
  removeBtn.onclick = () => removeCustomLink(name, href);

  wrapper.appendChild(a);
  wrapper.appendChild(removeBtn);
  appsDiv.appendChild(wrapper);
}

function addCustomLink() {
  console.log('Homepage add link button clicked');
  const form = document.getElementById('addLinkForm');
  const button = document.getElementById('addLinkBtn');
  if (!form || !button) {
    console.warn('Add link form or button not found');
    return;
  }

  form.style.setProperty('display', 'block', 'important');
  button.style.setProperty('display', 'none', 'important');
}

function saveCustomLink() {
  console.log('Homepage save link button clicked');
  const nameInput = document.getElementById('linkName');
  const urlInput = document.getElementById('linkUrl');
  if (!nameInput || !urlInput) {
    console.warn('Link name or URL input not found');
    return;
  }

  const name = nameInput.value.trim();
  let url = urlInput.value.trim();

  if (!name || !url) {
    alert('Please enter both name and URL.');
    return;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const savedLinks = getSavedLinks();
  if (!savedLinks.some(link => link.name === name && link.url === url)) {
    savedLinks.push({ name, url });
    saveLinks(savedLinks);
  }

  nameInput.value = '';
  urlInput.value = '';

  const form = document.getElementById('addLinkForm');
  const button = document.getElementById('addLinkBtn');
  if (form) form.style.setProperty('display', 'none', 'important');
  if (button) button.style.setProperty('display', 'inline-block', 'important');

  loadCustomLinks();
}

function removeCustomLink(name, url) {
  const savedLinks = getSavedLinks().filter(link => !(link.name === name && link.url === url));
  saveLinks(savedLinks);
  loadCustomLinks();
}

function cancelAddLink() {
  console.log('Homepage cancel link button clicked');
  const nameInput = document.getElementById('linkName');
  const urlInput = document.getElementById('linkUrl');
  if (nameInput) nameInput.value = '';
  if (urlInput) urlInput.value = '';

  const form = document.getElementById('addLinkForm');
  const button = document.getElementById('addLinkBtn');
  if (form) form.style.setProperty('display', 'none', 'important');
  if (button) button.style.setProperty('display', 'inline-block', 'important');
}

// Function to attach homepage link listeners
function initHomepageLinks() {
  const homepageContainer = document.querySelector('.homepage-container');
  if (homepageContainer) {
    homepageContainer.addEventListener('click', (e) => {
      if (e.target.id === 'addLinkBtn') {
        addCustomLink();
      } else if (e.target.id === 'saveLinkBtn') {
        saveCustomLink();
      } else if (e.target.id === 'cancelLinkBtn') {
        cancelAddLink();
      }
    });
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initHomepageLinks();
    loadCustomLinks();
  });
} else {
  initHomepageLinks();
  loadCustomLinks();
}
