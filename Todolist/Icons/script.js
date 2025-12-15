const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");

// Load saved todos or start empty
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Save to localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Display todos
function renderTodos() {
  list.innerHTML = "";

  todos.forEach((todo, index) => {
    const li = document.createElement("li");

    // checkbox / toggle
    const chk = document.createElement('button');
    chk.className = 'check' + (todo.completed ? ' checked' : '');
    chk.innerHTML = todo.completed ? '✓' : '';
    chk.addEventListener('click', (e) => {
      e.stopPropagation();
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    const span = document.createElement('span');
    span.className = 'todo-text' + (todo.completed ? ' completed' : '');
    span.textContent = todo.text;

    // Delete button (icon)
    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.innerHTML = '✕';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(chk);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// Add new todo
addBtn.addEventListener("click", () => {
  if (input.value.trim() === "") return;

  todos.push({
    text: input.value,
    completed: false
  });

  input.value = "";
  saveTodos();
  renderTodos();
});

// Load on start
renderTodos();
