import React from 'react';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns = 6, rows = 10 }) => {
  return (
    <div className="w-full h-full flex flex-col flex-1 overflow-hidden bg-white border-y border-gray-200">
      <div className="animate-pulse flex flex-col flex-1 w-full">
        {/* Header row */}
        <div className="flex bg-gray-50 border-b border-gray-100 p-3">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 px-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        {/* Body rows */}
        <div className="flex-1 overflow-hidden">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex border-b border-gray-50 p-3">
              {Array.from({ length: columns }).map((_, j) => (
                <div key={j} className="flex-1 px-4 py-1">
                  <div className={`h-4 bg-gray-200 rounded ${j === columns - 1 ? 'w-1/3' : 'w-[80%]'}`}></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
