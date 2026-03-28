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

// Shared singleton connection across the app
let sharedConnection = null;
let sharedConnectionPromise = null;
const listeners = new Set();

const notifyListeners = () => listeners.forEach((fn) => fn());

export const useChatConnection = () => {
  const [connection, setConnection] = useState(sharedConnection);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const sync = () => {
      if (mountedRef.current) setConnection(sharedConnection);
    };
    listeners.add(sync);

    const userId = getLoggedInUserId();
    if (!userId) return;

    if (sharedConnection?.state === signalR.HubConnectionState.Connected) {
      setConnection(sharedConnection);
      return;
    }

    if (!sharedConnectionPromise) {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${HUB_URL}?userId=${userId}`, {
          accessTokenFactory: () => {
            try {
              return JSON.parse(localStorage.getItem('login') || '{}')?.token || '';
            } catch {
              return '';
            }
          },
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Warning)
        .build();

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

  return connection;
};

export const disconnectChatHub = async () => {
  if (sharedConnection) {
    await sharedConnection.stop();
    sharedConnection = null;
    sharedConnectionPromise = null;
    notifyListeners();
  }
};
