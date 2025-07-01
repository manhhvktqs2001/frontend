import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const Header = () => (
  <header className="w-full h-16 bg-white shadow flex items-center justify-between px-8">
    <div className="flex items-center space-x-2">
      <ShieldCheckIcon className="w-7 h-7 text-blue-600" />
      <span className="text-xl font-bold text-blue-700 tracking-wide">EDR System</span>
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-gray-600 text-sm">Xin chào, Admin</span>
      <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="avatar" className="w-9 h-9 rounded-full border" />
    </div>
  </header>
);

export default Header;