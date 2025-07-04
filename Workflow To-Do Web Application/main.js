class TodoApp {
  constructor() {
    this.todos = this.loadTodos();
    this.currentFilter = 'all';
    this.currentEditId = null;
    this.searchQuery = '';
    
    this.initializeElements();
    this.attachEventListeners();
    this.render();
  }

  initializeElements() {
    this.todoInput = document.getElementById('todoInput');
    this.prioritySelect = document.getElementById('prioritySelect');
    this.addBtn = document.getElementById('addTodoBtn');
    this.todoList = document.getElementById('todoList');
    this.emptyState = document.getElementById('emptyState');
    this.searchInput = document.getElementById('searchInput');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
    this.clearAllBtn = document.getElementById('clearAllBtn');
    
    // Stats elements
    this.totalTodosElement = document.getElementById('totalTodos');
    this.completedTodosElement = document.getElementById('completedTodos');
    this.activeTodosElement = document.getElementById('activeTodos');
    
    // Modal elements
    this.editModal = document.getElementById('editModal');
    this.editInput = document.getElementById('editInput');
    this.editPrioritySelect = document.getElementById('editPrioritySelect');
    this.closeModal = document.getElementById('closeModal');
    this.cancelEdit = document.getElementById('cancelEdit');
    this.saveEdit = document.getElementById('saveEdit');
  }

  attachEventListeners() {
    // Add todo
    this.addBtn.addEventListener('click', () => this.addTodo());
    this.todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTodo();
    });

    // Search
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.render();
    });

    // Filter buttons
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFilter(btn.dataset.filter);
      });
    });

    // Clear actions
    this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    this.clearAllBtn.addEventListener('click', () => this.clearAll());

    // Modal events
    this.closeModal.addEventListener('click', () => this.closeEditModal());
    this.cancelEdit.addEventListener('click', () => this.closeEditModal());
    this.saveEdit.addEventListener('click', () => this.saveEditedTodo());
    this.editModal.addEventListener('click', (e) => {
      if (e.target === this.editModal) this.closeEditModal();
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.editModal.classList.contains('active')) {
        this.closeEditModal();
      }
    });
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addTodo() {
    const text = this.todoInput.value.trim();
    const priority = this.prioritySelect.value;
    
    if (!text) {
      this.showToast('Please enter a task!', 'error');
      return;
    }

    const todo = {
      id: this.generateId(),
      text: text,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.unshift(todo);
    this.saveTodos();
    this.todoInput.value = '';
    this.prioritySelect.value = 'medium';
    this.render();
    this.showToast('Task added successfully!', 'success');
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.render();
      this.showToast(
        todo.completed ? 'Task completed!' : 'Task marked as active!',
        'success'
      );
    }
  }

  deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.todos = this.todos.filter(t => t.id !== id);
      this.saveTodos();
      this.render();
      this.showToast('Task deleted!', 'success');
    }
  }

  editTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      this.currentEditId = id;
      this.editInput.value = todo.text;
      this.editPrioritySelect.value = todo.priority;
      this.editModal.classList.add('active');
      this.editInput.focus();
    }
  }

  saveEditedTodo() {
    const text = this.editInput.value.trim();
    const priority = this.editPrioritySelect.value;
    
    if (!text) {
      this.showToast('Please enter a task!', 'error');
      return;
    }

    const todo = this.todos.find(t => t.id === this.currentEditId);
    if (todo) {
      todo.text = text;
      todo.priority = priority;
      this.saveTodos();
      this.closeEditModal();
      this.render();
      this.showToast('Task updated successfully!', 'success');
    }
  }

  closeEditModal() {
    this.editModal.classList.remove('active');
    this.currentEditId = null;
    this.editInput.value = '';
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.render();
  }

  clearCompleted() {
    const completedCount = this.todos.filter(t => t.completed).length;
    if (completedCount === 0) {
      this.showToast('No completed tasks to clear!', 'info');
      return;
    }

    if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
      this.todos = this.todos.filter(t => !t.completed);
      this.saveTodos();
      this.render();
      this.showToast(`${completedCount} completed task(s) deleted!`, 'success');
    }
  }

  clearAll() {
    if (this.todos.length === 0) {
      this.showToast('No tasks to clear!', 'info');
      return;
    }

    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
      this.todos = [];
      this.saveTodos();
      this.render();
      this.showToast('All tasks deleted!', 'success');
    }
  }

  getFilteredTodos() {
    let filtered = [...this.todos];

    // Apply search filter
    if (this.searchQuery) {
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(this.searchQuery)
      );
    }

    // Apply status filter
    switch (this.currentFilter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    return filtered;
  }

  updateStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const active = total - completed;

    this.totalTodosElement.textContent = total;
    this.completedTodosElement.textContent = completed;
    this.activeTodosElement.textContent = active;
  }

  render() {
    this.updateStats();
    
    const filteredTodos = this.getFilteredTodos();
    
    if (filteredTodos.length === 0) {
      this.todoList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <h3>${this.searchQuery ? 'No tasks found' : 'No tasks yet'}</h3>
          <p>${this.searchQuery ? 'Try a different search term' : 'Add your first task to get started!'}</p>
        </div>
      `;
      return;
    }

    this.todoList.innerHTML = filteredTodos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
             onclick="app.toggleTodo('${todo.id}')">
          ${todo.completed ? '<i class="fas fa-check"></i>' : ''}
        </div>
        <div class="todo-content">
          <div class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</div>
          <div class="todo-priority priority-${todo.priority}">${this.capitalizeFirst(todo.priority)} Priority</div>
        </div>
        <div class="todo-actions">
          <button class="action-btn edit-btn" onclick="app.editTodo('${todo.id}')" title="Edit task">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" onclick="app.deleteTodo('${todo.id}')" title="Delete task">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${this.getToastIcon(type)}"></i>
        <span>${message}</span>
      </div>
    `;

    // Add styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getToastColor(type)};
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      max-width: 350px;
    `;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Hide toast
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  getToastIcon(type) {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      default: return 'info-circle';
    }
  }

  getToastColor(type) {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      default: return '#2196F3';
    }
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  loadTodos() {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  }
}

// Initialize the app
const app = new TodoApp();

// Add some sample todos if none exist
if (app.todos.length === 0) {
  const sampleTodos = [
    { id: 'sample1', text: 'Welcome to TaskFlow! 🎉', priority: 'high', completed: false, createdAt: new Date().toISOString() },
    { id: 'sample2', text: 'Try editing this task by clicking the edit button', priority: 'medium', completed: false, createdAt: new Date().toISOString() },
    { id: 'sample3', text: 'Mark this task as complete', priority: 'low', completed: false, createdAt: new Date().toISOString() },
    { id: 'sample4', text: 'This is a completed task', priority: 'medium', completed: true, createdAt: new Date().toISOString() }
  ];
  
  app.todos = sampleTodos;
  app.saveTodos();
  app.render();
}