import { useCallback, useEffect, useRef, useState } from 'react';
import { getChatHistory, sendChatMessage } from '../ServiceCustmer/Messages/MessagesApi';
import { useChatConnection } from './useChatConnection';

export const useChat = (senderId, receiverId, initialRoomId) => {
  const connection = useChatConnection();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const roomIdRef = useRef(initialRoomId ?? null);

  // Load history and join room
  useEffect(() => {
    if (!senderId && !roomIdRef.current) return;

    let cancelled = false;

    const loadHistory = async () => {
      setLoading(true);
      try {
        const res = await getChatHistory(senderId, receiverId, roomIdRef.current);
        if (cancelled) return;

        setMessages(res?.messages || []);

        if (res?.roomId) {
          roomIdRef.current = res.roomId;
          if (connection?.state === 'Connected') {
            connection.invoke('JoinRoom', res.roomId).catch(() => {});
          }
        }
      } catch {
        // silently fail — UI stays empty
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, receiverId, connection]);

  // Join room once connection becomes ready (if roomId already known)
  useEffect(() => {
    if (connection?.state === 'Connected' && roomIdRef.current) {
      connection.invoke('JoinRoom', roomIdRef.current).catch(() => {});
    }
  }, [connection]);

  // Listen for incoming messages — single source of truth for all messages
  // including sender's own (server broadcasts ReceiveMessage to all room members)
  useEffect(() => {
    if (!connection) return;

    const handler = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    connection.on('ReceiveMessage', handler);
    return () => connection.off('ReceiveMessage', handler);
  }, [connection]);

  // Leave room on unmount
  useEffect(() => {
    return () => {
      if (connection?.state === 'Connected' && roomIdRef.current) {
        connection.invoke('LeaveRoom', roomIdRef.current).catch(() => {});
      }
    };
  }, [connection]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text?.trim() || !senderId || !receiverId) return;

      try {
        const res = await sendChatMessage({
          senderId: Number(senderId),
          receiverId: Number(receiverId),
          message: text.trim(),
        });

        // Do NOT add to state here — ReceiveMessage SignalR event is the
        // single source of truth and will fire for the sender too.
        // Adding here causes the double-render since DB saves only once.

        // First message — join room now
        if (res?.roomId && !roomIdRef.current) {
          roomIdRef.current = res.roomId;
          if (connection?.state === 'Connected') {
            connection.invoke('JoinRoom', res.roomId).catch(() => {});
          }
        }
      } catch {
        // error handled by global feedback modal via ApiMethod
      }
    },
    [senderId, receiverId, connection],
  );

  return { messages, loading, sendMessage };
};
