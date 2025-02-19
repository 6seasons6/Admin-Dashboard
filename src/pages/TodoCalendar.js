import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './TodoCalendar.css';

const localizer = momentLocalizer(moment);

function Todocalendarpage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    date: '',
    completed: false,
  });

  // Fetch tasks from backend
  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Convert tasks to calendar events
  const events = tasks.map(task => ({
    title: `${task.title} (${task.completed ? 'Done' : 'Pending'})`,
    start: new Date(task.date),
    end: new Date(task.date),
    completed: task.completed,
    id: task._id,
  }));

  // Handle task selection (toggle completion)
  const handleSelectEvent = (event) => {
    const updatedTasks = tasks.map(task =>
      task._id === event.id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    axios.put(`http://localhost:5000/tasks/${event.id}`, { completed: !event.completed })
      .catch(error => console.error('Error updating task:', error));
  };

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.date) {
      alert('Please enter task title and date.');
      return;
    }

    axios.post('http://localhost:5000/tasks', newTask)
      .then(response => setTasks([...tasks, response.data]))
      .catch(error => console.error('Error adding task:', error));

    setNewTask({ title: '', date: '', completed: false });
  };

  // Event styling
  const getEventStyle = (event) => ({
    style: {
      backgroundColor: event.completed ? 'green' : 'red',
      color: 'white',
      borderRadius: '5px',
      padding: '5px',
    }
  });

  return (
    <div className="todo-calendar-container">
      <h2>To-Do Calendar</h2>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <input
          type="date"
          name="date"
          value={newTask.date}
          onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, marginTop: '20px' }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={getEventStyle}
      />
    </div>
  );
}

export default Todocalendarpage;
