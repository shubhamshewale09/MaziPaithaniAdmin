import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { Base_Url } from '../BaseURL/BaseUrl';

const HUB_URL = `${Base_Url}hubs/chat`;

const getLoggedInUserId = () => {
  try {
    const login = JSON.parse(localStorage.getItem('login') || '{}');
    return login?.userId ?? login?.UserId ?? localStorage.getItem('UserId') ?? null;
  } catch {
    return null;
  }
};

let sharedConnection = null;
let sharedConnectionPromise = null;
const listeners = new Set();

const notifyListeners = () => listeners.forEach((fn) => fn());

const buildConnection = (userId) => {
  const conn = new signalR.HubConnectionBuilder()
    .withUrl(`${HUB_URL}?userId=${userId}`, {
      accessTokenFactory: () => {
        try { return JSON.parse(localStorage.getItem('login') || '{}')?.token || ''; }
        catch { return ''; }
      },
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  // On every reconnect — notify all hooks so they re-join rooms
  conn.onreconnected(() => {
    sharedConnection = conn;
    notifyListeners();
  });

  conn.onclose(() => {
    sharedConnection = null;
    sharedConnectionPromise = null;
    notifyListeners();
  });

  return conn;
};

export const useChatConnection = () => {
  const [, forceUpdate] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const sync = () => { if (mountedRef.current) forceUpdate((n) => n + 1); };
    listeners.add(sync);

    const userId = getLoggedInUserId();
    if (!userId) return () => { mountedRef.current = false; listeners.delete(sync); };

    if (sharedConnection?.state === signalR.HubConnectionState.Connected) {
      return () => { mountedRef.current = false; listeners.delete(sync); };
    }

    if (!sharedConnectionPromise) {
      const conn = buildConnection(userId);
      sharedConnectionPromise = conn
        .start()
        .then(() => {
          sharedConnection = conn;
          notifyListeners();
        })
        .catch(() => {
          sharedConnectionPromise = null;
        });
    }

    return () => {
      mountedRef.current = false;
      listeners.delete(sync);
    };
  }, []);

  return sharedConnection;
};

export const disconnectChatHub = async () => {
  if (sharedConnection) {
    await sharedConnection.stop().catch(() => {});
    sharedConnection = null;
    sharedConnectionPromise = null;
    notifyListeners();
  }
};
