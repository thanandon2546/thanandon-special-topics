const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  title: { type: String }, // รองรับฟิลด์ title เดิม
  completed: { type: Boolean, default: false },
  done: { type: Boolean }, // รองรับฟิลด์ done เดิม
  status: { type: String }, // รองรับฟิลด์ status เดิม
  createdAt: { type: Date, default: Date.now }
}, { strict: false }); // อนุญาตฟิลด์อื่นๆ นอกเหนือจากที่ระบุ

module.exports = mongoose.model('Task', TaskSchema);
