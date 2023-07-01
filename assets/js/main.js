const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let todoListStore = JSON.parse(localStorage.getItem("todoList")) || [];

$(".form").addEventListener("submit", addTodo);
$(".todos").addEventListener("click", setCompleted);

renderTodoList(todoListStore);

function renderTodoList(todoList) {
  let html = "";
  todoList.forEach((todo) => {
    html += renderTodoItem(todo);
  });

  $(".todos").innerHTML = html;
}

function renderTodoItem(todo) {
  return `
    <li data-id='${todo.id}' class="${todo.completed ? "completed" : ""}">
      <span>${todo.content}</span>
      <i class="fas fa-trash"></i>
    </li>`;
}

function save(todoList) {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

function addTodo(e) {
  e.preventDefault();

  const todoVal = $(".input-todo").value.trim();

  if (todoVal === "") {
    $(".input-todo").value = "";
  }

  if (todoVal) {
    const todoItem = {
      id: Date.now(),
      content: todoVal,
      completed: false,
    };

    todoListStore.push(todoItem);

    $(".todos").innerHTML += renderTodoItem(todoItem);

    $(".input-todo").value = "";

    save(todoListStore);
  }
}

function getIndexTodo(id, todoList) {
  return todoList.findIndex((todo) => todo.id === Number(id));
}

function setCompleted(e) {
  const liTarget = e.target.closest("li");
  const deleteTarget = e.target.closest("i");

  if (liTarget && liTarget === e.target) {
    if (!liTarget.classList.contains("completed")) {
      liTarget.classList.add("completed");
      const indexCompleted = getIndexTodo(liTarget.dataset.id, todoListStore);
      todoListStore[indexCompleted].completed = true;
    } else {
      liTarget.classList.remove("completed");
      const indexCompleted = getIndexTodo(liTarget.dataset.id, todoListStore);
      todoListStore[indexCompleted].completed = false;
    }
    save(todoListStore);
  }

  if (deleteTarget && deleteTarget === e.target) {
    const parentTodo = deleteTarget.parentElement;
    const idTodo = +parentTodo.dataset.id;
    const indexTodo = getIndexTodo(idTodo, todoListStore);

    todoListStore = todoListStore
      .slice(0, indexTodo)
      .concat(todoListStore.slice(indexTodo + 1));
    parentTodo.remove();

    save(todoListStore);
  }
}
