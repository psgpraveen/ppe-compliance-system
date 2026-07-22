import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col p-4 space-y-6 shrink-0 animate-pulse">
        <div className="flex items-center gap-3 px-2 border-b border-gray-100 pb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-200" />
          <div className="h-5 w-32 bg-gray-200 rounded-md" />
        </div>
        <div className="space-y-3 flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50">
              <div className="w-5 h-5 bg-gray-200 rounded-md shrink-0" />
              <div className="h-4 bg-gray-200 rounded-md w-3/4" />
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 pt-4 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-gray-200 rounded-md w-28" />
            <div className="h-3 bg-gray-200 rounded-md w-16" />
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col overflow-hidden p-6 space-y-6 animate-pulse">
        {/* Top Header Skeleton */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded-md" />
            <div className="h-4 w-72 bg-gray-200 rounded-md" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 rounded-md" />
                <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>

        {/* Table Body Skeleton */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col p-4 space-y-4">
          <div className="h-5 w-40 bg-gray-200 rounded-md" />
          <div className="space-y-3 flex-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50">
                <div className="h-4 w-1/5 bg-gray-200 rounded-md" />
                <div className="h-4 w-1/4 bg-gray-200 rounded-md" />
                <div className="h-4 w-1/6 bg-gray-200 rounded-md" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
