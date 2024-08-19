const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// สร้าง Schema สำหรับการลา
const leaveRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: String,
  email: String,
  phoneNumber: { type: String, required: true },
  leaveType: {
    type: String,
    required: true,
    enum: ['ลาป่วย', 'ลากิจ', 'พักร้อน', 'อื่นๆ'],
  },
  reason: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    default: 'รอพิจารณา',
    enum: ['รอพิจารณา', 'อนุมัติ', 'ไม่อนุมัติ'],
  },
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

// API routes
app.post('/api/leave-requests', async (req, res) => {
  try {
    const newLeaveRequest = new LeaveRequest(req.body);

    // ตรวจสอบเงื่อนไขการลา
    const startDate = new Date(newLeaveRequest.startDate);
    const endDate = new Date(newLeaveRequest.endDate);
    const today = new Date();

    if (newLeaveRequest.leaveType === 'พักร้อน') {
      // ตรวจสอบการลาล่วงหน้า 3 วัน
      if ((startDate - today) / (1000 * 60 * 60 * 24) < 3) {
        return res
          .status(400)
          .json({ message: 'กรุณาลาพักร้อนล่วงหน้าอย่างน้อย 3 วัน' });
      }

      // ตรวจสอบการลาติดต่อกันไม่เกิน 2 วัน
      if ((endDate - startDate) / (1000 * 60 * 60 * 24) > 2) {
        return res
          .status(400)
          .json({ message: 'สามารถลาพักร้อนติดต่อกันได้ไม่เกิน 2 วัน' });
      }
    }

    // ตรวจสอบการลาย้อนหลัง
    if (startDate < today) {
      return res
        .status(400)
        .json({ message: 'ไม่อนุญาตให้บันทึกวันลาย้อนหลัง' });
    }

    await newLeaveRequest.save();
    res.status(201).json(newLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/leave-requests', async (req, res) => {
  try {
    const { name, startDate, sort } = req.query;
    let query = {};
    if (name) query.name = new RegExp(name, 'i');
    if (startDate) query.startDate = { $gte: new Date(startDate) };

    const sortOption = sort === 'asc' ? { createdAt: 1 } : { createdAt: -1 };

    const leaveRequests = await LeaveRequest.find(query).sort(sortOption);
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/leave-requests/:id', async (req, res) => {
  try {
    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบข้อมูลสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/leave-requests/:id', async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลการลา' });
    }

    if (leaveRequest.status !== 'รอพิจารณา') {
      return res
        .status(400)
        .json({ message: 'ไม่สามารถแก้ไขสถานะที่ไม่ใช่ "รอพิจารณา"' });
    }

    leaveRequest.status = req.body.status;
    await leaveRequest.save();
    res.json(leaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
