import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, CheckCircle2, XCircle, Clock, MapPin, Camera, DollarSign, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminResolutionsPage = () => {
  const [resolutions, setResolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResolutions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/resolutions');
      if (res.data?.success) {
        setResolutions(res.data.resolutions);
      }
    } catch {
      toast.error('Failed to load resolutions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResolutions();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await axios.post(`/api/admin/resolutions/${id}/verify`, {
        status,
        verificationNotes: status === 'APPROVED' ? 'Evidence inspected and resolution confirmed.' : 'Resolution rejected, rework required.',
      });
      toast.success(`Resolution ${status.toLowerCase()} successfully.`);
      fetchResolutions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification update failed.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
          Resolution Tracking & Photographic Evidence Verification
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Compare before-and-after photographic evidence and verify material completion before marking complaints resolved.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-[#07845F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading resolutions evidence...
        </div>
      ) : resolutions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#102544]">No Resolutions Awaiting Verification</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When field officers complete repairs and upload post-work photographs, they appear here for official sign-off.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {resolutions.map((res) => (
            <div
              key={res._id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-6"
            >
              {/* Before and After Image Comparison (matching prompt specification) */}
              <div className="lg:w-1/2 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200">
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/60 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs">
                    Before Repair
                  </span>
                  <img
                    src={res.beforeImages?.[0] || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80'}
                    alt="Before Repair"
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                </div>

                <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200">
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#07845F] text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                    After Resolution
                  </span>
                  <img
                    src={res.afterImages?.[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=400&q=80'}
                    alt="After Resolution"
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                </div>
              </div>

              {/* Resolution Details */}
              <div className="lg:w-1/2 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#102544] text-white">
                      Issue #{res.issueRef}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        res.verificationStatus === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : res.verificationStatus === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {res.verificationStatus}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#102544]">{res.issueTitle}</h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{res.resolutionNotes}"
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 mt-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Completed By Officer</span>
                      <strong className="text-slate-800">{res.submitterName}</strong> ({res.department})
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Cost</span>
                      <strong className="text-slate-800">₹{res.workCost?.toLocaleString() || '8,500'}</strong>
                    </div>
                  </div>

                  {res.materialsUsed?.length > 0 && (
                    <div className="mt-2 text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Materials Used</span>
                      <div className="flex flex-wrap gap-1">
                        {res.materialsUsed.map((m, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] text-slate-700">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Verification Actions */}
                {res.verificationStatus === 'PENDING_APPROVAL' && (
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <button
                      onClick={() => handleVerify(res._id, 'APPROVED')}
                      className="flex-1 py-2.5 px-4 bg-[#07845F] hover:bg-[#066f50] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Mark Issue Resolved</span>
                    </button>

                    <button
                      onClick={() => handleVerify(res._id, 'REJECTED')}
                      className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject & Request Rework</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminResolutionsPage;
