'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useUser } from '@/features/auth/hooks/useAuth';
import { authService } from '@/features/auth/services/auth.service';
import { NotificationBell } from '@/components/ui/NotificationBell';
import {
  LayoutDashboard, ShieldAlert, Building2, Network,
  UserCheck, Users, AlertTriangle, Settings, Cpu,
  LogOut, Menu, X, BarChart3, User,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard',       path: '/dashboard',               icon: LayoutDashboard, roles: ['ADMIN', 'SUPERVISOR'] },
  { name: 'Analytics',      path: '/dashboard/analytics',     icon: BarChart3,        roles: ['ADMIN', 'SUPERVISOR'] },
  { name: 'Violations',     path: '/dashboard/violations',    icon: ShieldAlert,      roles: ['ADMIN', 'SUPERVISOR'] },
  { name: 'Sites',          path: '/dashboard/sites',         icon: Building2,        roles: ['ADMIN'] },
  { name: 'Departments',    path: '/dashboard/departments',   icon: Network,          roles: ['ADMIN'] },
  { name: 'Supervisors',    path: '/dashboard/supervisors',   icon: UserCheck,        roles: ['ADMIN'] },
  { name: 'Employees',      path: '/dashboard/employees',     icon: Users,            roles: ['ADMIN', 'SUPERVISOR'] },
  { name: 'Violation Types',path: '/dashboard/violation-types',icon: AlertTriangle,   roles: ['ADMIN', 'SUPERVISOR'] },
  { name: 'Profile',        path: '/dashboard/profile',       icon: User,             roles: ['ADMIN', 'SUPERVISOR'] },
  { name: 'Settings',       path: '/dashboard/settings',      icon: Settings,         roles: ['ADMIN'] },
  { name: 'IoT Simulator',  path: '/dashboard/iot-simulator', icon: Cpu,              roles: ['ADMIN'] },
];

function SidebarContent({
  user,
  pathname,
  onNavClick,
  onLogout,
}: {
  user: { first_name: string; last_name: string; role: string; email: string };
  pathname: string;
  onNavClick?: () => void;
  onLogout: () => void;
}) {
  const filteredNavItems = navItems.filter(
    item => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/icon.svg" alt="PPE Monitor Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">PPE Monitor</span>
        </div>
        <NotificationBell />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 relative">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.path ||
            (item.path !== '/dashboard' && pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={onNavClick}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`absolute left-0 w-0.5 h-6 rounded-r-full bg-blue-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
              <Icon size={17} className={`flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-gray-100 shrink-0">
        <Link
          href="/dashboard/profile"
          onClick={onNavClick}
          className="flex items-center gap-3 px-2 py-2 rounded-lg mb-2 hover:bg-gray-50 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
          </div>
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: user } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 overflow-hidden">

        {/* ── Desktop Sidebar ───────────────────────────────── */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col shadow-sm">
          <SidebarContent
            user={user}
            pathname={pathname}
            onLogout={handleLogout}
          />
        </aside>

        {/* ── Mobile Overlay Sidebar ────────────────────────── */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="relative z-50 w-64 bg-white shadow-2xl flex flex-col">
              <SidebarContent
                user={user}
                pathname={pathname}
                onNavClick={() => setSidebarOpen(false)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}

        {/* ── Main Content ──────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Mobile top bar */}
          <header className="lg:hidden flex items-center gap-3 h-14 px-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <img src="/icon.svg" alt="PPE Monitor Logo" className="w-6 h-6 rounded shadow-sm" />
              <span className="text-base font-bold text-gray-900">PPE Monitor</span>
            </div>
            <div className="ml-auto">
              <NotificationBell placement="topbar" />
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

        </main>
      </div>
    </ProtectedRoute>
  );
}
