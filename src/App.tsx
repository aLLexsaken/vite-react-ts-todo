import { useState, useEffect } from 'react';
import './App.css';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const App: React.FC = () => {
  const [newTask, setNewTask] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filter, setFilter] = useState<string>('all');

  // Load tasks from local storage on mount
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleAddTask = (event: React.FormEvent) => {
    event.preventDefault();
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now(),
        title: newTask,
        completed: false,
        createdAt: new Date()
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const moveTaskUp = (index: number) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index - 1], updatedTasks[index]] = [updatedTasks[index], updatedTasks[index - 1]];
      setTasks(updatedTasks);
    }
  };

  const moveTaskDown = (index: number) => {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div id="root">
      <nav id="logo">
        <a href="/">
          <img src="../AM2.png" alt="logo" />
        </a>
      </nav>

      <h1>To-Do List</h1>

      <form onSubmit={handleAddTask} id="new-task-form">
        <input
          type="text"
          id="new-task-title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button type="submit" id="add-button">Add</button>
      </form>

      <div id="taskbar">
        <li id="all-btn" onClick={() => setFilter('all')}>All</li>
        <li id="pending-btn" onClick={() => setFilter('pending')}>Pending</li>
        <li id="completed-btn" onClick={() => setFilter('completed')}>Completed</li>
      </div>
      
      <hr style={{ width: '500px' }} />

      <ul id="list">
        <h1>Today</h1>
        {filteredTasks.map((task, index) => (
          <li key={task.id} id={`${task.id}`}>
            <input
              type="checkbox"
              id="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskStatus(task.id)}
            />
            <button id="move-button" onClick={() => moveTaskUp(index)}>⤴</button>
            <button id="move-button" onClick={() => moveTaskDown(index)}>⤵</button>
            <label>{task.title}</label>
            <button id="delete-button" onClick={() => handleDeleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>

      <ul id="day-plus"><h1>Created a day ago</h1></ul>
      <ul id="week-plus"><h1>Created a week ago</h1></ul>
    </div>
  );
};

// Save tasks to local storage
function saveTasks(tasks: Task[]) {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON, (key, value) => (key === "createdAt" ? new Date(value) : value));
}

export default App;
