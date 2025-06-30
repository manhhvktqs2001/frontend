import React from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-lg p-6 min-w-[320px] max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-200" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}; 