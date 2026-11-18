import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Issue from '../models/Issue.js';
import Department from '../models/Department.js';
import Escalation from '../models/Escalation.js';
import Resolution from '../models/Resolution.js';
import AuditLog from '../models/AuditLog.js';
import Announcement from '../models/Announcement.js';
import SystemSetting from '../models/SystemSetting.js';
import { State, District, LocalBody } from '../models/Geography.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civictrack';

async function seed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected! Starting CivicTrack Enterprise Admin Seeding...');

  // 1. Departments
  console.log('Seeding Departments...');
  await Department.deleteMany({});
  const departmentsData = [
    {
      name: 'Roads & Infrastructure',
      code: 'ROADS',
      description: 'Potholes, road repair, footpaths, bridges and road safety.',
      categories: ['Potholes', 'Potholes and Road Damage', 'Damaged Public Property'],
      contactEmail: 'roads@civictrack.gov.in',
      contactPhone: '011-23091101',
      slaHours: 48,
      totalStaff: 24,
    },
    {
      name: 'Sanitation & Waste Management',
      code: 'SANITATION',
      description: 'Garbage collection, overflowing dumpsters, street sweeping.',
      categories: ['Garbage', 'Garbage and Waste Management', 'Public Sanitation'],
      contactEmail: 'sanitation@civictrack.gov.in',
      contactPhone: '011-23091102',
      slaHours: 24,
      totalStaff: 38,
    },
    {
      name: 'Water Supply',
      code: 'WATER',
      description: 'Pipeline leakage, water contamination, low pressure, supply disruption.',
      categories: ['Water Supply', 'Water Issues', 'Water Leakage'],
      contactEmail: 'watersupply@civictrack.gov.in',
      contactPhone: '011-23091103',
      slaHours: 36,
      totalStaff: 20,
    },
    {
      name: 'Electricity & Streetlights',
      code: 'POWER',
      description: 'Broken streetlights, faulty transformers, sagging wires, power surges.',
      categories: ['Streetlights', 'Broken Streetlights', 'Electricity Infrastructure'],
      contactEmail: 'power@civictrack.gov.in',
      contactPhone: '011-23091104',
      slaHours: 24,
      totalStaff: 18,
    },
    {
      name: 'Drainage & Sewage',
      code: 'DRAINAGE',
      description: 'Blocked storm drains, open manholes, sewage overflow.',
      categories: ['Drainage', 'Drainage and Sewage'],
      contactEmail: 'drainage@civictrack.gov.in',
      contactPhone: '011-23091105',
      slaHours: 48,
      totalStaff: 16,
    },
  ];

  const createdDepartments = await Department.insertMany(departmentsData);
  const deptMap = {};
  createdDepartments.forEach((d) => {
    deptMap[d.code] = d;
  });

  // 2. Administrators & Officers
  console.log('Seeding Administrators & Officers...');
  await Admin.deleteMany({});

  const superAdmin = await Admin.create({
    adminId: 'CT-SUPER-0001',
    name: 'Dr. Rajesh Kumar',
    email: 'admin@civictrack.gov.in',
    phone: '+91 98765 43210',
    password: 'Admin@CivicTrack2025',
    role: 'super_admin',
    designation: 'Super Administrator',
    state: 'National',
    district: 'All',
    localBody: 'All',
    localBodyType: 'National',
    permissions: ['all'],
    status: 'active',
    requiresPasswordChange: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  });

  const stateAdminPb = await Admin.create({
    adminId: 'CT-STATE-PB-0001',
    name: 'Sardar Gurpreet Singh',
    email: 'stateadmin.pb@civictrack.gov.in',
    phone: '+91 98140 12345',
    password: 'Admin@CivicTrack2025',
    role: 'state_admin',
    designation: 'Principal Civic Secretary',
    state: 'Punjab',
    district: 'All',
    permissions: ['manage_issues', 'view_reports', 'assign_officers'],
    status: 'active',
    requiresPasswordChange: false,
  });

  const distAdminLdh = await Admin.create({
    adminId: 'CT-DIST-PB-0001',
    name: 'Ananya Sharma, IAS',
    email: 'distadmin.ldh@civictrack.gov.in',
    phone: '+91 98150 54321',
    password: 'Admin@CivicTrack2025',
    role: 'district_admin',
    designation: 'District Magistrate & Civic Head',
    state: 'Punjab',
    district: 'Ludhiana',
    permissions: ['manage_issues', 'assign_officers'],
    status: 'active',
    requiresPasswordChange: false,
  });

  const officerRoads = await Admin.create({
    adminId: 'CT-OFFICER-0001',
    name: 'Rakesh Sharma',
    email: 'rakesh.sharma@civictrack.gov.in',
    phone: '+91 98761 11001',
    password: 'Officer@CivicTrack2025',
    role: 'officer',
    designation: 'Executive Engineer (Roads)',
    assignedDepartment: deptMap.ROADS._id,
    departmentName: 'Roads & Infrastructure',
    state: 'Delhi',
    district: 'New Delhi',
    status: 'active',
    requiresPasswordChange: false,
  });

  const officerSanitation = await Admin.create({
    adminId: 'CT-OFFICER-0002',
    name: 'Sunita Verma',
    email: 'sunita.verma@civictrack.gov.in',
    phone: '+91 98761 11002',
    password: 'Officer@CivicTrack2025',
    role: 'officer',
    designation: 'Chief Sanitation Officer',
    assignedDepartment: deptMap.SANITATION._id,
    departmentName: 'Sanitation & Waste Management',
    state: 'Punjab',
    district: 'Ludhiana',
    status: 'active',
    requiresPasswordChange: false,
  });

  const officerWater = await Admin.create({
    adminId: 'CT-OFFICER-0003',
    name: 'Amit Patel',
    email: 'amit.patel@civictrack.gov.in',
    phone: '+91 98761 11003',
    password: 'Officer@CivicTrack2025',
    role: 'officer',
    designation: 'Senior Water Engineer',
    assignedDepartment: deptMap.WATER._id,
    departmentName: 'Water Supply',
    state: 'Delhi',
    district: 'Central Delhi',
    status: 'active',
    requiresPasswordChange: false,
  });

  // 3. Citizen Users
  console.log('Seeding Citizens...');
  let demoUser = await User.findOne({ email: 'citizen@example.com' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Vikas Malhotra',
      email: 'citizen@example.com',
      password: 'Password@123',
      phone: '+91 98991 22334',
      role: 'citizen',
      state: 'Delhi',
      district: 'New Delhi',
      city: 'Delhi',
      ward: 'Ward 12',
      isVerified: true,
    });
  }

  // 4. Geography Data (States, Districts, Local Bodies)
  console.log('Seeding Geography...');
  await State.deleteMany({});
  await District.deleteMany({});
  await LocalBody.deleteMany({});

  await State.insertMany([
    { code: 'DL', name: 'Delhi', type: 'Union Territory', capital: 'New Delhi', districtsCount: 11, active: true },
    { code: 'PB', name: 'Punjab', type: 'State', capital: 'Chandigarh', districtsCount: 23, active: true },
    { code: 'MH', name: 'Maharashtra', type: 'State', capital: 'Mumbai', districtsCount: 36, active: true },
    { code: 'KA', name: 'Karnataka', type: 'State', capital: 'Bengaluru', districtsCount: 31, active: true },
    { code: 'UP', name: 'Uttar Pradesh', type: 'State', capital: 'Lucknow', districtsCount: 75, active: true },
  ]);

  await District.insertMany([
    { stateCode: 'DL', stateName: 'Delhi', name: 'New Delhi', headquarters: 'Connaught Place', localBodiesCount: 4 },
    { stateCode: 'DL', stateName: 'Delhi', name: 'Central Delhi', headquarters: 'Daryaganj', localBodiesCount: 3 },
    { stateCode: 'PB', stateName: 'Punjab', name: 'Ludhiana', headquarters: 'Ludhiana City', localBodiesCount: 8 },
    { stateCode: 'PB', stateName: 'Punjab', name: 'Amritsar', headquarters: 'Amritsar City', localBodiesCount: 6 },
    { stateCode: 'MH', stateName: 'Maharashtra', name: 'Mumbai City', headquarters: 'Mumbai', localBodiesCount: 1 },
    { stateCode: 'KA', stateName: 'Karnataka', name: 'Bengaluru Urban', headquarters: 'Bengaluru', localBodiesCount: 2 },
  ]);

  await LocalBody.insertMany([
    { stateName: 'Delhi', districtName: 'New Delhi', name: 'New Delhi Municipal Council (NDMC)', type: 'Municipal Council', wardsCount: 14 },
    { stateName: 'Delhi', districtName: 'Central Delhi', name: 'Municipal Corporation of Delhi (MCD)', type: 'Municipal Corporation', wardsCount: 250 },
    { stateName: 'Punjab', districtName: 'Ludhiana', name: 'Municipal Corporation Ludhiana', type: 'Municipal Corporation', wardsCount: 95 },
    { stateName: 'Maharashtra', districtName: 'Mumbai City', name: 'Brihanmumbai Municipal Corporation (BMC)', type: 'Municipal Corporation', wardsCount: 227 },
    { stateName: 'Karnataka', districtName: 'Bengaluru Urban', name: 'Bruhat Bengaluru Mahanagara Palike (BBMP)', type: 'Municipal Corporation', wardsCount: 198 },
  ]);

  // 5. Seed Issues matching screenshot
  console.log('Seeding Issues & Complaints...');
  await Issue.deleteMany({});

  const issuesSeed = [
    {
      issueCode: 'CT-10432',
      title: 'Pothole on Main Road',
      description: 'Deep 8-inch hazardous pothole on arterial road creating massive traffic bottleneck and motorbike safety risks.',
      category: 'Potholes',
      priority: 'High',
      status: 'Resolved',
      location: {
        address: 'Outer Ring Road, Near Gate 3, Ward 12',
        ward: 'Ward 12',
        city: 'Delhi',
        district: 'New Delhi',
        state: 'Delhi',
        coordinates: { lat: 28.6289, lng: 77.2065 },
      },
      images: ['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'],
      reportedBy: demoUser._id,
      reporterName: 'Vikas Malhotra',
      reporterPhone: '+91 98991 22334',
      assignedDepartment: deptMap.ROADS._id,
      assignedDepartmentName: 'Roads & Infrastructure',
      assignedOfficer: officerRoads._id,
      assignedOfficerName: officerRoads.name,
      upvoteCount: 42,
      isVerified: true,
      verifiedBy: superAdmin._id,
      verifiedByName: superAdmin.name,
      resolvedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
      resolutionNotes: 'Bitumen and asphalt cold mix patch completed. Leveling tested and road reopened to traffic.',
      afterImages: ['https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80'],
      timeline: [
        { action: 'Reported by Citizen', status: 'Reported', performedBy: 'Vikas Malhotra', timestamp: new Date(Date.now() - 24 * 3600 * 1000) },
        { action: 'Complaint Verified', status: 'Under Review', performedBy: 'Dr. Rajesh Kumar', timestamp: new Date(Date.now() - 18 * 3600 * 1000) },
        { action: 'Assigned to Officer', status: 'Assigned', performedBy: 'System Auto-Router', note: 'Assigned to Roads Dept - Rakesh Sharma', timestamp: new Date(Date.now() - 12 * 3600 * 1000) },
        { action: 'Repair Completed', status: 'In Progress', performedBy: 'Rakesh Sharma', timestamp: new Date(Date.now() - 1 * 3600 * 1000) },
        { action: 'Resolution Approved', status: 'Resolved', performedBy: 'Dr. Rajesh Kumar', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
      ],
    },
    {
      issueCode: 'CT-10431',
      title: 'Garbage Overflow near Market',
      description: 'Solid waste container overflowing for past 48 hours. Stench spreading into nearby food market area.',
      category: 'Garbage',
      priority: 'Medium',
      status: 'Assigned',
      location: {
        address: 'Sector 32 Central Market, Gill Road',
        ward: 'Ward 8',
        city: 'Ludhiana',
        district: 'Ludhiana',
        state: 'Punjab',
        coordinates: { lat: 30.9010, lng: 75.8573 },
      },
      images: ['https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=600&q=80'],
      reportedBy: demoUser._id,
      reporterName: 'Aman Deep',
      assignedDepartment: deptMap.SANITATION._id,
      assignedDepartmentName: 'Sanitation & Waste Management',
      assignedOfficer: officerSanitation._id,
      assignedOfficerName: 'Rakesh Sharma',
      upvoteCount: 18,
      isVerified: true,
      timeline: [
        { action: 'Reported by Citizen', status: 'Reported', performedBy: 'Aman Deep', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
        { action: 'Assigned to Rakesh Sharma', status: 'Assigned', performedBy: 'System', timestamp: new Date(Date.now() - 8 * 60 * 1000) },
      ],
    },
    {
      issueCode: 'CT-10430',
      title: 'Broken Streetlight on Ring Road',
      description: 'Consecutive street poles 14 through 18 are dark at night, increasing accident danger.',
      category: 'Streetlights',
      priority: 'Medium',
      status: 'In Progress',
      location: {
        address: 'Ring Road Junction, Ward 4',
        ward: 'Ward 4',
        city: 'Delhi',
        district: 'Central Delhi',
        state: 'Delhi',
        coordinates: { lat: 28.6448, lng: 77.2167 },
      },
      images: ['https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=600&q=80'],
      reportedBy: demoUser._id,
      assignedDepartment: deptMap.POWER._id,
      assignedDepartmentName: 'Electricity & Streetlights',
      upvoteCount: 24,
      isVerified: true,
    },
    {
      issueCode: 'CT-10429',
      title: 'Water Leakage on Pipeline',
      description: 'Treated drinking water gushing from underground pipeline joint since early morning.',
      category: 'Water Supply',
      priority: 'High',
      status: 'In Progress',
      location: {
        address: 'Madhya Marg, Sector 7',
        ward: 'Sector 7',
        city: 'Chandigarh',
        district: 'Ludhiana',
        state: 'Punjab',
        coordinates: { lat: 30.7333, lng: 76.7794 },
      },
      images: ['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80'],
      reportedBy: demoUser._id,
      assignedDepartment: deptMap.WATER._id,
      assignedDepartmentName: 'Water Supply',
      assignedOfficer: officerWater._id,
      assignedOfficerName: officerWater.name,
      upvoteCount: 31,
      isVerified: true,
    },
    {
      issueCode: 'CT-10415',
      title: 'Open Drainage and Sewage Hazard',
      description: 'Collapsed concrete slab over main stormwater drain. High risk of human fall and disease outbreak.',
      category: 'Drainage',
      priority: 'Critical',
      status: 'Under Review',
      escalated: true,
      escalationLevel: 'Level 2 - District',
      escalationReason: 'No action for 48 hrs on high-risk civic hazard',
      location: {
        address: 'Opposite Community Center, Ward 15',
        ward: 'Ward 15',
        city: 'Delhi',
        district: 'New Delhi',
        state: 'Delhi',
        coordinates: { lat: 28.6145, lng: 77.1990 },
      },
      images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'],
      reportedBy: demoUser._id,
      assignedDepartment: deptMap.DRAINAGE._id,
      assignedDepartmentName: 'Drainage & Sewage',
      upvoteCount: 64,
      isVerified: true,
    },
    {
      issueCode: 'CT-10412',
      title: 'High Tension Wire Sagging near School',
      description: 'Live 11kV electrical wire sagging dangerously close to school pedestrian pathway.',
      category: 'Streetlights',
      priority: 'High',
      status: 'Pending',
      escalated: true,
      escalationLevel: 'Level 2 - District',
      escalationReason: 'Pending for 72 hrs without inspection',
      location: {
        address: 'Model Town Ext., Near Sacred Heart School',
        ward: 'Ward 22',
        city: 'Ludhiana',
        district: 'Ludhiana',
        state: 'Punjab',
        coordinates: { lat: 30.8920, lng: 75.8340 },
      },
      images: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80'],
      reportedBy: demoUser._id,
      assignedDepartment: deptMap.POWER._id,
      assignedDepartmentName: 'Electricity & Streetlights',
      upvoteCount: 52,
    },
    {
      issueCode: 'CT-10408',
      title: 'Contaminated Water Supply in Residential Block',
      description: 'Brown discolored tap water with chemical odor supplied across blocks C and D.',
      category: 'Water Supply',
      priority: 'High',
      status: 'Pending',
      escalated: true,
      escalationLevel: 'Level 3 - State',
      escalationReason: 'Pending for 96 hrs affecting 200+ households',
      location: {
        address: 'Dharavi Cross Road, Near Station',
        ward: 'Ward 45',
        city: 'Mumbai',
        district: 'Mumbai City',
        state: 'Maharashtra',
        coordinates: { lat: 19.0434, lng: 72.8567 },
      },
      images: ['https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'],
      reportedBy: demoUser._id,
      assignedDepartment: deptMap.WATER._id,
      assignedDepartmentName: 'Water Supply',
      upvoteCount: 78,
    },
    // More geographically diverse issues for Indian map pins
    {
      issueCode: 'CT-10399',
      title: 'Traffic Signal Failure at Major Crossroads',
      description: '4-way signal failure during peak hours leading to gridlock.',
      category: 'Streetlights',
      priority: 'High',
      status: 'In Progress',
      location: {
        address: 'MG Road Junction, Ward 10',
        ward: 'Ward 10',
        city: 'Bengaluru',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        coordinates: { lat: 12.9716, lng: 77.5946 },
      },
      reportedBy: demoUser._id,
      assignedDepartment: deptMap.POWER._id,
      upvoteCount: 35,
    },
    {
      issueCode: 'CT-10385',
      title: 'Illegal Waste Dumping on Lake Periphery',
      description: 'Construction debris dumped overnight into lake catchment zone.',
      category: 'Garbage',
      priority: 'High',
      status: 'Scheduled',
      location: {
        address: 'Bellandur Lake Road',
        ward: 'Ward 84',
        city: 'Bengaluru',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        coordinates: { lat: 12.9304, lng: 77.6784 },
      },
      reportedBy: demoUser._id,
      assignedDepartment: deptMap.SANITATION._id,
      upvoteCount: 48,
    },
    {
      issueCode: 'CT-10372',
      title: 'Broken Footpath & Open Cable Trench',
      description: 'Uncovered cable trench dug up 3 weeks ago and left open.',
      category: 'Potholes',
      priority: 'Medium',
      status: 'Resolved',
      location: {
        address: 'FC Road, Deccan Gymkhana',
        ward: 'Ward 18',
        city: 'Pune',
        district: 'Mumbai City',
        state: 'Maharashtra',
        coordinates: { lat: 18.5204, lng: 73.8567 },
      },
      reportedBy: demoUser._id,
      assignedDepartment: deptMap.ROADS._id,
      resolvedAt: new Date(Date.now() - 36 * 3600 * 1000),
      upvoteCount: 19,
    },
  ];

  const createdIssues = await Issue.insertMany(issuesSeed);
  console.log(`Seeded ${createdIssues.length} issues.`);

  // 6. Active Escalations
  console.log('Seeding Active Escalations...');
  await Escalation.deleteMany({});
  const iss10415 = createdIssues.find((i) => i.issueCode === 'CT-10415');
  const iss10412 = createdIssues.find((i) => i.issueCode === 'CT-10412');
  const iss10408 = createdIssues.find((i) => i.issueCode === 'CT-10408');

  await Escalation.insertMany([
    {
      escalationId: 'ESC-10415',
      issue: iss10415._id,
      issueRef: 'CT-10415',
      issueTitle: 'Open Drainage and Sewage Hazard',
      level: 'Level 2 - District',
      priority: 'Critical',
      reason: 'No action for 48 hrs',
      triggerType: 'AUTOMATIC_SLA',
      status: 'ACTIVE',
      currentOfficer: 'Unassigned',
      escalatedTo: 'District Magistrate Office, New Delhi',
      overdueHours: 48,
      recommendedAction: 'Immediate dispatch of emergency municipal drainage suction vehicle.',
      history: [
        { action: 'Automated SLA Breach Triggered', performedBy: 'SLA Engine', timestamp: new Date(Date.now() - 2 * 3600 * 1000), notes: 'SLA timer expired at 48 hours without officer action.' },
      ],
    },
    {
      escalationId: 'ESC-10412',
      issue: iss10412._id,
      issueRef: 'CT-10412',
      issueTitle: 'High Tension Wire Sagging near School',
      level: 'Level 2 - District',
      priority: 'High',
      reason: 'Pending for 72 hrs',
      triggerType: 'AUTOMATIC_SLA',
      status: 'ACTIVE',
      currentOfficer: 'Power Distribution Cell',
      escalatedTo: 'Sub-Divisional Magistrate, Ludhiana',
      overdueHours: 72,
      recommendedAction: 'Order power shutdown and rewire pole tensioners.',
      history: [
        { action: 'SLA Escalation Flagged', performedBy: 'SLA Engine', timestamp: new Date(Date.now() - 4 * 3600 * 1000) },
      ],
    },
    {
      escalationId: 'ESC-10408',
      issue: iss10408._id,
      issueRef: 'CT-10408',
      issueTitle: 'Contaminated Water Supply in Residential Block',
      level: 'Level 3 - State',
      priority: 'High',
      reason: 'Pending for 96 hrs',
      triggerType: 'CITIZEN_OUTCRY',
      status: 'ACTIVE',
      currentOfficer: 'Water Quality Inspector',
      escalatedTo: 'State Water & Sanitation Board',
      overdueHours: 96,
      recommendedAction: 'Collect water lab samples and deploy mobile clean water tankers.',
      history: [
        { action: 'Escalated due to Community Outcry', performedBy: 'Community Moderation', timestamp: new Date(Date.now() - 8 * 3600 * 1000) },
      ],
    },
  ]);

  // 7. Resolutions
  console.log('Seeding Resolutions...');
  await Resolution.deleteMany({});
  const iss10432 = createdIssues.find((i) => i.issueCode === 'CT-10432');
  if (iss10432) {
    await Resolution.create({
      issue: iss10432._id,
      issueRef: 'CT-10432',
      issueTitle: 'Pothole on Main Road',
      submittedBy: officerRoads._id,
      submitterName: officerRoads.name,
      department: 'Roads & Infrastructure',
      beforeImages: iss10432.images,
      afterImages: iss10432.afterImages,
      resolutionNotes: 'Bitumen and asphalt cold mix patch completed. Leveling tested and road reopened to traffic.',
      workCost: 8500,
      materialsUsed: ['Asphalt Cold Mix 250kg', 'Bitumen Emulsion 40L', 'Road Compactor Roller'],
      completionDate: iss10432.resolvedAt,
      verificationStatus: 'APPROVED',
      verifiedBy: superAdmin._id,
      verifierName: superAdmin.name,
      verificationNotes: 'High quality finish, photograph verified with GPS telemetry.',
      verifiedAt: iss10432.resolvedAt,
    });
  }

  // 8. Audit Logs (Matching Screenshot Recent Activities!)
  console.log('Seeding Audit Logs...');
  await AuditLog.deleteMany({});
  const now = Date.now();

  await AuditLog.insertMany([
    {
      adminId: 'CT-SUPER-0001',
      adminName: 'Dr. Rajesh Kumar',
      role: 'super_admin',
      action: 'ISSUE_RESOLVED',
      targetType: 'Issue',
      targetId: '#CT-10432',
      details: { title: 'Pothole on Main Road', status: 'Resolved' },
      createdAt: new Date(now - 2 * 60 * 1000), // 2 min ago
    },
    {
      adminId: 'SYSTEM',
      adminName: 'Citizen Portal',
      role: 'system',
      action: 'NEW_ISSUE_REPORTED',
      targetType: 'Issue',
      targetId: '#CT-10431',
      details: { title: 'Garbage Overflow near Market', category: 'Garbage' },
      createdAt: new Date(now - 5 * 60 * 1000), // 5 min ago
    },
    {
      adminId: 'CT-SUPER-0001',
      adminName: 'Dr. Rajesh Kumar',
      role: 'super_admin',
      action: 'ISSUE_ASSIGNED',
      targetType: 'Issue',
      targetId: '#CT-10431',
      details: { officerName: 'Rakesh Sharma', department: 'Roads & Infra' },
      createdAt: new Date(now - 8 * 60 * 1000), // 8 min ago
    },
    {
      adminId: 'SYSTEM',
      adminName: 'Citizen Upvotes',
      role: 'system',
      action: 'ISSUE_UPVOTED',
      targetType: 'Issue',
      targetId: '#CT-10430',
      details: { upvoteCount: 24 },
      createdAt: new Date(now - 10 * 60 * 1000), // 10 min ago
    },
    {
      adminId: 'SYSTEM',
      adminName: 'Citizen Community',
      role: 'system',
      action: 'NEW_COMMENT',
      targetType: 'Issue',
      targetId: '#CT-10429',
      details: { comment: 'Water pressure in sector 7 has completely dropped.' },
      createdAt: new Date(now - 12 * 60 * 1000), // 12 min ago
    },
    {
      adminId: 'CT-SUPER-0001',
      adminName: 'Dr. Rajesh Kumar',
      role: 'super_admin',
      action: 'ADMIN_LOGIN_SUCCESS',
      targetType: 'Auth',
      targetId: 'CT-SUPER-0001',
      details: { ip: '127.0.0.1' },
      createdAt: new Date(now - 60 * 60 * 1000),
    },
  ]);

  // 9. System Settings
  console.log('Seeding System Settings...');
  await SystemSetting.deleteMany({});
  await SystemSetting.create({
    key: 'platform_config',
    platformName: 'CivicTrack',
    tagline: 'Report Today. Better Tomorrow.',
    contactEmail: 'admin@civictrack.gov.in',
    emergencyHelpline: '1800-CIVIC-GOV (1800-24842-468)',
    maintenanceMode: false,
    slaSettings: {
      criticalHours: 24,
      highHours: 48,
      mediumHours: 72,
      lowHours: 120,
    },
    autoEscalateHours: 48,
    upvotesThresholdHighPriority: 25,
    categories: [
      { name: 'Potholes and Road Damage', departmentCode: 'ROADS', basePriority: 'High', enabled: true },
      { name: 'Garbage and Waste Management', departmentCode: 'SANITATION', basePriority: 'Medium', enabled: true },
      { name: 'Broken Streetlights', departmentCode: 'POWER', basePriority: 'Medium', enabled: true },
      { name: 'Water Supply', departmentCode: 'WATER', basePriority: 'High', enabled: true },
      { name: 'Drainage and Sewage', departmentCode: 'DRAINAGE', basePriority: 'High', enabled: true },
    ],
  });

  // 10. Announcements
  console.log('Seeding Announcements...');
  await Announcement.deleteMany({});
  await Announcement.create({
    title: 'Monsoon Preparedness Protocol 2025 Activated',
    message: 'All Municipal and Panchayat administrative units are instructed to prioritize drainage de-silting and open manhole covers within 24 hours.',
    type: 'ALERT',
    targetAudience: 'ALL_CITIZENS',
    creatorName: 'Dr. Rajesh Kumar',
    creatorRole: 'Super Admin',
    active: true,
  });

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ CIVICTRACK ENTERPRISE ADMIN SEEDING COMPLETED SUCCESSFULLY!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('SUPER ADMIN CREDENTIALS:');
  console.log('   Admin ID : CT-SUPER-0001');
  console.log('   Password : Admin@CivicTrack2025');
  console.log('   Email    : admin@civictrack.gov.in');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('STATE ADMIN CREDENTIALS:');
  console.log('   Admin ID : CT-STATE-PB-0001');
  console.log('   Password : Admin@CivicTrack2025');
  console.log('───────────────────────────────────────────────────────────────');
  console.log('DISTRICT ADMIN CREDENTIALS:');
  console.log('   Admin ID : CT-DIST-PB-0001');
  console.log('   Password : Admin@CivicTrack2025');
  console.log('═══════════════════════════════════════════════════════════════');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
