import React, { useState, useEffect } from 'react';
import LeaveRequestForm from './components/LeaveRequestForm';
import LeaveRequestList from './components/LeaveRequestList';
import axios from 'axios';

function App() {
  const [refreshList, setRefreshList] = useState(false);

  const handleSubmit = () => {
    setRefreshList(!refreshList);
  };

  useEffect(() => {
    // เพิ่มข้อมูลทดสอบ 10 รายการ
    const addTestData = async () => {
      const testData = [
        {
          name: 'สมชาย ใจดี',
          department: 'ฝ่ายขาย',
          email: 'somchai@example.com',
          phoneNumber: '0812345678',
          leaveType: 'ลาป่วย',
          reason: 'ไม่สบาย',
          startDate: '2024-08-20',
          endDate: '2024-08-21',
        },
        {
          name: 'สมหญิง รักดี',
          department: 'ฝ่ายบัญชี',
          email: 'somying@example.com',
          phoneNumber: '0823456789',
          leaveType: 'ลากิจ',
          reason: 'ธุระส่วนตัว',
          startDate: '2024-08-22',
          endDate: '2024-08-22',
        },
        {
          name: 'วิชัย สุขใจ',
          department: 'ฝ่ายไอที',
          email: 'wichai@example.com',
          phoneNumber: '0834567890',
          leaveType: 'พักร้อน',
          reason: 'ท่องเที่ยว',
          startDate: '2024-08-25',
          endDate: '2024-08-26',
        },
        {
          name: 'นภา ฟ้าใส',
          department: 'ฝ่ายการตลาด',
          email: 'napha@example.com',
          phoneNumber: '0845678901',
          leaveType: 'ลาป่วย',
          reason: 'พักรักษาตัว',
          startDate: '2024-08-27',
          endDate: '2024-08-28',
        },
        {
          name: 'ประสิทธิ์ มั่นคง',
          department: 'ฝ่ายผลิต',
          email: 'prasit@example.com',
          phoneNumber: '0856789012',
          leaveType: 'ลากิจ',
          reason: 'ดูแลครอบครัว',
          startDate: '2024-08-29',
          endDate: '2024-08-30',
        },
        {
          name: 'รัตนา พรมณี',
          department: 'ฝ่ายบุคคล',
          email: 'rattana@example.com',
          phoneNumber: '0867890123',
          leaveType: 'อื่นๆ',
          reason: 'อบรมสัมมนา',
          startDate: '2024-09-01',
          endDate: '2024-09-02',
        },
        {
          name: 'สมศักดิ์ ศรีสุข',
          department: 'ฝ่ายจัดซื้อ',
          email: 'somsak@example.com',
          phoneNumber: '0878901234',
          leaveType: 'ลาป่วย',
          reason: 'ตรวจสุขภาพประจำปี',
          startDate: '2024-09-03',
          endDate: '2024-09-03',
        },
        {
          name: 'วันดี มีสุข',
          department: 'ฝ่ายลูกค้าสัมพันธ์',
          email: 'wandee@example.com',
          phoneNumber: '0889012345',
          leaveType: 'พักร้อน',
          reason: 'พักผ่อนประจำปี',
          startDate: '2024-09-05',
          endDate: '2024-09-06',
        },
        {
          name: 'ชัยวัฒน์ รุ่งเรือง',
          department: 'ฝ่ายวิจัยและพัฒนา',
          email: 'chaiwat@example.com',
          phoneNumber: '0890123456',
          leaveType: 'ลากิจ',
          reason: 'จัดการธุระส่วนตัว',
          startDate: '2024-09-08',
          endDate: '2024-09-08',
        },
        {
          name: 'พิมพ์ใจ ใจงาม',
          department: 'ฝ่ายประชาสัมพันธ์',
          email: 'pimjai@example.com',
          phoneNumber: '0901234567',
          leaveType: 'อื่นๆ',
          reason: 'เข้าร่วมกิจกรรมจิตอาสา',
          startDate: '2024-09-10',
          endDate: '2024-09-11',
        },
      ];

      for (const data of testData) {
        try {
          await axios.post('http://localhost:5000/api/leave-requests', data);
        } catch (error) {
          console.error('Error adding test data:', error);
        }
      }
    };

    // addTestData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ระบบขออนุญาตลาหยุด</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">บันทึกการลา</h2>
          <LeaveRequestForm onSubmit={handleSubmit} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">รายการขอลาหยุด</h2>
          <LeaveRequestList key={refreshList} />
        </div>
      </div>
    </div>
  );
}

export default App;
