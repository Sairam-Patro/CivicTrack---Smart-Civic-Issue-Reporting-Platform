import Issue from '../models/Issue.js';
import Department from '../models/Department.js';
import Admin from '../models/Admin.js';
import Escalation from '../models/Escalation.js';
import { recordAuditLog } from '../middleware/adminAuthMiddleware.js';
import { emitEvent } from '../utils/socket.js';

// GET /api/admin/issues
export const getAllIssues = async (req, res) => {
  try {
    const geoFilter = req.geoScopeFilter || {};
    const {
      q,
      category,
      status,
      priority,
      state,
      district,
      page = 1,
      limit = 20,
      sortBy = '-createdAt',
    } = req.query;

    const filter = { ...geoFilter };

    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;
    if (priority && priority !== 'All') filter.priority = priority;
    if (state && state !== 'All') filter['location.state'] = state;
    if (district && district !== 'All') filter['location.district'] = district;

    if (q) {
      filter.$or = [
        { issueCode: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'location.address': { $regex: q, $options: 'i' } },
        { 'location.ward': { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .populate('reportedBy', 'name email phone')
        .populate('assignedDepartment', 'name code')
        .populate('assignedOfficer', 'name adminId designation')
        .sort(sortBy)
        .skip(skip)
        .limit(Number(limit)),
      Issue.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      issues,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/issues/:id
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email phone avatar')
      .populate('assignedDepartment', 'name code contactEmail contactPhone')
      .populate('assignedOfficer', 'name adminId phone designation');

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue record not found.' });
    }

    return res.json({ success: true, issue });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/issues/:id/status
export const updateIssueStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    const prevStatus = issue.status;
    issue.status = status;

    if (status === 'Resolved') {
      issue.resolvedAt = new Date();
    }

    issue.timeline.push({
      action: `Status changed to ${status}`,
      status,
      performedBy: `${req.admin.name} (${req.admin.adminId})`,
      note: note || `Status updated from ${prevStatus} to ${status}`,
      timestamp: new Date(),
    });

    await issue.save();

    // Audit log
    await recordAuditLog({
      admin: req.admin,
      action: 'ISSUE_STATUS_UPDATE',
      targetType: 'Issue',
      targetId: issue.issueCode || issue._id.toString(),
      details: { previousStatus: prevStatus, newStatus: status, note },
      ip: req.ip,
    });

    // Real-time broadcast
    emitEvent('issue:updated', {
      issueId: issue._id,
      issueCode: issue.issueCode,
      status: issue.status,
      updatedAt: issue.updatedAt,
    });

    emitEvent('issue:status-changed', {
      issueCode: issue.issueCode,
      status,
      actor: req.admin.name,
    });

    return res.json({ success: true, message: 'Issue status updated.', issue });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/issues/:id/assign
export const assignIssue = async (req, res) => {
  try {
    const { departmentId, officerId, note } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    let deptName = '';
    let officerName = '';

    if (departmentId) {
      const dept = await Department.findById(departmentId);
      if (dept) {
        issue.assignedDepartment = dept._id;
        issue.assignedDepartmentName = dept.name;
        deptName = dept.name;
      }
    }

    if (officerId) {
      const officer = await Admin.findById(officerId);
      if (officer) {
        issue.assignedOfficer = officer._id;
        issue.assignedOfficerName = officer.name;
        officerName = officer.name;
      }
    }

    issue.status = 'Assigned';
    issue.assignedAt = new Date();

    issue.timeline.push({
      action: 'Issue Assigned',
      status: 'Assigned',
      performedBy: `${req.admin.name} (${req.admin.adminId})`,
      note: note || `Assigned to ${deptName || 'Department'} ${officerName ? `- Officer ${officerName}` : ''}`,
      timestamp: new Date(),
    });

    await issue.save();

    await recordAuditLog({
      admin: req.admin,
      action: 'ISSUE_ASSIGNED',
      targetType: 'Issue',
      targetId: issue.issueCode || issue._id.toString(),
      details: { departmentId, officerId, deptName, officerName, note },
      ip: req.ip,
    });

    emitEvent('issue:assigned', {
      issueCode: issue.issueCode,
      department: deptName,
      officer: officerName,
    });

    return res.json({ success: true, message: 'Issue assigned successfully.', issue });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/admin/issues/:id/priority
export const updateIssuePriority = async (req, res) => {
  try {
    const { priority, note } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    const prevPriority = issue.priority;
    issue.priority = priority;

    issue.timeline.push({
      action: `Priority adjusted to ${priority}`,
      performedBy: `${req.admin.name} (${req.admin.adminId})`,
      note: note || `Priority elevated from ${prevPriority} to ${priority}`,
      timestamp: new Date(),
    });

    await issue.save();

    await recordAuditLog({
      admin: req.admin,
      action: 'ISSUE_PRIORITY_UPDATE',
      targetType: 'Issue',
      targetId: issue.issueCode || issue._id.toString(),
      details: { previousPriority: prevPriority, newPriority: priority, note },
      ip: req.ip,
    });

    return res.json({ success: true, message: 'Priority updated successfully.', issue });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/issues/:id/verify
export const verifyIssue = async (req, res) => {
  try {
    const { isVerified, rejectionReason, note } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    issue.isVerified = isVerified;
    issue.verifiedBy = req.admin._id;
    issue.verifiedByName = req.admin.name;
    issue.verifiedAt = new Date();

    if (isVerified) {
      issue.status = 'Under Review';
      issue.timeline.push({
        action: 'Complaint Verified',
        status: 'Under Review',
        performedBy: `${req.admin.name} (${req.admin.adminId})`,
        note: note || 'Issue inspected and verified as genuine civic complaint.',
        timestamp: new Date(),
      });
    } else {
      issue.status = 'Rejected';
      issue.rejectionReason = rejectionReason || 'Duplicate, invalid location, or spam content.';
      issue.timeline.push({
        action: 'Complaint Rejected',
        status: 'Rejected',
        performedBy: `${req.admin.name} (${req.admin.adminId})`,
        note: rejectionReason || 'Rejected after verification check.',
        timestamp: new Date(),
      });
    }

    await issue.save();

    await recordAuditLog({
      admin: req.admin,
      action: isVerified ? 'ISSUE_VERIFIED' : 'ISSUE_REJECTED',
      targetType: 'Issue',
      targetId: issue.issueCode || issue._id.toString(),
      details: { isVerified, rejectionReason },
      ip: req.ip,
    });

    return res.json({ success: true, message: isVerified ? 'Issue verified.' : 'Issue rejected.', issue });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/issues/:id/notes
export const addAdminNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ success: false, message: 'Note content is required.' });

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    issue.adminNotes.push({
      adminId: req.admin.adminId,
      adminName: req.admin.name,
      note,
      createdAt: new Date(),
    });

    await issue.save();

    return res.json({ success: true, message: 'Internal note recorded.', adminNotes: issue.adminNotes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/issues/:id/escalate
export const escalateIssue = async (req, res) => {
  try {
    const { reason, level = 'Level 2 - District', priority = 'High' } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found.' });

    issue.escalated = true;
    issue.escalationLevel = level;
    issue.escalationReason = reason;

    const count = await Escalation.countDocuments();
    const escalationId = `ESC-${10000 + count + 1}`;

    const escalation = await Escalation.create({
      escalationId,
      issue: issue._id,
      issueRef: issue.issueCode || `CT-${issue._id.toString().slice(-5)}`,
      issueTitle: issue.title,
      level,
      priority,
      reason: reason || 'Action delayed beyond SLA threshold',
      triggerType: 'MANUAL_OFFICIAL',
      status: 'ACTIVE',
      currentOfficer: issue.assignedOfficerName || 'Unassigned',
      escalatedTo: `${req.admin.district || 'District'} Administration`,
      overdueHours: 48,
    });

    issue.timeline.push({
      action: 'Issue Escalated',
      performedBy: `${req.admin.name} (${req.admin.adminId})`,
      note: `Escalated to ${level}: ${reason}`,
      timestamp: new Date(),
    });

    await issue.save();

    await recordAuditLog({
      admin: req.admin,
      action: 'ISSUE_ESCALATED',
      targetType: 'Issue',
      targetId: issue.issueCode || issue._id.toString(),
      details: { escalationId, level, reason },
      ip: req.ip,
    });

    emitEvent('issue:escalated', {
      issueCode: issue.issueCode,
      escalationId,
      priority,
      reason,
    });

    return res.json({ success: true, message: 'Issue escalated successfully.', escalation, issue });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
