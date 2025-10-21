import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Analyzing... this may take a moment.</p>
    </div>
  );
};

export default Loader;