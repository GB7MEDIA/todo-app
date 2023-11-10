import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('low');
  const [dueDate, setDueDate] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [allDone, setAllDone] = useState(false);

  // Getting todos from local storage
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  // Saving todos to local storage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options).replace(/\//g, '.');
    return formattedDate;
  };

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: false };
    const formattedTime = new Date(dateString).toLocaleTimeString('en-US', options);
    return formattedTime;
  };

  const addTodo = () => {
    if (editIndex !== null) {
      const newTodos = [...todos];
      newTodos[editIndex] = { text: inputValue, priority: priority, dueDate: dueDate, done: false };
      setTodos(newTodos);
      setEditIndex(null);
    } else {
      if (inputValue.trim() !== '') {
        setTodos([...todos, { text: inputValue, priority: priority, dueDate: dueDate, done: false }]);
      }
    }

    setInputValue('');
    setPriority('low');
    setDueDate('');
  };

  const setEditState = (index) => {
    setEditIndex(index);
    setInputValue(todos[index].text);
    setPriority(todos[index].priority);
    setDueDate(todos[index].dueDate);
  };

  const cancelEditState = () => {
    setEditIndex(null);
    setInputValue('');
    setPriority('low');
    setDueDate('');
  };

  const deleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
    setEditIndex(null);
  };

  const deleteAll = () => {
    // Ask for confirmation before deleting all todos
    const confirmDelete = window.confirm("Are you sure you want to delete all todos?");
    if (confirmDelete) {
      setTodos([]);
      setEditIndex(null);
    }
  };

  const toggleDone = (index) => {
    const newTodos = [...todos];
    newTodos[index].done = !newTodos[index].done;
    setTodos(newTodos);
  };

  const markAllDone = () => {
    const updatedTodos = todos.map(todo => ({ ...todo, done: true }));
    setTodos(updatedTodos);
  };

// Sort todos by priority, due date, and then by text
const sortedTodos = todos.slice().sort((a, b) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 }; // Define priority order

  // Sort by priority
  if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  }

  // If priorities are the same, sort by due date
  if (a.dueDate && b.dueDate) {
    const dueDateComparison = new Date(a.dueDate) - new Date(b.dueDate);
    if (dueDateComparison !== 0) {
      return dueDateComparison;
    }
  }

  // If due dates are the same or not present, sort by text
  return a.text.localeCompare(b.text);
});



  return (
    <div>
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Todo text"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTodo}>
          {editIndex !== null ? 'Save' : 'Add'}
        </button>
        {editIndex !== null && <button onClick={cancelEditState}>Cancel</button>}
        {todos.length > 0 && <button onClick={deleteAll}>Delete All</button>}
        {todos.length > 0 && <button onClick={markAllDone}>Mark All Done</button>}
      </div>
      <ul>
      {sortedTodos.map((todo, index) => (
  <li key={index} className={todo.done ? 'done' : ''}>
    <input
      type="checkbox"
      id={`checkbox-${index}`}
      checked={todo.done}
      onChange={() => toggleDone(index)}
    />
    <label htmlFor={`checkbox-${index}`}>

      <strong>{todo.text}</strong> - Priority: {todo.priority}, Due: {formatDate(todo.dueDate)} - {formatTime(todo.dueDate)}
      {editIndex !== index && !todo.done && (
        <>
          <button onClick={() => setEditState(index)}>Edit</button>
          <button onClick={() => deleteTodo(index)}>Delete</button>
        </>
      )}
    </label>
  </li>
))}

      </ul>
    </div>
  );
}

export default App;








