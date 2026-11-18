import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Building2, Landmark, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLocalBodiesPage = () => {
  const [localBodies, setLocalBodies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await axios.get('/api/admin/geography');
        if (res.data?.success && res.data?.localBodies) {
          setLocalBodies(res.data.localBodies);
        }
      } catch {
        toast.error('Failed to load local governance bodies.');
      } finally {
        setLoading(false);
      }
    };
    fetchGeo();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
          Local Governance Body Administration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Municipal Corporations, Municipal Councils, Nagar Panchayats, and Gram Panchayats nationwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {localBodies.map((lb) => (
          <div key={lb._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {lb.type}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {lb.wardsCount || 24} Wards
                </span>
              </div>

              <h3 className="font-extrabold text-base text-[#102544] leading-snug">{lb.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{lb.districtName}, {lb.stateName}</span>
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Jurisdiction: Active</span>
              <span className="font-semibold text-[#07845F]">Integrated with CivicTrack</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLocalBodiesPage;
