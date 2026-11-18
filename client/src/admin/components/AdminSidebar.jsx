import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  FileText,
  MapPin,
  CheckCircle2,
  Building2,
  UserCheck,
  Users,
  Landmark,
  Layers,
  AlertTriangle,
  ShieldCheck,
  Bell,
  BarChart3,
  ClipboardList,
  Settings,
  Crown,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Live Issue Monitoring', path: '/admin/live', icon: Radio },
    { name: 'All Complaints', path: '/admin/issues', icon: FileText },
    { name: 'Map Monitoring', path: '/admin/map', icon: MapPin },
    { name: 'Issue Verification', path: '/admin/verification', icon: CheckCircle2 },
    { name: 'Department Management', path: '/admin/departments', icon: Building2 },
    { name: 'Officer Management', path: '/admin/officers', icon: UserCheck },
    { name: 'Citizen Management', path: '/admin/citizens', icon: Users },
    { name: 'Local Body Management', path: '/admin/local-bodies', icon: Layers },
    { name: 'State & District', path: '/admin/states', icon: Landmark },
    { name: 'Escalation Center', path: '/admin/escalations', icon: AlertTriangle },
    { name: 'Resolution Tracking', path: '/admin/resolutions', icon: ShieldCheck },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: ClipboardList },
    { name: 'Admin Management', path: '/admin/administrators', icon: ShieldAlert, superOnly: true },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#102544] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800/60 shadow-xl`}
      >
        {/* Brand Header */}
        <div className="p-5 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#07845F] flex items-center justify-center shrink-0 shadow-md shadow-[#07845F]/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">CivicTrack</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#07845F]"></span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Report Today. Better Tomorrow.
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            if (item.superOnly && admin?.role !== 'super_admin') return null;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#07845F] text-white shadow-sm shadow-[#07845F]/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Profile & Logout Card (matching screenshot) */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {admin?.role === 'super_admin' ? 'Super Admin' : (admin?.designation || 'Administrator')}
              </p>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight truncate">
                {admin?.adminId || 'CT-SUPER-0001'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
