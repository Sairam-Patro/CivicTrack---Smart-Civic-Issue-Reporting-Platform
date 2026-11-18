import React, { useState } from 'react';
import { Shield, Key, CheckCircle2, User, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminProfilePage = () => {
  const { admin, changePassword } = useAdminAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
          Administrator Profile & Security
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Manage your official credentials, encryption keys, and active administrative session.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-[#102544] text-white flex items-center justify-center font-bold text-2xl">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#102544]">{admin?.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{admin?.designation || 'Administrator'}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {admin?.adminId}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {admin?.role?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 text-slate-600">
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Official Email</span>
            <span className="font-semibold text-slate-800">{admin?.email}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Official Phone</span>
            <span className="font-semibold text-slate-800">{admin?.phone || '+91 98765 43210'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Jurisdiction</span>
            <span className="font-semibold text-slate-800">{admin?.state || 'National'}, {admin?.district || 'All Districts'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Last Session Login</span>
            <span className="font-semibold text-slate-800">{admin?.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Active Now'}</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Key className="w-5 h-5 text-[#07845F]" />
          <h3 className="font-extrabold text-sm text-[#102544]">Update Secret Password</h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">New Password (Min 8 Characters)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#07845F] text-white font-bold rounded-xl hover:bg-[#066f50] cursor-pointer"
          >
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfilePage;
