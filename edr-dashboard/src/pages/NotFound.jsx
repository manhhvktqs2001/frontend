import * as React from 'react';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-4xl font-bold mb-2">404</h1>
    <div className="text-lg text-gray-400 mb-4">Page Not Found</div>
    <a href="/" className="btn btn-primary">Go to Dashboard</a>
  </div>
);

export default NotFound; 