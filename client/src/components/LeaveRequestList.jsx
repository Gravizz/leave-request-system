import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchLeaveRequests();
  }, [searchName, searchDate, sortOrder]);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/leave-requests',
        {
          params: { name: searchName, startDate: searchDate, sort: sortOrder },
        }
      );
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      try {
        await axios.delete(`http://localhost:5000/api/leave-requests/${id}`);
        fetchLeaveRequests();
      } catch (error) {
        console.error('Error deleting leave request:', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/leave-requests/${id}`, {
        status: newStatus,
      });
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error updating leave request status:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="ค้นหาตามชื่อ"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="desc">ล่าสุด</option>
          <option value="asc">เก่าสุด</option>
        </select>
      </div>
      <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3 text-left w-1/3">ชื่อ</th>
            <th className="border p-3 text-left">ประเภทการลา</th>
            <th className="border p-3 text-left">วันที่ลา</th>
            <th className="border p-3 text-left">เวลาที่บันทึก</th>
            <th className="border p-3 text-left">สถานะ</th>
            <th className="border p-3 text-left">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request, index) => (
            <tr
              key={request._id}
              className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="border p-3 w-1/3">{request.name}</td>
              <td className="border p-3">{request.leaveType}</td>
              <td className="border p-3">
                {new Date(request.startDate).toLocaleDateString()} -
                {new Date(request.endDate).toLocaleDateString()}
              </td>
              <td className="border p-3">
                {new Date(request.createdAt).toLocaleTimeString()}
              </td>
              <td className="border p-3">{request.status}</td>
              <td className="border p-3 flex space-x-2">
                {request.status === 'รอพิจารณา' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(request._id, 'อนุมัติ')}
                      className="bg-green-500 text-white p-2 rounded-md shadow hover:bg-green-600 transition"
                    >
                      อนุมัติ
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(request._id, 'ไม่อนุมัติ')
                      }
                      className="bg-yellow-500 text-white p-2 rounded-md shadow hover:bg-yellow-600 transition"
                    >
                      ไม่อนุมัติ
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(request._id)}
                  className="bg-red-500 text-white p-2 rounded-md shadow hover:bg-red-600 transition"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequestList;
