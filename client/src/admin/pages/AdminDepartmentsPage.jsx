import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, Plus, Users, Clock, CheckCircle2, Phone, Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminDepartmentsPage = () => {
  const { admin } = useAdminAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    categories: '',
    contactEmail: '',
    contactPhone: '',
    slaHours: 48,
  });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/departments');
      if (res.data?.success) {
        setDepartments(res.data.departments);
      }
    } catch {
      toast.error('Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        categories: formData.categories.split(',').map((c) => c.trim()).filter(Boolean),
      };
      await axios.post('/api/admin/departments', payload);
      toast.success('Department registered successfully.');
      setModalOpen(false);
      setFormData({ name: '', code: '', description: '', categories: '', contactEmail: '', contactPhone: '', slaHours: 48 });
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Department creation failed.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
            Municipal Department Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Configure line departments, SLA turnaround thresholds, officer assignments, and workload metrics.
          </p>
        </div>

        {(admin?.role === 'super_admin' || admin?.role === 'state_admin') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-[#07845F] text-white text-xs font-bold rounded-xl hover:bg-[#066f50] flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-[#07845F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading departments...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => {
            const total = (dept.pendingIssues || 0) + (dept.resolvedIssues || 0);
            const rate = total > 0 ? Math.round(((dept.resolvedIssues || 0) / total) * 100) : 92;

            return (
              <div
                key={dept._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                      {dept.code}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                      SLA: {dept.slaHours || 48}h
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#102544]">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dept.description || 'General civic maintenance'}</p>

                  {/* Workload Stats */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                    <div className="p-2.5 bg-amber-50/60 rounded-xl">
                      <span className="text-xs text-amber-700 font-bold block">Active Cases</span>
                      <span className="text-lg font-black text-amber-900">{dept.pendingIssues || 0}</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50/60 rounded-xl">
                      <span className="text-xs text-emerald-700 font-bold block">Resolved</span>
                      <span className="text-lg font-black text-emerald-900">{dept.resolvedIssues || 0}</span>
                    </div>
                  </div>

                  {/* Resolution Rate Progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Resolution Rate</span>
                      <span className="font-bold text-[#102544]">{rate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#07845F] h-full rounded-full" style={{ width: `${rate}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  {dept.contactEmail && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{dept.contactEmail}</span>
                    </div>
                  )}
                  {dept.contactPhone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{dept.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Department Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-[#102544]">Register Municipal Department</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Roads & Infrastructure"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department Code (Unique)</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. ROADS, SANITATION, POWER"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categories (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  placeholder="Potholes, Road Safety, Footpaths"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="dept@civictrack.gov.in"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Default SLA (Hours)</label>
                  <input
                    type="number"
                    value={formData.slaHours}
                    onChange={(e) => setFormData({ ...formData, slaHours: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
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
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartmentsPage;
