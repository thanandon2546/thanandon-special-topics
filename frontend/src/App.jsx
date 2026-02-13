import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(API_URL, { title });
      setTasks([response.data, ...tasks]);
      setTitle('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`);
      setTasks(tasks.map(t => t._id === id ? response.data : t));
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>

      <form className="input-group" onSubmit={addTask}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="add-btn">Add</button>
      </form>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <div className="task-content" onClick={() => toggleTask(task._id)}>
              <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                {task.title}
              </span>
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '1rem' }}>
          No tasks yet. Add one above!
        </p>
      )}
    </div>
  );
}

export default App;
