import { createPortal } from 'react-dom';
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

const moveToTop = (list, roomId) => {
  const idx = list.findIndex((c) => c.roomId === roomId);
  if (idx <= 0) return list;
  const copy = [...list];
  copy.unshift(copy.splice(idx, 1)[0]);
  return copy;
};

const MessageNotificationBell = ({ onOpenEnquiry }) => {
  const connection = useChatConnection();
  const sellerId   = getSellerUserId();

  const [conversations, setConversations] = useState([]);
  const [open, setOpen]   = useState(false);
  const [pos,  setPos]    = useState({ top: 0, left: 8 });

  const triggerRef  = useRef(null);
  const panelRef    = useRef(null);
  // track which roomId is currently open in Enquiries so we don't bump its unread
  const activeRoomRef = useRef(null);

  /* ── initial load ── */
  useEffect(() => {
    if (!sellerId) return;
    getConversations(sellerId)
      .then((res) => setConversations(res?.data ?? res ?? []))
      .catch(() => {});
  }, [sellerId]);

  /* ── SignalR: ConversationUpdated ──
     Backend fires this after a message is saved — carries full conversation
     snapshot including updated unreadCount and lastMessage.               */
  useEffect(() => {
    if (!connection) return;

    const handleUpdated = (updated) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.roomId === updated.roomId);
        const list = exists
          ? prev.map((c) => (c.roomId === updated.roomId ? { ...c, ...updated } : c))
          : [updated, ...prev];
        return moveToTop(list, updated.roomId);
      });
    };

    connection.on('ConversationUpdated', handleUpdated);
    return () => connection.off('ConversationUpdated', handleUpdated);
  }, [connection]);

  /* ── SignalR: ReceiveMessage ──
     Fallback — fires for every message in any room the seller is connected
     to. We use it to bump unreadCount + update lastMessage preview so the
     bell count updates even if ConversationUpdated is delayed or missing.  */
  useEffect(() => {
    if (!connection) return;

    const handleMessage = (msg) => {
      const roomId = msg.iRoomId ?? msg.roomId;
      if (!roomId) return;

      // Don't increment unread if this is the seller's own message
      const isOwnMessage = String(msg.iSenderUserId) === String(sellerId);
      if (isOwnMessage) return;

      setConversations((prev) => {
        const exists = prev.some((c) => c.roomId === roomId);
        if (!exists) {
          // Brand-new conversation — re-fetch to get full details
          getConversations(sellerId)
            .then((res) => setConversations(res?.data ?? res ?? []))
            .catch(() => {});
          return prev;
        }

        const updated = prev.map((c) => {
          if (c.roomId !== roomId) return c;
          // Only bump unread if this room is NOT currently open
          const isActive = activeRoomRef.current === roomId;
          return {
            ...c,
            lastMessage:     msg.sMessage,
            lastMessageTime: msg.dSentDate,
            unreadCount:     isActive ? (c.unreadCount ?? 0) : (c.unreadCount ?? 0) + 1,
          };
        });
        return moveToTop(updated, roomId);
      });
    };

    connection.on('ReceiveMessage', handleMessage);
    return () => connection.off('ReceiveMessage', handleMessage);
  }, [connection, sellerId]);

  /* ── calculate portal position when opening ── */
  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect    = triggerRef.current.getBoundingClientRect();
      const vw      = window.innerWidth;
      const popupW  = Math.min(360, vw - 16);
      const safeLeft = Math.max(8, rect.right - popupW);
      setPos({ top: rect.bottom + 8, left: safeLeft });
    }
    setOpen((v) => !v);
  };

  /* ── close on outside click ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        panelRef.current   && !panelRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const totalUnread  = conversations.reduce((s, c) => s + (c.unreadCount ?? 0), 0);
  const displayCount = totalUnread > 99 ? '99+' : totalUnread;

  const handleMsgClick = (conv) => {
    // Mark this room as active so incoming messages don't bump its unread
    activeRoomRef.current = conv?.roomId ?? null;
    // Clear unread for this conversation locally
    if (conv?.roomId) {
      setConversations((prev) =>
        prev.map((c) => (c.roomId === conv.roomId ? { ...c, unreadCount: 0 } : c))
      );
    }
    setOpen(false);
    onOpenEnquiry(conv);
  };

  const handleViewAll = () => {
    activeRoomRef.current = null;
    setOpen(false);
    onOpenEnquiry(null);
  };

  return (
    <>
      {/* ── trigger button ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee2db] bg-white text-[#6a1825] transition hover:-translate-y-0.5 hover:bg-[#fff8f3] sm:h-11 sm:w-11 sm:rounded-2xl"
        aria-label="Messages"
        aria-expanded={open}
      >
        <MessageSquare size={16} className="sm:h-[18px] sm:w-[18px]" />
        {totalUnread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#7a1e2c] text-[9px] font-bold text-white shadow">
            {displayCount}
          </span>
        )}
      </button>

      {/* ── portal popup ── */}
      {open && createPortal(
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            top:  pos.top,
            left: pos.left,
            zIndex: 9999,
            width: Math.min(360, window.innerWidth - 16),
          }}
          className="rounded-[20px] border border-[#f1e2d8] bg-white shadow-[0_20px_60px_rgba(122,30,44,0.18)]"
        >
          {/* header */}
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

          {/* list */}
          <div className="max-h-[340px] overflow-y-auto [scrollbar-width:thin]">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <MessageSquare size={28} className="text-[#d4b5a8]" />
                <p className="mt-3 text-sm font-semibold text-[#8b6759]">No messages yet</p>
                <p className="mt-1 text-xs text-[#b19588]">Customer enquiries will appear here</p>
              </div>
            ) : (
              conversations.slice(0, 10).map((conv, i) => {
                const name      = conv.otherUserName ?? 'Customer';
                const hasUnread = (conv.unreadCount ?? 0) > 0;
                return (
                  <button
                    key={conv.roomId ?? i}
                    type="button"
                    onClick={() => handleMsgClick(conv)}
                    className="flex w-full items-start gap-3 border-b border-[#fdf0ea] px-4 py-3 text-left transition hover:bg-[#fffaf6] last:border-0"
                  >
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
                      <p className={`mt-0.5 truncate text-xs ${hasUnread ? 'font-semibold text-[#7a1e2c]' : 'text-[#8b6759]'}`}>
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

          {/* footer */}
          <div className="border-t border-[#f1e2d8] px-4 py-3">
            <button
              type="button"
              onClick={handleViewAll}
              className="w-full rounded-[12px] bg-[#7a1e2c] py-2 text-xs font-bold text-white transition hover:bg-[#651623]"
            >
              View All Enquiries
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default MessageNotificationBell;
