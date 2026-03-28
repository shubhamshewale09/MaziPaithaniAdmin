import { useEffect, useRef, useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useChatConnection } from '../../hooks/useChatConnection';
import { getConversations } from '../../ServiceCustmer/Messages/MessagesApi';

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
    const diffMin = Math.floor((Date.now() - new Date(dateStr)) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
};

const MessageNotificationBell = ({ onOpenEnquiry }) => {
  const connection = useChatConnection();
  const sellerId = getSellerUserId();
  const [conversations, setConversations] = useState([]);
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!sellerId) return;
    getConversations(sellerId)
      .then((res) => setConversations(res?.data ?? res ?? []))
      .catch(() => {});
  }, [sellerId]);

  // Live updates via SignalR
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

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const unreadConvs = conversations.filter((c) => (c.unreadCount ?? 0) > 0);
  const totalUnread = unreadConvs.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
  const displayCount = totalUnread > 99 ? '99+' : totalUnread;

  const handleMsgClick = (conv) => {
    setOpen(false);
    onOpenEnquiry(conv);
  };

  return (
    <div className="relative" ref={popupRef}>
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee2db] bg-white text-[#6a1825] transition hover:-translate-y-0.5 hover:bg-[#fff8f3] sm:h-11 sm:w-11 sm:rounded-2xl"
        aria-label="Messages"
      >
        <MessageSquare size={16} className="sm:h-[18px] sm:w-[18px]" />
        {totalUnread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#7a1e2c] text-[9px] font-bold text-white shadow">
            {displayCount}
          </span>
        )}
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[320px] rounded-[20px] border border-[#f1e2d8] bg-white shadow-[0_20px_60px_rgba(122,30,44,0.15)] sm:w-[360px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#f1e2d8] px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={15} className="text-[#7a1e2c]" />
              <span className="text-sm font-bold text-[#34160f]">Messages</span>
              {totalUnread > 0 && (
                <span className="rounded-full bg-[#7a1e2c] px-2 py-0.5 text-[10px] font-bold text-white">
                  {displayCount} new
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff7f2] text-[#7a1e2c] hover:bg-[#fde8e0]"
            >
              <X size={13} />
            </button>
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto [scrollbar-width:thin]">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <MessageSquare size={28} className="text-[#d4b5a8]" />
                <p className="mt-3 text-sm font-semibold text-[#8b6759]">No messages yet</p>
                <p className="mt-1 text-xs text-[#b19588]">Customer enquiries will appear here</p>
              </div>
            ) : (
              conversations.slice(0, 10).map((conv, i) => {
                const name = conv.otherUserName ?? 'Customer';
                const hasUnread = (conv.unreadCount ?? 0) > 0;
                return (
                  <button
                    key={conv.roomId ?? i}
                    type="button"
                    onClick={() => handleMsgClick(conv)}
                    className="flex w-full items-start gap-3 border-b border-[#fdf0ea] px-4 py-3 text-left transition hover:bg-[#fffaf6] last:border-0"
                  >
                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-sm font-bold text-white">
                      {name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`truncate text-sm font-semibold ${hasUnread ? 'text-[#34160f]' : 'text-[#6d5850]'}`}>
                          {name}
                        </p>
                        <span className="shrink-0 text-[10px] text-[#b19588]">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[#8b6759]">
                        {conv.lastMessage ?? 'New enquiry'}
                      </p>
                    </div>
                    {hasUnread && (
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7a1e2c] text-[9px] font-bold text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#f1e2d8] px-4 py-3">
            <button
              type="button"
              onClick={() => { setOpen(false); onOpenEnquiry(null); }}
              className="w-full rounded-[12px] bg-[#7a1e2c] py-2 text-xs font-bold text-white transition hover:bg-[#651623]"
            >
              View All Enquiries
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageNotificationBell;
