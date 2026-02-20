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
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const newStatus = !task.completed;
        task.completed = newStatus;

        // 🔥 อัปเดตฟิลด์อื่นให้ตรงกันเพื่อป้องกัน Logic เก่าขัดขวาง
        task.set('status', newStatus ? 'done' : 'pending');
        task.set('done', newStatus);

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE: ลบงาน
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
