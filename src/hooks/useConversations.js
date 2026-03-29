import { useEffect, useRef, useState } from 'react';
import { getConversations } from '../ServiceCustmer/Messages/MessagesApi';
import { useChatConnection } from './useChatConnection';

const getLoggedInUserId = () => {
  try {
    const login = JSON.parse(localStorage.getItem('login') || '{}');
    return login?.userId ?? login?.UserId ?? localStorage.getItem('UserId') ?? null;
  } catch {
    return null;
  }
};

const moveToTop = (list, roomId) => {
  const idx = list.findIndex((c) => c.roomId === roomId);
  if (idx <= 0) return list;
  const copy = [...list];
  const [item] = copy.splice(idx, 1);
  return [item, ...copy];
};

export const useConversations = () => {
  const connection = useChatConnection();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const fetchedRef    = useRef(false);
  const reconnectRef  = useRef(false); // track if this is a reconnect

  const fetchConversations = async () => {
    const userId = getLoggedInUserId();
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getConversations(userId);
      setConversations(res?.data ?? res ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ONCE on mount
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch ONLY on reconnect (not on initial connect)
  useEffect(() => {
    if (!connection) return;
    if (!reconnectRef.current) {
      // First time connection becomes ready — mark it, don't re-fetch
      reconnectRef.current = true;
      return;
    }
    // Subsequent connection changes = reconnect — refresh list
    if (connection.state === 'Connected') {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  // SignalR: ConversationUpdated — update in place + move to top
  // SignalR: ReceiveMessage — update last message preview only (NO API call)
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

    const handleReceive = (message) => {
      const roomId = message.iRoomId ?? message.roomId;
      setConversations((prev) => {
        const exists = prev.some((c) => c.roomId === roomId);
        if (!exists) {
          // Brand new conversation — fetch once to get full details
          fetchConversations();
          return prev;
        }
        // Just update the preview — NO API call
        const updated = prev.map((c) =>
          c.roomId === roomId
            ? { ...c, lastMessage: message.sMessage, lastMessageTime: message.dSentDate }
            : c
        );
        return moveToTop(updated, roomId);
      });
    };

    connection.on('ConversationUpdated', handleUpdated);
    connection.on('ReceiveMessage', handleReceive);
    return () => {
      connection.off('ConversationUpdated', handleUpdated);
      connection.off('ReceiveMessage', handleReceive);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return { conversations, loading, error, refetch: fetchConversations };
};
