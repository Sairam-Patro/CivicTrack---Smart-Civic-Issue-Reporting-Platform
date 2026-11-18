import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building2,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  FileText,
  ThumbsUp,
  MapPin,
  X,
} from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import IssueStatusBadge from '../components/IssueStatusBadge';
import { useAdminAuth } from '../context/AdminAuthContext';
import toast from 'react-hot-toast';

export const AdminIssuesPage = () => {
  const { admin } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [issues, setIssues] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'All');

  // Selected issue for modal/quick action
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [actionModal, setActionModal] = useState(false);
  const [modalAction, setModalAction] = useState('status'); // 'status', 'assign', 'verify', 'escalate'
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);

  // Modal form states
  const [newStatus, setNewStatus] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [escalateReason, setEscalateReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 15,
      });

      if (query) params.append('q', query);
      if (category !== 'All') params.append('category', category);
      if (status !== 'All') params.append('status', status);
      if (priority !== 'All') params.append('priority', priority);

      const res = await axios.get(`/api/admin/issues?${params.toString()}`);
      if (res.data?.success) {
        setIssues(res.data.issues);
        setTotal(res.data.total);
        setPages(res.data.pages);
      }
    } catch (err) {
      toast.error('Failed to load issues list.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [deptRes, offRes] = await Promise.all([
        axios.get('/api/admin/departments'),
        axios.get('/api/admin/officers'),
      ]);
      if (deptRes.data?.departments) setDepartments(deptRes.data.departments);
      if (offRes.data?.officers) setOfficers(offRes.data.officers);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [page, category, status, priority]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchIssues();
  };

  const openAction = (issue, type) => {
    setSelectedIssue(issue);
    setModalAction(type);
    setNewStatus(issue.status);
    setSelectedDept(issue.assignedDepartment?._id || '');
    setSelectedOfficer(issue.assignedOfficer?._id || '');
    setActionNote('');
    setEscalateReason('');
    setRejectionReason('');
    setActionModal(true);
  };

  const submitAction = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    try {
      if (modalAction === 'status') {
        await axios.patch(`/api/admin/issues/${selectedIssue._id}/status`, {
          status: newStatus,
          note: actionNote,
        });
        toast.success(`Status updated to ${newStatus}`);
      } else if (modalAction === 'assign') {
        await axios.patch(`/api/admin/issues/${selectedIssue._id}/assign`, {
          departmentId: selectedDept,
          officerId: selectedOfficer,
          note: actionNote,
        });
        toast.success('Assignment updated successfully.');
      } else if (modalAction === 'verify') {
        await axios.post(`/api/admin/issues/${selectedIssue._id}/verify`, {
          isVerified: true,
          note: actionNote || 'Verified as genuine civic complaint.',
        });
        toast.success('Issue verified.');
      } else if (modalAction === 'reject') {
        await axios.post(`/api/admin/issues/${selectedIssue._id}/verify`, {
          isVerified: false,
          rejectionReason: rejectionReason || 'Invalid complaint',
        });
        toast.success('Issue rejected.');
      } else if (modalAction === 'escalate') {
        await axios.post(`/api/admin/issues/${selectedIssue._id}/escalate`, {
          reason: escalateReason || 'Urgent intervention required',
          priority: 'Critical',
        });
        toast.success('Issue escalated to senior authorities.');
      }

      setActionModal(false);
      fetchIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Title & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
            All Complaints & Civic Issues
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage, verify, route, and resolve nationwide civic complaints with full audit trail.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/map"
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <MapPin className="w-4 h-4 text-[#07845F]" />
            <span>Map View</span>
          </Link>
          <a
            href="/api/admin/reports/csv"
            download
            className="px-3.5 py-2 bg-[#07845F] text-white text-xs font-semibold rounded-xl hover:bg-[#066f50] flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Issue ID (#CT-10432), title, address, ward..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#07845F]"
          />
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Potholes">Potholes & Roads</option>
            <option value="Garbage">Garbage & Waste</option>
            <option value="Streetlights">Streetlights & Power</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Drainage">Drainage & Sewage</option>
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Issue Code</th>
                <th className="py-3.5 px-4">Complaint Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4 text-center">Upvotes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <div className="w-7 h-7 border-3 border-[#07845F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading complaints database...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 italic">
                    No complaints match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                issues.map((iss) => (
                  <tr key={iss._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#102544]">
                      {iss.issueCode || `CT-${iss._id.slice(-5)}`}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1 max-w-[220px]">
                        {iss.title}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(iss.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {iss.category}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="line-clamp-1 max-w-[160px]">
                        {iss.location?.ward || 'Ward 12'}, {iss.location?.district || iss.location?.city || 'Delhi'}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={iss.priority} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <IssueStatusBadge status={iss.status} />
                    </td>

                    {/* Assigned */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-medium">
                        {iss.assignedOfficerName || iss.assignedDepartmentName || 'Unassigned'}
                      </span>
                    </td>

                    {/* Upvotes */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                        <ThumbsUp className="w-3 h-3 text-slate-400" />
                        {iss.upvoteCount || 0}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openAction(iss, 'status')}
                          title="Change Status"
                          className="p-1.5 text-slate-500 hover:text-[#102544] hover:bg-slate-100 rounded-lg"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openAction(iss, 'assign')}
                          title="Assign Department/Officer"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openAction(iss, 'escalate')}
                          title="Escalate Issue"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {issues.length} of {total} records</span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-700">Page {page} of {pages || 1}</span>
            <button
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Modal (Status / Assign / Escalate) */}
      {actionModal && selectedIssue && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-[#102544]">
                  {modalAction === 'status' && 'Update Issue Status'}
                  {modalAction === 'assign' && 'Assign Department & Officer'}
                  {modalAction === 'escalate' && 'Escalate Civic Issue'}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Issue #{selectedIssue.issueCode || selectedIssue._id}
                </p>
              </div>
              <button
                onClick={() => setActionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitAction} className="space-y-4 text-xs">
              {modalAction === 'status' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Reported">Reported</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Duplicate">Duplicate</option>
                  </select>
                </div>
              )}

              {modalAction === 'assign' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Target Department</label>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="">Select Department...</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Assign Officer (Optional)</label>
                    <select
                      value={selectedOfficer}
                      onChange={(e) => setSelectedOfficer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="">Select Officer...</option>
                      {officers.map((off) => (
                        <option key={off._id} value={off._id}>
                          {off.name} ({off.adminId}) - {off.designation}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {modalAction === 'escalate' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Escalation Reason</label>
                  <textarea
                    rows="3"
                    required
                    value={escalateReason}
                    onChange={(e) => setEscalateReason(e.target.value)}
                    placeholder="e.g. Critical safety hazard with no resolution for 48 hours..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Official Note (Audit Trail)</label>
                <textarea
                  rows="2"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Reason or instructions for this action..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#07845F] text-white rounded-xl font-bold hover:bg-[#066f50]"
                >
                  Confirm & Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIssuesPage;
