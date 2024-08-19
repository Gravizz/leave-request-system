import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

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
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
            >
              ยืนยัน
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
