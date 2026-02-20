import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

//const API_URL = 'http://localhost:5000/tasks';
const API_URL = 'https://thanandon-special-topics-1.onrender.com/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    fetchTasks();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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
    if (!text.trim()) return;

    try {
      const response = await axios.post(API_URL, { text });
      setTasks([response.data, ...tasks]);
      setText('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`);
      setTasks(prevTasks => prevTasks.map(t => t._id === id ? response.data : t));
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

  const checkCompleted = (task) => {
    return task.completed === true ||
      task.done === true ||
      task.status === 'done' ||
      task.status === 'completed';
  };

  const filteredTasks = tasks.filter(task => {
    const taskTitle = (task.text || task.title || '').toLowerCase();
    const matchesSearch = taskTitle.includes(search.toLowerCase());
    const isCompleted = checkCompleted(task);

    const matchesFilter =
      filter === 'all' ? true :
        filter === 'active' ? !isCompleted :
          isCompleted;

    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter(checkCompleted).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const totalCount = tasks.length;
  const activeCount = totalCount - completedCount;

  // Formatting utilities
  const formatTaskTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const timeString = currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = currentTime.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Summary Logic
  const getFocusSummary = () => {
    if (totalCount === 0) return "เริ่มต้นวันใหม่ด้วยการเพิ่มงานใหม่กันเถอะ!";
    if (activeCount === 0) return "ยอดเยี่ยมมาก! คุณจัดการงานทั้งหมดเสร็จสิ้นแล้ว 🎉";
    if (progressPercent > 70) return `อีกนิดเดียว! เหลือเพียง ${activeCount} งานเท่านั้น คุณทำได้! 💪`;
    if (progressPercent > 40) return `ทำไปได้เกือบครึ่งแล้ว! สู้ต่อไปนะ เหลืออีก ${activeCount} รายการ 🚀`;
    return `วันนี้ยังมีงานรออยู่ ${activeCount} รายการ ค่อยๆ ทำไปนะ 🧘‍♂️`;
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="container" data-theme={theme}>
      <div className="header">
        <div className="brand-section">
          <h1>Task Master</h1>
          <p className="subtitle">จัดระเบียบงานของคุณอย่างมืออาชีพ</p>
        </div>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Switch Theme">
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="18.36" x2="5.64" y2="16.94"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </button>
          <div className="clock-section">
            <div className="clock-time">{timeString}</div>
            <div className="clock-date">{dateString}</div>
          </div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      )}

      <div className="top-bar">
        <div className="search-group">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="ค้นหางานของคุณ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'ทั้งหมด' : f === 'active' ? 'ค้างอยู่' : 'เสร็จแล้ว'}
            </button>
          ))}
        </div>
      </div>

      <form className="input-group" onSubmit={addTask}>
        <input
          type="text"
          className="main-input"
          placeholder="เพิ่มงานใหม่ที่นี่..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="add-btn">Add Task</button>
      </form>

      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const isCompleted = checkCompleted(task);
            return (
              <div key={task._id} className="task-item">
                <div className="task-content" onClick={() => toggleTask(task._id)}>
                  <div className={`checkbox ${isCompleted ? 'checked' : ''}`}>
                    {isCompleted && (
                      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="task-details">
                    <span className={`task-title ${isCompleted ? 'completed' : ''}`}>
                      {task.text || task.title || 'ไม่มีหัวข้อ'}
                    </span>
                    <span className="task-time">
                      {formatTaskTime(task.createdAt)}
                    </span>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            )
          })
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>
              {tasks.length === 0 ? 'ยังไม่มีรายการงาน เริ่มต้นด้วยการเพิ่มงานใหม่!' : 'ไม่พบรายการที่ตรงตามเงื่อนไข'}
            </p>
          </div>
        )}
      </div>

      <div className="focus-summary">
        <div className="summary-icon">✨</div>
        <div className="summary-text">{getFocusSummary()}</div>
      </div>
    </div>
  );
}

export default App;
