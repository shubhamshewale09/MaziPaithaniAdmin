import { useCallback, useEffect, useRef, useState } from 'react';
import { getChatHistory, sendChatMessage } from '../ServiceCustmer/Messages/MessagesApi';
import { useChatConnection } from './useChatConnection';

export const useChat = (senderId, receiverId, initialRoomId) => {
  const connection  = useChatConnection();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const roomIdRef   = useRef(initialRoomId ?? null);
  const seenIds     = useRef(new Set());
  const loadedRef   = useRef(false);
  // texts currently in-flight — block SignalR echo for sender's own messages
  const pendingTexts = useRef(new Set());

  const msgKey = (m) =>
    m.iMessageId != null
      ? String(m.iMessageId)
      : `${m.iSenderUserId}|${m.sMessage}|${m.dSentDate}`;

  const joinRoom = useCallback((conn, roomId) => {
    if (conn?.state === 'Connected' && roomId) {
      conn.invoke('JoinRoom', String(roomId)).catch(() => {});
    }
  }, []);

  // Load history ONCE
  useEffect(() => {
    if (!senderId && !roomIdRef.current) return;
    if (loadedRef.current) return;
    loadedRef.current = true;
    let cancelled = false;
    setLoading(true);

    getChatHistory(senderId, receiverId, roomIdRef.current)
      .then((res) => {
        if (cancelled) return;
        seenIds.current = new Set();
        const msgs = res?.messages ?? [];
        msgs.forEach((m) => seenIds.current.add(msgKey(m)));
        setMessages(msgs);
        if (res?.roomId) {
          roomIdRef.current = res.roomId;
          if (connection?.state === 'Connected') joinRoom(connection, res.roomId);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, receiverId]);

  // Re-join on reconnect — no history reload
  useEffect(() => {
    if (connection?.state === 'Connected' && roomIdRef.current) {
      joinRoom(connection, roomIdRef.current);
    }
  }, [connection, joinRoom]);

  // ReceiveMessage — skip sender's own echo while message is in-flight
  useEffect(() => {
    if (!connection) return;

    const handler = (msg) => {
      const isMine = String(msg.iSenderUserId) === String(senderId);

      // If this is the sender's own echo and we have it pending, skip it
      // (the optimistic bubble already shows it)
      if (isMine && pendingTexts.current.has(msg.sMessage)) {
        // Mark the real ID so we don't add it later either
        seenIds.current.add(msgKey(msg));
        return;
      }

      const key = msgKey(msg);
      if (seenIds.current.has(key)) return;
      seenIds.current.add(key);
      setMessages((prev) => [...prev, msg]);
    };

    connection.on('ReceiveMessage', handler);
    return () => connection.off('ReceiveMessage', handler);
  }, [connection, senderId]);

  // Leave room on unmount
  useEffect(() => {
    return () => {
      if (connection?.state === 'Connected' && roomIdRef.current) {
        connection.invoke('LeaveRoom', String(roomIdRef.current)).catch(() => {});
      }
    };
  }, [connection]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text?.trim() || !senderId || !receiverId) return;

      const trimmed = text.trim();
      const tempId  = `opt-${Date.now()}`;

      // Track in-flight text to suppress SignalR echo
      pendingTexts.current.add(trimmed);

      // Show optimistic bubble immediately — no loading state
      const optimistic = {
        iMessageId:      tempId,
        iSenderUserId:   senderId,
        iReceiverUserId: receiverId,
        sMessage:        trimmed,
        dSentDate:       new Date().toISOString(),
        _optimistic:     true,
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        const res = await sendChatMessage({
          senderId:   Number(senderId),
          receiverId: Number(receiverId),
          message:    trimmed,
        });

        if (res?.roomId && !roomIdRef.current) {
          roomIdRef.current = res.roomId;
          joinRoom(connection, res.roomId);
        }

        // Replace optimistic with real message from server response
        if (res?.message) {
          const realKey = msgKey(res.message);
          seenIds.current.add(realKey);
          setMessages((prev) =>
            prev.map((m) => (m.iMessageId === tempId ? { ...res.message } : m))
          );
        } else {
          // No message in response — just strip the _optimistic flag
          setMessages((prev) =>
            prev.map((m) => m.iMessageId === tempId ? { ...m, _optimistic: false } : m)
          );
        }
      } catch {
        setMessages((prev) => prev.filter((m) => m.iMessageId !== tempId));
      } finally {
        pendingTexts.current.delete(trimmed);
      }
    },
    [senderId, receiverId, connection, joinRoom],
  );

  return { messages, loading, sendMessage };
};
