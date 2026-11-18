import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Building2,
  AlertTriangle,
  Calendar,
  MapPin,
  Activity,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  Map as MapIcon,
  Zap,
  Trophy,
  MessageSquare,
  Check,
  ThumbsUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminSocket } from '../hooks/useAdminSocket';
import StatCard from '../components/StatCard';
import PriorityBadge from '../components/PriorityBadge';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom pin marker
const createCustomMarker = (color) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

export const AdminDashboardPage = () => {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalCitizens: '10,000+',
    totalCitizensTrend: '+12%',
    totalIssues: '5,680',
    totalIssuesTrend: '+8%',
    pendingIssues: '1,420',
    pendingIssuesTrend: '+5%',
    resolvedIssues: '3,120',
    resolvedIssuesTrend: '+15%',
    localBodiesCount: '320',
    localBodiesTrend: '+6%',
    escalatedIssues: '87',
    escalatedIssuesTrend: '+10%',
  });

  const [trends, setTrends] = useState([
    { date: 'Apr 1', reported: 680, resolved: 420 },
    { date: 'Apr 4', reported: 750, resolved: 520 },
    { date: 'Apr 7', reported: 1100, resolved: 850 },
    { date: 'Apr 10', reported: 980, resolved: 780 },
    { date: 'Apr 14', reported: 1250, resolved: 920 },
    { date: 'Apr 18', reported: 890, resolved: 650 },
    { date: 'Apr 21', reported: 1180, resolved: 980 },
    { date: 'Apr 25', reported: 1040, resolved: 910 },
    { date: 'Apr 28', reported: 1120, resolved: 960 },
  ]);

  const [categories, setCategories] = useState([
    { name: 'Potholes', count: 1590, percentage: 28, color: '#2563EB' },
    { name: 'Garbage', count: 1363, percentage: 24, color: '#07845F' },
    { name: 'Streetlights', count: 1136, percentage: 20, color: '#EAB308' },
    { name: 'Water Issues', count: 852, percentage: 15, color: '#06B6D4' },
    { name: 'Other', count: 739, percentage: 13, color: '#8B5CF6' },
  ]);

  const [totalCategoryCount, setTotalCategoryCount] = useState(5680);
  const [departments, setDepartments] = useState([
    { name: 'Roads & Infra', rate: 95 },
    { name: 'Sanitation', rate: 93 },
    { name: 'Water Supply', rate: 90 },
    { name: 'Electricity', rate: 88 },
    { name: 'Drainage', rate: 85 },
  ]);
  const [overallScore, setOverallScore] = useState(92);

  const [activities, setActivities] = useState([
    { id: 1, icon: 'resolved', title: 'Issue #CT-10432 marked as Resolved', targetId: 'CT-10432', timeText: '2 min ago' },
    { id: 2, icon: 'reported', title: 'New issue reported: Garbage Overflow', targetId: 'CT-10431', timeText: '5 min ago' },
    { id: 3, icon: 'assigned', title: 'Issue #CT-10431 assigned to Rakesh Sharma', targetId: 'CT-10431', timeText: '8 min ago' },
    { id: 4, icon: 'upvote', title: 'Issue #CT-10430 received 24 upvotes', targetId: 'CT-10430', timeText: '10 min ago' },
    { id: 5, icon: 'comment', title: 'New comment on Issue #CT-10429', targetId: 'CT-10429', timeText: '12 min ago' },
  ]);

  const [escalations, setEscalations] = useState([
    { _id: '1', issueRef: 'CT-10415', priority: 'Critical', reason: 'No action for 48 hrs' },
    { _id: '2', issueRef: 'CT-10412', priority: 'High', reason: 'Pending for 72 hrs' },
    { _id: '3', issueRef: 'CT-10408', priority: 'High', reason: 'Pending for 96 hrs' },
  ]);

  const [mapIssues, setMapIssues] = useState([]);
  const [timeRange, setTimeRange] = useState('30');

  const fetchDashboardData = async () => {
    try {
      const [statsRes, trendsRes, catRes, deptRes, actRes, escRes, mapRes] = await Promise.all([
        axios.get('/api/admin/dashboard/stats'),
        axios.get(`/api/admin/dashboard/trends?days=${timeRange}`),
        axios.get('/api/admin/dashboard/category-distribution'),
        axios.get('/api/admin/dashboard/department-performance'),
        axios.get('/api/admin/dashboard/recent-activity'),
        axios.get('/api/admin/dashboard/active-escalations'),
        axios.get('/api/admin/dashboard/map-issues'),
      ]);

      if (statsRes.data?.stats) {
        setStats((prev) => ({
          ...prev,
          ...statsRes.data.stats,
          totalCitizens: statsRes.data.stats.totalCitizens > 0 ? statsRes.data.stats.totalCitizens.toLocaleString() : '10,000+',
          totalIssues: statsRes.data.stats.totalIssues > 0 ? statsRes.data.stats.totalIssues.toLocaleString() : '5,680',
          pendingIssues: statsRes.data.stats.pendingIssues > 0 ? statsRes.data.stats.pendingIssues.toLocaleString() : '1,420',
          resolvedIssues: statsRes.data.stats.resolvedIssues > 0 ? statsRes.data.stats.resolvedIssues.toLocaleString() : '3,120',
          localBodiesCount: statsRes.data.stats.localBodiesCount || '320',
          escalatedIssues: statsRes.data.stats.escalatedIssues > 0 ? statsRes.data.stats.escalatedIssues : '87',
        }));
      }

      if (trendsRes.data?.trends && trendsRes.data.trends.length > 0) setTrends(trendsRes.data.trends);
      if (catRes.data?.categories && catRes.data.categories.length > 0) {
        setCategories(catRes.data.categories);
        if (catRes.data.total) setTotalCategoryCount(catRes.data.total);
      }
      if (deptRes.data?.departments && deptRes.data.departments.length > 0) {
        setDepartments(deptRes.data.departments);
        setOverallScore(deptRes.data.overallPerformance || 92);
      }
      if (actRes.data?.activities && actRes.data.activities.length > 0) {
        setActivities(actRes.data.activities.map((a, i) => ({
          id: a.id || i,
          icon: a.icon,
          title: a.title,
          targetId: a.targetId,
          timeText: new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })));
      }
      if (escRes.data?.escalations && escRes.data.escalations.length > 0) setEscalations(escRes.data.escalations);
      if (mapRes.data?.issues && mapRes.data.issues.length > 0) setMapIssues(mapRes.data.issues);
    } catch (err) {
      console.warn('Dashboard live fetch:', err?.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  useAdminSocket(() => {
    fetchDashboardData();
  });

  return (
    <div className="space-y-5 w-full">
      {/* ─── 1. TOP WELCOME BANNER (Exact Match with Reference Image) ──────── */}
      <div className="relative rounded-3xl bg-linear-to-r from-[#eaf4f2] via-[#f4f8fa] to-[#e8edf7] border border-slate-200/80 p-5 sm:p-6 lg:p-7 overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Text & Badges */}
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl xl:text-[2rem] font-black text-[#102544] tracking-tight leading-tight">
              Welcome Back, {admin?.name || 'Dr. Rajesh Kumar'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Here's what's happening with CivicTrack today.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Mon, 28 Apr 2025
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#07845F]" />
                {admin?.state && admin.state !== 'National' ? admin.state : 'India'}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#07845F]/15 text-[#07845F] border border-[#07845F]/30">
                <Activity className="w-3.5 h-3.5 text-[#07845F]" />
                Live Dashboard
              </span>
            </div>
          </div>

          {/* Right Skyline Artwork with Orange Script Slogan */}
          <div className="relative flex flex-col items-end justify-center shrink-0">
            {/* Orange Cursive Title matching screenshot */}
            <div className="text-right mb-1">
              <span
                style={{ fontFamily: 'Georgia, "Brush Script MT", cursive' }}
                className="text-xl sm:text-2xl font-bold text-[#E95532] italic block tracking-wide"
              >
                Together for
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-[#102544] tracking-tight">
                Cleaner, Safer Cities
              </span>
            </div>

            {/* Indian Cityscape Vector Illustration (India Gate + Modern Skyline) */}
            <div className="w-64 sm:w-80 h-16 relative overflow-hidden pointer-events-none opacity-85">
              <svg viewBox="0 0 320 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Background Sky Buildings */}
                <rect x="10" y="22" width="18" height="42" fill="#93C5FD" opacity="0.6"/>
                <rect x="32" y="14" width="22" height="50" fill="#60A5FA" opacity="0.7"/>
                <rect x="58" y="26" width="16" height="38" fill="#93C5FD" opacity="0.6"/>
                <rect x="78" y="10" width="24" height="54" fill="#3B82F6" opacity="0.7"/>
                <rect x="106" y="28" width="18" height="36" fill="#93C5FD" opacity="0.6"/>

                {/* India Gate (Center Monument) */}
                <rect x="135" y="18" width="48" height="46" fill="#D97706" rx="2" opacity="0.9"/>
                <rect x="141" y="14" width="36" height="6" fill="#B45309"/>
                <path d="M147 64V36C147 30 171 30 171 36V64H147Z" fill="#F4F8FA"/>
                <rect x="131" y="60" width="56" height="4" fill="#78350F"/>

                {/* Right Modern Highrises */}
                <rect x="194" y="20" width="18" height="44" fill="#60A5FA" opacity="0.7"/>
                <rect x="216" y="8" width="22" height="56" fill="#2563EB" opacity="0.8"/>
                <rect x="242" y="16" width="20" height="48" fill="#3B82F6" opacity="0.7"/>
                <rect x="266" y="24" width="24" height="40" fill="#60A5FA" opacity="0.6"/>
                <rect x="294" y="12" width="20" height="52" fill="#2563EB" opacity="0.7"/>

                {/* Green Trees at Base */}
                <circle cx="28" cy="58" r="8" fill="#07845F"/>
                <circle cx="70" cy="58" r="7" fill="#059669"/>
                <circle cx="120" cy="58" r="9" fill="#10B981"/>
                <circle cx="198" cy="58" r="8" fill="#07845F"/>
                <circle cx="240" cy="58" r="9" fill="#059669"/>
                <circle cx="285" cy="58" r="7" fill="#10B981"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. KPI CARDS ROW (Exact Match: 6 Cards) ───────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Citizens"
          value={stats.totalCitizens}
          trend={stats.totalCitizensTrend}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          linkTo="/admin/citizens"
        />

        <StatCard
          title="Issues Reported"
          value={stats.totalIssues}
          trend={stats.totalIssuesTrend}
          icon={FileText}
          iconBg="bg-orange-100"
          iconColor="text-orange-500"
          linkTo="/admin/issues"
        />

        <StatCard
          title="Pending Issues"
          value={stats.pendingIssues}
          trend={stats.pendingIssuesTrend}
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-500"
          linkTo="/admin/issues?status=Pending"
        />

        <StatCard
          title="Resolved Issues"
          value={stats.resolvedIssues}
          trend={stats.resolvedIssuesTrend}
          icon={CheckCircle2}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          linkTo="/admin/issues?status=Resolved"
        />

        <StatCard
          title="Local Bodies"
          value={stats.localBodiesCount}
          trend={stats.localBodiesTrend}
          icon={Building2}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          linkTo="/admin/local-bodies"
        />

        <StatCard
          title="Escalated Issues"
          value={stats.escalatedIssues}
          trend={stats.escalatedIssuesTrend}
          icon={AlertTriangle}
          iconBg="bg-red-100"
          iconColor="text-red-500"
          linkTo="/admin/escalations"
        />
      </div>

      {/* ─── 3. ROW 2: CHARTS & LIVE MAP (Balanced 3-Column Grid) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: Issue Trends Overview (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-[#102544]">
                  Issue Trends Overview
                </h3>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
              >
                <option value="30">Last 30 Days</option>
                <option value="14">Last 14 Days</option>
                <option value="7">Last 7 Days</option>
              </select>
            </div>

            {/* Sub-Legend */}
            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                Reported
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#07845F]"></span>
                Resolved
              </span>
            </div>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#102544', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="reported"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2563EB' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#07845F"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#07845F' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Issues by Category (Col 3.5 - Side by Side Donut + Legend) */}
        <div className="lg:col-span-3.5 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <PieIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-[#102544]">
              Issues by Category
            </h3>
          </div>

          {/* Side-by-Side: Donut on Left, Legend on Right (Matching Image) */}
          <div className="flex items-center justify-between gap-2 my-auto">
            {/* Donut Chart with Centered Total */}
            <div className="relative w-36 h-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    innerRadius={42}
                    outerRadius={62}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#64748B'} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-[#102544] leading-tight">
                  {totalCategoryCount.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Total
                </span>
              </div>
            </div>

            {/* Vertical Legend List */}
            <div className="flex-1 space-y-1.5 pl-2">
              {categories.slice(0, 5).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                    <span className="truncate max-w-[85px] font-medium">{cat.name}</span>
                  </span>
                  <span className="font-black text-[#102544] ml-1">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Live Issue Map (Col 3.5) */}
        <div className="lg:col-span-3.5 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#102544]">
                Live Issue Map
              </h3>
            </div>
            <Link
              to="/admin/map"
              className="text-xs font-bold text-[#07845F] hover:underline flex items-center gap-1"
            >
              <span>View Full Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-slate-200 relative z-0">
            <MapContainer
              center={[28.6139, 77.2090]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mapIssues.map((issue) => {
                const lat = issue.location?.coordinates?.lat || 28.6139;
                const lng = issue.location?.coordinates?.lng || 77.2090;
                const pinColor = issue.priority === 'Critical'
                  ? '#EF4444'
                  : issue.priority === 'High'
                  ? '#F97316'
                  : '#10B981';

                return (
                  <Marker
                    key={issue._id}
                    position={[lat, lng]}
                    icon={createCustomMarker(pinColor)}
                  >
                    <Popup className="custom-popup">
                      <div className="p-1 max-w-[200px]">
                        {issue.images?.[0] && (
                          <img
                            src={issue.images[0]}
                            alt={issue.title}
                            className="w-full h-18 object-cover rounded-lg mb-1.5"
                          />
                        )}
                        <h4 className="font-bold text-xs text-[#102544] line-clamp-1">{issue.title}</h4>
                        <div className="mt-1">
                          <PriorityBadge priority={issue.priority} />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">{issue.location?.ward || 'Ward 12'}, Delhi</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* ─── 4. ROW 3: RECENT ACTIVITIES, PERFORMANCE, ESCALATIONS, CIVIC ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: Recent Activities (Col 3.5) */}
        <div className="xl:col-span-3.5 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#102544]">
                Recent Activities
              </h3>
            </div>
            <Link to="/admin/audit-logs" className="text-xs font-bold text-[#07845F] hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-2.5 text-xs">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    act.icon === 'resolved'
                      ? 'bg-emerald-100 text-emerald-600'
                      : act.icon === 'reported'
                      ? 'bg-blue-100 text-blue-600'
                      : act.icon === 'assigned'
                      ? 'bg-orange-100 text-orange-600'
                      : act.icon === 'upvote'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {act.icon === 'resolved' && <Check className="w-3.5 h-3.5" />}
                  {act.icon === 'reported' && <FileText className="w-3.5 h-3.5" />}
                  {act.icon === 'assigned' && <ArrowRight className="w-3.5 h-3.5" />}
                  {act.icon === 'upvote' && <ThumbsUp className="w-3 h-3" />}
                  {act.icon === 'comment' && <MessageSquare className="w-3 h-3" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#102544] line-clamp-1 leading-snug">
                    {act.title}
                  </p>
                </div>

                <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                  {act.timeText}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Department Performance (Col 4 - Generous Width, No Wrapping!) */}
        <div className="xl:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#102544]">
                Department Performance
              </h3>
            </div>
            <Link to="/admin/departments" className="text-xs font-bold text-[#07845F] hover:underline">
              View Details →
            </Link>
          </div>

          <div className="flex items-center gap-5 my-auto">
            {/* Circular Gauge Ring */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/25 border-t-emerald-600 flex flex-col items-center justify-center shadow-xs">
                <span className="text-xl font-black text-[#102544]">{overallScore}%</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1.5 uppercase text-center leading-tight">
                Overall<br />Performance
              </span>
            </div>

            {/* Department Progress Bars */}
            <div className="flex-1 space-y-2">
              {departments.slice(0, 5).map((dept, i) => {
                const colors = ['bg-[#07845F]', 'bg-[#2563EB]', 'bg-[#06B6D4]', 'bg-[#8B5CF6]', 'bg-[#3B82F6]'];
                return (
                  <div key={dept.name || i}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-0.5">
                      <span className="truncate">{dept.name}</span>
                      <span className="font-bold text-[#102544] ml-2">{dept.rate || 90}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[i % colors.length]}`}
                        style={{ width: `${dept.rate || 90}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 3: Active Escalations (Col 2.5) */}
        <div className="xl:col-span-2.5 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-extrabold text-sm sm:text-base text-[#102544]">
                Active Escalations
              </h3>
            </div>
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
              {escalations.length || 3}
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            {escalations.slice(0, 3).map((esc) => (
              <div
                key={esc._id}
                onClick={() => navigate('/admin/escalations')}
                className="p-2.5 bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-2xl cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#102544]">
                    Issue #{esc.issueRef}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      esc.priority === 'Critical'
                        ? 'bg-red-600 text-white'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {esc.priority}
                  </span>
                </div>
                <p className="text-[11px] text-red-700 font-semibold mt-0.5">
                  {esc.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Motivational Civic Officer Card (Col 2 - Exact Screenshot Design) */}
        <div className="xl:col-span-2 rounded-3xl bg-[#d5ede2] p-5 text-[#102544] shadow-xs flex flex-col justify-between relative overflow-hidden border border-[#bce2d0]">
          <div>
            {/* Green speech banner matching screenshot */}
            <div className="bg-[#07845F] text-white px-3 py-2 rounded-2xl text-xs font-black text-center shadow-xs leading-snug mb-3">
              Making India Cleaner, Together!
            </div>
          </div>

          {/* Civic Officer Illustration matching screenshot */}
          <div className="w-full flex items-center justify-center my-auto">
            <svg viewBox="0 0 160 140" fill="none" className="w-36 h-32">
              {/* Skyline Background */}
              <rect x="10" y="30" width="18" height="80" fill="#A7D7C5" opacity="0.5"/>
              <rect x="32" y="20" width="24" height="90" fill="#88C7B0" opacity="0.6"/>
              <rect x="60" y="40" width="16" height="70" fill="#A7D7C5" opacity="0.5"/>
              <rect x="80" y="15" width="22" height="95" fill="#88C7B0" opacity="0.6"/>
              <rect x="106" y="25" width="26" height="85" fill="#6BB79C" opacity="0.7"/>

              {/* Female Officer Illustration */}
              {/* Hair */}
              <path d="M45 75C45 52 58 45 80 45C102 45 115 52 115 75C115 88 112 100 110 105C108 92 104 80 104 80C104 80 100 85 96 85C92 85 88 80 88 80C88 80 84 85 80 85C76 85 72 80 72 80C72 80 68 85 64 85C60 85 56 80 56 80C56 80 52 92 50 105C48 100 45 88 45 75Z" fill="#1E293B"/>

              {/* Headset */}
              <path d="M52 70C52 50 64 42 80 42C96 42 108 50 108 70" stroke="#07845F" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="52" cy="72" r="6" fill="#07845F"/>
              <path d="M52 75C54 85 62 88 70 88" stroke="#07845F" strokeWidth="2.5" strokeLinecap="round"/>

              {/* Face & Neck */}
              <circle cx="80" cy="70" r="18" fill="#FDE68A"/>
              <rect x="76" y="86" width="8" height="10" fill="#FCD34D"/>

              {/* Shirt & Collar */}
              <path d="M60 96L80 105L100 96L115 140H45L60 96Z" fill="#FFFFFF"/>
              <path d="M72 96L80 105L88 96" fill="#07845F"/>

              {/* Laptop in front */}
              <rect x="55" y="118" width="50" height="20" rx="3" fill="#334155"/>
              <polygon points="45,138 115,138 110,132 50,132" fill="#64748B"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
