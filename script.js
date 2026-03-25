document.addEventListener('DOMContentLoaded', () => {
    // --- DOM refs ---
    const taskInput    = document.getElementById('task-input');
    const addTaskBtn   = document.getElementById('add-task-btn');
    const taskList     = document.getElementById('task-list');
    const emptyImage   = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');

    const todoView     = document.getElementById('todo-view');
    const matrixView   = document.getElementById('matrix-view');
    const navTodo      = document.getElementById('nav-todo');
    const navMatrix    = document.getElementById('nav-matrix');
    const viewTitle    = document.getElementById('view-title');
    const todoApp      = document.querySelector('.todo-app');

    const quadrantModal    = document.getElementById('quadrant-modal');
    const modalTitle       = document.getElementById('modal-title');
    const modalNewInput    = document.getElementById('modal-new-input');
    const modalAddNewBtn   = document.getElementById('modal-add-new');
    const modalCancel      = document.getElementById('modal-cancel');
    const modalExistingList = document.getElementById('modal-existing-list');

    // --- In-memory state ---
    let tasks = [];
    let activeQuadrant = null;

    const QUADRANTS = {
        A: 'Important & Urgent',
        B: 'Important, Not Urgent',
        C: 'Urgent, Not Important',
        D: 'Not Important, Not Urgent',
    };

    // --- Persistence ---
    const saveTasks = () => {
        localStorage.setItem('myTasks', JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const saved = JSON.parse(localStorage.getItem('myTasks')) || [];
        // Migrate old format (no quadrant field)
        tasks = saved.map(t => ({
            text: t.text,
            completed: t.completed,
            quadrant: t.quadrant || null
        }));
        renderTodoList();
        renderMatrix();
    };

    // --- Todo View ---
    const renderTodoList = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            taskList.appendChild(createTodoElement(task, index));
        });
        toggleEmptyImage();
        checkAllCompleted();
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

    const createTodoElement = (task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTodoList();
            renderMatrix();
        });

        li.querySelector('.edit-btn').addEventListener('click', () => {
            const newText = prompt('Edit Task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                tasks[index].text = newText.trim();
                saveTasks();
                renderTodoList();
                renderMatrix();
            }
        });

        li.querySelector('.checkbox').addEventListener('change', (e) => {
            tasks[index].completed = e.target.checked;
            saveTasks();
            renderMatrix();
            checkAllCompleted();
        });

        return li;
    };

    const handleAddTask = (event) => {
        event.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;
        if (tasks.length >= 30) {
            alert('You can have a maximum of 30 tasks at a time.');
            return;
        }
        tasks.push({ text, completed: false, quadrant: null });
        taskInput.value = '';
        saveTasks();
        renderTodoList();
    };

    const checkAllCompleted = () => {
        if (tasks.length === 0) return;
        if (tasks.every(t => t.completed)) showConfetti();
    };

    // --- Matrix View ---
    const renderMatrix = () => {
        Object.keys(QUADRANTS).forEach(q => {
            const list = document.getElementById(`matrix-list-${q}`);
            if (!list) return;
            list.innerHTML = '';
            tasks.forEach((task, index) => {
                if (task.quadrant === q) {
                    list.appendChild(createMatrixTaskElement(task, index));
                }
            });
        });
    };

    const createMatrixTaskElement = (task, index) => {
        const li = document.createElement('li');
        li.className = 'matrix-task';
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
            <button class="matrix-remove-btn" title="Remove from matrix">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        li.querySelector('.checkbox').addEventListener('change', (e) => {
            tasks[index].completed = e.target.checked;
            saveTasks();
            renderTodoList();
        });

        li.querySelector('.matrix-remove-btn').addEventListener('click', () => {
            tasks[index].quadrant = null;
            saveTasks();
            renderMatrix();
        });

        return li;
    };

    // --- Quadrant Modal ---
    const openQuadrantModal = (quadrant) => {
        activeQuadrant = quadrant;
        modalTitle.textContent = `Add to: ${QUADRANTS[quadrant]}`;
        modalNewInput.value = '';

        const unassigned = tasks.filter(t => !t.quadrant);
        modalExistingList.innerHTML = '';

        if (unassigned.length > 0) {
            unassigned.forEach(task => {
                const item = document.createElement('li');
                item.textContent = task.text;
                if (task.completed) item.style.opacity = '0.5';
                item.addEventListener('click', () => {
                    const idx = tasks.indexOf(task);
                    tasks[idx].quadrant = activeQuadrant;
                    saveTasks();
                    renderTodoList();
                    renderMatrix();
                    closeModal();
                });
                modalExistingList.appendChild(item);
            });
        } else {
            const empty = document.createElement('li');
            empty.textContent = 'No unassigned tasks';
            empty.className = 'modal-empty';
            modalExistingList.appendChild(empty);
        }

        quadrantModal.style.display = 'flex';
        setTimeout(() => modalNewInput.focus(), 50);
    };

    const closeModal = () => {
        quadrantModal.style.display = 'none';
        activeQuadrant = null;
    };

    modalAddNewBtn.addEventListener('click', () => {
        const text = modalNewInput.value.trim();
        if (!text) return;
        if (tasks.length >= 30) {
            alert('You can have a maximum of 30 tasks at a time.');
            return;
        }
        tasks.push({ text, completed: false, quadrant: activeQuadrant });
        saveTasks();
        renderTodoList();
        renderMatrix();
        closeModal();
    });

    modalNewInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') modalAddNewBtn.click();
    });

    modalCancel.addEventListener('click', closeModal);
    quadrantModal.addEventListener('click', (e) => {
        if (e.target === quadrantModal) closeModal();
    });

    // --- Navigation ---
    const switchView = (view) => {
        if (view === 'todo') {
            todoView.classList.remove('hidden');
            matrixView.classList.remove('active');
            navTodo.classList.add('active');
            navMatrix.classList.remove('active');
            viewTitle.textContent = 'todos';
            todoApp.classList.remove('matrix-active');
        } else {
            todoView.classList.add('hidden');
            matrixView.classList.add('active');
            navMatrix.classList.add('active');
            navTodo.classList.remove('active');
            viewTitle.textContent = 'matrix';
            todoApp.classList.add('matrix-active');
            renderMatrix();
        }
    };

    navTodo.addEventListener('click', () => switchView('todo'));
    navMatrix.addEventListener('click', () => switchView('matrix'));

    // --- Quadrant add buttons ---
    document.querySelectorAll('.quadrant-add-btn').forEach(btn => {
        btn.addEventListener('click', () => openQuadrantModal(btn.dataset.quadrant));
    });

    // --- Main form listeners ---
    addTaskBtn.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTask(e);
    });

    // --- Confetti ---
    const showConfetti = () => {
        document.querySelectorAll('.confetti').forEach(c => c.remove());
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

    loadTasks();
});
