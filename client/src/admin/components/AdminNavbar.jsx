import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, User, LogOut, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminNavbar = ({ setMobileOpen, connected = true }) => {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifDropdown, setNotifDropdown] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/issues?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16 flex items-center px-4 sm:px-6">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="p-2 mr-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Global Search Bar (matching screenshot) */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues, citizens, locations..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200/80 focus:border-[#07845F] focus:outline-hidden transition-all text-[#102544] placeholder-slate-400"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Live Status Pill (matching screenshot) */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
          <span>{connected ? 'Live' : 'Offline'}</span>
        </div>

        {/* Notifications Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdown(!notifDropdown)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-[#102544] hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#102544]">Real-time Alerts</h4>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 text-xs">
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-[#102544]">Critical Drainage Hazard Escalated</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Issue #CT-10415 exceeded 48h SLA</p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">2 min ago</span>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-[#102544]">New Complaint Verified</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Issue #CT-10432 resolution approved</p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">10 min ago</span>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-[#102544]">High Tension Wire Flagged</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Ludhiana ward 22 alert active</p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">1 hour ago</span>
                </div>
              </div>
              <div className="px-4 pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setNotifDropdown(false);
                    navigate('/admin/notifications');
                  }}
                  className="text-xs font-semibold text-[#07845F] hover:underline"
                >
                  View All Announcements & Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Profile (matching screenshot) */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden ring-2 ring-[#07845F]/20">
              <img
                src={
                  admin?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={admin?.name || 'Admin'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-[#102544] leading-tight">
                {admin?.name || 'Dr. Rajesh Kumar'}
              </p>
              <p className="text-[10px] font-semibold text-slate-500">
                {admin?.role === 'super_admin' ? 'Super Admin' : (admin?.designation || 'Administrator')}
              </p>
            </div>
          </button>

          {/* Profile Dropdown */}
          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-[#102544]">{admin?.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{admin?.adminId}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  {admin?.role?.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileDropdown(false);
                  navigate('/admin/profile');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Admin Profile & Security</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border-t border-slate-100 mt-1"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
