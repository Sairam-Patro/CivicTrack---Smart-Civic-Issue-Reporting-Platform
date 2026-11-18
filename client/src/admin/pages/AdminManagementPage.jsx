import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, UserPlus, Mail, Phone, Crown, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminManagementPage = () => {
  const { admin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'state_admin',
    designation: 'State Civic Director',
    state: 'Punjab',
    district: 'All',
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/administrators');
      if (res.data?.success) {
        setAdmins(res.data.administrators);
      }
    } catch {
      toast.error('Failed to load administrators.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/administrators', formData);
      toast.success('Administrator provisioned successfully.');
      setModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'state_admin',
        designation: 'State Civic Director',
        state: 'Punjab',
        district: 'All',
      });
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Provisioning failed.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
            Administrator Hierarchy & Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Multi-tier governance provisioning: State Admins, District Admins, and Municipal Commissioners.
          </p>
        </div>

        {admin?.role === 'super_admin' && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-[#07845F] text-white text-xs font-bold rounded-xl hover:bg-[#066f50] flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New Admin</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {admins.map((adm) => (
          <div
            key={adm._id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-[#102544] text-white rounded-lg">
                  {adm.adminId}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {adm.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {adm.role === 'super_admin' ? <Crown className="w-6 h-6 text-amber-500" /> : adm.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base text-[#102544] truncate">{adm.name}</h3>
                  <p className="text-xs text-slate-500 font-medium truncate">{adm.designation}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 mb-2">
                <p className="text-slate-700 font-semibold">Jurisdiction: <span className="font-bold text-[#07845F]">{adm.state || 'National'}</span></p>
                {adm.district && adm.district !== 'All' && (
                  <p className="text-slate-500 text-[11px]">District: {adm.district}</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{adm.email}</span>
              </div>
              {adm.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{adm.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Provision Admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-[#102544]">Provision Administrative Account</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Administrator Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sardar Gurpreet Singh"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@civictrack.gov.in"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Administrative Level</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="state_admin">Level 2: State Admin</option>
                    <option value="district_admin">Level 3: District Admin</option>
                    <option value="local_admin">Level 4: Municipal Admin</option>
                    <option value="moderator">Level 6: Moderator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State / UT</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District (If applicable)</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Ludhiana or All"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave empty for Admin@CivicTrack2025"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#07845F] text-white rounded-xl font-bold hover:bg-[#066f50]"
                >
                  Generate Admin ID & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagementPage;
