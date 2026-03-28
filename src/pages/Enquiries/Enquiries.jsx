import { useEffect, useRef, useState, useCallback } from 'react';
import { Search, Send, ArrowLeft, MessageSquare, Circle } from 'lucide-react';
import MetaTitle from '../../components/custom/MetaTitle';
import Loader from '../../components/custom/Loader';
import {
  getConversations,
  getChatHistory,
  sendChatMessage,
} from '../../ServiceCustmer/Messages/MessagesApi';
import { useChatConnection } from '../../hooks/useChatConnection';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const getSellerId = () => {
  try {
    const d = JSON.parse(localStorage.getItem('login') || '{}');
    return d?.userId ?? d?.UserId ?? localStorage.getItem('UserId') ?? null;
  } catch {
    return null;
  }
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch { return ''; }
};

const clockTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
};

/* ─── Avatar ──────────────────────────────────────────────────────────────── */
const Avatar = ({ name, size = 10 }) => (
  <div
    className={`flex h-${size} w-${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] font-bold text-white`}
    style={{ fontSize: size <= 8 ? 11 : 13 }}
  >
    {(name ?? '?')[0].toUpperCase()}
  </div>
);

/* ─── ConversationItem ────────────────────────────────────────────────────── */
const ConversationItem = ({ conv, active, onClick }) => {
  const name = conv.otherUserName ?? 'Customer';
  const unread = conv.unreadCount ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-all duration-150',
        active
          ? 'bg-gradient-to-r from-[#fff0e8] to-[#fff7f2] border-r-[3px] border-[#7a1e2c]'
          : 'hover:bg-[#fffaf7] border-r-[3px] border-transparent',
      ].join(' ')}
    >
      {/* Avatar + online dot */}
      <div className="relative shrink-0">
        <Avatar name={name} size={10} />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22c55e]" />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className={`truncate text-[13px] ${unread > 0 ? 'font-bold text-[#1a0a07]' : 'font-semibold text-[#4a2e27]'}`}>
            {name}
          </p>
          <span className="shrink-0 text-[10px] text-[#b19588]">{timeAgo(conv.lastMessageTime)}</span>
        </div>
        <p className={`mt-0.5 truncate text-[11px] ${unread > 0 ? 'font-semibold text-[#7a1e2c]' : 'text-[#8b6759]'}`}>
          {conv.lastMessage ?? 'New enquiry'}
        </p>
      </div>

      {/* Unread badge */}
      {unread > 0 && (
        <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[#7a1e2c] px-1 text-[9px] font-bold text-white">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </button>
  );
};

/* ─── ChatBubble ──────────────────────────────────────────────────────────── */
const ChatBubble = ({ msg, isMe, senderName }) => (
  <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
    {!isMe && <Avatar name={senderName} size={7} />}
    <div className={[
      'max-w-[68%] rounded-2xl px-4 py-2.5 shadow-sm',
      isMe
        ? 'rounded-br-none bg-[#7a1e2c] text-white'
        : 'rounded-bl-none bg-white text-[#1a0a07] border border-[#f0e4de]',
    ].join(' ')}>
      <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">{msg.sMessage}</p>
      <p className={`mt-1 text-right text-[10px] ${isMe ? 'text-white/50' : 'text-[#b19588]'}`}>
        {clockTime(msg.dSentDate)}
      </p>
    </div>
  </div>
);

/* ─── ChatPanel ───────────────────────────────────────────────────────────── */
const ChatPanel = ({ sellerId, conv, onBack }) => {
  const connection = useChatConnection();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const name = conv.otherUserName ?? 'Customer';

  /* load history */
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    getChatHistory(sellerId, conv.otherUserId, conv.roomId)
      .then((res) => setMessages(res?.messages ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [conv.roomId, sellerId, conv.otherUserId]);

  /* SignalR room */
  useEffect(() => {
    if (!connection || !conv.roomId) return;
    connection.invoke('JoinRoom', conv.roomId).catch(() => {});
    const onMsg = (msg) => setMessages((p) => [...p, msg]);
    connection.on('ReceiveMessage', onMsg);
    return () => {
      connection.off('ReceiveMessage', onMsg);
      connection.invoke('LeaveRoom', conv.roomId).catch(() => {});
    };
  }, [connection, conv.roomId]);

  /* scroll to bottom */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* focus input */
  useEffect(() => { inputRef.current?.focus(); }, [conv.roomId]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);
    try {
      await sendChatMessage({
        senderId: Number(sellerId),
        receiverId: Number(conv.otherUserId),
        message: text,
      });
    } catch { /* global handler */ }
    finally { setSending(false); }
  }, [input, sending, sellerId, conv.otherUserId]);

  return (
    <div className="flex h-full flex-col">

      {/* ── Chat Header ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-[#f0e4de] bg-white px-5 py-3.5">
        {/* back (mobile) */}
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0e8] text-[#7a1e2c] transition hover:bg-[#fde0d0] lg:hidden"
        >
          <ArrowLeft size={15} />
        </button>

        <Avatar name={name} size={10} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#1a0a07]">{name}</p>
          <div className="flex items-center gap-1.5">
            <Circle size={7} className="fill-[#22c55e] text-[#22c55e]" />
            <span className="text-[11px] text-[#8b6759]">Online · Room #{conv.roomId}</span>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto bg-[#fdf8f5] px-5 py-4 [scrollbar-width:thin]">
        {loading ? (
          <div className="flex h-full items-center justify-center"><Loader /></div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0e8]">
              <MessageSquare size={26} className="text-[#7a1e2c]" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#7a1e2c]">No messages yet</p>
            <p className="mt-1 text-xs text-[#b19588]">Send the first message below</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <ChatBubble
                key={msg.iMessageId ?? i}
                msg={msg}
                isMe={String(msg.iSenderUserId) === String(sellerId)}
                senderName={name}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 border-t border-[#f0e4de] bg-white px-4 py-3">
        <div className="flex items-center gap-2 rounded-2xl border border-[#e8d5cc] bg-[#fffaf7] px-4 py-2.5 transition focus-within:border-[#7a1e2c] focus-within:ring-2 focus-within:ring-[#7a1e2c]/10">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={`Message ${name}…`}
            className="flex-1 bg-transparent text-[13px] text-[#1a0a07] outline-none placeholder:text-[#c4a99e]"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7a1e2c] text-white shadow transition hover:bg-[#651623] disabled:opacity-40"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Empty right panel ───────────────────────────────────────────────────── */
const EmptyChat = () => (
  <div className="flex h-full flex-col items-center justify-center bg-[#fdf8f5] text-center px-8">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(122,30,44,0.12)]">
      <MessageSquare size={30} className="text-[#7a1e2c]" />
    </div>
    <h2 className="mt-5 text-lg font-bold text-[#1a0a07]">Open a conversation</h2>
    <p className="mt-2 max-w-[220px] text-[13px] leading-relaxed text-[#8b6759]">
      Select a customer from the list to read and reply to their messages.
    </p>
  </div>
);

/* ─── Main Enquiries ──────────────────────────────────────────────────────── */
const Enquiries = ({ initConv, onInitConvConsumed }) => {
  const connection = useChatConnection();
  const sellerId = getSellerId();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeConv, setActiveConv] = useState(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  /* consume initConv from bell click */
  useEffect(() => {
    if (!initConv) return;
    setActiveConv(initConv);
    setMobileShowChat(true);
    onInitConvConsumed?.();
  }, [initConv, onInitConvConsumed]);

  /* load conversations */
  useEffect(() => {
    if (!sellerId) return;
    setLoading(true);
    getConversations(sellerId)
      .then((res) => setConversations(res?.data ?? res ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sellerId]);

  /* live SignalR updates */
  useEffect(() => {
    if (!connection) return;
    const handler = (updated) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.roomId === updated.roomId);
        const list = exists
          ? prev.map((c) => (c.roomId === updated.roomId ? { ...c, ...updated } : c))
          : [updated, ...prev];
        const idx = list.findIndex((c) => c.roomId === updated.roomId);
        if (idx > 0) {
          const copy = [...list];
          copy.unshift(copy.splice(idx, 1)[0]);
          return copy;
        }
        return list;
      });
    };
    connection.on('ConversationUpdated', handler);
    return () => connection.off('ConversationUpdated', handler);
  }, [connection]);

  const filtered = conversations.filter((c) =>
    `${c.otherUserName ?? ''} ${c.lastMessage ?? ''}`.toLowerCase().includes(query.toLowerCase())
  );

  const totalUnread = conversations.reduce((s, c) => s + (c.unreadCount ?? 0), 0);

  const selectConv = (conv) => {
    setActiveConv(conv);
    setMobileShowChat(true);
  };

  return (
    <>
      <MetaTitle title="Enquiries" />

      {/*
        Height = viewport - header(74px) - main padding-top(94px) - main padding-bottom(32px)
        = calc(100vh - 94px - 32px) minus a little breathing room → use 100% of available space
      */}
      <div
        className="overflow-hidden rounded-2xl border border-[#ede0d9] bg-white shadow-[0_16px_48px_rgba(122,30,44,0.10)]"
        style={{ height: 'calc(100vh - 140px)', minHeight: 480 }}
      >
        <div className="flex h-full">

          {/* ══ LEFT: Conversation List ══════════════════════════════════════ */}
          <div className={[
            'flex h-full flex-col border-r border-[#f0e4de] bg-white',
            'w-full shrink-0 lg:w-[300px] xl:w-[340px]',
            mobileShowChat ? 'hidden lg:flex' : 'flex',
          ].join(' ')}>

            {/* List header */}
            <div className="shrink-0 border-b border-[#f0e4de] bg-white px-4 pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-[15px] font-bold text-[#1a0a07]">Enquiries</h1>
                  <p className="mt-0.5 text-[11px] text-[#8b6759]">
                    {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                    {totalUnread > 0 && (
                      <span className="ml-1.5 inline-flex items-center rounded-full bg-[#7a1e2c] px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {totalUnread} new
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0e8]">
                  <MessageSquare size={15} className="text-[#7a1e2c]" />
                </div>
              </div>

              {/* Search */}
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#e8d5cc] bg-[#fffaf7] px-3 py-2 transition focus-within:border-[#7a1e2c]">
                <Search size={13} className="shrink-0 text-[#c4a99e]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or message…"
                  className="flex-1 bg-transparent text-[12px] text-[#1a0a07] outline-none placeholder:text-[#c4a99e]"
                />
              </div>
            </div>

            {/* List body */}
            <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
              {loading ? (
                <div className="flex items-center justify-center py-16"><Loader /></div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0e8]">
                    <MessageSquare size={20} className="text-[#7a1e2c]" />
                  </div>
                  <p className="mt-3 text-[13px] font-semibold text-[#7a1e2c]">
                    {query ? 'No results found' : 'No enquiries yet'}
                  </p>
                  <p className="mt-1 text-[11px] text-[#b19588]">
                    {query ? 'Try a different search term' : 'Customer messages will appear here'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#fdf0ea]">
                  {filtered.map((conv, i) => (
                    <ConversationItem
                      key={conv.roomId ?? i}
                      conv={conv}
                      active={activeConv?.roomId === conv.roomId}
                      onClick={() => selectConv(conv)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ══ RIGHT: Chat Window ═══════════════════════════════════════════ */}
          <div className={[
            'flex-1 h-full min-w-0',
            mobileShowChat ? 'flex flex-col' : 'hidden lg:flex lg:flex-col',
          ].join(' ')}>
            {activeConv ? (
              <ChatPanel
                sellerId={sellerId}
                conv={activeConv}
                onBack={() => setMobileShowChat(false)}
              />
            ) : (
              <EmptyChat />
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Enquiries;
