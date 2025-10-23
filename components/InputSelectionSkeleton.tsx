import React from 'react';

const InputSelectionSkeleton: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 animate-pulse">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-t-md mr-1"></div>
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-t-md ml-1"></div>
      </div>

      {/* Dropzone Area */}
      <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 pt-5 pb-6">
        <div className="space-y-2 text-center w-full py-4">
          <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-md mx-auto"></div>
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-md mx-auto"></div>
          <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-md mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default InputSelectionSkeleton;