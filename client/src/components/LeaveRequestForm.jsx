import React, { useState } from 'react';
import axios from 'axios';

const LeaveRequestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: '',
    phoneNumber: '',
    leaveType: 'อื่นๆ',
    reason: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://leave-request-system-server-cj6i.vercel.app/api/leave-requests',
        formData
      );
      onSubmit(response.data);
      setFormData({
        name: '',
        department: '',
        email: '',
        phoneNumber: '',
        leaveType: 'อื่นๆ',
        reason: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="ชื่อ - นามสกุล"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="department"
        value={formData.department}
        onChange={handleChange}
        placeholder="สังกัด/ตำแหน่ง"
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="อีเมล์"
        className="w-full p-2 border rounded"
      />
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="เบอร์โทรศัพท์"
        required
        className="w-full p-2 border rounded"
      />
      <select
        name="leaveType"
        value={formData.leaveType}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="ลาป่วย">ลาป่วย</option>
        <option value="ลากิจ">ลากิจ</option>
        <option value="พักร้อน">พักร้อน</option>
        <option value="อื่นๆ">อื่นๆ</option>
      </select>
      <textarea
        name="reason"
        value={formData.reason}
        onChange={handleChange}
        placeholder="สาเหตุการลา"
        required
        className="w-full p-2 border rounded"
      ></textarea>
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        บันทึกการลา
      </button>
    </form>
  );
};

export default LeaveRequestForm;
