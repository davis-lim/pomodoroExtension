let tasks = [];


const addTaskBtn = document.getElementById("addTask")
addTaskBtn.addEventListener("click", () => addTask())

chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : [];
    renderTasks();
})

function saveTask() {
    chrome.storage.sync.set({
        tasks,
    })
}

function renderTask(taskLen) {
    const taskRow = document.createElement("div")

    const text = document.createElement("input")
    text.type = "text"
    text.placeholder = "Enter a task";
    text.value = tasks[taskLen];
    text.addEventListener("change", () => {
        tasks[taskLen] = text.value;
        saveTask();
    })
    
    const deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.value = "X"
    deleteBtn.addEventListener("click", () => {
        deleteTask(taskLen);
    })

    taskRow.appendChild(text);
    taskRow.appendChild(deleteBtn);

    const taskContainer = document.getElementById("taskContainer");
    taskContainer.appendChild(taskRow);
}


function addTask() {
    const taskLen = tasks.length;
    tasks.push("");
    renderTask(taskLen);
    saveTask();
    
}

function deleteTask(taskLen) {
    tasks.splice(taskLen, 1);
    renderTasks();
    saveTask();
}

function renderTasks() {
    const taskContainer = document.getElementById("taskContainer");
    taskContainer.textContent = "";
    tasks.forEach((taskText,taskLen) => {
        renderTask(taskLen);
    })

}