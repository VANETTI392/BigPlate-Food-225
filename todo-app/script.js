// Task Manager Application
let tasks = [];
let currentFilter = {
    category: 'all',
    status: 'all',
    priority: 'all',
    search: '',
    date: 'all'
};
let sortBy = 'date-newest';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    setTodayDate();
    renderTasks();
    updateStats();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('stats-btn').addEventListener('click', showStats);
    document.getElementById('export-btn').addEventListener('click', exportTasks);
    document.getElementById('task-input').addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
    });
}

// Set today's date in the date input
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('due-date-input').value = today;
}

// Add Task
function addTask() {
    const taskInput = document.getElementById('task-input');
    const categorySelect = document.getElementById('category-select');
    const prioritySelect = document.getElementById('priority-select');
    const dueDateInput = document.getElementById('due-date-input');

    const title = taskInput.value.trim();
    if (!title) {
        showNotification('Please enter a task title', 'error');
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        description: '',
        category: categorySelect.value,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    
    // Clear form
    taskInput.value = '';
    setTodayDate();
    
    showNotification('Task added successfully!', 'success');
}

// Handle Enter key in task input
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

// Toggle Task Completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Delete Task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
        showNotification('Task deleted', 'success');
    }
}

// Duplicate Task
function duplicateTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newTask = {
            ...task,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        updateStats();
        showNotification('Task duplicated', 'success');
    }
}

// Edit Task - Open Modal
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-description').value = task.description;
        document.getElementById('edit-category').value = task.category;
        document.getElementById('edit-priority').value = task.priority;
        document.getElementById('edit-due-date').value = task.dueDate;
        document.getElementById('edit-modal').dataset.taskId = id;
        document.getElementById('edit-modal').classList.add('active');
    }
}

// Save Edited Task
function saveEditedTask(event) {
    event.preventDefault();
    const taskId = parseInt(document.getElementById('edit-modal').dataset.taskId);
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.title = document.getElementById('edit-title').value;
        task.description = document.getElementById('edit-description').value;
        task.category = document.getElementById('edit-category').value;
        task.priority = document.getElementById('edit-priority').value;
        task.dueDate = document.getElementById('edit-due-date').value;
        
        saveTasks();
        renderTasks();
        updateStats();
        closeEditModal();
        showNotification('Task updated successfully!', 'success');
    }
}

// Close Edit Modal
function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

// Filter by Category
function filterByCategory(category) {
    currentFilter.category = category;
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    renderTasks();
}

// Filter by Status
function filterByStatus(status) {
    currentFilter.status = status;
    document.querySelectorAll('.view-item').forEach(item => {
        item.classList.remove('active');
    });
    if (status !== 'all') {
        document.querySelector(`[data-view="${status}"]`).classList.add('active');
    }
    renderTasks();
}

// Filter by Date
function filterByDate(date) {
    currentFilter.date = date;
    renderTasks();
}

// Filter by Priority
function filterByPriority(priority) {
    currentFilter.priority = priority;
    document.querySelectorAll('.priority-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-priority="${priority}"]`).classList.add('active');
    renderTasks();
}

// Search Tasks
function searchTasks() {
    currentFilter.search = document.getElementById('search-input').value.toLowerCase();
    renderTasks();
}

// Sort Tasks
function sortTasks() {
    sortBy = document.getElementById('sort-select').value;
    renderTasks();
}

// Get filtered tasks
function getFilteredTasks() {
    let filtered = tasks;

    // Category filter
    if (currentFilter.category !== 'all') {
        filtered = filtered.filter(t => t.category === currentFilter.category);
    }

    // Status filter
    if (currentFilter.status === 'pending') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter.status === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    // Priority filter
    if (currentFilter.priority !== 'all') {
        filtered = filtered.filter(t => t.priority === currentFilter.priority);
    }

    // Date filter
    if (currentFilter.date === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(t => t.dueDate === today);
    }

    // Search filter
    if (currentFilter.search) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(currentFilter.search) ||
            t.description.toLowerCase().includes(currentFilter.search)
        );
    }

    // Sort
    switch(sortBy) {
        case 'date-newest':
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'date-oldest':
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'priority-high':
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        case 'priority-low':
            const priorityOrderLow = { low: 0, medium: 1, high: 2 };
            filtered.sort((a, b) => priorityOrderLow[a.priority] - priorityOrderLow[b.priority]);
            break;
        case 'name-az':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-za':
            filtered.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }

    return filtered;
}

// Render Tasks
function renderTasks() {
    const container = document.getElementById('tasks-container');
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>No tasks found. Add one to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => {
        const categoryEmoji = {
            work: '💼',
            personal: '👤',
            shopping: '🛒',
            health: '💚'
        };

        const categoryLabel = {
            work: 'Work',
            personal: 'Personal',
            shopping: 'Shopping',
            health: 'Health'
        };

        const priorityEmoji = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };

        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const isOverdue = dueDate < today && !task.completed && task.dueDate !== '';

        return `
            <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id})"
                >
                <div class="task-content">
                    <div class="task-header">
                        <span class="task-title">${escapeHtml(task.title)}</span>
                    </div>
                    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                    <div class="task-meta">
                        <span class="task-badge category-badge">
                            ${categoryEmoji[task.category]} ${categoryLabel[task.category]}
                        </span>
                        <span class="task-badge priority-badge-item ${task.priority}">
                            ${priorityEmoji[task.priority]} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        ${task.dueDate ? `
                            <span class="task-badge due-date-badge">
                                📅 ${formatDate(task.dueDate)}
                                ${isOverdue ? ' (Overdue)' : ''}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn btn-edit" onclick="editTask(${task.id})" title="Edit">✏️</button>
                    <button class="task-btn btn-duplicate" onclick="duplicateTask(${task.id})" title="Duplicate">📋</button>
                    <button class="task-btn btn-delete" onclick="deleteTask(${task.id})" title="Delete">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// Update Statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Update counts
    document.getElementById('count-all').textContent = total;
    document.getElementById('count-work').textContent = tasks.filter(t => t.category === 'work').length;
    document.getElementById('count-personal').textContent = tasks.filter(t => t.category === 'personal').length;
    document.getElementById('count-shopping').textContent = tasks.filter(t => t.category === 'shopping').length;
    document.getElementById('count-health').textContent = tasks.filter(t => t.category === 'health').length;
    document.getElementById('count-pending').textContent = pending;
    document.getElementById('count-completed').textContent = completed;
    document.getElementById('count-today').textContent = tasks.filter(t => {
        const today = new Date().toISOString().split('T')[0];
        return t.dueDate === today;
    }).length;
    document.getElementById('count-high').textContent = tasks.filter(t => t.priority === 'high').length;
    document.getElementById('count-medium').textContent = tasks.filter(t => t.priority === 'medium').length;
    document.getElementById('count-low').textContent = tasks.filter(t => t.priority === 'low').length;

    // Update stats in modal if it's open
    const statsModal = document.getElementById('stats-modal');
    if (statsModal.classList.contains('active')) {
        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-completed').textContent = completed;
        document.getElementById('stat-pending').textContent = pending;
        document.getElementById('stat-completion').textContent = completionRate + '%';

        // Category breakdown
        const categoryStats = `
            <div class="stat-row">
                <span class="stat-row-label">💼 Work</span>
                <span class="stat-row-value">${tasks.filter(t => t.category === 'work').length}</span>
            </div>
            <div class="stat-row">
                <span class="stat-row-label">👤 Personal</span>
                <span class="stat-row-value">${tasks.filter(t => t.category === 'personal').length}</span>
            </div>
            <div class="stat-row">
                <span class="stat-row-label">🛒 Shopping</span>
                <span class="stat-row-value">${tasks.filter(t => t.category === 'shopping').length}</span>
            </div>
            <div class="stat-row">
                <span class="stat-row-label">💚 Health</span>
                <span class="stat-row-value">${tasks.filter(t => t.category === 'health').length}</span>
            </div>
        `;
        document.getElementById('category-stats').innerHTML = categoryStats;

        // Priority breakdown
        const priorityStats = `
            <div class="stat-row">
                <span class="stat-row-label">🔴 High</span>
                <span class="stat-row-value">${tasks.filter(t => t.priority === 'high').length}</span>
            </div>
            <div class="stat-row">
                <span class="stat-row-label">🟡 Medium</span>
                <span class="stat-row-value">${tasks.filter(t => t.priority === 'medium').length}</span>
            </div>
            <div class="stat-row">
                <span class="stat-row-label">🟢 Low</span>
                <span class="stat-row-value">${tasks.filter(t => t.priority === 'low').length}</span>
            </div>
        `;
        document.getElementById('priority-stats').innerHTML = priorityStats;
    }
}

// Show Statistics Modal
function showStats() {
    updateStats();
    document.getElementById('stats-modal').classList.add('active');
}

// Close Statistics Modal
function closeStats() {
    document.getElementById('stats-modal').classList.remove('active');
}

// Export Tasks as JSON
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Tasks exported successfully!', 'success');
}

// Clear All Tasks
function clearAllTasks() {
    if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
        tasks = [];
        saveTasks();
        renderTasks();
        updateStats();
        showNotification('All tasks cleared', 'success');
    }
}

// LocalStorage Functions
function saveTasks() {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('taskflow-tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'info') {
    // Simple notification - can be enhanced with toast library
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Close modals on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.getElementById('stats-modal').classList.remove('active');
        document.getElementById('edit-modal').classList.remove('active');
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    const statsModal = document.getElementById('stats-modal');
    const editModal = document.getElementById('edit-modal');
    
    if (event.target === statsModal) {
        statsModal.classList.remove('active');
    }
    if (event.target === editModal) {
        editModal.classList.remove('active');
    }
};

// Auto-focus on task input when page loads
window.addEventListener('load', function() {
    document.getElementById('task-input').focus();
});
