import express from 'express';
import {
  adminLogin,
  adminLogout,
  getAdminMe,
  changeAdminPassword,
} from '../controllers/adminAuthController.js';
import {
  getDashboardStats,
  getIssueTrends,
  getCategoryDistribution,
  getDepartmentPerformance,
  getRecentActivities,
  getActiveEscalations,
  getMapIssues,
} from '../controllers/adminDashboardController.js';
import {
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  updateIssuePriority,
  verifyIssue,
  addAdminNote,
  escalateIssue,
} from '../controllers/adminIssueController.js';
import {
  getDepartments,
  createDepartment,
  getOfficers,
  createOfficer,
  getCitizens,
  toggleCitizenStatus,
  getGeographyHierarchy,
  getEscalations,
  updateEscalationStatus,
  getResolutions,
  verifyResolution,
  getAnnouncements,
  createAnnouncement,
  getAuditLogs,
  getAdministrators,
  createAdministrator,
  getSystemSettings,
  updateSystemSettings,
  getAnalyticsData,
  exportReportsCSV,
} from '../controllers/adminEntityControllers.js';
import {
  protectAdmin,
  authorizeAdminRoles,
  enforceGeographicScope,
} from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// ─── AUTHENTICATION (PUBLIC ADMIN ROUTES) ───────────────────────────────────
router.post('/auth/login', adminLogin);
router.post('/auth/logout', adminLogout);

// All routes below require protectAdmin
router.use(protectAdmin);

// Admin Profile & Self-Service
router.get('/auth/me', getAdminMe);
router.put('/auth/change-password', changeAdminPassword);

// Apply geographic scoping to data queries
router.use(enforceGeographicScope);

// ─── DASHBOARD METRICS & REAL-TIME WIDGETS ──────────────────────────────────
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/trends', getIssueTrends);
router.get('/dashboard/category-distribution', getCategoryDistribution);
router.get('/dashboard/department-performance', getDepartmentPerformance);
router.get('/dashboard/recent-activity', getRecentActivities);
router.get('/dashboard/active-escalations', getActiveEscalations);
router.get('/dashboard/map-issues', getMapIssues);

// ─── ISSUE MANAGEMENT ────────────────────────────────────────────────────────
router.get('/issues', getAllIssues);
router.get('/issues/:id', getIssueById);
router.patch('/issues/:id/status', updateIssueStatus);
router.patch('/issues/:id/assign', assignIssue);
router.patch('/issues/:id/priority', updateIssuePriority);
router.post('/issues/:id/verify', verifyIssue);
router.post('/issues/:id/notes', addAdminNote);
router.post('/issues/:id/escalate', escalateIssue);

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
router.get('/departments', getDepartments);
router.post('/departments', authorizeAdminRoles('super_admin', 'state_admin'), createDepartment);

// ─── OFFICERS ────────────────────────────────────────────────────────────────
router.get('/officers', getOfficers);
router.post('/officers', authorizeAdminRoles('super_admin', 'state_admin', 'district_admin', 'local_admin'), createOfficer);

// ─── CITIZENS ────────────────────────────────────────────────────────────────
router.get('/citizens', getCitizens);
router.patch('/citizens/:id/status', authorizeAdminRoles('super_admin', 'state_admin', 'district_admin'), toggleCitizenStatus);

// ─── GEOGRAPHY ───────────────────────────────────────────────────────────────
router.get('/geography', getGeographyHierarchy);

// ─── ESCALATIONS ─────────────────────────────────────────────────────────────
router.get('/escalations', getEscalations);
router.patch('/escalations/:id/status', updateEscalationStatus);

// ─── RESOLUTIONS ─────────────────────────────────────────────────────────────
router.get('/resolutions', getResolutions);
router.post('/resolutions/:id/verify', verifyResolution);

// ─── ANNOUNCEMENTS & NOTIFICATIONS ──────────────────────────────────────────
router.get('/announcements', getAnnouncements);
router.post('/announcements', authorizeAdminRoles('super_admin', 'state_admin', 'district_admin'), createAnnouncement);

// ─── AUDIT LOGS ─────────────────────────────────────────────────────────────
router.get('/audit-logs', getAuditLogs);

// ─── ADMINISTRATORS MANAGEMENT ──────────────────────────────────────────────
router.get('/administrators', authorizeAdminRoles('super_admin', 'state_admin', 'district_admin'), getAdministrators);
router.post('/administrators', authorizeAdminRoles('super_admin', 'state_admin'), createAdministrator);

// ─── SYSTEM SETTINGS ─────────────────────────────────────────────────────────
router.get('/settings', getSystemSettings);
router.put('/settings', authorizeAdminRoles('super_admin'), updateSystemSettings);

// ─── ANALYTICS & REPORTS ────────────────────────────────────────────────────
router.get('/analytics', getAnalyticsData);
router.get('/reports/csv', exportReportsCSV);

export default router;
