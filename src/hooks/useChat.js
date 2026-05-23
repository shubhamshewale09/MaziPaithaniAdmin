import { useCallback, useEffect, useRef, useState } from 'react';
import { getChatHistory, sendChatMessage } from '../ServiceCustmer/Messages/MessagesApi';
import { useChatConnection } from './useChatConnection';

export const useChat = (senderId, receiverId, initialRoomId) => {
  const connection   = useChatConnection();
  const [messages, setMessages]             = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const roomIdRef    = useRef(initialRoomId ?? null);
  const seenIds      = useRef(new Set());
  // NOTE: no loadedRef — we reload whenever senderId/receiverId/roomId changes
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

  // ── Load history — reruns whenever conversation changes ──────────────────
  useEffect(() => {
    if (!senderId && !initialRoomId) return;

    let cancelled = false;
    roomIdRef.current = initialRoomId ?? null;
    seenIds.current   = new Set();
    setMessages([]);
    setHistoryLoading(true);

    getChatHistory(senderId, receiverId, roomIdRef.current)
      .then((res) => {
        if (cancelled) return;
        const msgs = res?.messages ?? [];
        msgs.forEach((m) => seenIds.current.add(msgKey(m)));
        setMessages(msgs);
        if (res?.roomId) {
          roomIdRef.current = res.roomId;
          if (connection?.state === 'Connected') joinRoom(connection, res.roomId);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setHistoryLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [senderId, receiverId, initialRoomId]);

  // ── Re-join room on reconnect ──────────────────────────────────────────────
  useEffect(() => {
    if (connection?.state === 'Connected' && roomIdRef.current) {
      joinRoom(connection, roomIdRef.current);
    }
  }, [connection, joinRoom]);

  // ── ReceiveMessage ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!connection) return;

    const handler = (msg) => {
      const isMine = String(msg.iSenderUserId) === String(senderId);

      // Suppress echo of own in-flight messages (optimistic bubble already shows)
      if (isMine && pendingTexts.current.has(msg.sMessage)) {
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

  // ── Leave room on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (connection?.state === 'Connected' && roomIdRef.current) {
        connection.invoke('LeaveRoom', String(roomIdRef.current)).catch(() => {});
      }
    };
  }, [connection]);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text) => {
      if (!text?.trim() || !senderId || !receiverId) return;

      const trimmed = text.trim();
      const tempId  = `opt-${Date.now()}`;

      pendingTexts.current.add(trimmed);

      // Add optimistic bubble immediately — always visible regardless of loading
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

        if (res?.message) {
          const realKey = msgKey(res.message);
          seenIds.current.add(realKey);
          setMessages((prev) =>
            prev.map((m) => (m.iMessageId === tempId ? { ...res.message } : m))
          );
        } else {
          // Server returned 204 / no body — just confirm the bubble
          setMessages((prev) =>
            prev.map((m) => m.iMessageId === tempId ? { ...m, _optimistic: false } : m)
          );
        }
      } catch {
        // Remove failed bubble
        setMessages((prev) => prev.filter((m) => m.iMessageId !== tempId));
      } finally {
        pendingTexts.current.delete(trimmed);
      }
    },
    [senderId, receiverId, connection, joinRoom],
  );

  // Expose historyLoading as `loading` for backward compat
  return { messages, loading: historyLoading, sendMessage };
};
