import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radio, Bell, AlertTriangle, CheckCircle, RefreshCw, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { useAdminSocket } from '../hooks/useAdminSocket';
import PriorityBadge from '../components/PriorityBadge';
import IssueStatusBadge from '../components/IssueStatusBadge';

export const AdminLiveMonitoringPage = () => {
  const [liveEvents, setLiveEvents] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const { connected, latestEvent } = useAdminSocket((eventType, data) => {
    const newEntry = {
      id: Date.now() + Math.random(),
      type: eventType,
      data,
      timestamp: new Date(),
    };
    setLiveEvents((prev) => [newEntry, ...prev.slice(0, 49)]);
  });

  // Initial load of latest audit & issue records
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard/recent-activity');
        if (res.data?.activities) {
          const baseline = res.data.activities.map((a) => ({
            id: a.id,
            type: a.action,
            data: { title: a.title, actor: a.actor, issueCode: a.targetId },
            timestamp: new Date(a.timestamp),
          }));
          setLiveEvents(baseline);
        }
      } catch {
        // ignore
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
              Live Real-Time Issue Monitoring
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Active WebSocket stream listening to nationwide civic events, assignments, and escalations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{connected ? 'Socket Connected (Port 5000)' : 'Reconnecting...'}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#102544] shadow-2xs"
            title="Toggle notification sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#07845F]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live Event Stream Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span>Incoming Broadcast Stream</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px]">
              {liveEvents.length} events logged
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Updates arrive with zero manual refresh</span>
        </div>

        <div className="space-y-3">
          {liveEvents.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Radio className="w-8 h-8 mx-auto mb-2 text-slate-300 animate-pulse" />
              <p className="text-xs font-medium">Monitoring active. Waiting for civic events...</p>
            </div>
          ) : (
            liveEvents.map((evt) => {
              const isAlert = evt.type?.includes('escalat') || evt.type?.includes('CRITICAL');
              const isResolved = evt.type?.includes('resolve');

              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    isAlert
                      ? 'bg-red-50/70 border-red-200 text-red-900'
                      : isResolved
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50/60 border-slate-100 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isAlert
                        ? 'bg-red-600 text-white'
                        : isResolved
                        ? 'bg-[#07845F] text-white'
                        : 'bg-white text-slate-700 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {isAlert && <ShieldAlert className="w-5 h-5" />}
                    {isResolved && <CheckCircle className="w-5 h-5" />}
                    {!isAlert && !isResolved && <Bell className="w-4 h-4 text-blue-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-xs sm:text-sm tracking-tight">
                        {evt.data?.title || evt.type}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5">
                      {evt.data?.actor ? `Triggered by ${evt.data.actor}` : 'System real-time broadcast'}
                      {evt.data?.issueCode && ` • Target: ${evt.data.issueCode}`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLiveMonitoringPage;
