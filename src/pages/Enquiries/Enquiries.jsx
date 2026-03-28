import { useEffect, useRef, useState } from 'react';
import { MessageSquareQuote, Search, Send, ArrowLeft } from 'lucide-react';
import {
  SellerBadge,
  SellerButton,
  SellerEmptyState,
  SellerPageShell,
  SellerSearchField,
  SellerSectionCard,
  SellerStatCard,
} from '../../components/seller/SellerUI';
import MetaTitle from '../../components/custom/MetaTitle';
import Loader from '../../components/custom/Loader';
import { getConversations, getChatHistory, sendChatMessage } from '../../ServiceCustmer/Messages/MessagesApi';
import { useChatConnection } from '../../hooks/useChatConnection';

const getSellerUserId = () => {
  try {
    const d = JSON.parse(localStorage.getItem('login') || '{}');
    return d?.userId ?? d?.UserId ?? localStorage.getItem('UserId') ?? null;
  } catch {
    return null;
  }
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
};

const formatClock = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

// ── Inline chat panel for seller to reply ────────────────────────────────────
const ReplyChatPanel = ({ sellerId, conv, onClose }) => {
  const connection = useChatConnection();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!conv) return;
    setLoading(true);
    getChatHistory(sellerId, conv.otherUserId, conv.roomId)
      .then((res) => setMessages(res?.messages ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [conv, sellerId]);

  // Join room and listen for new messages
  useEffect(() => {
    if (!connection || !conv?.roomId) return;
    connection.invoke('JoinRoom', conv.roomId).catch(() => {});
    const handler = (msg) => setMessages((prev) => [...prev, msg]);
    connection.on('ReceiveMessage', handler);
    return () => {
      connection.off('ReceiveMessage', handler);
      connection.invoke('LeaveRoom', conv.roomId).catch(() => {});
    };
  }, [connection, conv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    try {
      await sendChatMessage({
        senderId: Number(sellerId),
        receiverId: Number(conv.otherUserId),
        message: text,
      });
    } catch {
      // error handled globally
    }
  };

  return (
    <div className='flex flex-col h-[420px] rounded-[20px] border border-[#f1e2d8] bg-white overflow-hidden shadow-sm'>
      {/* Header */}
      <div className='flex items-center gap-3 border-b border-[#f1e2d8] px-4 py-3'>
        <button type='button' onClick={onClose} className='flex h-8 w-8 items-center justify-center rounded-full bg-[#fff7f2] text-[#7a1e2c]'>
          <ArrowLeft size={14} />
        </button>
        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-sm font-bold text-white'>
          {(conv.otherUserName ?? '?')[0]}
        </div>
        <div>
          <p className='text-sm font-semibold text-[#34160f]'>{conv.otherUserName ?? 'Customer'}</p>
          <p className='text-[11px] text-[#8b6759]'>Customer enquiry</p>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto space-y-2 p-4 bg-[#fffaf6] [scrollbar-width:thin]'>
        {loading ? <Loader /> : messages.length === 0 ? (
          <p className='text-center text-xs text-[#b19588]'>No messages yet.</p>
        ) : messages.map((msg, i) => {
          const isMe = String(msg.iSenderUserId) === String(sellerId);
          return (
            <div key={msg.iMessageId ?? i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={['max-w-[80%] rounded-[20px] px-3 py-2 text-sm shadow-sm', isMe ? 'rounded-br-sm bg-[#7a1e2c] text-white' : 'rounded-bl-sm bg-white text-[#34160f]'].join(' ')}>
                <p>{msg.sMessage}</p>
                <p className={['mt-1 text-[10px]', isMe ? 'text-white/60' : 'text-[#8b6759]'].join(' ')}>{formatClock(msg.dSentDate)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className='border-t border-[#f1e2d8] bg-white p-3'>
        <div className='flex items-center gap-2 rounded-full border border-[#ead9cf] bg-[#fffaf6] px-3 py-2'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder='Reply to customer...'
            className='flex-1 bg-transparent text-sm text-[#34160f] outline-none placeholder:text-[#b19588]'
          />
          <button type='button' onClick={handleSend} className='flex h-8 w-8 items-center justify-center rounded-full bg-[#7a1e2c] text-white'>
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Enquiries page ───────────────────────────────────────────────────────
const Enquiries = () => {
  const connection = useChatConnection();
  const sellerId = getSellerUserId();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeConv, setActiveConv] = useState(null);

  useEffect(() => {
    if (!sellerId) return;
    setLoading(true);
    getConversations(sellerId)
      .then((res) => setConversations(res?.data ?? res ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sellerId]);

  // Live update: new conversation or updated last message
  useEffect(() => {
    if (!connection) return;
    const handler = (updated) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.roomId === updated.roomId);
        const merged = exists
          ? prev.map((c) => (c.roomId === updated.roomId ? { ...c, ...updated } : c))
          : [updated, ...prev];
        const idx = merged.findIndex((c) => c.roomId === updated.roomId);
        if (idx > 0) {
          const reordered = [...merged];
          const [item] = reordered.splice(idx, 1);
          reordered.unshift(item);
          return reordered;
        }
        return merged;
      });
    };
    connection.on('ConversationUpdated', handler);
    return () => connection.off('ConversationUpdated', handler);
  }, [connection]);

  const filtered = conversations.filter((c) => {
    const text = `${c.otherUserName ?? ''} ${c.lastMessage ?? ''}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const newCount = conversations.filter((c) => (c.unreadCount ?? 0) > 0).length;
  const repliedCount = conversations.filter((c) => (c.unreadCount ?? 0) === 0).length;

  return (
    <>
      <MetaTitle title='Enquiries' />
      <SellerPageShell
        eyebrow='Buyer Conversations'
        title='Handle customer enquiries and reply directly from this page.'
        description='Live messages from customers who clicked "Chat with Seller" on a product. Powered by SignalR.'
        actions={<SellerButton type='button'><Send size={16} /> Quick Reply Template</SellerButton>}
      >
        <section className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <SellerStatCard icon={<MessageSquareQuote size={20} />} label='Total Enquiries' value={conversations.length} note='All conversations' accent='wine' />
          <SellerStatCard icon={<MessageSquareQuote size={20} />} label='Unread' value={newCount} note='Need response' accent='gold' />
          <SellerStatCard icon={<MessageSquareQuote size={20} />} label='Replied' value={repliedCount} note='Followed up' accent='forest' />
        </section>

        <SellerSectionCard
          title='Conversation queue'
          description='Click any conversation to open the reply panel inline.'
          action={
            <div className='w-full sm:w-[260px]'>
              <SellerSearchField
                icon={<Search size={18} />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search by customer or message'
              />
            </div>
          }
        >
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <SellerEmptyState
              icon={<MessageSquareQuote size={28} />}
              title='No enquiries yet'
              description='When customers click "Chat with Seller" on a product, their messages will appear here.'
            />
          ) : (
            <div className='space-y-4'>
              {filtered.map((conv, index) => {
                const name = conv.otherUserName ?? 'Customer';
                const hasUnread = (conv.unreadCount ?? 0) > 0;
                const isOpen = activeConv?.roomId === conv.roomId;

                return (
                  <article
                    key={conv.roomId ?? index}
                    className='seller-soft-panel seller-rise rounded-[24px] p-5'
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                      <div className='min-w-0 flex-1'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <SellerBadge tone={hasUnread ? 'warning' : 'success'}>
                            {hasUnread ? 'New' : 'Replied'}
                          </SellerBadge>
                          <SellerBadge tone='neutral'>Chat</SellerBadge>
                          {conv.roomId && (
                            <span className='text-xs font-semibold uppercase tracking-[0.14em] text-[#9c7968]'>
                              Room #{conv.roomId}
                            </span>
                          )}
                        </div>

                        <div className='mt-4 flex items-center gap-3'>
                          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-sm font-bold text-white'>
                            {name[0]}
                          </div>
                          <div>
                            <h2 className='text-lg font-bold text-[#351915]'>{name}</h2>
                            {conv.lastMessage && (
                              <p className='mt-0.5 text-sm text-[#6d5850] line-clamp-1'>{conv.lastMessage}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='seller-panel min-w-[200px] rounded-[22px] p-4'>
                        <p className='text-xs font-bold uppercase tracking-[0.18em] text-[#a17b68]'>Last activity</p>
                        <p className='mt-2 text-base font-bold text-[#381c17]'>{formatTime(conv.lastMessageTime)}</p>
                        {hasUnread && (
                          <p className='mt-1 text-xs text-[#7a1e2c] font-semibold'>{conv.unreadCount} unread message{conv.unreadCount > 1 ? 's' : ''}</p>
                        )}
                        <button
                          type='button'
                          onClick={() => setActiveConv(isOpen ? null : conv)}
                          className='mt-3 w-full rounded-[12px] bg-[#7a1e2c] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#651623]'
                        >
                          {isOpen ? 'Close Chat' : 'Reply'}
                        </button>
                      </div>
                    </div>

                    {/* Inline reply panel */}
                    {isOpen && (
                      <div className='mt-4'>
                        <ReplyChatPanel
                          sellerId={sellerId}
                          conv={conv}
                          onClose={() => setActiveConv(null)}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </SellerSectionCard>
      </SellerPageShell>
    </>
  );
};

export default Enquiries;
