const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdateClick = document.getElementById("AddUpdateClick");
let updateText;
let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

todoValue.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addUpdateClick.click();
  }
});

function CreateToDoItems() {
  if (todoValue.value.trim() === "") {
    setAlertMessage("Please enter your todo text!");
    todoValue.focus();
    return;
  }

  let isPresent = todo.some((element) => element.item.toLowerCase() === todoValue.value.toLowerCase().trim());
  if (isPresent) {
    setAlertMessage("This item is already present in the list!");
    return;
  }

  let li = document.createElement("li");
  const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div>
                     <div>
                       <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pen.gif" />
                       <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.gif" />
                     </div>`;
  li.innerHTML = todoItems;
  listItems.appendChild(li);

  let itemList = { item: todoValue.value.trim(), status: false };
  todo.push(itemList);
  setLocalStorage();

  todoValue.value = "";
  setAlertMessage("Todo item created successfully!");
}

function CompletedToDoItems(e) {
  const divElement = e.parentElement.querySelector("div");
  if (!divElement.style.textDecoration || divElement.style.textDecoration !== "line-through") {
    const img = document.createElement("img");
    img.src = "/images/check.gif";
    img.className = "todo-controls";
    divElement.style.textDecoration = "line-through";
    divElement.appendChild(img);
    e.parentElement.querySelector("img.edit").remove(); 

    todo.forEach((element) => {
      if (divElement.innerText.trim() === element.item) {
        element.status = true;
      }
    });
    setLocalStorage();
    setAlertMessage("Todo item completed successfully!");
  }
}

function UpdateToDoItems(e) {
  const divElement = e.parentElement.parentElement.querySelector("div");
  if (divElement.style.textDecoration !== "line-through") {
    todoValue.value = divElement.innerText;
    updateText = divElement;
    addUpdateClick.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdateClick.setAttribute("src", "/images/refresh.gif");
    todoValue.focus();
  } else {
    setAlertMessage("Completed items cannot be updated!");
  }
}

function UpdateOnSelectionItems() {
  let isPresent = todo.some((element) => element.item.toLowerCase() === todoValue.value.toLowerCase().trim());
  if (isPresent) {
    setAlertMessage("This item is already present in the list!");
    return;
  }

  todo.forEach((element) => {
    if (element.item === updateText.innerText.trim()) {
      element.item = todoValue.value.trim();
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value.trim();
  addUpdateClick.setAttribute("onclick", "CreateToDoItems()");
  addUpdateClick.setAttribute("src", "/images/plus.png");
  todoValue.value = "";
  setAlertMessage("Todo item updated successfully!");
}

function DeleteToDoItems(e) {
  const deleteValue = e.parentElement.parentElement.querySelector("div").innerText.trim();

  if (confirm(`Are you sure you want to delete "${deleteValue}"?`)) {
    e.parentElement.parentElement.classList.add("deleted-item");
    todoValue.focus();

    todo = todo.filter((element) => element.item !== deleteValue);
    setTimeout(() => {
      e.parentElement.parentElement.remove();
    }, 1000);

    setLocalStorage();
    setAlertMessage(`"${deleteValue}" has been deleted!`);
  }
}

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message, duration = 3000) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, duration);
}


window.onload = function () {
  todo.forEach(item => {
    let li = document.createElement("li");
    const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${item.item}</div>
                       <div>
                         <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pen.gif" />
                         <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.gif" />
                       </div>`;
    li.innerHTML = todoItems;
    if (item.status) {
      const img = document.createElement("img");
      img.src = "/images/check.gif";
      img.className = "todo-controls";
      li.querySelector("div").style.textDecoration = "line-through";
      li.querySelector("div").appendChild(img);
      li.querySelector("img.edit").remove();
    }
    listItems.appendChild(li);
  });
};
