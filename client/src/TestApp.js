import React, { useState, useEffect } from 'react';

export const App = () => {
    const [tasks, setTasks] = useState([]);
    const [currentTaskInput, setCurrentTaskInput] = useState('');
    const [currentTaskPriority, setCurrentTaskPriority] = useState('low');
    const [currentTaskDueDate, setCurrentTaskDueDate] = useState('');
}