import { useEffect, useState } from 'react';
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

export const useConversations = () => {
  const connection = useChatConnection();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial fetch
  useEffect(() => {
    const userId = getLoggedInUserId();
    if (!userId) return;

    let cancelled = false;

    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getConversations(userId);
        if (cancelled) return;
        setConversations(res?.data ?? res ?? []);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchConversations();
    return () => { cancelled = true; };
  }, []);

  // Listen to ConversationUpdated — update item and move to top
  useEffect(() => {
    if (!connection) return;

    const handler = (updated) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.roomId === updated.roomId);
        const merged = exists
          ? prev.map((c) => (c.roomId === updated.roomId ? { ...c, ...updated } : c))
          : [updated, ...prev];
        // Move updated conversation to top
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

  return { conversations, loading, error };
};
