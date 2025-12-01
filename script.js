// Wait for the HTML document to fully load before running JS
document.addEventListener("DOMContentLoaded", function () {

    // Select DOM elements
    const addButton = document.getElementById("add-task-btn");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");

    // In-memory tasks array (each task is an object: { id: string, text: string })
    let tasks = [];

    // Save the current tasks array to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create a DOM element for a task object and append it to the list
    // taskObj: { id, text }
    function createTaskElement(taskObj) {
        // Create new list item
        const li = document.createElement("li");
        li.dataset.id = taskObj.id;

        // Use a span so we can keep the text separate from the remove button
        const span = document.createElement("span");
        span.textContent = taskObj.text;

        // Create Remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-btn";

        // Remove task when button is clicked: remove from DOM and update localStorage
        removeBtn.onclick = function () {
            // Remove from DOM
            if (li.parentNode) {
                li.parentNode.removeChild(li);
            }
            // Remove from tasks array by id
            tasks = tasks.filter(t => t.id !== taskObj.id);
            // Persist change
            saveTasks();
        };

        // Build li: [text span] [remove button]
        li.appendChild(span);
        li.appendChild(removeBtn);

        // Append to the visible list
        taskList.appendChild(li);
    }

    // Add a new task from the input field (handles UI + storage)
    function addTask() {
        // Get the input value and trim spaces
        const taskText = taskInput.value.trim();

        // Check if input is empty
        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }

        // Create a task object with a unique id to allow duplicates of the same text
        const taskObj = {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            text: taskText
        };

        // Add to in-memory array and persist
        tasks.push(taskObj);
        saveTasks();

        // Create and append the DOM element for this task
        createTaskElement(taskObj);

        // Clear the input field
        taskInput.value = "";
    }

    // Load tasks from localStorage and render them
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

        // Ensure storedTasks is an array; if not, reset it
        if (!Array.isArray(storedTasks)) {
            tasks = [];
            saveTasks();
            return;
        }

        // Populate in-memory array
        tasks = storedTasks;

        // Render each saved task
        tasks.forEach(taskObj => {
            createTaskElement(taskObj);
        });
    }

    // Add task when Add Task button is clicked
    addButton.addEventListener("click", addTask);

    // Add task when pressing Enter key
    taskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    // Load tasks from local storage when page loads
    loadTasks();
});
