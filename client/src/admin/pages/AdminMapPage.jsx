import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Filter, Search, Eye, AlertTriangle } from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import IssueStatusBadge from '../components/IssueStatusBadge';

const createCustomMarker = (color) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const AdminMapPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [stateFilter, setStateFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchMapIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stateFilter !== 'All') params.append('state', stateFilter);
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (priorityFilter !== 'All') params.append('priority', priorityFilter);
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const res = await axios.get(`/api/admin/dashboard/map-issues?${params.toString()}`);
      if (res.data?.success) {
        setIssues(res.data.issues);
      }
    } catch (err) {
      console.error('Map fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapIssues();
  }, [stateFilter, categoryFilter, priorityFilter, statusFilter]);

  return (
    <div className="space-y-4 h-[calc(100vh-6rem)] flex flex-col">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#07845F] flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-[#102544]">Nationwide Geographic Map Monitor</h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-time spatial visualization of complaints ({issues.length} active markers)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          >
            <option value="All">All States / UTs</option>
            <option value="Delhi">Delhi</option>
            <option value="Punjab">Punjab</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          >
            <option value="All">All Categories</option>
            <option value="Potholes">Potholes & Roads</option>
            <option value="Garbage">Garbage</option>
            <option value="Streetlights">Streetlights</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Drainage">Drainage</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Full-bleed Interactive Leaflet Map */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative z-0">
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {issues.map((iss) => {
            const lat = iss.location?.coordinates?.lat || 28.6139;
            const lng = iss.location?.coordinates?.lng || 77.2090;
            const color =
              iss.priority === 'Critical'
                ? '#EF4444'
                : iss.priority === 'High'
                ? '#F97316'
                : iss.priority === 'Medium'
                ? '#EAB308'
                : '#10B981';

            return (
              <Marker key={iss._id} position={[lat, lng]} icon={createCustomMarker(color)}>
                <Popup className="custom-popup">
                  <div className="p-1 max-w-[240px]">
                    {iss.images?.[0] && (
                      <img
                        src={iss.images[0]}
                        alt={iss.title}
                        className="w-full h-28 object-cover rounded-xl mb-2.5"
                      />
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {iss.issueCode || `CT-${iss._id.slice(-5)}`}
                      </span>
                      <PriorityBadge priority={iss.priority} />
                    </div>
                    <h4 className="font-bold text-xs text-[#102544] leading-snug">{iss.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {iss.location?.address || `${iss.location?.ward || 'Ward 12'}, ${iss.location?.city || 'Delhi'}`}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <IssueStatusBadge status={iss.status} />
                      <span className="text-[10px] font-bold text-slate-500">
                        {iss.upvoteCount || 0} Upvotes
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default AdminMapPage;
