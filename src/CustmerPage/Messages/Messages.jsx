import { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';

const CONVERSATIONS = [
  { id: 1, seller: 'Ravi Handlooms',   last: 'Your saree is ready for dispatch!', time: '2m ago',  unread: 2 },
  { id: 2, seller: 'Weaver Sunita',    last: 'Thank you for your order.',          time: '1h ago',  unread: 0 },
  { id: 3, seller: 'Mohan Silk House', last: 'Custom design confirmed.',           time: '3h ago',  unread: 1 },
];

const CHAT = {
  1: [
    { from: 'seller', text: 'Hello! Thank you for your order.',           time: '10:00 AM' },
    { from: 'me',     text: 'Hi! When will it be dispatched?',            time: '10:05 AM' },
    { from: 'seller', text: 'Your saree is ready for dispatch!',          time: '10:10 AM' },
  ],
  2: [
    { from: 'seller', text: 'Thank you for your order.',                  time: 'Yesterday' },
    { from: 'me',     text: 'Looking forward to receiving it!',           time: 'Yesterday' },
  ],
  3: [
    { from: 'me',     text: 'Can you do a custom peacock motif?',         time: '3h ago' },
    { from: 'seller', text: 'Custom design confirmed.',                   time: '3h ago' },
  ],
};

const Messages = () => {
  const [active, setActive]   = useState(null);
  const [msgs, setMsgs]       = useState(CHAT);
  const [input, setInput]     = useState('');

  const send = () => {
    if (!input.trim() || !active) return;
    setMsgs((prev) => ({
      ...prev,
      [active]: [...(prev[active] || []), { from: 'me', text: input.trim(), time: 'Now' }],
    }));
    setInput('');
  };

  const conv = CONVERSATIONS.find((c) => c.id === active);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#3d1e17] mb-6">Messages</h1>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[320px_1fr] rounded-[24px] border border-[#f0e4de] bg-white shadow-sm overflow-hidden" style={{ minHeight: 520 }}>
        {/* Conversation list */}
        <div className={`border-r border-[#f0e4de] ${active ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4 border-b border-[#f0e4de]">
            <p className="text-sm font-bold text-[#3d1e17]">Conversations</p>
          </div>
          {CONVERSATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={[
                'flex w-full items-start gap-3 p-4 border-b border-[#f0e4de] text-left transition',
                active === c.id ? 'bg-[#fff8f3]' : 'hover:bg-[#fdf7f4]',
              ].join(' ')}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-white text-sm font-bold">
                {c.seller[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#3d1e17] truncate">{c.seller}</p>
                  <span className="text-[10px] text-[#9b7b69] shrink-0 ml-2">{c.time}</span>
                </div>
                <p className="text-xs text-[#9b7b69] truncate mt-0.5">{c.last}</p>
              </div>
              {c.unread > 0 && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7a1e2c] text-[9px] font-bold text-white">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Chat panel */}
        {active ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-[#f0e4de] p-4">
              <button onClick={() => setActive(null)} className="lg:hidden text-[#7a1e2c]">
                <ArrowLeft size={18} />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-white text-sm font-bold">
                {conv?.seller[0]}
              </div>
              <p className="font-semibold text-[#3d1e17] text-sm">{conv?.seller}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 380 }}>
              {(msgs[active] || []).map((m, i) => (
                <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={[
                    'max-w-[70%] rounded-2xl px-4 py-2.5 text-sm',
                    m.from === 'me'
                      ? 'bg-gradient-to-r from-[#7a1e2c] to-[#a52b39] text-white rounded-br-sm'
                      : 'bg-[#f7f1ed] text-[#3d1e17] rounded-bl-sm',
                  ].join(' ')}>
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-white/60' : 'text-[#9b7b69]'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#f0e4de] p-4 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-[#e9d7cf] bg-[#fff8f3] px-4 py-2.5 text-sm text-[#3d1e17] placeholder-[#b8a09a] outline-none focus:border-[#7a1e2c]"
              />
              <button
                onClick={send}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#7a1e2c] to-[#a52b39] text-white shadow transition hover:opacity-90"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center text-center p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#fff8f3] text-3xl mb-4">💬</div>
            <p className="font-semibold text-[#3d1e17]">Select a conversation</p>
            <p className="text-sm text-[#9b7b69] mt-1">Choose a seller to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
