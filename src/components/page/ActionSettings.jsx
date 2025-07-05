import React from 'react';
import { ShieldCheckIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
// ... (Bạn có thể copy phần giao diện Actions từ Settings.jsx, truyền props và xử lý state tương tự)

const ActionSettings = ({ actionSettings, setActionSettings, isDarkMode, onSave, loading, saved }) => {
  // Copy phần giao diện và logic từ tab Actions trong Settings.jsx, thay thế state bằng props
  // ...
  return (
    <div className="space-y-6">
      {/* Copy phần giao diện Actions ở đây, truyền props và xử lý state */}
      {/* ... */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 shadow-lg"
        >
          {loading ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : saved ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <ShieldCheckIcon className="w-5 h-5" />
          )}
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ActionSettings; 