import React, { useEffect, useState } from "react";

export const App = () => {
    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState('');
    const [taskPriority, setTaskPriority] = useState('low');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [allTasksCompleted, setAllTasksCompleted] = useState(false);
    const [sleepStartTime, setSleepStartTime] = useState('');
    const [sleepEndTime, setSleepEndTime] = useState('');

    useEffect(() => {
        setTasks(JSON.parse(localStorage.getItem('tasks')) || []);
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        setAllTasksCompleted(tasks.every(task => task.completed));
    }, [tasks]);

    const formatDateAndTime = (dateString, format_number = 0) => {
        try {
            const date = new Date(dateString);

            if (format_number === 1) {
                return `${date.getFullYear()}:${(date.getMonth() + 1).toString().padStart(2, '0')}:${date.getDate().toString().padStart(2, '0')}`;
            }

            return `${date.getFullYear()}:${(date.getMonth() + 1).toString().padStart(2, '0')}:${date.getDate().toString().padStart(2, '0')} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        } catch (err) {
            console.error("There was an error formatting the Date and Time!", err);
            return null;
        }
    }

    const addTask = () => {
        const taskItem = {
            taskText,
            taskPriority,
            taskDueDate,
            completed: false
        };

        const isTaskTextDuplicate = tasks.every((task) => task.taskText === taskItem.taskText);
        if (isTaskTextDuplicate) {
            alert("Task with the same text already exists! Please enter a different text.");
            return null;
        }

        if (!taskDueDate || new Date() > new Date(taskDueDate)) {
            alert("The task due date needs to be set and can not be in the past! Please enter a task due date that lies in the future.");
            return null;
        }

        if (taskItem.taskText.trim() === "") {
            alert("Please enter a task!");
            return null;
        }

        setTasks([...tasks, taskItem]);

        setTaskText('');
        setTaskPriority('low');
        setTaskDueDate('');
    }

    const editTask = () => {
        const taskItem = {
            taskText,
            taskPriority,
            taskDueDate,
            completed: false
        };

        const isTaskTextDuplicate = tasks.every((task, index) => index !== editingIndex && task.taskText === taskItem.taskText);
        if (isTaskTextDuplicate) {
            alert("Task with the same text already exists! Please enter a different text.");
            return null;
        }

        if (!taskDueDate || new Date() > new Date(taskDueDate)) {
            alert("The task due date needs to be set and can not be in the past! Please enter a task due date that lies in the future.");
            return null;
        }

        if (taskItem.taskText.trim() === "") {
            alert("Please enter a task!");
            return null;
        }

        if (editingIndex !== null) {
            const newTasks = [...tasks];
            newTasks[editingIndex] = taskItem;
            setTasks(newTasks);
            setEditingIndex(null);
        }

        setTaskText('');
        setTaskPriority('low');
        setTaskDueDate('');
    }

    const setEditingTaskState = (index) => {
        setEditingIndex(index);
        setTaskText(tasks[index].taskText);
        setTaskPriority(tasks[index].taskPriority);
        setTaskDueDate(tasks[index].taskDueDate);
    }

    const cancelEditingTaskState = () => {
        setEditingIndex(null);
        setTaskText('');
        setTaskPriority('low');
        setTaskDueDate('');
    }

    const deleteTask = (index) => {
        const newTasks = [...tasks];
        newTasks.slice(index, 1);
        setTasks(newTasks);
    }

    const deleteAllTasks = () => {
        const deleteAllTasks_confirm = window.confirm("Are you sure you want to delete all tasks?");
        if (deleteAllTasks_confirm) {
            setTasks([]);
        }
    }

    const toggleTaskCompletion = (index) => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
    }

    const markAllTasksAsCompleted = () => {
        const newTasks = tasks.map(task => ({ ...task, completed: true }));
        setTasks(newTasks);
    }

    
}