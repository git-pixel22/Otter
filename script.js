document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');

    // --- 1. Persistence Logic: Save to Local Storage ---
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.querySelector('.checkbox').checked
            });
        });
        localStorage.setItem('myTasks', JSON.stringify(tasks));
    };

    // --- 2. Persistence Logic: Load from Local Storage ---
    const loadTasks = () => {
        const savedTasks = JSON.parse(localStorage.getItem('myTasks')) || [];
        savedTasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
        toggleEmptyImage();
    };

    const toggleEmptyImage = () => {
        if (taskList.children.length === 0) {
            emptyImage.style.display = 'block';
            todosContainer.style.width = '50%';
        } else {
            emptyImage.style.display = 'none';
            todosContainer.style.width = '100%';
        }
    };

    // Refactored to separate "creation" from "adding new"
    const createTaskElement = (taskText, isCompleted = false) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        // Event: Delete
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyImage();
            checkAllCompleted();
            saveTasks(); // Save after delete
        });

        // Event: Edit
        li.querySelector('.edit-btn').addEventListener('click', () => {
            const span = li.querySelector('span');
            const newTaskText = prompt('Edit Task:', span.textContent);
            if (newTaskText !== null && newTaskText.trim() !== "") {
                span.textContent = newTaskText.trim();
                saveTasks(); // Save after edit
            }
        });

        // Event: Checkbox
        li.querySelector('.checkbox').addEventListener('change', () => {
            checkAllCompleted();
            saveTasks(); // Save after toggle
        });

        taskList.appendChild(li);
    };

    const handleAddTask = (event) => {
        event.preventDefault();
        const taskText = taskInput.value.trim();

        if (!taskText) return;

        if (taskList.children.length >= 7) {
            alert('You can only have a maximum of 7 tasks at a time.');
            return;
        }

        createTaskElement(taskText);
        taskInput.value = '';
        toggleEmptyImage();
        saveTasks(); // Save new task
    };

    const checkAllCompleted = () => {
        const tasks = taskList.querySelectorAll('li');
        const checkboxes = taskList.querySelectorAll('.checkbox');
        if (tasks.length === 0) return;
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        if (allChecked) showConfetti();
    };

    const showConfetti = () => {
        const existingConfetti = document.querySelectorAll('.confetti');
        existingConfetti.forEach(confetti => confetti.remove());
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
            document.body.appendChild(confetti);
        }
        setTimeout(() => {
            document.querySelectorAll('.confetti').forEach(el => el.remove());
        }, 5000);
    };

    const getRandomColor = () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    addTaskBtn.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTask(e);
    });

    // Run on startup
    loadTasks();
});