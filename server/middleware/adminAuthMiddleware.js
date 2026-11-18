import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import AuditLog from '../models/AuditLog.js';

/**
 * Protect Admin Routes
 * Authenticates using HttpOnly cookie or Authorization Bearer header.
 */
export const protectAdmin = async (req, res, next) => {
  try {
    let token = req.cookies?.ct_admin_token;

    const authHeader = req.headers.authorization;
    if (!token && authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. Administrator token required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'civictrack_super_secret_jwt_key_2025');

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Administrator account not found.' });
    }

    if (admin.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is currently ${admin.status}. Please contact the Super Administrator.`,
      });
    }

    if (admin.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to repeated failed login attempts. Try again later.',
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired administrative token.' });
  }
};

/**
 * Role-Based Access Control for Administrators
 */
export const authorizeAdminRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // Super Admin has national access and bypasses role restrictions
    if (req.admin.role === 'super_admin') {
      return next();
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: Role '${req.admin.role}' lacks permission for this action.`,
      });
    }

    next();
  };
};

/**
 * Enforce Geographic Jurisdiction Scoping on Database Queries
 */
export const enforceGeographicScope = (req, res, next) => {
  if (!req.admin) {
    return next();
  }

  const filter = {};

  if (req.admin.role === 'super_admin') {
    // Nationwide - no filter
  } else if (req.admin.role === 'state_admin') {
    if (req.admin.state && req.admin.state !== 'National' && req.admin.state !== 'All') {
      filter['location.state'] = new RegExp(`^${req.admin.state}$`, 'i');
    }
  } else if (req.admin.role === 'district_admin') {
    if (req.admin.state && req.admin.state !== 'All') {
      filter['location.state'] = new RegExp(`^${req.admin.state}$`, 'i');
    }
    if (req.admin.district && req.admin.district !== 'All') {
      filter['location.district'] = new RegExp(`^${req.admin.district}$`, 'i');
    }
  } else if (req.admin.role === 'local_admin') {
    if (req.admin.state && req.admin.state !== 'All') {
      filter['location.state'] = new RegExp(`^${req.admin.state}$`, 'i');
    }
    if (req.admin.district && req.admin.district !== 'All') {
      filter['location.district'] = new RegExp(`^${req.admin.district}$`, 'i');
    }
    if (req.admin.localBody && req.admin.localBody !== 'All') {
      filter['location.localBody'] = new RegExp(`^${req.admin.localBody}$`, 'i');
    }
  } else if (req.admin.role === 'officer') {
    if (req.admin.assignedDepartment) {
      filter.assignedDepartment = req.admin.assignedDepartment;
    }
    if (req.admin.state && req.admin.state !== 'All') {
      filter['location.state'] = new RegExp(`^${req.admin.state}$`, 'i');
    }
  }

  req.geoScopeFilter = filter;
  next();
};

/**
 * Record an audit log entry in MongoDB
 */
export const recordAuditLog = async ({
  admin,
  action,
  targetType,
  targetId = '',
  details = {},
  ip = '127.0.0.1',
  userAgent = '',
  status = 'SUCCESS',
}) => {
  try {
    await AuditLog.create({
      adminId: admin?.adminId || 'SYSTEM',
      adminName: admin?.name || 'Automated System',
      role: admin?.role || 'system',
      action,
      targetType,
      targetId: String(targetId),
      details,
      ip,
      userAgent,
      status,
    });
  } catch (err) {
    console.error('Failed to record audit log:', err.message);
  }
};
