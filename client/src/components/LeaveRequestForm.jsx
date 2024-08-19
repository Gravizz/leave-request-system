import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Show confirmation modal
  };

  const handleConfirm = async () => {
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
      setSuccessMessage('บันทึกการลาสำเร็จ');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000); // Hide message after 2 seconds
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setIsModalOpen(false); // Close confirmation modal
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
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
        <div className="flex justify-between items-center space-x-4">
          <div className="flex-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              id="startDate"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              id="endDate"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          บันทึกการลา
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        message="คุณแน่ใจหรือไม่ว่าต้องการบันทึกการลา?"
      />
      {successMessage && (
        <div className="text-center mt-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default LeaveRequestForm;
