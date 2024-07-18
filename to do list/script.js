document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('new-task-input');
  const addTaskButton = document.getElementById('add-task-button');
  const taskList = document.getElementById('task-list');

  // Load tasks from local storage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Function to save tasks to local storage
  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Function to render tasks
  const renderTasks = () => {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item' + (task.completed ? ' completed' : '');
      taskItem.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} data-index=${index}>
        <span class="task-text">${task.text}</span>
        <input type="text" class="edit-input" value="${task.text}" style="display: none;">
        <button class="edit-button" data-index=${index}>Edit</button>
        <button class="delete-button" data-index=${index}>Delete</button>
      `;
      taskList.appendChild(taskItem);
    });
  };

  // Function to add a new task
  const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
      alert('Task cannot be empty.');
      return;
    }
    tasks.push({ text: taskText, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
  };

  // Function to toggle task completion
  const toggleTaskCompletion = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  // Function to edit a task
  const editTask = (index) => {
    const taskItem = taskList.children[index];
    const editInput = taskItem.querySelector('.edit-input');
    const taskText = taskItem.querySelector('.task-text');

    if (editInput.style.display === 'none') {
      editInput.style.display = 'inline';
      taskText.style.display = 'none';
      editInput.focus();
    } else {
      tasks[index].text = editInput.value.trim();
      saveTasks();
      renderTasks();
    }
  };
  
  // Function to delete a task
  const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  // Add event listeners for task management
  addTaskButton.addEventListener('click', addTask);
  taskList.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const index = e.target.dataset.index;
      toggleTaskCompletion(index);
    }
  });
  taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-button')) {
      const index = e.target.dataset.index;
      editTask(index);
    } else if (e.target.classList.contains('delete-button')) {
      const index = e.target.dataset.index;
      deleteTask(index);
    }
  });

  // Function to update date and time
  const updateDateTime = () => {
    const now = new Date();
    const options = { weekday: 'long' };
    const day = now.toLocaleDateString(undefined, options);
    const formattedDate = now.toLocaleDateString();
    document.getElementById('day').textContent = day;
    document.getElementById('date').textContent = formattedDate;
  };

  // Initial render
  renderTasks();
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Add event listeners for quick task add
  taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      addTaskButton.click();
    }
  });
});
