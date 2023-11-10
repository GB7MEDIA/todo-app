import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [taskPriority, setTaskPriority] = useState('low');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);


  // Getting tasks from local storage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Saving tasks to local storage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const formatDateTime = (dateString, options = {}) => {
    try {
      const formattedDateTime = new Date(dateString)
        .toLocaleString('en-US', { ...options, hour12: false });
      return formattedDateTime;
    } catch (error) {
      console.error('Error formatting date/time:', error);
      return null; // or throw an exception, depending on your error handling strategy
    }
  };
  

  const addTasks = (text, priority, dueDate) => {
    const taskItem = {
      text: currentInput,
      priority: taskPriority,
      dueDate: taskDueDate,
      done: false,
    };
  
    if (editingIndex !== null) {
      const newTasks = [...tasks];
      newTasks[editingIndex] = taskItem;
      setTasks(newTasks);
      setEditingIndex(null);
    } else {
      if (taskItem.text.trim()) {
        setTasks([...tasks, taskItem]);
      }
    }
  
    // Reset input values
    setCurrentInput('');
    setTaskPriority('low');
    setTaskDueDate('');
  };
  

  const setEditingTaskState = (index) => {
    setEditingIndex(index);
    setCurrentInput(tasks[index].text);
    setTaskPriority(tasks[index].priority);
    setTaskDueDate(tasks[index].dueDate);
  };

  const cancelEditingState = () => {
    setEditingIndex(null);
    setCurrentInput('');
    setTaskPriority('low');
    setTaskDueDate('');
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    setEditingIndex(null);
  };

  const deleteAllTasks = () => {
    const deleteAllTasksconfirm = window.confirm("Are you sure you want to delete all tasks?");
    if (deleteAllTasksconfirm) {
      setTasks([]);
      setEditingIndex(null);
    }
  };

  const toggleTaskCompletion = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const markAllTasksCompleted = () => {
    const updatedTasks = tasks.map(task => ({ ...task, done: true }));
    setTasks(updatedTasks);
  };

  useEffect(() => {
    setAllTasksCompleted(tasks.every(task => task.done));
  }, [tasks]);

  // Sort todos by priority, due date, and then by text
  const sortedTasks = tasks.slice().sort((a, b) => {
    const taskPriorityOrder = { high: 3, medium: 2, low: 1 }; // Define priority order

    if (taskPriorityOrder[a.priority] !== taskPriorityOrder[b.priority]) {
      return taskPriorityOrder[b.priority] - taskPriorityOrder[a.priority];
    }

    if (a.dueDate && b.dueDate) {
      const taskDueDateComparison = new Date(a.dueDate) - new Date(b.dueDate);
      if (taskDueDateComparison !== 0) {
        return taskDueDateComparison;
      }
    }

    return a.text.localeCompare(b.text);
  });

  return (
    <div>
      <h1>Task App</h1>
      <div>
        <label htmlFor="task-text">Task</label>
        <input
          type="text"
          id="task-text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Enter your todo text"
        />
        <label htmlFor="priority-of-todo">Priority</label>
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          id="priority-of-todo"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="datetime-local"
          id="dueDate"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />
        <button onClick={addTasks}>
          {editingIndex !== null ? 'Save' : 'Add'}
        </button>
        {editingIndex !== null && <button onClick={cancelEditingState}>Cancel</button>}
        {tasks.length > 1 && <button onClick={deleteAllTasks}>Delete All</button>}
        {tasks.length > 1 && !allTasksCompleted && <button onClick={markAllTasksCompleted}>Mark All Done</button>}
      </div>
      <ul>
        {sortedTasks.map((task, index) => {
          const originalIndex = tasks.findIndex(t => t.text === task.text);

          return (
            <li key={index} className={task.done ? 'done' : ''}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTaskCompletion(originalIndex)}
              />
              <label htmlFor={`checkbox-${originalIndex}`}>
                <strong>{task.text}</strong> - Priority: {task.priority}, Due: {formatDateTime(`${task.dueDate}`, { hour: 'numeric', minute: 'numeric' })}
                {editingIndex !== originalIndex && (
                  <>
                    {!task.done && (
                      <button onClick={() => setEditingTaskState(originalIndex)}>
                        Edit
                      </button>
                    )}
                    <button onClick={() => deleteTask(originalIndex)}>
                      Delete
                    </button>
                  </>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;

