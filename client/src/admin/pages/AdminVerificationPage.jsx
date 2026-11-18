import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, MapPin, Eye, ThumbsUp, AlertCircle, ShieldCheck } from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import toast from 'react-hot-toast';

export const AdminVerificationPage = () => {
  const [unverified, setUnverified] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchUnverified = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/issues?status=Reported&limit=30');
      if (res.data?.success) {
        setUnverified(res.data.issues);
      }
    } catch {
      toast.error('Failed to load verification queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverified();
  }, []);

  const handleVerify = async (id, isApproved, reason = '') => {
    try {
      await axios.post(`/api/admin/issues/${id}/verify`, {
        isVerified: isApproved,
        rejectionReason: reason,
        note: isApproved ? 'Verified by administrator.' : reason,
      });

      toast.success(isApproved ? 'Complaint approved & verified.' : 'Complaint rejected.');
      setRejectModal(null);
      setRejectReason('');
      fetchUnverified();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification update failed.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
          Issue Verification Queue
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Inspect photo evidence and citizen reports before official routing to municipal departments.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-[#07845F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Checking pending verification queue...
        </div>
      ) : unverified.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#102544]">Verification Queue is Clear!</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All newly incoming complaints have been inspected. New citizen reports will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {unverified.map((iss) => (
            <div
              key={iss._id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Photo */}
              <div className="h-44 bg-slate-100 relative">
                {iss.images?.[0] ? (
                  <img src={iss.images[0]} alt={iss.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    No photo attached
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[10px] font-bold px-2 py-1 rounded-lg bg-black/60 text-white backdrop-blur-xs">
                    {iss.issueCode || `CT-${iss._id.slice(-5)}`}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <PriorityBadge priority={iss.priority} />
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#07845F]"></span>
                  <span>{iss.category}</span>
                </div>

                <h3 className="font-bold text-sm text-[#102544] line-clamp-1">{iss.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{iss.description}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{iss.location?.address || `${iss.location?.ward}, ${iss.location?.city}`}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Reported by: <strong className="text-slate-600">{iss.reporterName || 'Citizen'}</strong></span>
                    <span>{new Date(iss.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleVerify(iss._id, true)}
                    className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => { setRejectModal(iss); setRejectReason(''); }}
                    className="flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-extrabold text-base text-[#102544] mb-1">Reject Civic Complaint</h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify reason for rejecting complaint #{rejectModal.issueCode || rejectModal._id}.
            </p>

            <textarea
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Duplicate report, invalid location, spam or prank photo..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-4"
            />

            <div className="flex items-center justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerify(rejectModal._id, false, rejectReason)}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerificationPage;
