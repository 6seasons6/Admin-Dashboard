import React, { useState, useEffect } from 'react'; 
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './TodoPlanner.css';

const localizer = momentLocalizer(moment);

function TodoPlanner() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: '',
    status: 'not viewed',
    completed: false,
  });

  // Fetch tasks from backend
  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => {
        console.log('Fetched tasks:', response.data);  // Log to verify task data
        setTasks(response.data);
      })
      .catch(error => {
        if (error.response) {
          console.error('Server response error:', error.response.data);
        } else if (error.request) {
          console.error('No response from the server:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      });
  }, []); // Run only on mount

  // Map tasks to calendar events
  const events = tasks.map(task => ({
    title: `${task.title} (${task.completed ? 'Done' : 'Pending'})`,
    start: new Date(task.date),  // Ensure this is a valid Date object
    end: new Date(task.date),    // This should be the same as start if it's an all-day event
    description: task.description,
    status: task.completed ? 'viewed' : 'not viewed',
    completed: task.completed,
    id: task._id,
  }));

  // Event style based on status
  const getEventStyle = (event) => {
    let backgroundColor = 'red';
    if (event.completed) {
      backgroundColor = 'green';
    }
    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }
    };
  };

  // Handle event click to toggle the task completion status
  const handleSelectEvent = (event) => {
    const taskId = event.id;
    const newCompletionStatus = !event.completed;
  
    // Update the task completion status in the backend
    axios.put(`http://localhost:5000/tasks/${taskId}`, { completed: newCompletionStatus })
      .then(response => {
        setTasks(tasks.map(task =>
          task._id === taskId ? { ...task, completed: newCompletionStatus } : task
        ));
      })
      .catch(error => console.error('Error updating task:', error));
  };

  // Handle form input change for new task creation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Handle adding new task
  const handleAddTask = (e) => {
    e.preventDefault();
  
    // Make sure newTask has all necessary fields
    if (!newTask.title || !newTask.date) {
      alert('Please provide both title and date for the task');
      return;
    }
  
    axios.post('http://localhost:5000/tasks', newTask)
      .then(response => {
        // Update state with the new task
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', date: '', status: 'not viewed', completed: false });
      })
      .catch(error => {
        if (error.response) {
          // Server responded with an error
          console.error('Error response:', error.response.data);
          alert('Failed to add task: ' + error.response.data.message);
        } else if (error.request) {
          // No response received from the server
          console.error('Error request:', error.request);
          alert('Failed to reach the server. Please try again later.');
        } else {
          // Other errors
          console.error('General error:', error.message);
          alert('An error occurred while adding the task.');
        }
      });
  };

  // Handle checkbox toggle to mark task as completed
  const handleCheckboxChange = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task._id === taskId ? { ...task, completed: !task.completed, status: !task.completed ? 'viewed' : 'not viewed' } : task
    );
    
    setTasks(updatedTasks); 

    const taskToUpdate = updatedTasks.find(task => task._id === taskId);
    axios.put(`http://localhost:5000/tasks/${taskId}`, {
      completed: taskToUpdate.completed,
      status: taskToUpdate.completed ? 'viewed' : 'not viewed',
    })
      .then(response => {
        console.log(`Task updated to ${taskToUpdate.completed ? 'Done' : 'Pending'}`);
      })
      .catch(error => console.error('Error updating task status:', error));
  };

  const sortedTasks = tasks.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="todo-planner-container">
      <h2>To-Do Planner</h2>

      {/* Add Task Form */}
      <div className="form-container">
        <h3>Add Task</h3>
        <form onSubmit={handleAddTask} className="task-form">
          <input
            className="inputBox"
            type="text"
            name="title"
            placeholder="Task Title"
            value={newTask.title}
            onChange={handleInputChange}
            required
          />
          <input
            className="inputBox"
            type="date"
            name="date"
            value={newTask.date}
            onChange={handleInputChange}
            required
          />
          <button className="submit-btn" type="submit">Add Task</button>
        </form>
      </div>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={getEventStyle}
        selectable
      />

      {/* Task List with Checkboxes */}
      <div className="task-list">
        <h3>Tasks</h3>
        {sortedTasks.map(task => (
          <div key={task._id} className="task-item">
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => handleCheckboxChange(task._id)} 
            />
            <span>{task.title}</span>
            <span className={task.completed ? 'done' : 'pending'}>
              {task.completed ? 'Done' : 'Pending'}
            </span>
            <span className='spaceAdd'>{moment(task.date).format(' YYYY-MM-DD ' )}</span> 
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoPlanner;
