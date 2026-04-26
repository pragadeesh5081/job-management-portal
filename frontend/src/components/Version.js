import React from 'react';

const Version = () => {
  const version = '1.0.1';
  const buildDate = new Date().toLocaleDateString();

  return (
    <div className="text-xs text-gray-500 text-center mt-4">
      Job Management Portal v{version} | Built on {buildDate}
    </div>
  );
};

export default Version;
