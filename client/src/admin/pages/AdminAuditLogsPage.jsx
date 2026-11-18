import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Search, ShieldCheck, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('All');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 25 });
      if (filterAction !== 'All') params.append('action', filterAction);

      const res = await axios.get(`/api/admin/audit-logs?${params.toString()}`);
      if (res.data?.success) {
        setLogs(res.data.logs);
        setTotal(res.data.total);
      }
    } catch {
      toast.error('Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filterAction]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
            Security & Administrative Audit Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Immutable, append-only log of every administrative action, privilege change, and status transition.
          </p>
        </div>

        <select
          value={filterAction}
          onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
          className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-2xs focus:outline-hidden"
        >
          <option value="All">All Actions</option>
          <option value="ADMIN_LOGIN_SUCCESS">Admin Login</option>
          <option value="ISSUE_STATUS_UPDATE">Status Update</option>
          <option value="ISSUE_ASSIGNED">Issue Assignment</option>
          <option value="ISSUE_RESOLVED">Issue Resolved</option>
          <option value="ISSUE_ESCALATED">Issue Escalated</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Record</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="w-7 h-7 border-3 border-[#07845F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 italic">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-[#102544]">{log.adminName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{log.adminId} ({log.role})</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#07845F] font-bold">
                      {log.targetId || '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {log.ip || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {log.status}
                      </span>
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

export default AdminAuditLogsPage;
