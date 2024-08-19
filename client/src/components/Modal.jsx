import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isConfirming) return; // Prevent confirming if already confirming
    setIsConfirming(true);
    try {
      await onConfirm(); // Execute the onConfirm action
    } catch (error) {
      console.error('Error during confirm action:', error);
    } finally {
      setIsConfirming(false); // Reset state after action completes
      onClose(); // Close modal after confirmation
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">ยืนยันการดำเนินการ</h2>
        {message && <p className="mb-4">{message}</p>}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirming} // Disable button during confirmation
            className={`bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md ${
              isConfirming ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isConfirming ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
