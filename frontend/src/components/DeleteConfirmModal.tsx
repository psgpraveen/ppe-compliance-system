import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50">
      <div className="relative w-full max-w-md p-4">
        <div className="relative bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 text-center">
            <svg className="mx-auto mb-4 text-red-500 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
            <p className="mb-6 text-sm text-gray-500">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Yes, I\'m sure'}
              </button>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 border border-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
