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
    li.textContent = todo.text;

    if (todo.completed) {
      li.classList.add("completed");
    }

    // Toggle completed
    li.addEventListener("click", () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.className = "delete";

    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

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
