import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { recordAuditLog } from '../middleware/adminAuthMiddleware.js';

const generateAdminToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'civictrack_super_secret_jwt_key_2025',
    { expiresIn: '12h' }
  );
};

// POST /api/admin/auth/login
export const adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID and Password are required.',
      });
    }

    const cleanAdminId = adminId.trim().toUpperCase();

    // Find admin by adminId or official email
    const admin = await Admin.findOne({
      $or: [{ adminId: cleanAdminId }, { email: cleanAdminId.toLowerCase() }],
    }).select('+password');

    if (!admin) {
      await recordAuditLog({
        admin: { adminId: cleanAdminId, name: 'Unknown', role: 'anonymous' },
        action: 'ADMIN_LOGIN_FAILED',
        targetType: 'Auth',
        targetId: cleanAdminId,
        details: { reason: 'Admin account not found' },
        ip,
        status: 'FAILED',
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    // Check account status
    if (admin.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is currently ${admin.status}. Please contact the Super Administrator.`,
      });
    }

    // Check lockout
    if (admin.isLocked()) {
      const minutesRemaining = Math.ceil((admin.lockoutUntil - Date.now()) / (60 * 1000));
      return res.status(423).json({
        success: false,
        message: `Account locked due to multiple failed attempts. Try again in ${minutesRemaining} minutes.`,
      });
    }

    // Verify password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      await admin.incLoginAttempts();
      await recordAuditLog({
        admin,
        action: 'ADMIN_LOGIN_FAILED',
        targetType: 'Auth',
        targetId: admin.adminId,
        details: { reason: 'Incorrect password', failedAttempts: admin.failedLoginAttempts },
        ip,
        status: 'FAILED',
      });

      const attemptsRemaining = Math.max(0, 5 - admin.failedLoginAttempts);
      return res.status(401).json({
        success: false,
        message: attemptsRemaining > 0
          ? `Invalid credentials. ${attemptsRemaining} attempt(s) remaining before lockout.`
          : 'Account has been locked for 15 minutes due to consecutive failed attempts.',
      });
    }

    // Successful login - reset attempts & record timestamp
    await admin.resetLoginAttempts(ip);

    // Generate JWT
    const token = generateAdminToken(admin._id);

    // Set secure HttpOnly cookie
    res.cookie('ct_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });

    await recordAuditLog({
      admin,
      action: 'ADMIN_LOGIN_SUCCESS',
      targetType: 'Auth',
      targetId: admin.adminId,
      details: { role: admin.role, state: admin.state, district: admin.district },
      ip,
      status: 'SUCCESS',
    });

    return res.json({
      success: true,
      message: 'Administrative authentication successful.',
      token,
      admin: {
        id: admin._id,
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        designation: admin.designation,
        state: admin.state,
        district: admin.district,
        localBody: admin.localBody,
        localBodyType: admin.localBodyType,
        ward: admin.ward,
        departmentName: admin.departmentName,
        permissions: admin.permissions,
        requiresPasswordChange: admin.requiresPasswordChange,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (err) {
    console.error('adminLogin error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
};

// POST /api/admin/auth/logout
export const adminLogout = async (req, res) => {
  try {
    if (req.admin) {
      await recordAuditLog({
        admin: req.admin,
        action: 'ADMIN_LOGOUT',
        targetType: 'Auth',
        targetId: req.admin.adminId,
        ip: req.ip,
        status: 'SUCCESS',
      });
    }

    res.clearCookie('ct_admin_token');
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/auth/me
export const getAdminMe = async (req, res) => {
  return res.json({
    success: true,
    admin: req.admin,
  });
};

// PUT /api/admin/auth/change-password
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password does not match.' });
    }

    admin.password = newPassword;
    admin.requiresPasswordChange = false;
    await admin.save();

    await recordAuditLog({
      admin,
      action: 'ADMIN_PASSWORD_CHANGED',
      targetType: 'Auth',
      targetId: admin.adminId,
      ip: req.ip,
      status: 'SUCCESS',
    });

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
