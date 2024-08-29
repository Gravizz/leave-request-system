import React, { useState, useEffect } from 'react';
import LeaveRequestForm from './components/LeaveRequestForm';
import LeaveRequestList from './components/LeaveRequestList';

function App() {
  const [showForm, setShowForm] = useState(true);
  const [showList, setShowList] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleFormClick = () => {
    setShowForm(true);
    setShowList(false);
  };

  const handleListClick = () => {
    setShowForm(false);
    setShowList(true);
  };

  const handleSubmit = () => {
    setRefreshList(!refreshList);
  };

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-200 px-20 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">ระบบขออนุญาตลาหยุด</h1>
        <div>
          <button
            className={`px-4 py-2 mx-2 rounded-md ${
              showForm ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={handleFormClick}
          >
            ยื่นบันทึกการลา
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded-md ${
              showList ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={handleListClick}
          >
            ดูรายการขอลาหยุด
          </button>
        </div>
      </div>
      <div className="flex-1 p-4">
        {showForm && (
          <div>
            <h2 className="text-xl text-center font-semibold mb-2">
              บันทึกการลา
            </h2>
            <LeaveRequestForm onSubmit={handleSubmit} />
          </div>
        )}
        {showList && (
          <div>
            <h2 className="text-xl text-center font-semibold mb-2">
              รายการขอลาหยุด
            </h2>
            <LeaveRequestList key={refreshList} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
