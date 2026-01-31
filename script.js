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

        // Check if we've reached the limit of 7 tasks
        if (taskList.children.length >= 7) {
            alert('You can only have a maximum of 7 tasks at a time.');
            return;
        }

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
            checkAllCompleted();
        });

        li.querySelector('.edit-btn').addEventListener('click', () => {
            const span = li.querySelector('span');
            const newTaskText = prompt('Edit Task:', span.textContent);
            if (newTaskText !== null) {
                span.textContent = newTaskText.trim();
            }
        });

        // Add event listener for checkbox to check completion
        li.querySelector('.checkbox').addEventListener('change', checkAllCompleted);

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyImage();
        checkAllCompleted();
    };

    // Function to check if all tasks are completed
    const checkAllCompleted = () => {
        const tasks = taskList.querySelectorAll('li');
        const checkboxes = taskList.querySelectorAll('.checkbox');
        
        if (tasks.length === 0) {
            return;
        }
        
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        
        if (allChecked) {
            showConfetti();
        }
    };

    // Function to create confetti animation
    const showConfetti = () => {
        // Remove any existing confetti
        const existingConfetti = document.querySelectorAll('.confetti');
        existingConfetti.forEach(confetti => confetti.remove());
        
        // Create confetti elements
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
            document.body.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            const confettiElements = document.querySelectorAll('.confetti');
            confettiElements.forEach(confetti => confetti.remove());
        }, 5000);
    };

    // Helper function to get random colors for confetti
    const getRandomColor = () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(e);
        }
    });
});
