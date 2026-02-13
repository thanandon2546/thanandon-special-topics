const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

// 1. GET: ดึงรายการงานทั้งหมด
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
});

// 2. POST: เพิ่มงานใหม่
app.post('/tasks', async (req, res) => {
    const newTask = new Task({ text: req.body.text });
    const savedTask = await newTask.save();
    res.json(savedTask);
});

// 3. PUT: Toggle Status (สลับสถานะ ขีดฆ่า/ไม่ขีดฆ่า)
app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed; // สลับค่า true/false
    await task.save();
    res.json(task);
});

// 4. DELETE: ลบงาน
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
