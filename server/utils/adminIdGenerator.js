import Admin from '../models/Admin.js';

/**
 * Generates sequential formatted Admin ID.
 * @param {string} role - Admin role
 * @param {string} stateCode - Optional 2-letter state code e.g. 'PB', 'DL', 'MH'
 * @returns {Promise<string>} Next unique Admin ID
 */
export async function generateAdminId(role, stateCode = 'PB') {
  let prefix = 'CT-ADMIN';
  const cleanState = (stateCode || 'IN').toUpperCase().substring(0, 2);

  switch (role) {
    case 'super_admin':
      prefix = 'CT-SUPER';
      break;
    case 'state_admin':
      prefix = `CT-STATE-${cleanState}`;
      break;
    case 'district_admin':
      prefix = `CT-DIST-${cleanState}`;
      break;
    case 'local_admin':
      prefix = `CT-MUNI-${cleanState}`;
      break;
    case 'officer':
      prefix = 'CT-OFFICER';
      break;
    case 'moderator':
      prefix = 'CT-MOD';
      break;
    default:
      prefix = 'CT-ADMIN';
  }

  // Count existing admins matching this prefix
  const regex = new RegExp(`^${prefix}-\\d+`);
  const count = await Admin.countDocuments({ adminId: { $regex: regex } });
  const nextSeq = String(count + 1).padStart(4, '0');

  let adminId = `${prefix}-${nextSeq}`;

  // Double check uniqueness
  let exists = await Admin.findOne({ adminId });
  let loopCount = count + 1;
  while (exists) {
    loopCount++;
    adminId = `${prefix}-${String(loopCount).padStart(4, '0')}`;
    exists = await Admin.findOne({ adminId });
  }

  return adminId;
}

export default generateAdminId;
