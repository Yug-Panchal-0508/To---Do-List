const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const sortTasks = document.getElementById("sortTasks");
const clearAllBtn = document.getElementById("clearAllBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        let details = document.createElement("div");
        details.classList.add("task-details");

        let title = document.createElement("span");
        title.textContent = task.text;
        details.appendChild(title);

        let category = document.createElement("span");
        category.classList.add("category");
        category.textContent = `Category: ${task.category}`;
        details.appendChild(category);

        let dueDate = document.createElement("span");
        dueDate.classList.add("due-date");
        dueDate.textContent = task.due ? `Due: ${task.due}` : "No due date";
        details.appendChild(dueDate);

        // Toggle completion
        li.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
        });

        // Delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
        });

        li.appendChild(details);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Add task
addTaskBtn.addEventListener("click", () => {
    let taskText = taskInput.value.trim();
    let dueValue = taskDate.value;
    let categoryValue = taskCategory.value;

    if (taskText !== "") {
        tasks.push({
            text: taskText,
            due: dueValue ? new Date(dueValue).toLocaleString() : null,
            category: categoryValue,
            completed: false
        });
        saveTasks();
        taskInput.value = "";
        taskDate.value = "";
    }
});

// Search tasks
searchInput.addEventListener("input", () => {
    let query = searchInput.value.toLowerCase();
    document.querySelectorAll("#taskList li").forEach(li => {
        let text = li.querySelector(".task-details span").textContent.toLowerCase();
        li.style.display = text.includes(query) ? "" : "none";
    });
});

// Sort tasks
sortTasks.addEventListener("change", () => {
    if (sortTasks.value === "date") {
        tasks.sort((a, b) => new Date(a.due || Infinity) - new Date(b.due || Infinity));
    } else if (sortTasks.value === "category") {
        tasks.sort((a, b) => a.category.localeCompare(b.category));
    }
    saveTasks();
});

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
        tasks = [];
        saveTasks();
    }
});

renderTasks();
