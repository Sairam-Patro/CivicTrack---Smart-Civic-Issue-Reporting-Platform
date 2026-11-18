import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const BOT_AVATAR = '🤖';

const QUICK_REPLIES = [
  'How do I report an issue?',
  'How to track my complaint?',
  'What categories are supported?',
  'How to upvote an issue?',
];

const BOT_RESPONSES = {
  'how do i report an issue': 'Click the "Report an Issue" button on the homepage or navigate to /report-issue. Fill in details like title, description, category, location and optionally upload photos.',
  'how to track my complaint': 'Go to "My Issues" from your dashboard. You\'ll see real-time status updates for every complaint you\'ve submitted.',
  'what categories are supported': 'Currently supported: Potholes, Garbage, Streetlights, Drainage, Water Supply, Encroachments and Other.',
  'how to upvote an issue': 'Open any issue from the map or issues list and click the thumbs-up button. You need to be logged in to upvote.',
};

function getBotReply(msg) {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key)) return val;
  }
  return "I'm here to help! You can ask me about reporting issues, tracking complaints, using the map, or anything about CivicTrack. Try one of the quick options below!";
}

export default function CivicAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hi! 👋 I'm your Civic Assistant. I can help you report issues, track complaints and guide you on how to use CivicTrack.",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function sendMessage(text) {
    if (!text.trim()) return;
    const userMsg = { from: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: getBotReply(text) }]);
    }, 900);
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Chat Widget */}
      {open && (
        <div className="chat-widget">
          {/* Header */}
          <div style={{ background: '#102544', padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: '#07845F',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
            }}>
              {BOT_AVATAR}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Civic Assistant</div>
              <div style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>● Online</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', gap: '0.5rem', alignItems: 'flex-end' }}>
                {msg.from === 'bot' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#102544', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>
                    {BOT_AVATAR}
                  </div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '0.65rem 0.9rem', borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.from === 'user' ? '#07845F' : '#fff',
                  color: msg.from === 'user' ? '#fff' : '#102544',
                  fontSize: '0.83rem', lineHeight: 1.5,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#102544', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                  {BOT_AVATAR}
                </div>
                <div style={{ background: '#fff', borderRadius: '16px 16px 16px 4px', padding: '0.65rem 1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <span style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#07845F', animation: `bounce 0.8s ${i * 0.2}s infinite` }} />
                    ))}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                {QUICK_REPLIES.map((qr, i) => (
                  <button key={i} onClick={() => sendMessage(qr)} style={{
                    background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '20px',
                    padding: '0.45rem 0.9rem', fontSize: '0.78rem', fontWeight: 500, color: '#102544',
                    cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s',
                  }}>
                    {qr}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{ padding: '0.75rem', borderTop: '1px solid #e9edf2', display: 'flex', gap: '0.5rem', background: '#fff' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1, border: '1.5px solid #e2e8f0', borderRadius: '20px',
                padding: '0.55rem 0.9rem', fontSize: '0.84rem',
                fontFamily: 'Inter, sans-serif', outline: 'none', color: '#102544'
              }}
            />
            <button type="submit" style={{
              width: '36px', height: '36px', borderRadius: '50%', background: '#07845F',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0
            }}>
              <Send size={15} color="#fff" />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button
        className="chat-fab btn btn-green"
        onClick={() => setOpen(v => !v)}
        style={{ borderRadius: '50px', gap: '0.5rem', boxShadow: '0 4px 20px rgba(7,132,95,0.4)', padding: '0.75rem 1.25rem' }}
        aria-label="Open Civic Assistant"
      >
        <MessageCircle size={20} />
        {!open && <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Chat Now</span>}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
