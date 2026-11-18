import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSent(true);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, background: '#FCFAF5', padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontWeight: 800, fontSize: '2rem', color: '#102544', marginBottom: '0.5rem' }}>Contact Us</h1>
            <p style={{ color: '#5a6a7e' }}>Have a question or feedback? We'd love to hear from you.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { icon: <Mail size={20} />, label: 'Email', value: 'support@civictrack.in', color: '#07845F' },
                { icon: <Phone size={20} />, label: 'Phone', value: '+91 98765 43210', color: '#E95532' },
                { icon: <MapPin size={20} />, label: 'Location', value: 'Brahmapur, Odisha, India', color: '#7c3aed' },
              ].map((c, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(16,37,68,0.07)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#102544', marginBottom: '0.2rem' }}>{c.label}</div>
                    <div style={{ fontSize: '0.875rem', color: '#5a6a7e' }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="card">
              {sent ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <CheckCircle size={52} style={{ color: '#07845F', marginBottom: '1rem' }} />
                  <h3 style={{ fontWeight: 700, color: '#102544', marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ color: '#5a6a7e' }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[['name', 'Full Name', 'text', 'Your name'], ['email', 'Email', 'email', 'you@example.com'], ['subject', 'Subject', 'text', 'What is this about?']].map(([k, l, t, p]) => (
                    <div key={k}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#102544', display: 'block', marginBottom: '0.35rem' }}>{l}</label>
                      <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p}
                        style={{ width: '100%', border: `1.5px solid ${errors[k] ? '#ef4444' : '#e2e8f0'}`, borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none', color: '#102544' }} />
                      {errors[k] && <span style={{ fontSize: '0.76rem', color: '#ef4444' }}>{errors[k]}</span>}
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#102544', display: 'block', marginBottom: '0.35rem' }}>Message</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} placeholder="Your message..."
                      style={{ width: '100%', border: `1.5px solid ${errors.message ? '#ef4444' : '#e2e8f0'}`, borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none', color: '#102544', resize: 'vertical' }} />
                    {errors.message && <span style={{ fontSize: '0.76rem', color: '#ef4444' }}>{errors.message}</span>}
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}>
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
