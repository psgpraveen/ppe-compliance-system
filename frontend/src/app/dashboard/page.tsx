'use client';

import React from 'react';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboard';
import { useUser } from '@/features/auth/hooks/useAuth';
import { Building2, Users, AlertCircle, CheckCircle, Clock, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { ViolationsChart } from '@/features/dashboard/components/ViolationsChart';
import { RecentViolations } from '@/features/dashboard/components/RecentViolations';

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const skeletonCls = 'animate-pulse bg-gray-200 rounded';

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Real-time PPE compliance summary</p>
        </div>
      </div>

      {/* Primary Stats Row */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={`skel-1-${i}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className={`${skeletonCls} h-4 w-24 mb-3`} />
                  <div className={`${skeletonCls} h-8 w-16`} />
                </div>
              ))}
            </>
          ) : (
            <>
              <StatCard icon={Building2} title="Active Sites" value={stats?.totalSites ?? '--'} iconColorClass="text-blue-600 bg-blue-50" />
              <StatCard icon={Building2} title="Departments" value={stats?.totalDepartments ?? '--'} iconColorClass="text-indigo-600 bg-indigo-50" />
              <StatCard icon={Users} title="Active Employees" value={stats?.totalEmployees ?? '--'} iconColorClass="text-purple-600 bg-purple-50" />
            </>
          )}
        </div>
      )}

      {/* Supervisor Primary Stats */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            [...Array(2)].map((_, i) => (
              <div key={`skel-2-${i}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className={`${skeletonCls} h-4 w-24 mb-3`} />
                <div className={`${skeletonCls} h-8 w-16`} />
              </div>
            ))
          ) : (
            <>
              <StatCard icon={Users} title="My Employees" value={stats?.totalEmployees ?? '--'} iconColorClass="text-purple-600 bg-purple-50" />
              <StatCard icon={ShieldAlert} title="Total Violations" value={stats?.violations?.total ?? 0} iconColorClass="text-red-600 bg-red-50" />
            </>
          )}
        </div>
      )}

      {/* Middle Row: Violations Breakdown & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 2x2 Grid of Violation Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={`skel-3-${i}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className={`${skeletonCls} h-4 w-20 mb-3`} />
                <div className={`${skeletonCls} h-8 w-12`} />
              </div>
            ))
          ) : (
            <>
              <StatCard icon={Clock} title="Pending" value={stats?.violations?.pending ?? 0} iconColorClass="text-amber-600 bg-amber-50" />
              <StatCard icon={ShieldAlert} title="Escalated" value={stats?.violations?.escalated ?? 0} iconColorClass="text-red-600 bg-red-50" />
              <StatCard icon={AlertCircle} title="Acknowledged" value={stats?.violations?.acknowledged ?? 0} iconColorClass="text-blue-600 bg-blue-50" />
              <StatCard icon={CheckCircle} title="Resolved" value={stats?.violations?.resolved ?? 0} iconColorClass="text-emerald-600 bg-emerald-50" />
            </>
          )}
        </div>
        
        {/* Right Column: Donut Chart */}
        <div className="lg:col-span-1">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full min-h-[400px] flex items-center justify-center">
               <div className={`${skeletonCls} rounded-full h-48 w-48`} />
            </div>
          ) : (
            <ViolationsChart stats={stats?.violations ?? { pending: 0, escalated: 0, acknowledged: 0, resolved: 0, total: 0 }} />
          )}
        </div>
      </div>

      {/* Recent Violations Row */}
      <div className="w-full">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
             <div className={`${skeletonCls} h-6 w-48 mb-6`} />
            {[...Array(5)].map((_, i) => (
              <div key={`skel-4-${i}`} className={`${skeletonCls} h-10 w-full`} />
            ))}
          </div>
        ) : (
          <RecentViolations violations={stats?.recentViolations ?? []} />
        )}
      </div>

    </div>
  );
}
