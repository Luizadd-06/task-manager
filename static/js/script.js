document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const priorityFilter = document.getElementById('priorityFilter');
    const statusFilter = document.getElementById('statusFilter');
    const editModal = isAdmin ? new bootstrap.Modal(document.getElementById('editModal')) : null;
    const editTaskInput = document.getElementById('editTaskInput');
    const editTaskId = document.getElementById('editTaskId');
    const saveEditBtn = document.getElementById('saveEdit');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    fetchTasks();

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.remove(currentTheme);
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    if (isAdmin && taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = taskInput.value.trim();
            if (text) {
                const response = await fetch('/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });
                if (response.ok) {
                    taskInput.value = '';
                    fetchTasks();
                } else {
                    alert('Erro ao adicionar tarefa');
                }
            }
        });
    }

    priorityFilter.addEventListener('change', fetchTasks);
    statusFilter.addEventListener('change', fetchTasks);

    async function fetchTasks() {
        const priority = priorityFilter.value;
        const status = statusFilter.value;
        let url = '/tasks';
        const params = new URLSearchParams();
        if (priority) params.append('priority', priority);
        if (status) params.append('status', status);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item ${task.done ? 'done' : ''}`;
            li.innerHTML = `
                <div>
                    <input type="checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}" ${!isAdmin ? 'disabled' : ''}>
                    ${task.text} <span class="badge bg-${getBadgeColor(task.priority)}">${task.priority}</span>
                    <small class="text-muted ms-2">${task.created_at}</small>
                </div>
                ${isAdmin ? `
                    <div>
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${task.id}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${task.id}">Excluir</button>
                    </div>
                ` : ''}
            `;
            taskList.appendChild(li);

            const checkbox = li.querySelector('input');
            if (isAdmin && checkbox) {
                checkbox.addEventListener('change', async (e) => {
                    const taskId = e.target.dataset.id;
                    const done = e.target.checked;
                    await fetch(`/tasks/${taskId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ done })
                    });
                    fetchTasks();
                });
            }

            if (isAdmin) {
                const editBtn = li.querySelector('.edit-btn');
                if (editBtn) {
                    editBtn.addEventListener('click', () => {
                        editTaskId.value = task.id;
                        editTaskInput.value = task.text;
                        editModal.show();
                    });
                }

                const deleteBtn = li.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', async () => {
                        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                            await fetch(`/tasks/${task.id}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' }
                            });
                            fetchTasks();
                        }
                    });
                }
            }
        });
    }

    if (isAdmin && saveEditBtn) {
        saveEditBtn.addEventListener('click', async () => {
            const taskId = editTaskId.value;
            const text = editTaskInput.value.trim();
            if (text) {
                await fetch(`/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });
                editModal.hide();
                fetchTasks();
            }
        });
    }

    function getBadgeColor(priority) {
        return priority === 'High' ? 'danger' : priority === 'Medium' ? 'warning' : 'success';
    }

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
});