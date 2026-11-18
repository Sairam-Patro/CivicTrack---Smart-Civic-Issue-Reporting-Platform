import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Send, Megaphone, AlertCircle, Info, ShieldAlert, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminNotificationsPage = () => {
  const { admin } = useAdminAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'INFO',
    targetAudience: 'ALL_CITIZENS',
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/announcements');
      if (res.data?.success) {
        setAnnouncements(res.data.announcements);
      }
    } catch {
      toast.error('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/announcements', formData);
      toast.success('Announcement broadcast successfully.');
      setFormData({ title: '', message: '', type: 'INFO', targetAudience: 'ALL_CITIZENS' });
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Publish failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
          Notifications & Administrative Announcements
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Broadcast emergency civic alerts, seasonal advisory notices, and inter-departmental directives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Form (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Megaphone className="w-5 h-5 text-[#07845F]" />
            <h3 className="font-extrabold text-sm text-[#102544]">Create Official Broadcast</h3>
          </div>

          <form onSubmit={handlePublish} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Announcement Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Monsoon Drainage Advisory 2025"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alert Severity</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="INFO">Information</option>
                  <option value="WARNING">Advisory Warning</option>
                  <option value="ALERT">Priority Alert</option>
                  <option value="EMERGENCY">Public Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="ALL_CITIZENS">All Citizens & Public</option>
                  <option value="ADMINS_ONLY">Civic Administrators Only</option>
                  <option value="DEPARTMENT">Field Officers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Advisory Message</label>
              <textarea
                rows="4"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write the full broadcast instruction..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#07845F] text-white font-bold rounded-xl hover:bg-[#066f50] flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Now</span>
            </button>
          </form>
        </div>

        {/* Broadcast Feed (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-extrabold text-sm text-[#102544] mb-4 pb-3 border-b border-slate-100">
            Active Published Announcements
          </h3>

          <div className="space-y-3.5">
            {announcements.map((ann) => (
              <div
                key={ann._id}
                className={`p-4 rounded-2xl border ${
                  ann.type === 'EMERGENCY' || ann.type === 'ALERT'
                    ? 'bg-red-50/50 border-red-200'
                    : 'bg-slate-50/70 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ann.type === 'EMERGENCY'
                        ? 'bg-red-600 text-white'
                        : ann.type === 'ALERT'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ann.type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-[#102544]">{ann.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.message}</p>
                <p className="text-[10px] text-slate-400 mt-2">Issued by: {ann.creatorName} ({ann.creatorRole})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
