import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Plus, Mail, Phone, Building2, CheckCircle2, Clock, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminOfficersPage = () => {
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    designation: 'Executive Engineer',
    departmentId: '',
    state: 'Delhi',
    district: 'New Delhi',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offRes, deptRes] = await Promise.all([
        axios.get('/api/admin/officers'),
        axios.get('/api/admin/departments'),
      ]);
      if (offRes.data?.success) setOfficers(offRes.data.officers);
      if (deptRes.data?.success) setDepartments(deptRes.data.departments);
    } catch {
      toast.error('Failed to load officers directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/officers', formData);
      toast.success('Officer provisioned successfully.');
      setModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        designation: 'Executive Engineer',
        departmentId: '',
        state: 'Delhi',
        district: 'New Delhi',
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Provisioning failed.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
            Field Officer Roster & Jurisdictions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage municipal field engineers, sanitation supervisors, and resolution verification officers.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-[#07845F] text-white text-xs font-bold rounded-xl hover:bg-[#066f50] flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Officer</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-[#07845F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading officers directory...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {officers.map((off) => (
            <div
              key={off._id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    {off.adminId}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-[#102544] text-white font-bold flex items-center justify-center shrink-0">
                    {off.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-[#102544] truncate">{off.name}</h3>
                    <p className="text-xs text-slate-500 font-medium truncate">{off.designation}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 mb-3">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#07845F] shrink-0" />
                    <span className="truncate">{off.departmentName || off.assignedDepartment?.name || 'General Operations'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>{off.district || 'New Delhi'}, {off.state || 'Delhi'}</span>
                  </div>
                </div>

                {/* Assigned vs Completed */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-blue-50/60 rounded-xl">
                    <span className="text-slate-500 text-[10px] font-bold block">Active Tasks</span>
                    <span className="text-base font-extrabold text-blue-900">{off.assignedCount || 0}</span>
                  </div>
                  <div className="p-2 bg-emerald-50/60 rounded-xl">
                    <span className="text-slate-500 text-[10px] font-bold block">Resolved</span>
                    <span className="text-base font-extrabold text-emerald-900">{off.completedCount || 0}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{off.email}</span>
                </div>
                {off.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{off.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provision Officer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-[#102544]">Provision Department Officer</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rakesh Sharma"
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
                    placeholder="officer@civictrack.gov.in"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <select
                  required
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="">Select Department...</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Executive Engineer, Sanitation Inspector"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave empty for default Officer@CivicTrack2025"
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
                  Generate Officer ID & Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOfficersPage;
