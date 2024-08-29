import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const LeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, [searchName, searchDate, sortOrder]);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://leave-request-system-server-cj6i.vercel.app/api/leave-requests',
        {
          params: { name: searchName, date: searchDate, sort: sortOrder },
        }
      );
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirmMessage('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?');
    setConfirmAction(() => async () => {
      try {
        await axios.delete(
          `https://leave-request-system-server-cj6i.vercel.app/api/leave-requests/${id}`
        );
        fetchLeaveRequests();
      } catch (error) {
        console.error('Error deleting leave request:', error);
      }
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    setConfirmMessage(`คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะเป็น "${newStatus}"?`);
    setConfirmAction(() => async () => {
      try {
        await axios.patch(
          `https://leave-request-system-server-cj6i.vercel.app/api/leave-requests/${id}`,
          { status: newStatus }
        );
        fetchLeaveRequests();
      } catch (error) {
        console.error('Error updating leave request status:', error);
      }
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'อนุมัติ':
        return 'bg-green-100 text-green-800';
      case 'ไม่อนุมัติ':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getButtonClass = (status) => {
    switch (status) {
      case 'อนุมัติ':
        return 'bg-green-500 hover:bg-green-600';
      case 'ไม่อนุมัติ':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
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

      {loading ? (
        <div className="flex justify-center items-center h-96">Loading...</div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <table className="w-full border-collapse bg-white shadow-md rounded-md overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-3 text-center w-1/3">ชื่อ</th>
                  <th className="border p-3 text-center">ประเภทการลา</th>
                  <th className="border p-3 text-center">วันที่ลา</th>
                  <th className="border p-3 text-center">
                    วันและเวลาที่บันทึก
                  </th>
                  <th className="border p-3 text-center">สถานะ</th>
                  <th className="border p-3 text-center">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request, index) => (
                  <tr
                    key={request._id}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="border p-3 text-center w-1/3">
                      {request.name}
                    </td>
                    <td className="border p-3 text-center">
                      {request.leaveType}
                    </td>
                    <td className="border p-3 text-center">
                      <p>
                        {new Date(request.startDate).toLocaleDateString()}{' '}
                        ถึงวันที่{' '}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="border p-3 text-center">
                      {new Date(request.createdAt).toLocaleString()}
                    </td>
                    <td
                      className={`border p-3 text-center ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </td>
                    <td className="border p-3 text-center flex space-x-2 justify-center">
                      {request.status === 'รอพิจารณา' && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(request._id, 'อนุมัติ')
                            }
                            className={`text-white p-2 rounded-md shadow transition ${getButtonClass(
                              'อนุมัติ'
                            )}`}
                          >
                            อนุมัติ
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(request._id, 'ไม่อนุมัติ')
                            }
                            className={`text-white p-2 rounded-md shadow transition ${getButtonClass(
                              'ไม่อนุมัติ'
                            )}`}
                          >
                            ไม่อนุมัติ
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(request._id)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md shadow transition"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Moblie */}
          <div className="md:hidden space-y-4">
            {leaveRequests.map((request) => (
              <div
                key={request._id}
                className="border p-4 rounded-md shadow-md bg-white space-y-4"
              >
                <div>
                  <p className="font-semibold">ชื่อ:</p>
                  <p>{request.name}</p>
                </div>
                <div>
                  <p className="font-semibold">ประเภทการลา:</p>
                  <p>{request.leaveType}</p>
                </div>
                <div>
                  <p className="font-semibold">วันที่ลา:</p>
                  <p>
                    {new Date(request.startDate).toLocaleDateString()} ถึงวันที่{' '}
                    {new Date(request.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">วันและเวลาที่บันทึก:</p>
                  <p>{new Date(request.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold">สถานะ:</p>
                  <p
                    className={`p-2 rounded ${getStatusClass(request.status)}`}
                  >
                    {request.status}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {request.status === 'รอพิจารณา' && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(request._id, 'อนุมัติ')
                        }
                        className={`text-white p-2 rounded-md shadow transition ${getButtonClass(
                          'อนุมัติ'
                        )}`}
                      >
                        อนุมัติ
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(request._id, 'ไม่อนุมัติ')
                        }
                        className={`text-white p-2 rounded-md shadow transition ${getButtonClass(
                          'ไม่อนุมัติ'
                        )}`}
                      >
                        ไม่อนุมัติ
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(request._id)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md shadow transition"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        message={confirmMessage}
      />
    </div>
  );
};

export default LeaveRequestList;
