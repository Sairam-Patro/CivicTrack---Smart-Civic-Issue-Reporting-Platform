import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, PieChart as PieIcon, Download, FileSpreadsheet } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';

export const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/admin/analytics');
        if (res.data?.success) {
          setAnalytics(res.data.analytics);
        }
      } catch {
        toast.error('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const sampleStateData = analytics?.stateDistribution?.length > 0
    ? analytics.stateDistribution.map((s) => ({ state: s._id || 'Delhi', total: s.count, resolved: s.resolved }))
    : [
        { state: 'Delhi', total: 42, resolved: 36 },
        { state: 'Punjab', total: 38, resolved: 31 },
        { state: 'Maharashtra', total: 29, resolved: 24 },
        { state: 'Karnataka', total: 25, resolved: 20 },
        { state: 'Uttar Pradesh', total: 18, resolved: 14 },
      ];

  const sampleMonthlyData = analytics?.monthlyPerformance?.length > 0
    ? analytics.monthlyPerformance.map((m) => ({ month: m._id, reported: m.reported, resolved: m.resolved }))
    : [
        { month: 'Nov 2024', reported: 620, resolved: 510 },
        { month: 'Dec 2024', reported: 780, resolved: 690 },
        { month: 'Jan 2025', reported: 890, resolved: 810 },
        { month: 'Feb 2025', reported: 940, resolved: 870 },
        { month: 'Mar 2025', reported: 1120, resolved: 980 },
        { month: 'Apr 2025', reported: 1250, resolved: 1100 },
      ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
            National Civic Analytics & Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Cross-jurisdictional performance comparisons, resolution velocity, and volume trends.
          </p>
        </div>

        <a
          href="/api/admin/reports/csv"
          download
          className="px-4 py-2 bg-[#07845F] text-white text-xs font-bold rounded-xl hover:bg-[#066f50] flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </a>
      </div>

      {/* Grid of Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-extrabold text-sm text-[#102544] mb-4">
            Monthly Inflow vs Resolution Performance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#102544', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="reported" name="Reported Complaints" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved Complaints" fill="#07845F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State / Regional Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-extrabold text-sm text-[#102544] mb-4">
            State-wise Complaint Resolution Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleStateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#102544', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="total" name="Total Issues" fill="#64748B" radius={[0, 4, 4, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#07845F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
