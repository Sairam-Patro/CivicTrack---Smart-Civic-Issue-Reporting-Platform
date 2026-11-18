import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, ShieldCheck, ShieldAlert, Mail, Phone, MapPin, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminCitizensPage = () => {
  const [citizens, setCitizens] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (stateFilter !== 'All') params.append('state', stateFilter);

      const res = await axios.get(`/api/admin/citizens?${params.toString()}`);
      if (res.data?.success) {
        setCitizens(res.data.citizens);
        setTotal(res.data.total);
      }
    } catch {
      toast.error('Failed to load citizens registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, [stateFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCitizens();
  };

  const handleToggleStatus = async (citizen, newVerified) => {
    try {
      await axios.patch(`/api/admin/citizens/${citizen._id}/status`, {
        isVerified: newVerified,
        reason: newVerified ? 'Verified by administrator.' : 'Flagged for review.',
      });
      toast.success(`Citizen status updated.`);
      fetchCitizens();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
          Citizen Management Registry
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Verified citizen profiles, civic participation metrics, and account integrity controls.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by citizen name, email, or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#07845F]"
          />
        </form>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
        >
          <option value="All">All Regions</option>
          <option value="Delhi">Delhi</option>
          <option value="Punjab">Punjab</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Karnataka">Karnataka</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Citizen Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Jurisdiction</th>
                <th className="py-3.5 px-4 text-center">Complaints Filed</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Account Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="w-7 h-7 border-3 border-[#07845F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading citizens...
                  </td>
                </tr>
              ) : citizens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 italic">
                    No citizen accounts found.
                  </td>
                </tr>
              ) : (
                citizens.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-[#102544]">{c.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {c._id.slice(-6)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{c.email}</div>
                      <div className="text-[10px] text-slate-400">{c.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span>{c.ward || 'Ward 12'}, {c.city || c.district || 'Delhi'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md font-mono">
                        {c.issuesCount || 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          c.isVerified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.isVerified ? 'Verified Citizen' : 'Unverified'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(c, !c.isVerified)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                          c.isVerified
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {c.isVerified ? 'Flag / Suspend' : 'Verify Account'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCitizensPage;
