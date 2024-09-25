const btn = document.getElementById("btn");
const input = document.querySelector("input");
const list = document.querySelector("ul");
const left = document.querySelector("#left");
const active = document.querySelector("#active");
const activeAll = document.querySelector("#activeAll");
const completed = document.querySelector("#completed");
const clearList = document.querySelector("#clearList");
const allButtons = document.querySelector("#all-buttons");

let group = JSON.parse(localStorage.getItem("tasks")) || [];
let count;
let editIndex = null;

left.innerHTML = `0 Items left`;
allButtons.style.display = group.length > 0 ? "flex" : "none";

input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    if (editIndex !== null) {
      saveEdit(editIndex, input.value);
      editIndex = null;
    } else {
      add();
      allButtons.style.display = "flex";
    }
  }
});

function add() {
  if (input.value != "") {
    group.push({
      checked: false,
      value: input.value,
    });
    saveToLocalStorage();
    show();
  }
}

function del(i) {
  group.splice(i, 1);
  saveToLocalStorage();
  show();
}

function edit(i) {
  input.value = group[i].value;
  editIndex = i;
}

function saveEdit(i, newValue) {
  if (newValue != "") {
    group[i].value = newValue;
    input.value = "";
    saveToLocalStorage();
    show();
  }
}

function chng(i) {
  group[i].checked = !group[i].checked;
  saveToLocalStorage();
  show();
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(group));
}

function show() {
  let kod = "";
  input.value = "";
  for (let i = 0; i < group.length; i++) {
    kod += `<li style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
                <input type="checkbox" ${
                  group[i].checked ? "checked" : ""
                } onchange="chng(${i})" />
                <span style="text-decoration:${
                  group[i].checked ? "line-through" : "none"
                }">${group[i].value}</span>
            </div>
            <div style="display: flex; gap: 10px;"> <!-- Buttonları yan yana yerleştiriyoruz -->
              <button onclick="edit(${i})">Edit</button>
              <button onclick="del(${i})">X</button>
            </div>
        </li>`;
  }

  list.innerHTML = kod;
  const uncompleted = group.filter((item) => item.checked == false);
  const completedlist = group.filter((item) => item.checked == true);
  const leftCount = uncompleted.length;
  left.innerHTML = ` ${leftCount} items left`;

  active.onclick = activeShow;
  function activeShow() {
    let kod1 = "";
    for (let i = 0; i < uncompleted.length; i++) {
      kod1 += `<li style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
                <input type="checkbox" onchange="chng(${i})" />
                <span style="text-decoration:none;">${uncompleted[i].value}</span>
            </div>
            <div style="display: flex; gap: 10px;">
              <button onclick="edit(${i})">Edit</button>
              <button onclick="del(${i})">X</button>
            </div>
        </li>`;
    }
    list.innerHTML = kod1;
  }

  activeAll.onclick = show;
  completed.onclick = completedShow;
  function completedShow() {
    let kod2 = "";
    for (let i = 0; i < completedlist.length; i++) {
      kod2 += `<li style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
                <input type="checkbox" checked onchange="chng(${i})" />
                <span style="text-decoration:line-through;">${completedlist[i].value}</span>
            </div>
            <div style="display: flex; gap: 10px;">
              <button onclick="edit(${i})">Edit</button>
              <button onclick="del(${i})">X</button>
            </div>
        </li>`;
    }
    list.innerHTML = kod2;
  }

  clearList.onclick = clearShow;
  function clearShow() {
    group = group.filter((item) => !item.checked);
    saveToLocalStorage();
    show();
    if (group.length === 0) {
      allButtons.style.display = "none";
    }
  }
}
show();
