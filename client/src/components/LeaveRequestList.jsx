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
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="ค้นหาตามชื่อ"
          className="p-2 border rounded mr-2"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="desc">ล่าสุด</option>
          <option value="asc">เก่าสุด</option>
        </select>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">ชื่อ</th>
            <th className="border p-2">ประเภทการลา</th>
            <th className="border p-2">วันที่ลา</th>
            <th className="border p-2">สถานะ</th>
            <th className="border p-2">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request._id}>
              <td className="border p-2">{request.name}</td>
              <td className="border p-2">{request.leaveType}</td>
              <td className="border p-2">
                {new Date(request.startDate).toLocaleDateString()} -
                {new Date(request.endDate).toLocaleDateString()}
              </td>
              <td className="border p-2">{request.status}</td>
              <td className="border p-2">
                {request.status === 'รอพิจารณา' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(request._id, 'อนุมัติ')}
                      className="bg-green-500 text-white p-1 rounded mr-1"
                    >
                      อนุมัติ
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(request._id, 'ไม่อนุมัติ')
                      }
                    >
                      ไม่อนุมัติ
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(request._id)}
                  className="bg-red-500 text-white p-1 rounded"
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
