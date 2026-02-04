import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../app/hooks';

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: unknown) => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string, callback?: (data: unknown) => void) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppSelector((state) => state.auth.token);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
    const newSocket = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const emit = useCallback(
    (event: string, data?: unknown) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, data);
      }
    },
    []
  );

  const on = useCallback(
    (event: string, callback: (data: unknown) => void) => {
      socketRef.current?.on(event, callback);
    },
    []
  );

  const off = useCallback(
    (event: string, callback?: (data: unknown) => void) => {
      if (callback) {
        socketRef.current?.off(event, callback);
      } else {
        socketRef.current?.off(event);
      }
    },
    []
  );

  return {
    socket,
    isConnected,
    emit,
    on,
    off,
  };
}
