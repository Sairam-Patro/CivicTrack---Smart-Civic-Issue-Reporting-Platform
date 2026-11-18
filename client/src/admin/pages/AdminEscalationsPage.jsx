import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminEscalationsPage = () => {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEscalations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/escalations');
      if (res.data?.success) {
        setEscalations(res.data.escalations);
      }
    } catch {
      toast.error('Failed to load escalations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  const handleUpdate = async (id, newStatus, notes) => {
    try {
      await axios.patch(`/api/admin/escalations/${id}/status`, {
        status: newStatus,
        notes,
      });
      toast.success(`Escalation marked as ${newStatus}.`);
      fetchEscalations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
          Automated Escalation Management Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Priority alert center for SLA breaches, critical public hazards, and delayed municipal resolutions.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Checking escalations database...
        </div>
      ) : escalations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#102544]">No Active Escalations!</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All civic complaints across your jurisdiction are progressing within SLA timelines.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {escalations.map((esc) => (
            <div
              key={esc._id}
              className={`p-6 rounded-3xl border transition-all ${
                esc.status === 'ACTIVE'
                  ? 'bg-red-50/40 border-red-200 shadow-xs'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-red-600 text-white">
                      {esc.escalationId}
                    </span>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#102544] text-white">
                      Issue #{esc.issueRef}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                      {esc.level}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        esc.status === 'ACTIVE'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {esc.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#102544]">{esc.issueTitle}</h3>
                  <p className="text-xs text-red-800 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Breach Reason: {esc.reason} (Overdue by {esc.overdueHours || 48} hours)</span>
                  </p>

                  <div className="text-xs text-slate-600 space-y-0.5 pt-1">
                    <p>Current Assignee: <strong className="text-slate-800">{esc.currentOfficer}</strong></p>
                    <p>Escalated To: <strong className="text-slate-800">{esc.escalatedTo}</strong></p>
                    <p>Recommended Action: <span className="italic text-slate-700">{esc.recommendedAction}</span></p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                  {esc.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => handleUpdate(esc._id, 'ACKNOWLEDGED', 'Acknowledged by Senior Admin')}
                        className="w-full sm:w-auto px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 shadow-2xs"
                      >
                        Acknowledge & Dispatch
                      </button>

                      <button
                        onClick={() => handleUpdate(esc._id, 'RESOLVED', 'Resolution expedited and verified')}
                        className="w-full sm:w-auto px-4 py-2 bg-[#07845F] text-white text-xs font-bold rounded-xl hover:bg-[#066f50] shadow-2xs"
                      >
                        Mark Escalation Resolved
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEscalationsPage;
