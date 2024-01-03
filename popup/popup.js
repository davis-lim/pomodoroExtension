let tasks = [];

function updateTime() {
    chrome.storage.local.get(["timer"], (res) => {
        const time = document.getElementById("time");
        const minutes = `${25 - Math.ceil(res.timer / 60)}`.padStart(2, "0");
        let seconds = '00';
        if (res.timer % 60 != 0) {
            seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
        }
        time.textContent = `${minutes}:${seconds}`;
    })
}

updateTime();
setInterval(updateTime, 1000)

const startTimerBtn = document.getElementById("startTimer");
startTimerBtn.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer";
        })
    })
})

const resetTimerBtn = document.getElementById("resetTimer");
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        isRunning: false,
        timer: 0
    }, () => {
        startTimerBtn.textContent = "Start Timer";
    })
})


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

