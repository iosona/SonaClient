import { API_KEY, SERVER_URL } from '@renderer/constants';
import { createContext, FC, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { EmitEvent, EventData, EventHandler, SocketContextType } from './SocketProvider.types';
import { logger } from '@renderer/logger';

export const SocketContext = createContext<SocketContextType>({} as SocketContextType);

export const SocketProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    window.api.getHash()
      .then(appHash => {
        setSocket(io(SERVER_URL, {
          autoConnect: true,
          query: {
            apiKey: API_KEY,
            appHash
          }
        }))
      })
  }, []);

  const [isConnected, setIsConnected] = useState(socket?.connected || false);
  const [isVerificationError, setIsVerificationError] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      setIsConnected(true);
      setIsVerificationError(false);
      logger.success(`Connected to Signal Server: ${socket.id}`);
    }

    const onDisconnect = () => {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on("connect_error", (err) => {
      if (err.message.includes("Client verification error")) {
        setIsVerificationError(true);
      }
    })
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    }
  }, [socket]);

  const subscribeEvent = (event: EmitEvent, handler: EventHandler) => {
    if (!isConnected || !socket) return;
    socket.on(event, handler);
  }

  const unsubscribeEvent = (event: EmitEvent, handler: EventHandler) => {
    if (!socket) return;
    socket.off(event, handler);
  }

  const emitEvent = (event: EmitEvent, data: EventData) => {
    if (!isConnected || !socket) return;
    socket.emit(event, data);
  }

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected,
      subscribeEvent,
      unsubscribeEvent,
      emitEvent,
      isVerificationError
    }}>
      {children}
    </SocketContext.Provider>
  );
}