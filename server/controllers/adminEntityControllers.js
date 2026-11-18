import Department from '../models/Department.js';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Issue from '../models/Issue.js';
import Escalation from '../models/Escalation.js';
import Resolution from '../models/Resolution.js';
import Announcement from '../models/Announcement.js';
import AuditLog from '../models/AuditLog.js';
import SystemSetting from '../models/SystemSetting.js';
import { State, District, LocalBody } from '../models/Geography.js';
import { generateAdminId } from '../utils/adminIdGenerator.js';
import { recordAuditLog } from '../middleware/adminAuthMiddleware.js';
import { emitEvent } from '../utils/socket.js';

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort('name');

    const deptsWithStats = await Promise.all(
      departments.map(async (d) => {
        const [pending, resolved, officersCount] = await Promise.all([
          Issue.countDocuments({ assignedDepartment: d._id, status: { $ne: 'Resolved' } }),
          Issue.countDocuments({ assignedDepartment: d._id, status: 'Resolved' }),
          Admin.countDocuments({ assignedDepartment: d._id, role: 'officer' }),
        ]);

        return {
          ...d.toObject(),
          pendingIssues: pending,
          resolvedIssues: resolved,
          activeOfficers: officersCount || d.totalStaff || 8,
        };
      })
    );

    return res.json({ success: true, departments: deptsWithStats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { name, code, description, categories, contactEmail, contactPhone, slaHours } = req.body;
    const exists = await Department.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ success: false, message: 'Department code already exists.' });

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      description,
      categories: categories || [name],
      contactEmail,
      contactPhone,
      slaHours: slaHours || 48,
    });

    await recordAuditLog({
      admin: req.admin,
      action: 'DEPARTMENT_CREATED',
      targetType: 'Department',
      targetId: department.code,
      details: { name: department.name },
      ip: req.ip,
    });

    return res.status(201).json({ success: true, department });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── OFFICERS ────────────────────────────────────────────────────────────────
export const getOfficers = async (req, res) => {
  try {
    const geoFilter = req.geoScopeFilter || {};
    const query = { role: 'officer' };
    if (geoFilter['location.state']) query.state = geoFilter['location.state'];

    const officers = await Admin.find(query)
      .populate('assignedDepartment', 'name code')
      .sort('-createdAt');

    const officersWithStats = await Promise.all(
      officers.map(async (off) => {
        const [assignedCount, completedCount] = await Promise.all([
          Issue.countDocuments({ assignedOfficer: off._id, status: { $ne: 'Resolved' } }),
          Issue.countDocuments({ assignedOfficer: off._id, status: 'Resolved' }),
        ]);

        return {
          ...off.toObject(),
          assignedCount,
          completedCount,
        };
      })
    );

    return res.json({ success: true, officers: officersWithStats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createOfficer = async (req, res) => {
  try {
    const { name, email, phone, password, departmentId, state, district, designation } = req.body;

    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: 'Official email already in use.' });

    const adminId = await generateAdminId('officer', state ? state.substring(0, 2) : 'PB');
    const dept = departmentId ? await Department.findById(departmentId) : null;

    const officer = await Admin.create({
      adminId,
      name,
      email: email.toLowerCase(),
      phone,
      password: password || 'Officer@CivicTrack2025',
      role: 'officer',
      designation: designation || 'Department Executive Engineer',
      assignedDepartment: dept?._id,
      departmentName: dept?.name || 'General Operations',
      state: state || req.admin.state || 'Punjab',
      district: district || req.admin.district || 'Ludhiana',
      createdBy: req.admin.adminId,
      requiresPasswordChange: true,
    });

    await recordAuditLog({
      admin: req.admin,
      action: 'OFFICER_CREATED',
      targetType: 'Officer',
      targetId: officer.adminId,
      details: { name: officer.name, department: dept?.name },
      ip: req.ip,
    });

    return res.status(201).json({ success: true, officer });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── CITIZENS ────────────────────────────────────────────────────────────────
export const getCitizens = async (req, res) => {
  try {
    const { q, state, district, page = 1, limit = 20 } = req.query;
    const filter = { role: 'citizen' };

    if (state && state !== 'All') filter.state = state;
    if (district && district !== 'All') filter.district = district;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [citizens, total] = await Promise.all([
      User.find(filter).select('-password').sort('-createdAt').skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    // Attach complaint counts for each citizen
    const citizensWithStats = await Promise.all(
      citizens.map(async (c) => {
        const issuesCount = await Issue.countDocuments({ reportedBy: c._id });
        return {
          ...c.toObject(),
          issuesCount,
        };
      })
    );

    return res.json({
      success: true,
      citizens: citizensWithStats,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleCitizenStatus = async (req, res) => {
  try {
    const { isVerified, reason } = req.body;
    const citizen = await User.findById(req.params.id);
    if (!citizen) return res.status(404).json({ success: false, message: 'Citizen account not found.' });

    citizen.isVerified = isVerified;
    await citizen.save();

    await recordAuditLog({
      admin: req.admin,
      action: isVerified ? 'CITIZEN_ACCOUNT_VERIFIED' : 'CITIZEN_ACCOUNT_FLAGGED',
      targetType: 'User',
      targetId: citizen._id.toString(),
      details: { email: citizen.email, reason },
      ip: req.ip,
    });

    return res.json({ success: true, message: 'Citizen status updated.', citizen });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GEOGRAPHY (STATES, DISTRICTS, LOCAL BODIES) ────────────────────────────
export const getGeographyHierarchy = async (req, res) => {
  try {
    const [states, districts, localBodies] = await Promise.all([
      State.find({ active: true }).sort('name'),
      District.find({ active: true }).sort('name'),
      LocalBody.find({ active: true }).sort('name'),
    ]);

    return res.json({ success: true, states, districts, localBodies });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ESCALATIONS ─────────────────────────────────────────────────────────────
export const getEscalations = async (req, res) => {
  try {
    const escalations = await Escalation.find()
      .populate('issue', 'location category priority upvoteCount images')
      .sort('-createdAt');

    return res.json({ success: true, escalations });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEscalationStatus = async (req, res) => {
  try {
    const { status, notes, action } = req.body;
    const escalation = await Escalation.findById(req.params.id);
    if (!escalation) return res.status(404).json({ success: false, message: 'Escalation not found.' });

    escalation.status = status;
    escalation.history.push({
      action: action || `Status updated to ${status}`,
      performedBy: `${req.admin.name} (${req.admin.adminId})`,
      notes,
      timestamp: new Date(),
    });

    await escalation.save();

    await recordAuditLog({
      admin: req.admin,
      action: 'ESCALATION_STATUS_UPDATE',
      targetType: 'Escalation',
      targetId: escalation.escalationId,
      details: { newStatus: status, notes },
      ip: req.ip,
    });

    return res.json({ success: true, message: 'Escalation updated.', escalation });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── RESOLUTIONS ─────────────────────────────────────────────────────────────
export const getResolutions = async (req, res) => {
  try {
    const resolutions = await Resolution.find()
      .populate('issue')
      .sort('-createdAt');

    return res.json({ success: true, resolutions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyResolution = async (req, res) => {
  try {
    const { status, verificationNotes } = req.body; // 'APPROVED' or 'REJECTED'
    const resolution = await Resolution.findById(req.params.id);
    if (!resolution) return res.status(404).json({ success: false, message: 'Resolution not found.' });

    resolution.verificationStatus = status;
    resolution.verifiedBy = req.admin._id;
    resolution.verifierName = req.admin.name;
    resolution.verificationNotes = verificationNotes;
    resolution.verifiedAt = new Date();
    await resolution.save();

    // If approved, update the related issue status to 'Resolved'
    if (status === 'APPROVED' && resolution.issue) {
      const issue = await Issue.findById(resolution.issue);
      if (issue) {
        issue.status = 'Resolved';
        issue.resolvedAt = new Date();
        issue.resolutionNotes = resolution.resolutionNotes;
        issue.afterImages = resolution.afterImages;
        issue.timeline.push({
          action: 'Resolution Approved',
          status: 'Resolved',
          performedBy: `${req.admin.name} (${req.admin.adminId})`,
          note: verificationNotes || 'Resolution inspected and approved by administrator.',
          timestamp: new Date(),
        });
        await issue.save();

        emitEvent('issue:resolved', {
          issueCode: issue.issueCode,
          resolvedAt: issue.resolvedAt,
          verifier: req.admin.name,
        });
      }
    }

    await recordAuditLog({
      admin: req.admin,
      action: status === 'APPROVED' ? 'RESOLUTION_APPROVED' : 'RESOLUTION_REJECTED',
      targetType: 'Resolution',
      targetId: resolution.issueRef,
      details: { status, verificationNotes },
      ip: req.ip,
    });

    return res.json({ success: true, message: `Resolution ${status.toLowerCase()}.`, resolution });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ANNOUNCEMENTS & NOTIFICATIONS ──────────────────────────────────────────
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ active: true }).sort('-createdAt');
    return res.json({ success: true, announcements });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, type, targetAudience, targetScope } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      type: type || 'INFO',
      targetAudience: targetAudience || 'ALL_CITIZENS',
      targetScope: targetScope || { state: 'All', district: 'All', department: 'All' },
      createdBy: req.admin._id,
      creatorName: req.admin.name,
      creatorRole: req.admin.role,
    });

    // Real-time broadcast
    emitEvent('notification:new', {
      title,
      message,
      type: announcement.type,
      creatorName: announcement.creatorName,
      timestamp: announcement.createdAt,
    });

    await recordAuditLog({
      admin: req.admin,
      action: 'ANNOUNCEMENT_PUBLISHED',
      targetType: 'Setting',
      targetId: announcement._id.toString(),
      details: { title, targetAudience },
      ip: req.ip,
    });

    return res.status(201).json({ success: true, announcement });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── AUDIT LOGS ─────────────────────────────────────────────────────────────
export const getAuditLogs = async (req, res) => {
  try {
    const { adminId, action, targetType, page = 1, limit = 30 } = req.query;
    const filter = {};

    if (adminId) filter.adminId = { $regex: adminId, $options: 'i' };
    if (action && action !== 'All') filter.action = action;
    if (targetType && targetType !== 'All') filter.targetType = targetType;

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
      AuditLog.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      logs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ADMINISTRATORS MANAGEMENT ──────────────────────────────────────────────
export const getAdministrators = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select('-password')
      .populate('assignedDepartment', 'name')
      .sort('-createdAt');

    return res.json({ success: true, administrators: admins });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createAdministrator = async (req, res) => {
  try {
    const { name, email, phone, password, role, designation, state, district, localBody, permissions } = req.body;

    // Only Super Admin can create State/District/Super Admins
    if (req.admin.role !== 'super_admin' && (role === 'super_admin' || role === 'state_admin')) {
      return res.status(403).json({ success: false, message: 'Only Super Admin can provision State/Super Admins.' });
    }

    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered for an admin.' });

    const adminId = await generateAdminId(role, state ? state.substring(0, 2) : 'PB');

    const newAdmin = await Admin.create({
      adminId,
      name,
      email: email.toLowerCase(),
      phone,
      password: password || 'Admin@CivicTrack2025',
      role,
      designation: designation || 'Administrative Officer',
      state: state || 'All',
      district: district || 'All',
      localBody: localBody || 'All',
      permissions: permissions || ['manage_issues', 'view_reports'],
      createdBy: req.admin.adminId,
      requiresPasswordChange: true,
    });

    await recordAuditLog({
      admin: req.admin,
      action: 'ADMIN_ACCOUNT_CREATED',
      targetType: 'Admin',
      targetId: newAdmin.adminId,
      details: { role: newAdmin.role, state: newAdmin.state },
      ip: req.ip,
    });

    return res.status(201).json({ success: true, admin: newAdmin });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── SYSTEM SETTINGS ─────────────────────────────────────────────────────────
export const getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne({ key: 'platform_config' });
    if (!settings) {
      settings = await SystemSetting.create({
        key: 'platform_config',
        platformName: 'CivicTrack',
        tagline: 'Report Today. Better Tomorrow.',
        emergencyHelpline: '1800-CIVIC-GOV',
        slaSettings: { criticalHours: 24, highHours: 48, mediumHours: 72, lowHours: 120 },
      });
    }
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSystemSettings = async (req, res) => {
  try {
    const { platformName, emergencyHelpline, slaSettings, maintenanceMode } = req.body;
    const settings = await SystemSetting.findOneAndUpdate(
      { key: 'platform_config' },
      {
        platformName,
        emergencyHelpline,
        slaSettings,
        maintenanceMode,
        updatedBy: req.admin.adminId,
      },
      { new: true, upsert: true }
    );

    await recordAuditLog({
      admin: req.admin,
      action: 'PLATFORM_SETTINGS_UPDATED',
      targetType: 'Setting',
      targetId: 'platform_config',
      details: { maintenanceMode, platformName },
      ip: req.ip,
    });

    return res.json({ success: true, message: 'Settings saved.', settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── ANALYTICS & REPORTS ────────────────────────────────────────────────────
export const getAnalyticsData = async (req, res) => {
  try {
    const geoFilter = req.geoScopeFilter || {};

    const [stateDist, priorityDist, monthlyPerf] = await Promise.all([
      Issue.aggregate([
        { $match: geoFilter },
        { $group: { _id: '$location.state', count: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Issue.aggregate([
        { $match: geoFilter },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Issue.aggregate([
        { $match: geoFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            reported: { $sum: 1 },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 6 },
      ]),
    ]);

    return res.json({
      success: true,
      analytics: {
        stateDistribution: stateDist,
        priorityDistribution: priorityDist,
        monthlyPerformance: monthlyPerf,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const exportReportsCSV = async (req, res) => {
  try {
    const geoFilter = req.geoScopeFilter || {};
    const issues = await Issue.find(geoFilter)
      .populate('assignedDepartment', 'name')
      .sort('-createdAt')
      .limit(1000);

    let csv = 'Issue ID,Title,Category,Priority,Status,State,District,Ward,Upvotes,Reported Date,Resolved Date\n';

    issues.forEach((iss) => {
      const code = iss.issueCode || `CT-${iss._id.toString().slice(-5)}`;
      const title = `"${(iss.title || '').replace(/"/g, '""')}"`;
      const cat = iss.category || 'Other';
      const pri = iss.priority || 'Medium';
      const st = iss.status || 'Pending';
      const state = iss.location?.state || 'Delhi';
      const dist = iss.location?.district || 'New Delhi';
      const ward = iss.location?.ward || 'Ward 12';
      const upvotes = iss.upvoteCount || 0;
      const repDate = iss.createdAt ? iss.createdAt.toISOString().split('T')[0] : '';
      const resDate = iss.resolvedAt ? iss.resolvedAt.toISOString().split('T')[0] : '';

      csv += `${code},${title},${cat},${pri},${st},${state},${dist},${ward},${upvotes},${repDate},${resDate}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="CivicTrack_Complaints_Report.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
