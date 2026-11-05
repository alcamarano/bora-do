// Pegar os elementos do HTML
const year = document.getElementById('year');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Pegar e enviar ao HTML o ano atual
year.textContent = new Date().getFullYear();

// Guarda as tarefas
let tasks = [];

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
        });
        item.querySelector('.task__action--edit').setAttribute('aria-label', `Editar: ${task.title}`);
        item.querySelector('.task__action--delete').setAttribute('aria-label', `Excluir: ${task.title}`);
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
    renderTasks();

    taskForm.reset();
    taskInput.focus();
});