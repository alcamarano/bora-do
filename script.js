// Pegar os elementos do HTML
const year = document.getElementById('year');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Pegar e enviar ao HTML o ano atual
year.textContent = new Date().getFullYear();

// Guarda as tarefas
let tasks = JSON.parse(localStorage.getItem('boraDoTasks')) || [];

// Salva as tarefas no navegador
function saveTasks() {
    localStorage.setItem('boraDoTasks', JSON.stringify(tasks));
}

// Mostra as tarefas na tela
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task) => {
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

// Executa quando o formulário é enviado
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

renderTasks();