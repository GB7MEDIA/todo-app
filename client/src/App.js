import React, { useState, useEffect } from 'react';

const getDateWithoutTime = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [taskPriority, setTaskPriority] = useState('low');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState('');
  const [sleepEndTime, setSleepEndTime] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const formattedDateTime = `${date.getFullYear()}:${(date.getMonth() + 1).toString().padStart(2, '0')}:${date.getDate().toString().padStart(2, '0')} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      return formattedDateTime;
    } catch (error) {
      console.error('Error formatting date/time:', error);
      return null;
    }
  };

  const formatDateTime2 = (dateString) => {
    try {
      const date = new Date(dateString);
      const formattedDateTime = `${date.getFullYear()}:${(date.getMonth() + 1).toString().padStart(2, '0')}:${date.getDate().toString().padStart(2, '0')}`;
      return formattedDateTime;
    } catch (error) {
      console.error('Error formatting date/time:', error);
      return null;
    }
  };

  const addTask = () => {
    const taskItem = {
      text: currentInput,
      priority: taskPriority,
      dueDate: taskDueDate,
      done: false,
    };

    const isTextDuplicate = tasks.some((task, index) => index !== editingIndex && task.text === taskItem.text);

    if (isTextDuplicate) {
      alert("Task with the same text already exists. Please choose a different text.");
      return;
    }

    if (!taskDueDate) {
      alert("Please provide a due date for the task.");
      return;
    }

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

  const sortedTasks = tasks.slice().sort((a, b) => {
    const taskPriorityOrder = { high: 3, medium: 2, low: 1 };

    const getDateWithoutTime = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

    const aDateWithoutTime = getDateWithoutTime(a.dueDate);
    const bDateWithoutTime = getDateWithoutTime(b.dueDate);

    if (aDateWithoutTime !== bDateWithoutTime) {
      return aDateWithoutTime.localeCompare(bDateWithoutTime);
    }

    if (taskPriorityOrder[a.priority] !== taskPriorityOrder[b.priority]) {
      return taskPriorityOrder[b.priority] - taskPriorityOrder[a.priority];
    }

    return a.text.localeCompare(b.text);
  });

  const filteredTasks = sortedTasks.filter((task) => {
    const taskDateTime = new Date(task.dueDate);
    const sleepStartTimeDate = new Date(`2000-01-01 ${sleepStartTime}`);
    const sleepEndTimeDate = new Date(`2000-01-01 ${sleepEndTime}`);

    return (
      taskDateTime < sleepStartTimeDate || taskDateTime > sleepEndTimeDate
    );
  });

  const uniqueDueDates = [...new Set(filteredTasks.map(task => getDateWithoutTime(task.dueDate)))];

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
        <label htmlFor="sleepStartTime">Sleep Start Time</label>
        <input
          type="time"
          id="sleepStartTime"
          value={sleepStartTime}
          onChange={(e) => setSleepStartTime(e.target.value)}
        />
        <label htmlFor="sleepEndTime">Sleep End Time</label>
        <input
          type="time"
          id="sleepEndTime"
          value={sleepEndTime}
          onChange={(e) => setSleepEndTime(e.target.value)}
        />
        <button onClick={addTask}>
          {editingIndex !== null ? 'Save' : 'Add'}
        </button>
        {editingIndex !== null && <button onClick={cancelEditingState}>Cancel</button>}
        {tasks.length > 1 && <button onClick={deleteAllTasks}>Delete All</button>}
        {tasks.length > 1 && !allTasksCompleted && <button onClick={markAllTasksCompleted}>Mark All Done</button>}
      </div>
      <ul>
        {uniqueDueDates.map((dueDate, dateIndex) => (
          <li key={dateIndex}>
            <h2>{formatDateTime2(dueDate, { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
            <ul>
              {filteredTasks
                .filter(task => getDateWithoutTime(task.dueDate) === dueDate)
                .map((task, index) => {
                  const originalIndex = tasks.findIndex(t => t.text === task.text);

                  return (
                    <li key={index} className={task.done ? 'done' : ''}>
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTaskCompletion(originalIndex)}
                      />
                      <label htmlFor={`checkbox-${originalIndex}`}>
                        <strong>{task.text}</strong> - Priority: {task.priority} - DueDate: {formatDateTime(task.dueDate)}
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


