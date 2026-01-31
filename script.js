document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');

    console.log("Empty Image Element = ", emptyImage);

    const toggleEmptyImage = () => {

        if (taskList.children.length === 0) {
            emptyImage.style.display = 'block';
        } else {
            emptyImage.style.display = 'none';
        }


        if (taskList.children.length > 0) {
            todosContainer.style.width = '100%';
        } else {
            todosContainer.style.width = '50%';
        }

    };

    const addTask = (event) => {
        event.preventDefault();

        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `

            <input type="checkbox" class="checkbox">
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

        li.querySelector('.delete-btn').addEventListener('click', () => {
            taskList.removeChild(li);
            toggleEmptyImage();
        });

        li.querySelector('.edit-btn').addEventListener('click', () => {
            const span = li.querySelector('span');
            const newTaskText = prompt('Edit Task:', span.textContent);
            if (newTaskText !== null) {
                span.textContent = newTaskText.trim();
            }
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyImage();
    };

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(e);
        }
    });
});
