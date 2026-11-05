const year = document.getElementById('year');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filters__button');
const completedTasks = document.getElementById('completedTasks');
const numberTasks = document.getElementById('numberTasks');
const pendingMessage = document.getElementById('pendingMessage');

year.textContent = new Date().getFullYear();

let tasks = JSON.parse(localStorage.getItem('boraDoTasks')) || [];

let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('boraDoTasks', JSON.stringify(tasks));
}

function getFilteredTasks() {
    if (currentFilter === 'pending') {
        return tasks.filter((task) => !task.completed);
    }

    if (currentFilter === 'completed') {
        return tasks.filter((task) => task.completed);
    }

    return tasks;
}

function updateCounters() {
    const total = tasks.length;
    const pending = tasks.filter((task) => !task.completed).length;
    const completed = total - pending;

    completedTasks.textContent = completed;
    numberTasks.textContent = total;

    if (total === 0) {
        pendingMessage.textContent = 'adicione uma tarefa';
    } else if (pending === 0) {
        pendingMessage.textContent = 'tudo feito';
    } else if (pending === 1) {
        pendingMessage.textContent = 'falta 1 tarefa';
    } else {
        pendingMessage.textContent = `faltam ${pending} tarefas`;
    }
}

function renderTasks() {
    updateCounters();
    taskList.innerHTML = '';
    getFilteredTasks().forEach((task) => {
        const item = document.createElement('li');
        item.className = 'task';
        item.innerHTML = `
            <label class="task__label">
                <input type="checkbox" class="task__checkbox">
                <span class="task__title"></span>
            </label>
            <div class="task__buttons">
                <button class="task__action task__action--edit" type="button">
                    <img src="image/edit.png" alt="" width="16" height="16">
                </button>
                <button class="task__action task__action--delete" type="button">
                    <img src="image/delete.png" alt="" width="16" height="16">
                </button>
            </div>
        `;

        item.querySelector('.task__title').textContent = task.title;
        const checkbox = item.querySelector('.task__checkbox');
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });
        const editButton = item.querySelector('.task__action--edit');
        editButton.setAttribute('aria-label', `Editar: ${task.title}`);
        editButton.addEventListener('click', () => {
            const newTitle = prompt('Editar tarefa:', task.title);
            if (newTitle === null) {
                return;
            }
            const title = newTitle.trim();
            if (title === '') {
                return;
            }
            task.title = title;
            saveTasks();
            renderTasks();
        });
        const deleteButton = item.querySelector('.task__action--delete');

        deleteButton.setAttribute('aria-label', `Excluir: ${task.title}`);

        deleteButton.addEventListener('click', () => {
            tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
            saveTasks();
            renderTasks();
        });
        taskList.appendChild(item);
    });
}
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = taskInput.value.trim();
    if (title === '') {
        taskForm.reset();
        taskInput.focus();
        return;
    }
    const newTask = {
        id: Date.now(),
        title: title,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskForm.reset();
    taskInput.focus();
});
filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
            const isActive = filterButton === button;

            filterButton.classList.toggle('filters__button--active', isActive);
            filterButton.setAttribute('aria-pressed', isActive);
        });

        renderTasks();
    });
});
renderTasks();