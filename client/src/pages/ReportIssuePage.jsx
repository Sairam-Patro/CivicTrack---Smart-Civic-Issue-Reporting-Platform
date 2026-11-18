import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Camera, MapPin, Tag, AlertTriangle, Upload, CheckCircle } from 'lucide-react';

const CATEGORIES = ['Potholes', 'Garbage', 'Streetlights', 'Drainage', 'Water Supply', 'Encroachments', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function ReportIssuePage() {
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium', address: '', ward: '', lat: '', lng: '' });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Select a category';
    if (!form.address.trim()) e.address = 'Location/address is required';
    return e;
  }

  function handleImages(e) {
    const files = Array.from(e.target.files || []);
    const previews = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...previews].slice(0, 5));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img.file));
      const token = localStorage.getItem('ct_token');
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Failed to submit');
      }
      setSuccess(true);
      setTimeout(() => navigate('/issues'), 2500);
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
        <CheckCircle size={64} style={{ color: '#07845F' }} />
        <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#102544' }}>Issue Reported Successfully!</h2>
        <p style={{ color: '#5a6a7e' }}>Redirecting you to issues list...</p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, background: '#FCFAF5', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontWeight: 800, fontSize: '2rem', color: '#102544', marginBottom: '0.35rem' }}>Report a Civic Issue</h1>
            <p style={{ color: '#5a6a7e' }}>Provide details so authorities can address the issue quickly.</p>
          </div>

          {errors.global && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.9rem 1rem', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{errors.global}</div>}

          <form onSubmit={handleSubmit}>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#102544', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={18} style={{ color: '#07845F' }} /> Basic Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#102544', display: 'block', marginBottom: '0.35rem' }}>Issue Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Pothole on Main Road near Park"
                    style={{ width: '100%', border: `1.5px solid ${errors.title ? '#ef4444' : '#e2e8f0'}`, borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', outline: 'none', color: '#102544' }} />
                  {errors.title && <span style={{ fontSize: '0.76rem', color: '#ef4444' }}>{errors.title}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#102544', display: 'block', marginBottom: '0.35rem' }}>Category *</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      style={{ width: '100%', border: `1.5px solid ${errors.category ? '#ef4444' : '#e2e8f0'}`, borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', outline: 'none', color: '#102544', background: '#fff' }}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <span style={{ fontSize: '0.76rem', color: '#ef4444' }}>{errors.category}</span>}
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#102544', display: 'block', marginBottom: '0.35rem' }}>Priority</label>
                    <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                      style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', outline: 'none', color: '#102544', background: '#fff' }}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#102544', display: 'block', marginBottom: '0.35rem' }}>Description *</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={4} placeholder="Describe the issue in detail..."
                    style={{ width: '100%', border: `1.5px solid ${errors.description ? '#ef4444' : '#e2e8f0'}`, borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', outline: 'none', color: '#102544', resize: 'vertical' }} />
                  {errors.description && <span style={{ fontSize: '0.76rem', color: '#ef4444' }}>{errors.description}</span>}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#102544', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: '#07845F' }} /> Location
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#102544', display: 'block', marginBottom: '0.35rem' }}>Address / Landmark *</label>
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="e.g. Near Gandhi Park, MG Road"
                    style={{ width: '100%', border: `1.5px solid ${errors.address ? '#ef4444' : '#e2e8f0'}`, borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', outline: 'none', color: '#102544' }} />
                  {errors.address && <span style={{ fontSize: '0.76rem', color: '#ef4444' }}>{errors.address}</span>}
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#102544', display: 'block', marginBottom: '0.35rem' }}>Ward / Panchayat</label>
                  <input value={form.ward} onChange={e => setForm(f => ({ ...f, ward: e.target.value }))}
                    placeholder="e.g. Ward No. 12"
                    style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.9rem', fontFamily: 'Inter,sans-serif', outline: 'none', color: '#102544' }} />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, color: '#102544', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={18} style={{ color: '#07845F' }} /> Photos (Optional, up to 5)
              </h3>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
              {images.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                      <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()}
                style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '1.5rem', width: '100%', background: '#f8fafc', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#5a6a7e' }}>
                <Upload size={24} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Click to upload photos</span>
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem' }}>
              {loading ? 'Submitting...' : '📤 Submit Issue Report'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
