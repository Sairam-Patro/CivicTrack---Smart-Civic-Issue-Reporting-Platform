import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Shield, Clock, Phone, AlertTriangle, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminSettingsPage = () => {
  const { admin } = useAdminAuth();
  const [settings, setSettings] = useState({
    platformName: 'CivicTrack',
    emergencyHelpline: '1800-CIVIC-GOV (1800-24842-468)',
    maintenanceMode: false,
    slaSettings: { criticalHours: 24, highHours: 48, mediumHours: 72, lowHours: 120 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/admin/settings');
        if (res.data?.success && res.data?.settings) {
          setSettings(res.data.settings);
        }
      } catch {
        toast.error('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/admin/settings', settings);
      toast.success('System settings saved successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
          Super Admin Control Center & Platform Configuration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Nationwide SLA rules, emergency helplines, automated escalation parameters, and platform security.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Platform Identity */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-[#102544] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#07845F]" />
            <span>Platform Identity & Helplines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Helpline</label>
              <input
                type="text"
                value={settings.emergencyHelpline}
                onChange={(e) => setSettings({ ...settings, emergencyHelpline: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        {/* SLA & Auto-Escalation Engine */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-[#102544] flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Service Level Agreements (SLA) & Automated Escalation Thresholds</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-red-50/60 border border-red-100 rounded-2xl">
              <span className="font-bold text-red-800 block mb-1">Critical Priority SLA</span>
              <input
                type="number"
                value={settings.slaSettings?.criticalHours || 24}
                onChange={(e) => setSettings({
                  ...settings,
                  slaSettings: { ...settings.slaSettings, criticalHours: Number(e.target.value) },
                })}
                className="w-full p-2 bg-white border border-red-200 rounded-xl font-bold text-center"
              />
              <span className="text-[10px] text-slate-500 block text-center mt-1">Hours</span>
            </div>

            <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-2xl">
              <span className="font-bold text-orange-800 block mb-1">High Priority SLA</span>
              <input
                type="number"
                value={settings.slaSettings?.highHours || 48}
                onChange={(e) => setSettings({
                  ...settings,
                  slaSettings: { ...settings.slaSettings, highHours: Number(e.target.value) },
                })}
                className="w-full p-2 bg-white border border-orange-200 rounded-xl font-bold text-center"
              />
              <span className="text-[10px] text-slate-500 block text-center mt-1">Hours</span>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-2xl">
              <span className="font-bold text-amber-800 block mb-1">Medium Priority SLA</span>
              <input
                type="number"
                value={settings.slaSettings?.mediumHours || 72}
                onChange={(e) => setSettings({
                  ...settings,
                  slaSettings: { ...settings.slaSettings, mediumHours: Number(e.target.value) },
                })}
                className="w-full p-2 bg-white border border-amber-200 rounded-xl font-bold text-center"
              />
              <span className="text-[10px] text-slate-500 block text-center mt-1">Hours</span>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
              <span className="font-bold text-emerald-800 block mb-1">Low Priority SLA</span>
              <input
                type="number"
                value={settings.slaSettings?.lowHours || 120}
                onChange={(e) => setSettings({
                  ...settings,
                  slaSettings: { ...settings.slaSettings, lowHours: Number(e.target.value) },
                })}
                className="w-full p-2 bg-white border border-emerald-200 rounded-xl font-bold text-center"
              />
              <span className="text-[10px] text-slate-500 block text-center mt-1">Hours</span>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-[#102544]">Platform Maintenance Mode</h4>
            <p className="text-xs text-slate-500">Temporarily disables public citizen complaints intake during server maintenance.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenanceMode || false}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="w-5 h-5 accent-[#07845F] rounded cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#07845F] text-white font-bold text-xs rounded-xl hover:bg-[#066f50] flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
