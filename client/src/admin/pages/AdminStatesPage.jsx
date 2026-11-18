import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Landmark, MapPin, Building, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminStatesPage = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await axios.get('/api/admin/geography');
        if (res.data?.success) {
          setStates(res.data.states || []);
          setDistricts(res.data.districts || []);
        }
      } catch {
        toast.error('Failed to load geographic registry.');
      } finally {
        setLoading(false);
      }
    };
    fetchGeo();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#102544] tracking-tight">
          States, Union Territories & Districts
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Nationwide jurisdictional boundaries and administrative tier mapping.
        </p>
      </div>

      {/* States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {states.map((st) => (
          <div key={st._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-black px-2.5 py-1 bg-[#102544] text-white rounded-lg">
                  {st.code}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {st.type}
                </span>
              </div>

              <h3 className="font-black text-lg text-[#102544]">{st.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Capital: {st.capital || 'Administrative HQ'}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">{st.districtsCount || 20}+ Districts</span>
              <span className="font-bold text-[#07845F] flex items-center gap-1">
                <span>Active Region</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Districts Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-base font-extrabold text-[#102544] mb-3">Districts Registry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">District Name</th>
                <th className="pb-3">State / UT</th>
                <th className="pb-3">Headquarters</th>
                <th className="pb-3">Local Governance Bodies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {districts.map((d) => (
                <tr key={d._id} className="hover:bg-slate-50/60">
                  <td className="py-3 font-extrabold text-[#102544]">{d.name}</td>
                  <td className="py-3 text-slate-600">{d.stateName} ({d.stateCode})</td>
                  <td className="py-3 text-slate-500">{d.headquarters || 'City Center'}</td>
                  <td className="py-3 font-semibold text-slate-700">{d.localBodiesCount || 4} Municipal Units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStatesPage;
